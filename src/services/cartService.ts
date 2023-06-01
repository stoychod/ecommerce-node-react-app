import { Pool } from "pg";
import CartModel from "../models/cartModel";
import CartItemModel from "../models/cartItemModel";
import OrdersModel from "../models/ordersModel";

export default class CartService {
  cartModel: CartModel;
  cartItemModel: CartItemModel;
  db: Pool;
  constructor(db: Pool) {
    this.cartModel = new CartModel(db);
    this.cartItemModel = new CartItemModel(db);
    this.db = db;
  }

  async createCart(userId: string) {
    // check if a cart already exists for the specified user and return it
    const cart = await this.cartModel.findOneByUserId(userId);
    if (cart) return cart;

    // if not create a new cart
    const newCart = await this.cartModel.create(userId);

    return newCart;
  }

  async loadCart(userId: string) {
    const cart = await this.cartModel.findOneByUserId(userId);

    const items = await this.cartItemModel.find(cart.id);

    return items;
  }

  async addItem(userId: string, data: { productId: string; quantity: number }) {
    const cart = await this.cartModel.findOneByUserId(userId);

    const cartItem = await this.cartItemModel.create({
      cartId: cart.id,
      ...data,
    });

    return cartItem;
  }

  async updateItem(
    userId: string,
    data: { cartItemId: string; quantity: number }
  ) {
    const cart = await this.cartModel.findOneByUserId(userId);

    const updatedItem = await this.cartItemModel.update({
      cartId: cart.id,
      ...data,
    });
    return updatedItem;
  }

  async removeItem(userId: string, cartItemId: string) {
    const cart = await this.cartModel.findOneByUserId(userId);

    const deletedItem = await this.cartItemModel.deleteOne({
      cartItemId,
      cartId: cart.id,
    });

    return deletedItem;
  }

  async checkout(userId: string) {
    // initialize a pool client to be able to use a transaction
    // https://node-postgres.com/features/transactions
    const client = await this.db.connect();

    try {
      // begin transaction
      await client.query("BEGIN");

      // create a local instance of CartModel and get this user's cart
      const cartModel = new CartModel(client);
      const cart = await cartModel.findOneByUserId(userId);

      // create a local instance of CartItemModel
      const cartItemModel = new CartItemModel(client);

      // and load cart items
      const cartItems = await cartItemModel.find(cart.id);

      // calculate total price
      const total = cartItems.reduce((total, item) => {
        return (total += Number(item.price * item.quantity));
      }, 0);

      // Stripe transaction should be here

      // initialize an order
      const ordersModel = new OrdersModel(client);
      const order = await ordersModel.initializeOrder(userId, total);

      // add order items
      const orderItems = await ordersModel.addItems(order.id, cartItems);

      // empty cart
      await cartItemModel.deleteAll(cart.id);

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
