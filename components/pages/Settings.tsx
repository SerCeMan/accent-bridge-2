import { IonContent, IonHeader, IonItem, IonList, IonPage, IonTitle, IonToggle, IonToolbar } from '@ionic/react';
import { setSettings } from '../../store/actions';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';

export class SettingsStore {
  private _enableNotifications: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  get enableNotifications() {
    return this._enableNotifications;
  }

  set enableNotifications(value: boolean) {
    this._enableNotifications = value;
  }
}

export const Settings = observer(({ store }: { store: SettingsStore }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonToggle
              checked={store.enableNotifications}
              onIonChange={e => {
                setSettings({
                  ...store,
                  enableNotifications: e.target.checked,
                });
              }}
            >
              Enable Notifications
            </IonToggle>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
});
