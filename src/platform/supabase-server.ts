import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

const supabaseUrl = getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getRequiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const supabaseServiceKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');

export async function createServerClient(): Promise<SupabaseClient> {
  const { cookies, headers } = await import('next/headers');
  const cookieStore = await cookies();
  const headerStore = await headers();
  
  const accessToken = cookieStore.get('sb-access-token')?.value;
  const refreshToken = cookieStore.get('sb-refresh-token')?.value;
  
  const authHeader = headerStore.get('authorization') || headerStore.get('Authorization');
  const bearerToken = authHeader?.replace('Bearer ', '');
  const tokenToUse = accessToken || bearerToken;

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: tokenToUse ? { cookie: `sb-access-token=${tokenToUse}; sb-refresh-token=${refreshToken || ''}` } : {},
    },
  });
}

export function createServiceClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    }
  });
}
