import { makeAutoObservable } from 'mobx';
import { Exercise, Lesson, lessons } from '../../data/lessons';

export class LessonsService {
  private _lessons: Lesson[];

  constructor() {
    makeAutoObservable(this);
    this._lessons = lessons
  }

  get lessons() {
    return this._lessons;
  }

  findLessonById(lessonId: string): Lesson | undefined {
    return this._lessons.find(l => l.id === lessonId);
  }

  findExerciseById(exerciseId: string): Exercise | undefined {
    return this._lessons
      .flatMap(l => l.exercises || [])
      .find(e => e.id === exerciseId);
  }
}