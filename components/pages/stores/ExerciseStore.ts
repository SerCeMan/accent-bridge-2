import { LessonsService } from '../../services/lessons';
import { ApiClient } from '../../api';
import { SettingsStore } from './SettingsStore';
import { makeAutoObservable, reaction } from 'mobx';
import { ShadowStore } from './ShadowStore';
import { ProgressService } from '../../services/progress';

export class ExerciseStore {
  private shadowStores: Map<string, ShadowStore> = new Map();

  constructor(
    private readonly lessonsService: LessonsService,
    private readonly progressService: ProgressService,
    private readonly apiClient: ApiClient,
    private readonly settings: SettingsStore,
  ) {
    makeAutoObservable(this);
  }

  getShadowStore(lessonId: string, exerciseId: string): ShadowStore {
    let shadowStore = this.shadowStores.get(exerciseId);
    if (!shadowStore) {
      const exercise = this.lessonsService.findExerciseById(exerciseId);
      if (!exercise) {
        throw new Error(`Exercise with id ${exerciseId} not found`);
      }

      const newStore = new ShadowStore(this.apiClient, this.settings);
      newStore.setCanonicalTextState(exercise.text);
      reaction(
        () => this.progressService.progress,
        () => {
          newStore.bestScore = this.progressService.findBestScoreByExercise(exerciseId);
        },
        { fireImmediately: true },
      );
      newStore.onNewBestScore = (score) => {
        this.progressService.updateProgress(lessonId, exerciseId, score);
      };
      shadowStore = newStore;
      this.shadowStores.set(exerciseId, shadowStore);
    }
    return shadowStore;
  }
}