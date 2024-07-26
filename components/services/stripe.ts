import { makeAutoObservable } from 'mobx';
import { CapacitorStripeContext } from '@capacitor-community/stripe';

export class StripeService {
  private _stripe: CapacitorStripeContext | undefined;

  set stripe(value: CapacitorStripeContext) {
    this._stripe = value;
  }

  constructor() {
    makeAutoObservable(this);
  }
}