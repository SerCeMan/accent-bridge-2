import { makeAutoObservable, runInAction } from 'mobx';
import { User } from '@supabase/auth-js';
import { SupabaseService } from './supabase';
import { AuthService } from './auth';
import { LOADING } from '../model';

export interface Progress {
  id: number;
  lesson: string;
  exercise: string;
  best_score: number | null;
}

export class ProgressService {
  private _progress: Progress[] | undefined = undefined;
  private _isLoading: boolean = true;
  private _user: User | undefined = undefined;

  constructor(
    auth: AuthService,
    private readonly supabase: SupabaseService,
  ) {
    makeAutoObservable(this);
    // refresh eagerly so that other components can read progress immediately.
    // this.refreshProgress();
    auth.onAuthChange((session) => {
      if (session) {
        runInAction(() => {
          this._user = session.user;
        });
        this.refreshProgress();
      } else {
        runInAction(() => {
          this._user = undefined;
          this._progress = [];
        });
      }
    });
  }

  get progress(): Progress[] | undefined {
    return this._progress;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  async refreshProgress(): Promise<void> {
    const userRes = await this.supabase.client.auth.getUser();
    if (!userRes.data?.user) {
      throw new Error(`Can't load user progress, ${userRes.error?.message}`);
    }

    this._user = userRes.data.user;
    try {
      const progress = await this.fetchProgress();
      runInAction(() => {
        this._progress = progress;
        this._isLoading = false;
      });
    } catch (error) {
      console.error('Error loading progress:', error);
      runInAction(() => {
        this._progress = [];
        this._isLoading = false;
      });
    }
  }

  private async fetchProgress(): Promise<Progress[]> {
    if (!this._user) {
      throw new Error('User not loaded');
    }
    const { data, error } = await this.supabase.client
      .from('progress')
      .select('id, lesson, exercise, best_score')
      .eq('user_id', this._user.id);
    if (error) {
      throw new Error(`Error fetching progress: ${error.message}`);
    }
    return data as Progress[];
  }

  async updateProgress(lesson: string, exercise: string, bestScore: number): Promise<void> {
    if (!this._user) {
      throw new Error('User not loaded');
    }
    const { data, error } = await this.supabase.client
      .from('progress')
      .upsert(
        { user_id: this._user.id, lesson: lesson, exercise: exercise, best_score: `${bestScore}` },
        { onConflict: 'user_id, lesson, exercise' },
      );
    if (error) {
      throw new Error(`Error updating progress: ${error.message}`);
    }
    // since we don't know the new ID if it was inserted, we just refresh the whole list.
    await this.fetchProgress();
  }

  findBestScoreByExercise(exerciseId: string): LOADING | number | undefined {
    if (!this.progress) {
      return LOADING;
    }
    return this.progress.find(p => p.exercise === exerciseId)?.best_score ?? undefined;
  }
}
