import { NextRequest } from 'next/server';
import { apiHost } from '../../../../services/paths';
import { createAuthHeaderClient, fetchUserSession, supabaseSuperClient } from '../../../../services/supabase';
import { User } from '@supabase/auth-js';

export const runtime = 'edge';

async function getUserId(req: NextRequest): Promise<User> {
  var supabase = await createAuthHeaderClient(req);
  return await fetchUserSession(supabase)
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const text = body.text;
  const accent = body.accent;
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response('auth is required', { status: 403 });
  }

  const [accessToken, refreshToken] = authHeader.split(",");

  const user = await getUserId(req);
  const userId = user.id;

  const response = await fetch(`${apiHost}/synthesize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ text, accent }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response
}