import {
  IonButton, IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonPage,
  IonSelect, IonSelectOption,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/react';
import { setSettings } from '../../store/actions';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { AuthService } from '../services/auth';

export class SettingsStore {
  private _enableNotifications: boolean = true;
  private _selectedAccent: string = 'british';

  constructor() {
    makeAutoObservable(this);
  }

  get enableNotifications() {
    return this._enableNotifications;
  }

  set enableNotifications(value: boolean) {
    this._enableNotifications = value;
  }

  get selectedAccent(): string {
    return this._selectedAccent;
  }

  set selectedAccent(value: string) {
    this._selectedAccent = value;
  }
}

export const Settings = observer((
  { store, auth }: { store: SettingsStore, auth: AuthService },
) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
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
      </IonContent>
    </IonPage>
  );
});
