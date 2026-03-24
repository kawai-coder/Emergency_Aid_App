import { isDemoMode } from '@/lib/supabase';
import { createServiceClient } from '@/lib/supabase-server';
import { requireRole } from '@/lib/auth/roles';
import { SectionCard } from '@/components/SectionCard';
import Link from 'next/link';

export default async function AdminPage() {
  if (isDemoMode) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-semibold tracking-tight text-apple-text mb-8">
          User Management
        </h1>
        <SectionCard>
          <p className="text-apple-text-secondary">
            Admin features not available in demo mode. Configure Supabase service role key.
          </p>
        </SectionCard>
      </div>
    );
  }

  await requireRole('admin');
  
  const supabase = await createServiceClient();
  
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-semibold tracking-tight text-apple-text">
          User Management
        </h1>
        <Link 
          href="/teacher"
          className="text-apple-blue hover:text-apple-blue-hover transition-colors"
        >
          Teacher Dashboard
        </Link>
      </div>
      
      <SectionCard>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-apple-border/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-apple-text-secondary">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-apple-text-secondary">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-apple-text-secondary">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-apple-text-secondary">Stage</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-apple-text-secondary">Created</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id} className="border-b border-apple-border/30 hover:bg-apple-bg-secondary/50">
                  <td className="px-4 py-3 text-sm text-apple-text">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-apple-text">{user.full_name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 
                        user.role === 'teacher' ? 'bg-blue-100 text-blue-700' : 
                        'bg-green-100 text-green-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-apple-text-secondary capitalize">
                    {user.stage || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-apple-text-secondary">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
