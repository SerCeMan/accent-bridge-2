import {
  IonButton,
  IonContent,
  IonHeader, IonLabel,
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
import { profile } from 'unenv/runtime/node/console';
import { LOADING } from '../model';

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
              {/* Current Plan, and a button to upgrade if Free */}
              <>
                {store.plan === LOADING
                  ? <IonSpinner />
                  : <>
                    <IonLabel>Current Plan: <b>{store.plan}</b></IonLabel>
                    {store.plan === 'free'
                      ? (
                        <IonButton onClick={() => store.upgradePlan()} expand="block" className="mt-4">
                          Upgrade Plan
                        </IonButton>
                      )
                      : (
                        <IonButton onClick={() => store.managePlan()} expand="block" className="mt-4">
                          Manage Plan
                        </IonButton>
                      )}
                  </>}

              </>

              {/*Logout Button*/}
              <IonButton onClick={() => auth.logout()} expand="block" color={'danger'} className="mt-4">
                Logout
              </IonButton>
            </>
          )}
      </IonContent>
    </IonPage>
  );
});
