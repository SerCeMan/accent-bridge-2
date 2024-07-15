import { observer } from 'mobx-react-lite';
import { AuthService } from '../services/auth';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import React from 'react';

export const WithAuth = observer(({
                                    authService,
                                    LoggedIn,
                                    LoggedOut,
                                  }: {
  authService: AuthService,
  LoggedIn: React.ComponentType<any>
  LoggedOut: React.ComponentType<any>
}) => {
  console.log("authService.session", authService.session)
  return (
    <>
      {authService.session
        ? <LoggedIn />
        : <LoggedOut />}
    </>
  )
});

export const AuthScreen = observer((
  { authService }: { authService: AuthService },
) => {
  return (
    <div className="flex justify-center">
      <Auth supabaseClient={authService.client} appearance={{ theme: ThemeSupa }} />
    </div>
  );
});