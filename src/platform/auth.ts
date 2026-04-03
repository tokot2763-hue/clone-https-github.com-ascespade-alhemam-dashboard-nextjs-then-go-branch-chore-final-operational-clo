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
  const supabase = await createServerClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return null;
  }

  let role_code = 'admin';
  let role_name = 'Admin';
  let role_id = null;
  let userData = null;

  // Check if user exists in iam_users table
  const { data: iamUser } = await supabase
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

  if (iamUser) {
    userData = iamUser;
    if (iamUser.role_id) {
      const { data: roleData } = await supabase
        .from('iam_roles')
        .select('code, name')
        .eq('id', iamUser.role_id)
        .single();
      
      if (roleData) {
        role_code = roleData.code;
        role_name = roleData.name;
        role_id = iamUser.role_id;
      }
    }
  } else {
    // User not in iam_users - check if they exist in auth.users
    // Use default admin role for authenticated users
    userData = {
      id: session.user.id,
      email: session.user.email,
      full_name: session.user.user_metadata?.full_name || session.user.email,
      role_id: null,
      tenant_id: null
    };
  }

  return {
    user: {
      id: userData.id,
      email: userData.email,
      full_name: userData.full_name,
      role_id: role_id,
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
  const supabase = await createServerClient();
  
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
  const supabase = await createServerClient();
  await supabase.auth.signOut();
}

export async function getUserRole(userId: string) {
  const supabase = await createServerClient();
  
  const { data } = await supabase
    .from('iam_users')
    .select('role_id')
    .eq('id', userId)
    .single();

  if (!data?.role_id) return null;

  const { data: role } = await supabase
    .from('iam_roles')
    .select('code, name, priority')
    .eq('id', data.role_id)
    .single();

  return role;
}
