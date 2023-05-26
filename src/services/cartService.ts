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
    try {
      const cart = await this.cartModel.create(userId);

      return cart;
    } catch (error) {
      if (error instanceof Error) {
        throw createHttpError(500, "Server error");
      }
    }
  }

  async loadCart(userId: string) {
    try {
      const cart = await this.cartModel.findOneByUserId(userId);

      const items = await this.cartItemModel.find(cart.id);

      cart.items = items;
      return cart;
    } catch (error) {
      if (error instanceof Error) {
        throw createHttpError(500, "Server error");
      }
    }
  }

  async addItem(userId: string, data: { productId: string; quantity: number }) {
    try {
      const cart = await this.cartModel.findOneByUserId(userId);

      const cartItem = await this.cartItemModel.create({
        cartId: cart.id,
        ...data,
      });

      return cartItem;
    } catch (error) {
      if (error instanceof Error) {
        throw createHttpError(500, "Server error");
      }
    }
  }
}
