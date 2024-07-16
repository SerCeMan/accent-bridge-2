import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { makeAutoObservable } from 'mobx';

export class AuthService {
  private _client: SupabaseClient;
  private _session: Session | null = null;
  private _isInitialized = false;

  constructor() {
    makeAutoObservable(this);
    this._client = createClient('https://cylaxffeozuygylayaea.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5bGF4ZmZlb3p1eWd5bGF5YWVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA5MjY5MjksImV4cCI6MjAzNjUwMjkyOX0.1V806k2vAtVv6p5i87IPxy18zi9aI9JBMRMeiZJ0ou4');
    this._client.auth.getSession()
      .then(({ data: { session } }) => {
        this.session = session;
      })
      .finally(() => {
        this._isInitialized = true;
      });
    this._client.auth.onAuthStateChange((_event, session) => {
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
    return this._client;
  }

  async logout() {
    await this._client.auth.signOut();
    this.session = null;
    // todo router
    window.location.href = '/';
  }
}