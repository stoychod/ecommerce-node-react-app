import { STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY } from '../environment'
import Stripe from 'stripe'

export default class PaymentService {
  stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(STRIPE_SECRET_KEY, {apiVersion: '2022-11-15'})
  }
  async getPubKey() {
    return STRIPE_PUBLISHABLE_KEY;
  }
}
