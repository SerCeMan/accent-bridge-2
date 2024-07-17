import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { observer } from 'mobx-react-lite';
import { AuthService } from '../services/auth';
import { SettingsStore } from './stores/SettingsStore';

export const Settings = observer((
  { store, auth }: { store: SettingsStore, auth: AuthService },
) => {
  const isLoading = store.isLoading;
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {isLoading
          ? <IonSpinner />
          : (
            <>
              <IonSelect
                value={store.selectedAccent}
                onIonChange={(e) => store.selectedAccent = e.detail.value}
                className="w-full p-2 mb-4 border rounded"
              >
                <IonSelectOption value="british">British</IonSelectOption>
                <IonSelectOption value="us">US</IonSelectOption>
              </IonSelect>
              {/*Logout Button*/}
              <IonButton onClick={() => auth.logout()} expand="block" className="mb-4">
                Logout
              </IonButton>
            </>
          )}
      </IonContent>
    </IonPage>
  );
});
