'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: { role: 'student' },
          },
        });

        if (error) throw error;
        setMessage('Check your email to confirm your account!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role, stage')
            .eq('id', user.id)
            .single();

          // Handle profile fetch error
          if (profileError) {
            console.error('Profile fetch error:', profileError);
            // Redirect to stage select to create/complete profile
            router.push('/stage/select');
            router.refresh();
            return;
          }

          // Redirect based on role and stage
          if (profile?.role === 'teacher' || profile?.role === 'admin') {
            router.push('/teacher');
          } else if (profile?.stage) {
            // User already has stage - go directly to their stage
            router.push(`/stage/${profile.stage}`);
          } else {
            // No stage assigned - let them select
            router.push('/stage/select');
          }
          router.refresh();
        }
      }
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-apple-bg-secondary flex items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-apple-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-apple-text">
              Campus First Aid
            </h1>
            <p className="text-apple-text-secondary">
              {isSignUp ? 'Create your account' : 'Sign in to continue'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-apple-text mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-apple-bg-secondary border-0 
                    focus:ring-2 focus:ring-apple-blue transition-all duration-200
                    text-apple-text placeholder:text-apple-text-secondary"
                  placeholder="name@school.edu"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-apple-text mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-apple-bg-secondary border-0 
                    focus:ring-2 focus:ring-apple-blue transition-all duration-200
                    text-apple-text placeholder:text-apple-text-secondary"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-apple-blue text-white font-medium py-3.5 rounded-full
                transition-all duration-200 ease-apple
                hover:bg-apple-blue-hover hover:-translate-y-0.5 hover:shadow-md hover:shadow-apple-blue/30
                active:scale-[0.98] active:shadow-none active:brightness-[0.97]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isSignUp ? 'Creating account...' : 'Signing in...'}
                </span>
              ) : (
                isSignUp ? 'Create Account' : 'Continue'
              )}
            </button>
          </form>

          {message && (
            <div className={`p-4 rounded-2xl text-sm animate-fade-in ${
              message.includes('error') || message.includes('Error') || message.includes('Invalid')
                ? 'bg-red-50 text-red-600'
                : 'bg-green-50 text-green-600'
            }`}>
              {message}
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-apple-blue hover:text-apple-blue-hover transition-colors duration-200"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"}
            </button>
          </div>

          <div className="pt-4 border-t border-apple-border/50 text-center text-xs text-apple-text-secondary space-y-1">
            <p>Teachers: Contact admin to upgrade your account</p>
            <Link href="/" className="text-apple-blue hover:text-apple-blue-hover transition-colors">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
