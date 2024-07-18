import { observer } from 'mobx-react-lite';
import { IonContent, IonPage, IonSpinner } from '@ionic/react';

export const Loading = observer(() => {
  console.log("Loading")
  return (
    <>
      <IonPage>
        <IonContent className="ion-padding" fullscreen>
          <div className="flex justify-center items-center min-h-screen">
            <IonSpinner />
          </div>
        </IonContent>
      </IonPage>
    </>
  );
});