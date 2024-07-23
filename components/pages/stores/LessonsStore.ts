import { LessonsService } from '../../services/lessons';
import { ProgressService } from '../../services/progress';
import { Lesson } from '../../../data/lessons';
import { makeAutoObservable } from 'mobx';

export class LessonsStore {
  constructor(
    private readonly lessonsService: LessonsService,
    private readonly progressService: ProgressService,
  ) {
    makeAutoObservable(this);
  }

  get lessons(): Lesson[] {
    return this.lessonsService.lessons;
  }

  get progressByLesson(): Record<string, number> | undefined {
    const progress = this.progressService.progress;
    if (!progress) {
      return undefined
    }

    // the number of completed exercises per lesson
    const exercisesPerLesson: Record<string, number> = {};
    for (const lesson of this.lessons) {
      exercisesPerLesson[lesson.id] = lesson.exercises?.length || 0;
    }

    const byLesson: Record<string, number> = {};
    for (const p of progress) {
      const lesson = p.lesson;
      if (p.best_score != null) {
        byLesson[lesson] = byLesson[lesson] || 0;
        if (isCompleted(p.best_score)) {
          byLesson[lesson] += 1.0 / exercisesPerLesson[lesson];
        }
      }
    }
    return byLesson
  }
}

function isCompleted(best_score: number) {
  return best_score >= 0.75;
}