import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export const supabaseSuperClient = //
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SECRET_SERVICE_ROLE_KEY as string);

export async function fetchUserSession(supabase: SupabaseClient<any, 'public' extends keyof any ? 'public' : (string & keyof any), any>) {
  const session = await supabase.auth.getSession();
  if (session.error) {
    throw new Error('error fetching session');
  }
  const user = session.data.session?.user;
  if (!user) {
    throw new Error('auth is required');
  }
  return user;
}

export async function createAuthHeaderClient(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    throw new Error('auth is required');
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {
        },
      },
    }
  );
  const [accessToken, refreshToken] = authHeader.split(",");
  await supabase.auth.setSession({access_token: accessToken, refresh_token: refreshToken})
  await fetchUserSession(supabase);
  return supabase
}
