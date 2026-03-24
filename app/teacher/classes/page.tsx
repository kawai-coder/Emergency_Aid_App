import { requireRole } from '@/lib/auth/roles';
import { isDemoMode } from '@/lib/supabase';
import { createServerSupabase } from '@/lib/supabase-server';
import { SectionCard } from '@/components/SectionCard';
import Link from 'next/link';

export default async function TeacherClassesPage() {
  if (isDemoMode) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-semibold tracking-tight text-apple-text mb-8">
          Class Management
        </h1>
        <SectionCard>
          <p className="text-apple-text-secondary">
            Class management not available in demo mode. Please configure Supabase.
          </p>
        </SectionCard>
      </div>
    );
  }

  const user = await requireRole('teacher');
  const supabase = await createServerSupabase();
  
  const { data: classes } = await supabase
    .from('classes')
    .select('*, class_students(count), profiles(full_name)')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-semibold tracking-tight text-apple-text">
          Class Management
        </h1>
        <Link
          href="/teacher"
          className="text-apple-blue hover:text-apple-blue-hover transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
      
      {classes && classes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <SectionCard key={cls.id} className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-apple-text">{cls.name}</h3>
                  <p className="text-sm text-apple-text-secondary capitalize">{cls.stage} School</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-apple-blue/10 text-apple-blue">
                  {cls.class_students?.[0]?.count || 0} students
                </span>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-apple-text-secondary">Invite Code</span>
                  <code className="bg-apple-bg-secondary px-2 py-1 rounded text-apple-text font-mono">
                    {cls.invite_code}
                  </code>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Link
                  href={`/teacher/students?class=${cls.id}`}
                  className="flex-1 text-center py-2 rounded-full border border-apple-border text-sm text-apple-text
                    hover:bg-apple-bg-secondary transition-colors"
                >
                  View Students
                </Link>
              </div>
            </SectionCard>
          ))}
        </div>
      ) : (
        <SectionCard className="text-center py-12">
          <p className="text-apple-text-secondary mb-4">You haven&apos;t created any classes yet.</p>
          <p className="text-sm text-apple-text-secondary">
            Create a class to get started with student management.
          </p>
        </SectionCard>
      )}
    </div>
  );
}
