/// <reference types="stripe-event-types" />
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
import CartService from "../services/cartService";

export default class PaymentService {
  stripe: Stripe;
  cartModel: CartModel;
  cartItemModel: CartItemModel;
  cartService: CartService;
  db: Pool;
  constructor(db: Pool) {
    this.stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });
    this.cartModel = new CartModel(db);
    this.cartItemModel = new CartItemModel(db);
    this.cartService = new CartService(db);
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

    // create a payment intent and attach the user Id and cart Id
    // to the metadata object
    const paymentIntent = await this.stripe.paymentIntents.create({
      currency: "GBP",
      amount: total,
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId,
        cartId: cart.id,
      },
    });

    // save the payment intent in the cart
    await this.cartModel.update(userId, paymentIntent.id);

    return paymentIntent.client_secret;
  }

  async handleEvent(signature: string, rawBody: Buffer) {
    let event;

    // check event object signature to make suer it comes from Stripe
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        STRIPE_WEBHOOK_SECRET
      ) as Stripe.DiscriminatedEvent;
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

        // extract data from event data object
        const { id: paymentId, amount, metadata } = paymentIntentSucceeded;
        const { userId, cartId } = metadata;

        // get the cart
        const cart = await this.cartService.findOneById(cartId);

        // check if the payment id mathces the one in the database
        if (paymentId === cart.payment_id) {
          console.log("Payment ID mathces, completing the order..");
          // if so complete the order
         await this.cartService.completeCheckout(
            Number(userId),
            cartId,
            amount
          );
        }
        break;
      }
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event?.type}`);
    }
  }
}
