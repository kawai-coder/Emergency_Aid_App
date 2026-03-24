'use client';

import { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-apple-bg-secondary flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-apple-lg p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-apple-text">
                Campus First Aid
              </h1>
              <p className="text-apple-text-secondary mt-2">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
