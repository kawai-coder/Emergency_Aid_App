'use client';

import { ReactNode } from 'react';

export default function Template({ children }: { children: ReactNode }) {
  return (
    <div className="animate-fade-in-up">
      {children}
    </div>
  );
}
