import { Lesson } from '../../data/lessons';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { observer } from 'mobx-react-lite';
import { LessonsStore } from './stores/LessonsStore';
import { formatPerc } from '../services/utils';

const LessonEntry = ({ lesson, progress }: { lesson: Lesson, progress: undefined | Record<string, number> }) => {
  const lessonProgress = progress ? progress[lesson.id] : undefined;
  return (
    <IonItem routerLink={`/lessons/${lesson.id}`} className="list-entry">
      <IonLabel>{lesson.name}</IonLabel>
      {!progress
        ? <IonSpinner />
        : <IonLabel>
          {lessonProgress == null
            ? 'Not started'
            : lessonProgress >= 1
              ? 'Completed'
              : `${(formatPerc(lessonProgress))}%`}
        </IonLabel>}
    </IonItem>
  );
};

const AllLessons = observer((
  { store }: { store: LessonsStore },
) => {
  const lessons = store.lessons;
  const progress = store.progressByLesson;
  return (
    <>
      {lessons.map((lesson, i) => (
        <LessonEntry lesson={lesson} progress={progress} key={i} />
      ))}
    </>
  );
});

export const Lessons = observer((
  { store }: { store: LessonsStore },
) => {
  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>Lessons</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Lessons</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <AllLessons store={store} />
        </IonList>
      </IonContent>
    </IonPage>
  );
});
