import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xjcxsdoblqckxafvzqsa.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqY3hzZG9ibHFja3hhZnZ6cXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNzEyNzQsImV4cCI6MjA5MDc0NzI3NH0.1QiRSM16AcEmAFwKyqIbXZvhCtev7iUbsBDXZ9PB3Rc';

export function createServerClient() {
  return createClient(supabaseUrl, supabaseKey);
}

export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqY3hzZG9ibHFja3hhZnZ6cXNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE3MTI3NCwiZXhwIjoyMDkwNzQ3Mjc0fQ.gzHKDlEZdITkEHoAoJflTl8MmFODGuRLMuZUqWgB5eA';
  return createClient(supabaseUrl, serviceKey);
}
