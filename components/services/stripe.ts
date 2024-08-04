import { makeAutoObservable } from 'mobx';
import { CapacitorStripeContext } from '@capacitor-community/stripe';

export class StripeService {
  private _stripe: CapacitorStripeContext | undefined;

  set stripe(value: CapacitorStripeContext) {
    this._stripe = value;
  }

  get stripe() {
    if (!this._stripe) {
      throw new Error('Stripe not initialized');
    }
    return this._stripe;
  }

  constructor() {
    makeAutoObservable(this);
  }

  async createPayment(intent: string) {
    await this.stripe.stripe.createPaymentSheet({
      paymentIntentClientSecret: intent
    })
  }
}