import { observer } from 'mobx-react-lite';
import { AuthService } from '../services/auth';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import React from 'react';
import { IonContent, IonPage, IonToast } from '@ionic/react';

export const WithAuth = observer(({
                                    authService,
                                    LoadingScreen,
                                    LoggedIn,
                                    LoggedOut,
                                  }: {
  authService: AuthService,
  LoadingScreen: React.ComponentType<any>
  LoggedIn: React.ComponentType<any>
  LoggedOut: React.ComponentType<any>
}) => {
  return (
    <>
      {!authService.isInitialized
        ? <LoadingScreen />
        : authService.session
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
        <IonToast
          isOpen={authService.isInitialized && !authService.session}
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