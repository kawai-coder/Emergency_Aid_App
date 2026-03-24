import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { isDemoMode } from './supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export { supabaseUrl, supabaseAnonKey };

// Server client for Server Components
export async function createServerSupabase() {
  if (isDemoMode) {
    throw new Error('Server Supabase not available in demo mode');
  }
  
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}

// Service role client for admin operations
export async function createServiceClient() {
  if (isDemoMode) {
    throw new Error('Service client not available in demo mode');
  }
  
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY not configured');
  }
  
  return createServerClient(supabaseUrl, serviceRoleKey, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}
