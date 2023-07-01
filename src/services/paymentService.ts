import {
  STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_WEBHOOK_SECRET,
} from "../environment";
import Stripe from "stripe";
import { Pool } from "pg";
import CreateHttpError from "http-errors";
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

  async handleEvent(signature: string, rawBody: Buffer) {
    let event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      if (err instanceof Error) {
        throw CreateHttpError(400, `Webhook Error: ${err.message}`);
      }
    }

    // Handle the event
    switch (event?.type) {
      case "payment_intent.succeeded": {
        const paymentIntentSucceeded = event.data.object;
        console.log(paymentIntentSucceeded);
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      }
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event?.type}`);
    }
  }
}
