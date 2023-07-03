import { Pool } from "pg";
import CartModel from "../models/cartModel";
import CartItemModel from "../models/cartItemModel";
import OrdersModel from "../models/ordersModel";
import createHttpError from "http-errors";

export default class CartService {
  cartModel: CartModel;
  cartItemModel: CartItemModel;
  db: Pool;
  constructor(db: Pool) {
    this.cartModel = new CartModel(db);
    this.cartItemModel = new CartItemModel(db);
    this.db = db;
  }

  async createCart(userId: number) {
    // check if a cart already exists for the specified user and return it
    const cart = await this.cartModel.findOneByUserId(userId);
    if (cart) return cart;

    // if not create a new cart
    const newCart = await this.cartModel.create(userId);

    return newCart;
  }

  async findOneById(cartId: string) {
    const cart = this.cartModel.findOneById(cartId);
    if (!cart) {
      throw createHttpError(404, "Cart does not exist");
    }

    return cart;
  }

  async loadCart(userId: number) {
    const cart = await this.cartModel.findOneByUserId(userId);
    if (!cart) {
      throw createHttpError(404, "User cart does not exist");
    }

    const items = await this.cartItemModel.find(cart.id);

    return items;
  }

  async addItem(userId: number, data: { productId: string; quantity: number }) {
    const cart = await this.cartModel.findOneByUserId(userId);

    const cartItem = await this.cartItemModel.create({
      cartId: cart.id,
      ...data,
    });

    return cartItem;
  }

  async updateItem(
    userId: number,
    data: { cartItemId: string; quantity: number }
  ) {
    const cart = await this.cartModel.findOneByUserId(userId);

    const updatedItem = await this.cartItemModel.update({
      cartId: cart.id,
      ...data,
    });
    return updatedItem;
  }

  async removeItem(userId: number, cartItemId: string) {
    const cart = await this.cartModel.findOneByUserId(userId);

    const deletedItem = await this.cartItemModel.deleteOne({
      cartItemId,
      cartId: cart.id,
    });

    return deletedItem;
  }

  async completeCheckout(userId: number, cartId: string, total: number) {
    // initialize a pool client to be able to use a transaction
    // https://node-postgres.com/features/transactions
    const client = await this.db.connect();

    try {
      // begin transaction
      await client.query("BEGIN");

      // create a local instance of CartModel
      const cartModel = new CartModel(client);

      // create a local instance of CartItemModel
      const cartItemModel = new CartItemModel(client);

      // and load cart items
      const cartItems = await cartItemModel.find(cartId);

      // initialize an order
      const ordersModel = new OrdersModel(client);
      const order = await ordersModel.initializeOrder(userId, total);

      // add order items
      const orderItems = await ordersModel.addItems(order.id, cartItems);

      // empty cart
      await cartItemModel.deleteAll(cartId);

      // remve the associated payment id
      await cartModel.update(userId)

      // complete the order
      const completedOrder = await ordersModel.complete(order.id);

      // finish transaction
      await client.query("COMMIT");

      // return completed order
      completedOrder.items = orderItems;
      return completedOrder;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
