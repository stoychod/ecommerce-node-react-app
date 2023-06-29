import { STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY } from "../environment";
import Stripe from "stripe";
import { Pool } from "pg";
import CartModel from "../models/cartModel";
import CartItemModel from "../models/cartItemModel";

export default class PaymentService {
  stripe: Stripe;
  cartModel: CartModel;
  cartItemModel: CartItemModel;
  db: Pool;
  constructor(db: Pool) {
    this.stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });
    this.cartModel = new CartModel(db);
    this.cartItemModel = new CartItemModel(db);
    this.db = db;
  }
  async getPubKey() {
    return STRIPE_PUBLISHABLE_KEY;
  }

  async createPaymentIntent(userId: number) {
    // get this user's cart
    const cart = await this.cartModel.findOneByUserId(userId);

    // load cart items
    const cartItems = await this.cartItemModel.find(cart.id);

    // calculate total price
    const total = cartItems.reduce((total, item) => {
      return (total += Number(item.price * item.quantity));
    }, 0);

    const paymentIntent = await this.stripe.paymentIntents.create({
      currency: "GBP",
      amount: total,
      automatic_payment_methods: { enabled: true },
    });

    const paymentId = await this.cartModel.update(userId, paymentIntent.id);
    console.log(paymentId);

    return paymentIntent.client_secret;
  }
}
