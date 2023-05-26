import { Pool } from "pg";
import CartModel from "../models/cartModel";

export default class CartService {
  cartModel: CartModel;
  constructor(db: Pool) {
    this.cartModel = new CartModel(db);
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
  }
}
