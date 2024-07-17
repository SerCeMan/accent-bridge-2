import { Session, SupabaseClient } from '@supabase/supabase-js';
import { makeAutoObservable } from 'mobx';
import { SupabaseService } from './supabase';

export class AuthService {
  private _session: Session | null = null;
  private _isInitialized = false;

  constructor(
    private readonly supabase: SupabaseService
  ) {
    makeAutoObservable(this);
    supabase.client.auth.getSession()
      .then(({ data: { session } }) => {
        this.session = session;
      })
      .finally(() => {
        this._isInitialized = true;
      });
    supabase.client.auth.onAuthStateChange((_event, session) => {
      this.session = session;
    });
  }

  private set session(session: Session | null) {
    console.log('session', session);
    this._session = session;
  }

  get isInitialized() {
    return this._isInitialized;
  }

  get session() {
    return this._session;
  }

  get client(): SupabaseClient {
    return this.supabase.client;
  }

  async logout() {
    await this.client.auth.signOut();
    this.session = null;
    // todo router
    window.location.href = '/';
  }
}