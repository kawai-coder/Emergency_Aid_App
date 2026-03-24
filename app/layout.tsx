import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/AppShell';
import { isDemoMode } from '@/lib/supabase';
import { createServerSupabase } from '@/lib/supabase-server';

export const metadata: Metadata = {
  title: 'Campus First Aid Interactive Learning Platform',
  description: 'A lightweight shared platform demo with primary, middle, and high school first-aid learning loops.',
};

export default async function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // Get current user for navigation
  let user = null;
  
  if (!isDemoMode) {
    try {
      const supabase = await createServerSupabase();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, stage')
          .eq('id', authUser.id)
          .single();
          
        user = {
          email: authUser.email!,
          role: profile?.role || 'student',
          stage: profile?.stage,
        };
      }
    } catch {
      // Silent fail - user not logged in
    }
  }

  return (
    <html lang="en">
      <body>
        <AppShell user={user}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
