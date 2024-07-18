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
import { useParams } from 'react-router-dom';
import { Exercise, Lesson } from '../../mock';
import { observer } from 'mobx-react-lite';
import { LessonsService } from '../services/lessons';

type LessonDetailParams = {
  listId: string;
};

const ListItems = ({ list }: { list: Lesson }) => {
  return (
    <IonList>
      {(list?.exercises || []).map((item, key) => (
        <LessonItem item={item} name={`Exercise ${key + 1}`} key={key} />
      ))}
    </IonList>
  );
};

const LessonItem = (
  {
    item,
    name
  }: {
    item: Exercise;
    name: string
  }) => (
  <IonItem routerLink={`/exercises/${item.id}`}>
    <IonLabel>{name}</IonLabel>
  </IonItem>
);

export const LessonDetail = observer((
  { store }: { store: LessonsService },
) => {
  const lists = store.lessons;
  const params = useParams<LessonDetailParams>();
  const { listId } = params;
  const loadedList = lists.find(l => l.id === listId);

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
      <IonContent>{loadedList && <ListItems list={loadedList} />}</IonContent>
    </IonPage>
  );
});

