import {
  IonBackButton,
  IonButtons,
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
import { useParams } from 'react-router';
import { Lesson } from '../../data/lessons';
import { observer } from 'mobx-react-lite';
import { LessonDetailStore } from './stores/LessonDetailStore';
import { LOADING } from '../model';
import { formatPerc } from '../services/utils';

type LessonDetailParams = {
  lessonId: string;
};

const ListItems = observer((
  {
    lessonId,
    store,
    lesson,
  }: {
    lessonId: string,
    store: LessonDetailStore,
    lesson: Lesson
  }) => {
  return (
    <IonList>
      {(lesson?.exercises || []).map((exercise, key) => {
        const progress = store.findBestScoreByExercise(exercise.id);
        return (
          <IonItem routerLink={`/lessons/${lessonId}/exercises/${exercise.id}`} key={key}>
            <IonLabel>{`Exercise ${key + 1}`}</IonLabel>
            {progress == LOADING
              ? <IonSpinner />
              : progress == undefined
                ? <IonLabel>Not started</IonLabel>
                : <IonLabel>{`Best score: ${formatPerc(progress)}%`}</IonLabel>}
          </IonItem>
        );
      })}
    </IonList>
  );
});

export const LessonDetail = observer((
  { store }: { store: LessonDetailStore },
) => {
  const params = useParams<LessonDetailParams>();
  const { lessonId } = params;
  const lesson: Lesson | undefined = store.findLessonById(lessonId);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/lessons" />
          </IonButtons>
          <IonTitle>{lesson?.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>{lesson &&
        <ListItems lessonId={lessonId} store={store} lesson={lesson} />}</IonContent>
    </IonPage>
  );
});

