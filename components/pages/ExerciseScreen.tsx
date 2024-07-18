import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { LessonsService } from '../services/lessons';

type ExerciseDetailParams = {
  exerciseId: string;
};

export const ExerciseDetail = observer((
  { store }: { store: LessonsService },
) => {
  const lists = store.lessons;
  const params = useParams<ExerciseDetailParams>();
  const { exerciseId } = params;
  const loadedList = lists.find(l => l.id === exerciseId);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/Exercises" />
          </IonButtons>
          <IonTitle>{loadedList?.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>Exercise</IonContent>
    </IonPage>
  );
});

