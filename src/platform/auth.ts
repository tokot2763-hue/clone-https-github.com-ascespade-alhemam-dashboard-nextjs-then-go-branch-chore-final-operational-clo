import { createServerClient } from './supabase-server';

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

  // Check if user exists in iam_users table
  const { data: userData } = await supabase
    .from('iam_users')
    .select(`
      id,
      email,
      full_name,
      role_id,
      tenant_id
    `)
    .eq('id', session.user.id)
    .single();

  if (!userData) {
    return null;
  }

  let role_code = 'guest';
  let role_name = 'Guest';

  if (userData.role_id) {
    const { data: roleData } = await supabase
      .from('iam_roles')
      .select('role_key, name')
      .eq('id', userData.role_id)
      .single();
    
    if (roleData) {
      role_code = roleData.role_key;
      role_name = roleData.name;
    }
  }

  return {
    user: {
      id: userData.id,
      email: userData.email,
      full_name: userData.full_name,
      role_id: userData.role_id,
      role_code: role_code,
      role_name: role_name,
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
    .select('role_id')
    .eq('id', userId)
    .single();

  if (!data?.role_id) return null;

  const { data: role } = await supabase
    .from('iam_roles')
    .select('role_key, name, role_level')
    .eq('id', data.role_id)
    .single();

  return role;
}
