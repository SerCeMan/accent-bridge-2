import { observer } from 'mobx-react-lite';
import { AuthService } from '../services/auth';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export const AuthScreen = observer((
  { authService }: { authService: AuthService },
) => {
  return (
    <div className="flex justify-center">
      <Auth supabaseClient={authService.client} appearance={{ theme: ThemeSupa }} />
    </div>
  );
});