import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { cookies, headers } from 'next/headers';

const supabaseUrl = 'https://xjcxsdoblqckxafvzqsa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqY3hzZG9ibHFja3hhZnZ6cXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNzEyNzQsImV4cCI6MjA5MDc0NzI3NH0.1QiRSM16AcEmAFwKyqIbXZvhCtev7iUbsBDXZ9PB3Rc';

export async function createServerClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();
  const headerStore = await headers();
  
  const accessToken = cookieStore.get('sb-access-token')?.value;
  const refreshToken = cookieStore.get('sb-refresh-token')?.value;
  
  // Also try Authorization header
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
  const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqY3hzZG9ibHFja3hhZnZ6cXNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE3MTI3NCwiZXhwIjoyMDkwNzQ3Mjc0fQ.gzHKDlEZdITkEHoAoJflTl8MmFODGuRLMuZUqWgB5eA';
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
    }
  });
}
