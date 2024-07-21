import { Lesson } from '../../data';
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { LessonsService } from '../services/lessons';
import { observer } from 'mobx-react-lite';

const LessonEntry = ({ list }: { list: Lesson }) => {
  return (
    <IonItem routerLink={`/lessons/${list.id}`} className="list-entry">
      <IonLabel>{list.name}</IonLabel>
    </IonItem>
  );
};

const AllLessons = observer((
  { store }: { store: LessonsService },
) => {
  const lessons = store.lessons;
  return (
    <>
      {lessons.map((list, i) => (
        <LessonEntry list={list} key={i} />
      ))}
    </>
  );
});

export const Lessons = observer((
  { store }: { store: LessonsService },
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
