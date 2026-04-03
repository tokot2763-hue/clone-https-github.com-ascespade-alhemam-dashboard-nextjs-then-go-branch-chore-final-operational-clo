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
  
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error('Session error:', sessionError);
  }
  
  if (!session?.user) {
    console.log('getSession: No session found - returning null');
    return null;
  }

  console.log('getSession: Found user:', session.user.email);
  
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

  // If no role mapping, use email to determine role from users table
  if (iamUser) {
    userData = iamUser;
    // role_id field doesn't exist in DB - derive role from user mapping
  } else {
    // Check by email prefix
    const emailPrefix = session.user.email.split('@')[0];
    if (emailPrefix === 'admin' || emailPrefix === 'system_manager') {
      role_code = 'admin';
      role_name = 'System Admin';
    } else if (emailPrefix === 'medical_supervisor' || emailPrefix === 'supervisor') {
      role_code = 'super_doctor';
      role_name = 'Super Doctor';
    } else if (emailPrefix === 'doctor') {
      role_code = 'doctor';
      role_name = 'Doctor';
    } else if (emailPrefix === 'nurse') {
      role_code = 'nurse';
      role_name = 'Nurse';
    } else if (emailPrefix === 'receptionist') {
      role_code = 'receptionist';
      role_name = 'Receptionist';
    } else if (emailPrefix === 'insurance') {
      role_code = 'accountant';
      role_name = 'Accountant';
    } else if (emailPrefix === 'patient') {
      role_code = 'patient';
      role_name = 'Patient';
    } else if (emailPrefix === 'parent' || emailPrefix === 'guardian') {
      role_code = 'guardian';
      role_name = 'Guardian';
    }
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
