import { makeAutoObservable } from 'mobx';
import { Lesson, lessons } from '../../mock';

export class LessonsService {
  private _lessons: Lesson[];

  constructor() {
    makeAutoObservable(this);
    this._lessons = lessons
  }

  get lessons() {
    return this._lessons;
  }
}