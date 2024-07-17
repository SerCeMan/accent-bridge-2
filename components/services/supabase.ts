import { makeAutoObservable } from 'mobx';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class SupabaseService {
  private _client: SupabaseClient;

  constructor() {
    makeAutoObservable(this);
    this._client = createClient('https://cylaxffeozuygylayaea.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5bGF4ZmZlb3p1eWd5bGF5YWVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA5MjY5MjksImV4cCI6MjAzNjUwMjkyOX0.1V806k2vAtVv6p5i87IPxy18zi9aI9JBMRMeiZJ0ou4');
  }

  get client(): SupabaseClient {
    return this._client;
  }
}