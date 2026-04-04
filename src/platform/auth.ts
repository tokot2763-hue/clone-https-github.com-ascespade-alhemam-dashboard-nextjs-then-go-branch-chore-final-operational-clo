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
  organization_id: string | null;
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

export async function getUserPreferences(userId: string): Promise<UserPreferences> {
  const supabase = createServiceClient();
  
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error || !data) {
      return { ...DEFAULT_PREFERENCES, user_id: userId };
    }
    
    return {
      user_id: data.user_id,
      theme: data.theme || 'dark',
      locale: data.locale || 'ar',
    };
  } catch (e) {
    console.error('getUserPreferences error:', e);
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
      });
    
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('updateUserPreferences error:', e);
    return false;
  }
}

async function resolveUserRoleFromDb(supabase: SupabaseClient, authUserId: string): Promise<{role_code: string; role_name: string; role_level: number; role_id: string | null; organization_id: string | null}> {
  // Try user_roles table from migration 003
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('*, role:roles(*)')
    .eq('user_id', authUserId)
    .single();

  if (userRole?.role) {
    return {
      role_code: userRole.role.key,
      role_name: userRole.role.name_ar || userRole.role.name,
      role_level: userRole.role.level,
      role_id: userRole.role_id,
      organization_id: userRole.organization_id,
    };
  }

  // Fallback: Get highest system role
  const { data: existingRole } = await supabase
    .from('roles')
    .select('*')
    .eq('is_system', true)
    .order('level', { ascending: false })
    .limit(1)
    .single();

  if (existingRole) {
    return {
      role_code: existingRole.key,
      role_name: existingRole.name_ar || existingRole.name,
      role_level: existingRole.level,
      role_id: existingRole.id,
      organization_id: null,
    };
  }

  return {
    role_code: 'guest',
    role_name: 'زائر',
    role_level: 0,
    role_id: null,
    organization_id: null,
  };
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
  const userId = session.user.id;

  const roleInfo = await resolveUserRoleFromDb(supabase, userId);

  const fullName = session.user.user_metadata?.full_name as string | null 
    || session.user.user_metadata?.name as string | null
    || userEmail.split('@')[0];

  const preferences = await getUserPreferences(userId);

  return {
    user: {
      id: userId,
      email: userEmail,
      full_name: fullName,
      role_id: roleInfo.role_id,
      role_code: roleInfo.role_code,
      role_name: roleInfo.role_name,
      role_level: roleInfo.role_level,
      organization_id: roleInfo.organization_id,
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
    .from('user_roles')
    .select('*, role:roles(*)')
    .order('assigned_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getRoles() {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .order('level', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateUserRole(userId: string, roleId: string | null, organizationId?: string) {
  const supabase = createServiceClient();
  
  if (roleId) {
    const { error } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role_id: roleId,
        organization_id: organizationId || null,
        assigned_at: new Date().toISOString(),
      }, { onConflict: 'user_id,role_id,organization_id' });

    if (error) throw error;
  }
}

export async function createRole(roleKey: string, name: string, nameAr: string, level: number, organizationId?: string) {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('roles')
    .insert({
      organization_id: organizationId || null,
      key: roleKey,
      name,
      name_ar: nameAr,
      level,
      is_system: !organizationId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}