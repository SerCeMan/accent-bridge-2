import { Session, SupabaseClient } from '@supabase/supabase-js';
import { makeAutoObservable, runInAction } from 'mobx';
import { SupabaseService } from './supabase';

export class AuthService {
  private _session: Session | null = null;
  private _isInitialized = false;
  private callbacks: ((session: Session | null) => void)[] = [];

  constructor(
    private readonly supabase: SupabaseService,
  ) {
    makeAutoObservable(this);
    supabase.client.auth.getSession()
      .then(({ data: { session } }) => {
        this.session = session;
      })
      .finally(() => {
        this.isInitialized = true;
      });
    supabase.client.auth.onAuthStateChange((_event, session) => {
      this.session = session;
      this.callbacks.forEach(cb => cb(session));
    });
  }

  private set session(session: Session | null) {
    this._session = session;
  }

  private set isInitialized(isInitialized: boolean) {
    this._isInitialized = isInitialized
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

  async onAuthChange(callback: (session: Session | null) => void) {
    this.callbacks.push(callback);
    if (this.session) {
      callback(this.session);
    }
  }
}