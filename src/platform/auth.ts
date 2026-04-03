import { createServerClient } from './supabase-server';
import { cookies } from 'next/headers';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role_id: string | null;
  role_code: string | null;
  role_name: string | null;
  tenant_id: string | null;
}

export interface Session {
  user: User;
  access_token: string;
}

export async function getSession(): Promise<Session | null> {
  const supabase = createServerClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return null;
  }

  const { data: userData } = await supabase
    .from('iam_users')
    .select(`
      id,
      email,
      full_name,
      role_id,
      iam_roles:iam_roles (
        code,
        name
      ),
      tenant_id
    `)
    .eq('id', session.user.id)
    .single();

  if (!userData) {
    return null;
  }

  const roleData = Array.isArray(userData.iam_roles) 
    ? userData.iam_roles[0] 
    : userData.iam_roles;

  return {
    user: {
      id: userData.id,
      email: userData.email,
      full_name: userData.full_name,
      role_id: userData.role_id,
      role_code: roleData?.code || null,
      role_name: roleData?.name || null,
      tenant_id: userData.tenant_id,
    },
    access_token: session.access_token,
  };
}

export async function requireAuth() {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  return session;
}

export async function signIn(email: string, password: string) {
  const supabase = createServerClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const supabase = createServerClient();
  await supabase.auth.signOut();
}

export async function getUserRole(userId: string) {
  const supabase = createServerClient();
  
  const { data } = await supabase
    .from('iam_users')
    .select(`
      role_id,
      iam_roles (
        code,
        name,
        priority
      )
    `)
    .eq('id', userId)
    .single();

  return data?.iam_roles || null;
}
