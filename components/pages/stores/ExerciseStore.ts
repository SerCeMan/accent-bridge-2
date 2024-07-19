import { LessonsService } from '../../services/lessons';
import { ApiClient } from '../../api';
import { SettingsStore } from './SettingsStore';
import { makeAutoObservable } from 'mobx';
import { ShadowStore } from './ShadowStore';

export class ExerciseStore {
  private shadowStores: Map<string, ShadowStore> = new Map();

  constructor(
    private readonly lessonsService: LessonsService,
    private readonly apiClient: ApiClient,
    private readonly settings: SettingsStore,
  ) {
    makeAutoObservable(this);
  }

  getShadowStore(exerciseId: string): ShadowStore {
    let shadowStore = this.shadowStores.get(exerciseId);
    if (!shadowStore) {
      const exercise = this.lessonsService.findExerciseById(exerciseId);
      if (!exercise) {
        throw new Error(`Exercise with id ${exerciseId} not found`);
      }

      const newStore = new ShadowStore(this.apiClient, this.settings);
      newStore.setCanonicalTextState(exercise.text);
      shadowStore = newStore;
      this.shadowStores.set(exerciseId, shadowStore);
    }
    return shadowStore;
  }
}