import Link from 'next/link';
import { StageCard } from '@/components/StageCard';
import { SectionCard } from '@/components/SectionCard';
import { allStages } from '@/lib/content/stages';
import { supabaseMode } from '@/lib/supabase';

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="animate-fade-in-up" style={{ animationFillMode: 'both' }}>
        <SectionCard className="overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
          <div className="grid gap-8 lg:grid-cols-[1.35fr,0.65fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-apple-text-secondary animate-fade-in" style={{ animationDelay: '100ms' }}>
                Competition demo · shared platform
              </p>
              <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-tight text-apple-text tracking-tight animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                One first-aid learning platform, three stage-specific closed loops.
              </h1>
              <p className="mt-4 max-w-3xl text-lg text-apple-text-secondary animate-fade-in" style={{ animationDelay: '300ms' }}>
                Explore a shared app shell that adapts lesson content, quiz logic, scenario depth, and feedback tone for primary, middle, and high school learners.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
                <Link 
                  href="/stage/primary" 
                  className="rounded-full bg-apple-blue px-5 py-3 font-medium text-white 
                             transition-all duration-200 ease-apple
                             hover:bg-apple-blue-hover hover:-translate-y-0.5 hover:shadow-md hover:shadow-apple-blue/30
                             active:scale-[0.98] active:shadow-none active:brightness-[0.97]"
                >
                  Start learner loop
                </Link>
                <Link 
                  href="/teacher" 
                  className="rounded-full border border-apple-border px-5 py-3 text-apple-text 
                             transition-all duration-200 ease-apple
                             hover:bg-apple-bg-secondary hover:-translate-y-0.5 hover:shadow-md
                             active:scale-[0.98] active:shadow-none"
                >
                  Open teacher dashboard
                </Link>
              </div>
            </div>
            <SectionCard className="bg-apple-bg-secondary animate-scale-in" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
              <h2 className="text-xl font-semibold text-apple-text">What this demo proves</h2>
              <ul className="mt-4 space-y-3 text-sm text-apple-text">
                <li className="flex items-center gap-2 transition-transform duration-200 hover:translate-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-apple-blue" />
                  Shared app shell and design system
                </li>
                <li className="flex items-center gap-2 transition-transform duration-200 hover:translate-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-apple-green" />
                  Stage-specific lesson, quiz, scenario, and result content
                </li>
                <li className="flex items-center gap-2 transition-transform duration-200 hover:translate-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-apple-orange" />
                  Lightweight Next.js backend with optional Supabase connection
                </li>
                <li className="flex items-center gap-2 transition-transform duration-200 hover:translate-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  Stage-comparison analytics for teachers
                </li>
              </ul>
              <p className="mt-5 text-xs uppercase tracking-[0.28em] text-apple-text-secondary">Persistence mode: {supabaseMode}</p>
            </SectionCard>
          </div>
        </SectionCard>
      </div>

      {/* Stage Cards Grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {allStages.map((content, index) => (
          <StageCard key={content.stage.key} content={content} index={index} />
        ))}
      </div>
    </div>
  );
}
