import { makeAutoObservable } from 'mobx';
import { LessonsService } from '../../services/lessons';

export class LessonDetailStore {

  constructor(
    private readonly lessonService: LessonsService,
  ) {
    makeAutoObservable(this);
  }

  findLessonById(lessonId: string) {
    return this.lessonService.findLessonById(lessonId);
  }
}