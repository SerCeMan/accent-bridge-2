import { createClient } from '@supabase/supabase-js';

export const supabaseClient = //
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SECRET_SERVICE_ROLE_KEY as string);