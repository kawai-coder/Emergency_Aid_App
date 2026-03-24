import { isDemoMode } from '@/lib/supabase';
import { createServiceClient } from '@/lib/supabase-server';
import { requireRole } from '@/lib/auth/roles';
import { NextResponse } from 'next/server';

// GET: List all users (admin only)
export async function GET() {
  try {
    if (isDemoMode) {
      return NextResponse.json([]);
    }

    await requireRole('admin');
    const supabase = await createServiceClient();
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*, classes(name)')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}

// PATCH: Update user role/stage (admin only)
export async function PATCH(request: Request) {
  try {
    if (isDemoMode) {
      return NextResponse.json({ error: 'Not available in demo mode' }, { status: 403 });
    }

    await requireRole('admin');
    const { userId, role, stage } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    const supabase = await createServiceClient();
    
    const updateData: any = { updated_at: new Date().toISOString() };
    if (role) updateData.role = role;
    if (stage) updateData.stage = stage;
    
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);
      
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
