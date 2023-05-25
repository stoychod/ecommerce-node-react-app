import { Pool } from "pg";
import CartModel from "../models/cartModel";

export default class CartService {
  cartModel: CartModel;
  constructor(db: Pool) {
    this.cartModel = new CartModel(db);
  }

  async create(userId: string) {
    const cart = this.cartModel.create(userId);

    return cart;
  }
}
