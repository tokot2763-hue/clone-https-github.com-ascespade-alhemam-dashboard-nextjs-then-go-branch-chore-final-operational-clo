import { NextResponse } from 'next/server';
import { getSession, getUsers, getRoles, updateUserRole, createRole, canAccessPage, ROLE_LEVELS } from '@/platform/auth';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Require admin role (level 100)
    if (session.user.role_level < 100) {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }
    
    const users = await getUsers();
    const roles = await getRoles();
    
    return NextResponse.json({ users, roles });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (session.user.role_level < 100) {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }
    
    const body = await request.json();
    const { action, ...data } = body;
    
    if (action === 'updateRole') {
      await updateUserRole(data.userId, data.roleId);
      return NextResponse.json({ success: true });
    }
    
    if (action === 'createRole') {
      const role = await createRole(data.roleKey, data.name, data.roleLevel);
      return NextResponse.json({ success: true, role });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}