import { createBrowserClient } from '@supabase/ssr';
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Demo mode flag - works without Supabase credentials
export const isDemoMode = !supabaseUrl || !supabaseAnonKey || 
  supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key');

// Browser client for Client Components
export function createClient() {
  if (isDemoMode) {
    throw new Error('Client-side Supabase not available in demo mode');
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Middleware client for route protection
export function createMiddlewareSupabaseClient(request: NextRequest, response: NextResponse) {
  if (isDemoMode) {
    return createMockMiddlewareClient();
  }
  
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });
}

// Demo mode mock client for middleware
function createMockMiddlewareClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
    },
  } as any;
}

// Supabase connection status message
export const supabaseMode = isDemoMode 
  ? 'Demo mode: Authentication not available' 
  : 'Connected to Supabase';
