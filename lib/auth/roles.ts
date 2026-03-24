import { isDemoMode } from '@/lib/supabase';
import { createServerSupabase } from '@/lib/supabase-server';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface UserWithProfile {
  id: string;
  email: string;
  profile: {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    stage: 'primary' | 'middle' | 'high' | null;
    avatar_url: string | null;
  };
}

// Get current user with profile
export async function getCurrentUser(): Promise<UserWithProfile | null> {
  if (isDemoMode) return null;
  
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  if (!profile) return null;
    
  return { ...user, profile } as UserWithProfile;
}

// Require authentication (throws if not logged in)
export async function requireAuth(): Promise<UserWithProfile> {
  if (isDemoMode) {
    throw new Error('Authentication not available in demo mode');
  }
  
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  return user;
}

// Require specific role
export async function requireRole(role: UserRole | UserRole[]): Promise<UserWithProfile> {
  const user = await requireAuth();
  const allowedRoles = Array.isArray(role) ? role : [role];
  
  if (!allowedRoles.includes(user.profile.role) && user.profile.role !== 'admin') {
    throw new Error('Forbidden: Insufficient permissions');
  }
  
  return user;
}

// Check if user is teacher of a specific class
export async function isTeacherOfClass(classId: string): Promise<boolean> {
  if (isDemoMode) return false;
  
  try {
    const user = await requireAuth();
    if (user.profile.role === 'admin') return true;
    if (user.profile.role !== 'teacher') return false;
    
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from('classes')
      .select('id')
      .eq('id', classId)
      .eq('teacher_id', user.id)
      .single();
      
    return !!data;
  } catch {
    return false;
  }
}

// Check if user can access stage content
export async function canAccessStage(stage: string): Promise<boolean> {
  if (isDemoMode) return true;
  
  try {
    const user = await requireAuth();
    
    // Admin and teacher can access all stages
    if (user.profile.role === 'admin' || user.profile.role === 'teacher') {
      return true;
    }
    
    // Students can only access their assigned stage
    return user.profile.stage === stage;
  } catch {
    return false;
  }
}
