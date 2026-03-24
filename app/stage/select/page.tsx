import { redirect } from 'next/navigation';
import { isDemoMode } from '@/lib/supabase';
import { createServerSupabase } from '@/lib/supabase-server';
import { StageSelector } from '@/components/stage/StageSelector';

export default async function StageSelectPage() {
  // Demo mode: skip
  if (isDemoMode) {
    redirect('/');
  }

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  // Check if user already has a stage assigned - redirect immediately if so
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('stage, role')
    .eq('id', user.id)
    .single();

  // Handle errors gracefully
  if (error) {
    console.error('Error fetching profile:', error);
    // If profile doesn't exist, let them continue to select
    if (error.code !== 'PGRST116') {
      redirect('/login?error=profile');
    }
  }

  // If already has stage or is teacher/admin, redirect appropriately
  if (profile?.role === 'teacher' || profile?.role === 'admin') {
    redirect('/teacher');
  }
  
  if (profile?.stage) {
    redirect(`/stage/${profile.stage}`);
  }

  return (
    <div className="min-h-screen bg-apple-bg-secondary flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-apple-lg animate-fade-in-up">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-semibold text-apple-text mb-4">
              Select Your Grade Level
            </h1>
            <p className="text-apple-text-secondary text-lg">
              This helps us personalize your learning experience
            </p>
          </div>
          
          <StageSelector userId={user.id} />
        </div>
      </div>
    </div>
  );
}
