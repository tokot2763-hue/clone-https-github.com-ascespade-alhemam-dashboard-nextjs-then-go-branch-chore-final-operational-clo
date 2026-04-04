import { NextResponse } from 'next/server';
import { createServiceClient } from '@/platform/supabase-server';
import { getSession } from '@/platform/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceClient();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const status = searchParams.get('status');
    const patientId = searchParams.get('patient_id');
    const doctorId = searchParams.get('doctor_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('appointments')
      .select('*', { count: 'exact' })
      .order('appointment_date', { ascending: true })
      .range(offset, offset + limit - 1);

    if (date) {
      const startOfDay = `${date}T00:00:00Z`;
      const endOfDay = `${date}T23:59:59Z`;
      query = query.gte('appointment_date', startOfDay).lte('appointment_date', endOfDay);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (patientId) {
      query = query.eq('patient_id', patientId);
    }

    if (doctorId) {
      query = query.eq('doctor_id', doctorId);
    }

    const { data, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      appointments: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
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

    if (session.user.role_level < 30) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const supabase = createServiceClient();
    const body = await request.json();
    const { patient_id, doctor_id, department_id, appointment_date, duration_minutes, type, reason, reason_ar, is_online } = body;

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        patient_id,
        doctor_id,
        department_id,
        appointment_date,
        duration_minutes: duration_minutes || 30,
        type: type || 'consultation',
        reason,
        reason_ar,
        is_online: is_online || false,
        status: 'scheduled',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, appointment: data });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role_level < 30) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const supabase = createServiceClient();
    const body = await request.json();
    const { id, status, notes, notes_ar } = body;

    const { data, error } = await supabase
      .from('appointments')
      .update({
        status,
        notes,
        notes_ar,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, appointment: data });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}