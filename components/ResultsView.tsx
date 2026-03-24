'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { StageContent } from '@/lib/types/content';
import { listAttempts } from '@/lib/utils/storage';
import { SectionCard } from '@/components/SectionCard';

function getBand(content: StageContent, score: number) {
  return content.results.awarenessBands.find((band) => score >= band.min) ?? content.results.awarenessBands.at(-1)!;
}

function useCountUp(target: number, duration: number = 1000) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * target));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);
  
  return count;
}

export function ResultsView({ content }: { content: StageContent }) {
  const latest = listAttempts(content.stage.key).find((attempt) => attempt.learner === 'Demo learner') ?? listAttempts(content.stage.key)[0];
  const band = getBand(content, latest?.awarenessScore ?? 0);
  
  const readinessCount = useCountUp(latest?.readinessScore ?? 0, 1200);
  const quizScoreCount = useCountUp(latest?.quizScore ?? 0, 800);
  const quizTotal = latest?.quizTotal ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up" style={{ animationFillMode: 'both' }}>
        <SectionCard>
          <p className="text-sm uppercase tracking-[0.3em] text-apple-text-secondary">{content.stage.label} results</p>
          <h1 className="mt-2 text-4xl font-semibold text-apple-text">{content.results.headline}</h1>
          <p className="mt-3 max-w-3xl text-apple-text-secondary leading-relaxed">{content.results.encouragement}</p>
        </SectionCard>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          { label: 'Lesson completion', value: latest?.lessonCompleted ? 'Done' : 'Pending', color: latest?.lessonCompleted ? 'text-apple-green' : 'text-apple-text-secondary' },
          { label: 'Quiz score', value: quizTotal > 0 ? `${quizScoreCount}/${quizTotal}` : '—', color: 'text-apple-text' },
          { label: 'Scenario readiness', value: readinessCount, color: 'text-apple-text' },
        ].map((stat, index) => (
          <div 
            key={stat.label}
            className="animate-fade-in-up"
            style={{ animationDelay: `${100 + index * 100}ms`, animationFillMode: 'both' }}
          >
            <SectionCard className="group">
              <p className="text-sm text-apple-text-secondary transition-colors duration-200 group-hover:text-apple-text">{stat.label}</p>
              <div className={`mt-2 text-4xl font-semibold ${stat.color} transition-transform duration-300 group-hover:scale-105`}>
                {stat.value}
              </div>
            </SectionCard>
          </div>
        ))}
      </div>

      {/* Performance Band */}
      <div className="grid gap-6 lg:grid-cols-[1.25fr,0.75fr]">
        <div className="animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
          <SectionCard>
            <h2 className="text-2xl font-semibold text-apple-text">Performance band: {band.label}</h2>
            <p className="mt-3 text-apple-text-secondary leading-relaxed">{band.description}</p>
            <p className="mt-6 text-sm text-apple-text-secondary">{content.results.nextStep}</p>
          </SectionCard>
        </div>
        
        <div className="animate-fade-in-up" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
          <SectionCard>
            <h3 className="text-xl font-semibold text-apple-text">Next moves</h3>
            <div className="mt-4 flex flex-col gap-3">
              <Link 
                href={`/lesson/${content.lesson.slug}`} 
                className="rounded-full border border-apple-border px-4 py-3 text-center text-sm text-apple-text 
                           transition-all duration-200 ease-apple
                           hover:bg-apple-bg-secondary hover:-translate-y-0.5
                           active:scale-[0.98]"
              >
                Review lesson
              </Link>
              <Link 
                href={`/quiz/${content.quiz.slug}`} 
                className="rounded-full border border-apple-border px-4 py-3 text-center text-sm text-apple-text 
                           transition-all duration-200 ease-apple
                           hover:bg-apple-bg-secondary hover:-translate-y-0.5
                           active:scale-[0.98]"
              >
                Retry quiz
              </Link>
              <Link 
                href={`/teacher`} 
                className="rounded-full bg-apple-blue px-4 py-3 text-center text-sm font-medium text-white 
                           transition-all duration-200 ease-apple
                           hover:bg-apple-blue-hover hover:-translate-y-0.5 hover:shadow-md hover:shadow-apple-blue/30
                           active:scale-[0.98] active:shadow-none active:brightness-[0.97]"
              >
                See teacher dashboard
              </Link>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
