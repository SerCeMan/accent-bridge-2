import { Shadow, ShadowSkeleton, ShadowPageStore } from './pages/Shadow';
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import Lists from './pages/Lists';
import ListDetail from './pages/ListDetail';
import { Settings, SettingsStore } from './pages/Settings';
import { cog, flash, list } from 'ionicons/icons';
import React from 'react';

const settings = new SettingsStore();
const SettingsPage = () => {
  return (
    <Settings store={settings} />
  );
};


const shadowPageStore = new ShadowPageStore(settings);
export const ShadowPage = () => {
  return (
    <ShadowSkeleton>
      <Shadow store={shadowPageStore} />
    </ShadowSkeleton>
  );
};

export const Tabs = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/shadow" render={() => <ShadowPage />} exact={true} />
        <Route path="/lists" render={() => <Lists />} exact={true} />
        <Route
          path="/lists/:listId"
          render={() => <ListDetail />}
          exact={true}
        />
        <Route path="/settings" render={() => <SettingsPage />} exact={true} />
        <Route path="" render={() => <Redirect to="/shadow" />} exact={true} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/shadow">
          <IonIcon icon={flash} />
          <IonLabel>Shadow</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/lists">
          <IonIcon icon={list} />
          <IonLabel>Lists</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/settings">
          <IonIcon icon={cog} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};