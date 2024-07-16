'use client';
import { setupIonicReact } from '@ionic/react';
import { StatusBar, Style } from '@capacitor/status-bar';


import React from 'react';
import { Root } from './install';

setupIonicReact({});

window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', async status => {
    try {
      await StatusBar.setStyle({
        // style: status.matches ? Style.Dark : Style.Light,
        // TODO: for now, always light
        style: Style.Light
      });
    } catch {}
  });

const AppShell = () => {
  return (
    <Root/>
  );
};

export default AppShell;
