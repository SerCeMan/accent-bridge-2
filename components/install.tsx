import { Shadow, ShadowSkeleton } from './pages/Shadow';
import { IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { Redirect, Route } from 'react-router';
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
import { lessons } from '../mock';
import { ExerciseStore } from './pages/stores/ExerciseStore';
import { LessonDetailStore } from './pages/stores/LessonDetailStore';

const supabase = new SupabaseService();
const authService = new AuthService(supabase);
const apiClient = new ApiClient(authService);

const settings = new SettingsStore(supabase);
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

const lessonsService = new LessonsService();
const LessonsPage = () => <Lessons store={lessonsService} />;
const lessonDetailStore = new LessonDetailStore(lessonsService);
const LessonPage = () => <LessonDetail store={lessonDetailStore} />;

const exerciseStore = new ExerciseStore(lessonsService, apiClient, settings);
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

export const Root = observer(() => {
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
