import { computed, makeAutoObservable } from 'mobx';
import { LessonsService } from '../../services/lessons';
import { Progress, ProgressService } from '../../services/progress';
import { LOADING } from '../../model';

export class LessonDetailStore {
  constructor(
    private readonly lessonService: LessonsService,
    private readonly progressService: ProgressService,
  ) {
    makeAutoObservable(this);
  }

  findBestScoreByExercise(exerciseId: string): LOADING | number | undefined {
    return this.progressService.findBestScoreByExercise(exerciseId);
  }

  findLessonById(lessonId: string) {
    return this.lessonService.findLessonById(lessonId);
  }
}