import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useParams } from 'react-router';
import { observer } from 'mobx-react-lite';
import { LessonsService } from '../services/lessons';
import { useEffect } from 'react';
import { ExerciseStore } from './stores/ExerciseStore';
import { Shadow } from './Shadow';
import { ShadowStore } from './stores/ShadowStore';

type ExerciseDetailParams = {
  lessonId: string;
  exerciseId: string;
};

export const ExerciseDetail = observer((
  { store, lessonService }: { store: ExerciseStore, lessonService: LessonsService },
) => {
  const params = useParams<ExerciseDetailParams>();
  const { lessonId, exerciseId } = params;
  const exercise = lessonService.findExerciseById(exerciseId);
  const lesson = lessonService.findLessonById(lessonId);
  if (!exercise || !lesson) {
    return <IonPage>
      <IonContent>
        <p>Sorry, exercise not found!</p>
      </IonContent>
    </IonPage>;
  }

  const shadowStore: ShadowStore = store.getShadowStore(lessonId, exerciseId);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={`/lessons/${lessonId}`} />
          </IonButtons>
          <IonTitle>{lesson.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        {!shadowStore.isSelectedAccentLoaded
          ? <IonSpinner />
          : <Shadow store={shadowStore} />}
      </IonContent>
    </IonPage>
  );
});

