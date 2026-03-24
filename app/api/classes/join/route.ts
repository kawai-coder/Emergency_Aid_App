import { isDemoMode } from '@/lib/supabase';
import { createServerSupabase } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/auth/roles';
import { NextResponse } from 'next/server';

// POST: Join a class using invite code
export async function POST(request: Request) {
  try {
    if (isDemoMode) {
      return NextResponse.json({ error: 'Not available in demo mode' }, { status: 403 });
    }

    const user = await requireAuth();
    const { inviteCode } = await request.json();
    
    if (!inviteCode) {
      return NextResponse.json({ error: 'Invite code is required' }, { status: 400 });
    }
    
    const supabase = await createServerSupabase();
    
    // Find class by invite code
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('id, stage')
      .eq('invite_code', inviteCode.toUpperCase())
      .single();
      
    if (classError || !classData) {
      return NextResponse.json({ error: 'Invalid invite code' }, { status: 404 });
    }
    
    // Check student's stage matches class stage
    const { data: profile } = await supabase
      .from('profiles')
      .select('stage')
      .eq('id', user.id)
      .single();
      
    if (profile?.stage !== classData.stage) {
      return NextResponse.json(
        { error: `This class is for ${classData.stage} school. Your profile is set to ${profile?.stage || 'unknown'}.` },
        { status: 400 }
      );
    }
    
    // Check if already enrolled
    const { data: existing } = await supabase
      .from('class_students')
      .select('id')
      .eq('class_id', classData.id)
      .eq('student_id', user.id)
      .single();
      
    if (existing) {
      return NextResponse.json({ error: 'Already enrolled in this class' }, { status: 400 });
    }
    
    // Enroll student
    const { error } = await supabase
      .from('class_students')
      .insert({ 
        class_id: classData.id, 
        student_id: user.id 
      });
      
    if (error) throw error;
    
    return NextResponse.json({ success: true, classId: classData.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
