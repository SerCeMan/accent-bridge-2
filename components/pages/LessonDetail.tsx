import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useParams } from 'react-router';
import { Exercise, Lesson } from '../../mock';
import { observer } from 'mobx-react-lite';
import { LessonsService } from '../services/lessons';
import { LessonDetailStore } from './stores/LessonDetailStore';

type LessonDetailParams = {
  lessonId: string;
};

const ListItems = ({ lessonId, list }: { lessonId: string, list: Lesson }) => {
  return (
    <IonList>
      {(list?.exercises || []).map((item, key) => (
        <LessonItem item={item} lessonId={lessonId} name={`Exercise ${key + 1}`} key={key} />
      ))}
    </IonList>
  );
};

const LessonItem = (
  {
    item,
    lessonId,
    name
  }: {
    item: Exercise;
    lessonId: string;
    name: string;
  }) => (
  <IonItem routerLink={`/lessons/${lessonId}/exercises/${item.id}`}>
    <IonLabel>{name}</IonLabel>
  </IonItem>
);

export const LessonDetail = observer((
  { store }: { store: LessonDetailStore },
) => {
  const params = useParams<LessonDetailParams>();
  const { lessonId } = params;
  const loadedList = store.findLessonById(lessonId)
  console.log("PARAMS: ", params)

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/lessons" />
          </IonButtons>
          <IonTitle>{loadedList?.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>{loadedList && <ListItems lessonId={lessonId} list={loadedList} />}</IonContent>
    </IonPage>
  );
});

