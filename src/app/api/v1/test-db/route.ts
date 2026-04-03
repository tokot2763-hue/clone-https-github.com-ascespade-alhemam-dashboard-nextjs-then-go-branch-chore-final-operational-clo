import { NextResponse } from 'next/server';
import { createServiceClient } from '@/platform/supabase-server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xjcxsdoblqckxafvzqsa.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqY3hzZG9ibHFja3hhZnZ6cXNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE3MTI3NCwiZXhwIjoyMDkwNzQ3Mjc0fQ.gzHKDlEZdITkEHoAoJflTl8MmFODGuRLMuZUqWgB5eA';

export async function GET() {
  // Test with service client from auth.ts style
  const testClient1 = createServiceClient();
  const { data: data1, error: error1 } = await testClient1
    .from('nav_sections')
    .select('*');
  
  // Test with direct client creation
  const directClient = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false }
  });
  const { data: data2, error: error2 } = await directClient
    .from('nav_sections')
    .select('*');
  
  // Test with just count like healthz
  const { count } = await directClient
    .from('nav_sections')
    .select('*', { count: 'exact', head: true });
  
  return NextResponse.json({
    serviceClient: { count: data1?.length, error: error1 ? String(error1) : null, sample: data1?.slice(0, 2) },
    directClient: { count: data2?.length, error: error2 ? String(error2) : null, sample: data2?.slice(0, 2) },
    directHeadCount: count,
  });
}