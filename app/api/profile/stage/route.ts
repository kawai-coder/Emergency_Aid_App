import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// PATCH: Update user's stage
export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    
    // Create server client with proper cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Unauthorized - Please sign in again' }, { status: 401 });
    }

    const { stage } = await request.json();
    
    if (!stage || !['primary', 'middle', 'high'].includes(stage)) {
      return NextResponse.json({ error: 'Invalid stage' }, { status: 400 });
    }
    
    // Update the profile
    const { data, error } = await supabase
      .from('profiles')
      .update({ stage, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single();
      
    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, profile: data });
  } catch (err: any) {
    console.error('API error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
