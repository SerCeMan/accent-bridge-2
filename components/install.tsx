import { Shadow, ShadowSkeleton } from './pages/Shadow';
import { IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { Route } from 'react-router';
import { Lessons } from './pages/Lessons';
import { LessonDetail } from './pages/LessonDetail';
import { Settings } from './pages/Settings';
import { bookOutline, cog, flash } from 'ionicons/icons';
import React from 'react';
import { ApiClient } from './api';
import { AuthService } from './services/auth';
import { IonReactRouter } from '@ionic/react-router';
import { observer } from 'mobx-react-lite';
import { AuthScreen, WithAuth } from './pages/AuthScreen';

import { ShadowStore } from './pages/stores/ShadowStore';
import { SupabaseService } from './services/supabase';
import { SettingsStore } from './pages/stores/SettingsStore';
import { Loading } from './pages/Loading';
import { LessonsService } from './services/lessons';
import { ExerciseDetail } from './pages/ExerciseDetail';
import { ExerciseStore } from './pages/stores/ExerciseStore';
import { LessonDetailStore } from './pages/stores/LessonDetailStore';
import { ProgressService } from './services/progress';
import { LessonsStore } from './pages/stores/LessonsStore';
import { CapacitorStripeProvider, useCapacitorStripe } from '@capacitor-community/stripe/dist/esm/react/provider';
import { StripeService } from './services/stripe';
import { ProfileService } from './services/profiles';

const supabase = new SupabaseService();
const authService = new AuthService(supabase);
const profileService = new ProfileService(authService, supabase);
const apiClient = new ApiClient(authService, profileService);
const stripeService = new StripeService();
const settings = new SettingsStore(supabase, authService, profileService, apiClient, stripeService);
const SettingsPage = () => {
  return (
    <Settings store={settings} auth={authService} />
  );
};


const shadowPageStore = new ShadowStore(apiClient, settings);
const ShadowPage = () => {
  return (
    <ShadowSkeleton>
      <Shadow store={shadowPageStore} />
    </ShadowSkeleton>
  );
};

const AuthPage = () => {
  return <AuthScreen authService={authService} />;
};

const progressService = new ProgressService(authService, supabase);
const lessonsService = new LessonsService();
const lessonsStore = new LessonsStore(lessonsService, progressService);
const LessonsPage = () => <Lessons store={lessonsStore} />;
const lessonDetailStore = new LessonDetailStore(lessonsService, progressService);
const LessonPage = () => <LessonDetail store={lessonDetailStore} />;

const exerciseStore = new ExerciseStore(lessonsService, progressService, apiClient, settings);
const ExercisePage = () => <ExerciseDetail store={exerciseStore} lessonService={lessonsService} />;

const Tabs = () => {
  const shadowPath = '/';
  return (
    <IonTabs>
      <IonRouterOutlet>
        {/* Can't use Redirect due to https://github.com/ionic-team/ionic-framework/issues/23743 */}
        {/*<Route path="" render={() => <Redirect to="/shadow" />} exact={true} />*/}
        <Route path={shadowPath} render={() => <ShadowPage />} exact={true} />
        <Route path="/lessons" render={() => <LessonsPage />} exact={true} />
        <Route
          path="/lessons/:lessonId"
          render={LessonPage}
          exact={true}
        />
        <Route
          path="/lessons/:lessonId/exercises/:exerciseId"
          render={ExercisePage}
          exact={true}
        />
        <Route path="/settings" render={() => <SettingsPage />} exact={true} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/lessons">
          <IonIcon icon={bookOutline} />
          <IonLabel>Lessons</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href={shadowPath}>
          <IonIcon icon={flash} />
          <IonLabel>Shadow</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/settings">
          <IonIcon icon={cog} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

const LoadingPage = () => <Loading />;

const Router = () => {
  return (
    <IonReactRouter>
      <IonRouterOutlet id="main">
        <Route path="/" render={Tabs} />
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

const AppInitializer = observer(() => {
  // const stripe = useCapacitorStripe();
  // stripeService.stripe = stripe;
  return (
    <IonApp>
      <WithAuth
        authService={authService}
        LoadingScreen={LoadingPage}
        LoggedIn={Router}
        LoggedOut={AuthPage}
      />
    </IonApp>
  );
});

export const Root = observer(() => {
  return (
    // <CapacitorStripeProvider
    //   publishableKey="pk_live_51PfaxCHUC68AQdv3PVsgmXnj7b13iC7actc27pGENFYkFqaNGrCT6wXaK5bEiw05ehArYkJz43a31apvpii9adlc00OpCPiUli"
    //   fallback={<p>Loading...</p>}
    // >
    <AppInitializer />
    // </CapacitorStripeProvider>
  );
});
