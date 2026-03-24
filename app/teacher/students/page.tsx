import { requireRole } from '@/lib/auth/roles';
import { isDemoMode } from '@/lib/supabase';
import { createServerSupabase } from '@/lib/supabase-server';
import { SectionCard } from '@/components/SectionCard';
import Link from 'next/link';

interface Enrollment {
  student_id: string;
  joined_at: string;
  classes: {
    name: string;
    stage: string;
  };
  profiles: {
    full_name: string;
    email: string;
    stage: string;
  };
}

export default async function StudentManagementPage() {
  if (isDemoMode) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-semibold tracking-tight text-apple-text mb-8">
          Students
        </h1>
        <SectionCard>
          <p className="text-apple-text-secondary">
            Student management not available in demo mode.
          </p>
        </SectionCard>
      </div>
    );
  }

  const user = await requireRole('teacher');
  const supabase = await createServerSupabase();
  
  // Get students from teacher's classes
  const { data: students } = await supabase
    .from('class_students')
    .select(`
      student_id,
      joined_at,
      classes!inner(name, stage, teacher_id),
      profiles!inner(full_name, email, stage)
    `)
    .eq('classes.teacher_id', user.id)
    .returns<Enrollment[]>();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-semibold tracking-tight text-apple-text">
          Students
        </h1>
        <Link 
          href="/teacher/classes"
          className="text-apple-blue hover:text-apple-blue-hover transition-colors"
        >
          Back to Classes
        </Link>
      </div>
      
      <SectionCard>
        {students && students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-apple-border/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-apple-text-secondary">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-apple-text-secondary">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-apple-text-secondary">Class</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-apple-text-secondary">Stage</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-apple-text-secondary">Joined</th>
                </tr>
              </thead>
              <tbody>
                {students.map((enrollment) => (
                  <tr key={enrollment.student_id} className="border-b border-apple-border/30 hover:bg-apple-bg-secondary/50">
                    <td className="px-4 py-3 text-sm text-apple-text font-medium">
                      {enrollment.profiles.full_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-apple-text-secondary">
                      {enrollment.profiles.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-apple-text">
                      {enrollment.classes.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-apple-text-secondary capitalize">
                      {enrollment.profiles.stage}
                    </td>
                    <td className="px-4 py-3 text-sm text-apple-text-secondary">
                      {new Date(enrollment.joined_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-apple-text-secondary mb-4">No students enrolled yet.</p>
            <p className="text-sm text-apple-text-secondary">
              Share your class invite code with students to have them join.
            </p>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
