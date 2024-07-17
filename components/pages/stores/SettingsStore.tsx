import { makeAutoObservable, runInAction } from 'mobx';
import { SupabaseService } from '../../services/supabase';
import { User } from '@supabase/auth-js';
import { refresh } from 'ionicons/icons';

export class SettingsStore {
  private _selectedAccent: string | undefined = undefined;
  private _isLoading: boolean = true;
  private _user: User | undefined = undefined;

  constructor(private readonly supabase: SupabaseService) {
    makeAutoObservable(this);
    // refresh eagerly so that other components can read settings immediately.
    this.refreshSettings();
  }

  get selectedAccent(): string | undefined {
    return this._selectedAccent;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  set selectedAccent(selectedAccent: string) {
    this._selectedAccent = selectedAccent;
    this.saveSettings(selectedAccent);
  }

  async refreshSettings(): Promise<void> {
    const userRes = await this.supabase.client.auth.getUser()
    if (!userRes.data?.user) {
      throw new Error(`Can't load user settings, ${userRes.error?.message}`);
    }

    this._user = userRes.data.user;
    const user = this._user;
    try {
      const accent = await this.fetchSetting(user.id);
      runInAction(() => {
        this._selectedAccent = accent ?? 'british';
        this._isLoading = false;
      });
    } catch (error) {
      console.error('Error loading settings:', error);
      runInAction(() => {
        this._selectedAccent = 'british';
        this._isLoading = false;
      });
    }
  }

  private async saveSettings(selectedAccent: string): Promise<void> {
    if (!this._user) {
      throw new Error('User not loaded');
    }
    await this.updateSetting(this._user.id, selectedAccent);
  }

  async fetchSetting(userId: string): Promise<string | null> {
    const { data, error } = await this.supabase.client
      .from('settings')
      .select('selected_accent')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) {
      throw new Error(`Error fetching setting:${error.message}`);
    }
    return data?.selected_accent ?? null;
  }

  async updateSetting(userId: string, selectedAccent: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('settings')
      .upsert({ user_id: userId, selected_accent: selectedAccent }, { onConflict: 'user_id' });
    if (error) {
      throw new Error(`Error updating setting: ${error.message}`);
    }
  }
}