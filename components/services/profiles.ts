import { SupabaseService } from './supabase';
import { makeAutoObservable } from 'mobx';
import { AuthService } from './auth';
import { LOADING } from '../model';

export class ProfileService {
  _plan: string | LOADING = LOADING;
  _stripeCustomer: string | LOADING = LOADING;

  constructor(
    private readonly auth: AuthService,
    private readonly supabase: SupabaseService,
  ) {
    makeAutoObservable(this);
    auth.onAuthChange((session) => {
      if (session) {
        this.refreshProfile();
      }
    });
  }

  get stripeCustomer() {
    return this._stripeCustomer;
  }

  get plan() {
    return this._plan;
  }

  async refreshProfile() {
    const user = this.auth.session?.user.id;
    if (!user) {
      return;
    }

    const { data, error } = await this.supabase.client
      .from('profiles')
      .select('plan, stripe_customer')
      .eq('id', user)
      .single();

    if (error) {
      throw error;
    }

    if (data) {
      this._plan = data.plan;
      this._stripeCustomer = data.stripe_customer;
    }
  }
}