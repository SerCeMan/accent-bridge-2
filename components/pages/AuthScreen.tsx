import { observer } from 'mobx-react-lite';
import { AuthService } from '../services/auth';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import React from 'react';
import { IonContent, IonPage, IonToast } from '@ionic/react';

export const WithAuth = observer(({
                                    authService,
                                    LoggedIn,
                                    LoggedOut,
                                  }: {
  authService: AuthService,
  LoggedIn: React.ComponentType<any>
  LoggedOut: React.ComponentType<any>
}) => {
  console.log('authService.session', authService.session);
  return (
    <>
      {authService.session
        ? <LoggedIn />
        : <LoggedOut />}
    </>
  );
});

export const AuthScreen = observer((
  { authService }: { authService: AuthService },
) => {
  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <div className="flex justify-center items-center min-h-screen pb-14">
          <Auth supabaseClient={authService.client} appearance={{ theme: ThemeSupa }} />
        </div>
        {/*<ion-toast*/}
        {/*  trigger="open-toast"*/}
        {/*  message="Hello World!"*/}
        {/*[duration]="3000"*/}
        {/*[buttons]="toastButtons"*/}
        {/*(didDismiss)="setRoleMessage($event)"*/}
        {/*></ion-toast>*/}
        <IonToast
          isOpen={true}
          message="The application is currently in development. Do not expect it to work reliably at this point in time."
          duration={10000}
          buttons={[
            {
              text: 'Dismiss',
              role: 'cancel',
            },
          ]}>
        </IonToast>
      </IonContent>
    </IonPage>
  );
});