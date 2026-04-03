import { NextResponse } from 'next/server';
import { createServerClient } from '@/platform/supabase-server';

export async function POST(request: Request) {
  console.log('=== Signin API called ===');
  
  try {
    const { email, password } = await request.json();
    console.log('Login attempt for:', email);

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();
    console.log('Supabase client created');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    console.log('Login successful for:', email);
    
    const response = NextResponse.json({
      user: data.user,
      session: data.session,
    });

    // Set auth cookies - allow all paths and subdomains
    if (data.session) {
      response.cookies.set('sb-access-token', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });
      
      response.cookies.set('sb-refresh-token', data.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
    }

    return response;
  } catch (error: any) {
    console.error('Catch error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
