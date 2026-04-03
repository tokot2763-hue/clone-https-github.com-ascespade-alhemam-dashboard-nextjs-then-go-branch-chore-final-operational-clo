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

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role_id: string | null;
  role_code: string | null;
  role_name: string | null;
  role_level: number;
  tenant_id: string | null;
}

export interface UserPreferences {
  user_id: string;
  theme: 'dark' | 'light';
  locale: 'ar' | 'en';
}

export interface Session {
  user: User;
  access_token: string;
  preferences?: UserPreferences;
}

export const ROLE_LEVELS: Record<string, number> = {
  admin: 100,
  super_doctor: 60,
  doctor: 50,
  nurse: 40,
  receptionist: 30,
  guardian: 20,
  patient: 10,
  guest: 0,
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  user_id: '',
  theme: 'dark',
  locale: 'ar',
};

async function createAuthClient(): Promise<SupabaseClient> {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  
  const accessToken = cookieStore.get('sb-access-token')?.value;
  const refreshToken = cookieStore.get('sb-refresh-token')?.value;
  
  const client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  
  if (accessToken) {
    await client.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || '',
    });
  }
  
  return client;
}

export function createServiceClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false }
  });
}

async function getUserPreferences(userId: string): Promise<UserPreferences> {
  const supabase = createServiceClient();
  
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error || !data) {
      // Return defaults if no preferences found
      return { ...DEFAULT_PREFERENCES, user_id: userId };
    }
    
    return {
      user_id: data.user_id,
      theme: data.theme || 'dark',
      locale: data.locale || 'ar',
    };
  } catch (e) {
    console.log('getUserPreferences: using defaults', e);
    return { ...DEFAULT_PREFERENCES, user_id: userId };
  }
}

export async function updateUserPreferences(userId: string, updates: Partial<UserPreferences>) {
  const supabase = createServiceClient();
  
  try {
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        theme: updates.theme || 'dark',
        locale: updates.locale || 'ar',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('updateUserPreferences error:', e);
    return false;
  }
}

export async function getSession(): Promise<Session | null> {
  const supabase = await createAuthClient();
  
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error('Session error:', sessionError);
  }
  
  if (!session?.user) {
    return null;
  }

  const userEmail = session.user.email || '';
  
  const { data: iamUser } = await supabase
    .from('iam_users')
    .select('*, role:iam_roles(*)')
    .eq('id', session.user.id)
    .single();

  let role_code = 'guest';
  let role_name = 'Guest';
  let role_level = 0;
  let role_id: string | null = null;
  let tenant_id: string | null = null;
  let full_name: string | null = null;

  if (iamUser?.role) {
    role_code = iamUser.role.role_key;
    role_name = iamUser.role.name;
    role_level = iamUser.role.role_level;
    role_id = iamUser.role_id;
    tenant_id = iamUser.tenant_id;
    full_name = iamUser.full_name;
  } else {
    const emailPrefix = userEmail.split('@')[0];
    
    const emailRoleMap: Record<string, { code: string; name: string; level: number }> = {
      admin: { code: 'admin', name: 'System Admin', level: 100 },
      system_manager: { code: 'admin', name: 'System Admin', level: 100 },
      medical_supervisor: { code: 'super_doctor', name: 'Super Doctor', level: 60 },
      supervisor: { code: 'super_doctor', name: 'Super Doctor', level: 60 },
      doctor: { code: 'doctor', name: 'Doctor', level: 50 },
      nurse: { code: 'nurse', name: 'Nurse', level: 40 },
      receptionist: { code: 'receptionist', name: 'Receptionist', level: 30 },
      insurance: { code: 'accountant', name: 'Accountant', level: 35 },
      patient: { code: 'patient', name: 'Patient', level: 10 },
      guardian: { code: 'guardian', name: 'Guardian', level: 20 },
      parent: { code: 'guardian', name: 'Guardian', level: 20 },
    };

    const emailRole = emailRoleMap[emailPrefix] || { code: 'patient', name: 'Patient', level: 10 };
    role_code = emailRole.code;
    role_name = emailRole.name;
    role_level = emailRole.level;
    
    full_name = session.user.user_metadata?.full_name || userEmail;
  }

  // Load user preferences (with Arabic default)
  const preferences = await getUserPreferences(session.user.id);

  return {
    user: {
      id: session.user.id,
      email: userEmail,
      full_name: full_name,
      role_id: role_id,
      role_code: role_code,
      role_name: role_name,
      role_level: role_level,
      tenant_id: tenant_id,
    },
    access_token: session.access_token,
    preferences,
  };
}

export function canAccessPage(userRoleLevel: number, requiredRoleLevel: number): boolean {
  return userRoleLevel >= requiredRoleLevel;
}

export async function requireAuth(minRoleLevel: number = 0) {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  if (session.user.role_level < minRoleLevel) {
    throw new Error('Forbidden');
  }
  
  return session;
}

export async function signIn(email: string, password: string) {
  const supabase = await createAuthClient();
  
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
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
}

export async function getUsers() {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('iam_users')
    .select('*, role:iam_roles(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getRoles() {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('iam_roles')
    .select('*')
    .order('role_level', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateUserRole(userId: string, roleId: string | null) {
  const supabase = createServiceClient();
  
  const { error } = await supabase
    .from('iam_users')
    .update({ role_id: roleId })
    .eq('id', userId);

  if (error) throw error;
}

export async function createRole(roleKey: string, name: string, roleLevel: number) {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('iam_roles')
    .insert({ role_key: roleKey, name, role_level: roleLevel })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createUser(email: string, fullName: string, roleId?: string, tenantId?: string) {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('iam_users')
    .insert({
      email,
      full_name: fullName,
      role_id: roleId,
      tenant_id: tenantId || '00000000-0000-0000-0000-000000000001',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}