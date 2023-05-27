import { Pool } from "pg";
import CartModel from "../models/cartModel";
import CartItemModel from "../models/cartItemModel";
import createHttpError from "http-errors";

export default class CartService {
  cartModel: CartModel;
  cartItemModel: CartItemModel;
  constructor(db: Pool) {
    this.cartModel = new CartModel(db);
    this.cartItemModel = new CartItemModel(db);
  }

  async createCart(userId: string) {
    const cart = await this.cartModel.create(userId);

    return cart;
  }

  async loadCart(userId: string) {
    const cart = await this.cartModel.findOneByUserId(userId);

    const items = await this.cartItemModel.find(cart.id);

    cart.items = items;
    return cart;
  }

  async addItem(userId: string, data: { productId: string; quantity: number }) {
    const cart = await this.cartModel.findOneByUserId(userId);

    const cartItem = await this.cartItemModel.create({
      cartId: cart.id,
      ...data,
    });

    return cartItem;
  }

  async updateItem(cartItemId: string, quantity: number) {
    const updatedItem = await this.cartItemModel.update(cartItemId, quantity);
    return updatedItem;
  }

  async removeItem(cartItemId: string) {
    const deletedItem = await this.cartItemModel.delete(cartItemId);

    return deletedItem;
  }
}
