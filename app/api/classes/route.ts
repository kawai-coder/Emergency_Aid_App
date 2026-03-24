import { isDemoMode } from '@/lib/supabase';
import { createServerSupabase } from '@/lib/supabase-server';
import { requireRole } from '@/lib/auth/roles';
import { NextResponse } from 'next/server';

// POST: Create a new class (teachers only)
export async function POST(request: Request) {
  try {
    if (isDemoMode) {
      return NextResponse.json({ error: 'Not available in demo mode' }, { status: 403 });
    }

    const user = await requireRole('teacher');
    const { name, stage } = await request.json();
    
    if (!name || !stage) {
      return NextResponse.json({ error: 'Name and stage are required' }, { status: 400 });
    }
    
    const supabase = await createServerSupabase();
    
    // Generate a random 6-character invite code
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const { data, error } = await supabase
      .from('classes')
      .insert({ 
        name, 
        stage, 
        teacher_id: user.id, 
        invite_code: inviteCode 
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}

// GET: List classes
export async function GET() {
  try {
    if (isDemoMode) {
      return NextResponse.json([]);
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    let data;
    
    // Teachers see their own classes
    if (profile?.role === 'teacher') {
      const { data: classes, error } = await supabase
        .from('classes')
        .select('*, profiles(full_name), class_students(count)')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      data = classes;
    } 
    // Students see classes they're enrolled in
    else if (profile?.role === 'student') {
      // Get enrolled class IDs first
      const { data: enrollments } = await supabase
        .from('class_students')
        .select('class_id')
        .eq('student_id', user.id);
      
      const classIds = enrollments?.map(e => e.class_id) || [];
      
      if (classIds.length === 0) {
        data = [];
      } else {
        const { data: classes, error } = await supabase
          .from('classes')
          .select('*, profiles(full_name), class_students(count)')
          .in('id', classIds)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        data = classes;
      }
    }
    // Admin sees all
    else {
      const { data: classes, error } = await supabase
        .from('classes')
        .select('*, profiles(full_name), class_students(count)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      data = classes;
    }
    
    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
