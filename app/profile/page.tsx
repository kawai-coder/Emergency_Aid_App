import { redirect } from 'next/navigation';
import { isDemoMode } from '@/lib/supabase';
import { createServerSupabase } from '@/lib/supabase-server';
import { SectionCard } from '@/components/SectionCard';
import { LogoutButton } from '@/components/auth/LogoutButton';
import Link from 'next/link';

export default async function ProfilePage() {
  if (isDemoMode) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <h1 className="text-4xl font-semibold tracking-tight text-apple-text">
          Profile
        </h1>
        <SectionCard>
          <p className="text-apple-text-secondary">
            Profile features are not available in demo mode. Please configure Supabase to enable full authentication.
          </p>
          <Link href="/" className="mt-4 inline-block text-apple-blue hover:text-apple-blue-hover">
            Back to home
          </Link>
        </SectionCard>
      </div>
    );
  }

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, class_students(class_id, classes(name, stage))')
    .eq('id', user.id)
    .single();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <h1 className="text-4xl font-semibold tracking-tight text-apple-text">
        Profile
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <SectionCard>
            <h2 className="text-xl font-semibold text-apple-text mb-6">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-apple-text-secondary">Email</label>
                <p className="text-apple-text font-medium">{profile?.email}</p>
              </div>
              <div>
                <label className="text-sm text-apple-text-secondary">Full Name</label>
                <p className="text-apple-text font-medium">{profile?.full_name}</p>
              </div>
            </div>
          </SectionCard>
          
          <SectionCard>
            <h2 className="text-xl font-semibold text-apple-text mb-6">Enrolled Classes</h2>
            {profile?.class_students && profile.class_students.length > 0 ? (
              <div className="space-y-3">
                {profile.class_students.map((enrollment: any) => (
                  <div 
                    key={enrollment.class_id}
                    className="p-4 rounded-2xl bg-apple-bg-secondary flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-apple-text">{enrollment.classes.name}</p>
                      <p className="text-sm text-apple-text-secondary capitalize">{enrollment.classes.stage}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-apple-text-secondary">
                You haven&apos;t joined any classes yet.
              </p>
            )}
          </SectionCard>
        </div>
        
        <div className="space-y-6">
          <SectionCard>
            <h3 className="text-lg font-semibold text-apple-text mb-4">Role</h3>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium
              bg-apple-blue/10 text-apple-blue capitalize">
              {profile?.role}
            </span>
          </SectionCard>
          
          {profile?.stage && (
            <SectionCard>
              <h3 className="text-lg font-semibold text-apple-text mb-4">Grade Level</h3>
              <p className="text-apple-text capitalize">{profile.stage} School</p>
            </SectionCard>
          )}
          
          <SectionCard>
            <h3 className="text-lg font-semibold text-apple-text mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link 
                href={profile?.role === 'teacher' ? '/teacher' : `/stage/${profile?.stage || 'primary'}`}
                className="block text-apple-blue hover:text-apple-blue-hover transition-colors"
              >
                Go to Dashboard →
              </Link>
              {profile?.role === 'student' && (
                <Link 
                  href="/stage/select"
                  className="block text-apple-blue hover:text-apple-blue-hover transition-colors"
                >
                  Change Grade Level →
                </Link>
              )}
            </div>
          </SectionCard>

          {/* Logout Section */}
          <SectionCard className="border-red-100">
            <h3 className="text-lg font-semibold text-apple-text mb-4">Account</h3>
            <LogoutButton />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
