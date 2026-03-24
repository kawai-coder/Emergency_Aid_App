'use client';

import Link from 'next/link';
import { useState } from 'react';
import { StageContent } from '@/lib/types/content';
import { SectionCard } from '@/components/SectionCard';

export function LessonView({ content }: { content: StageContent }) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  async function markComplete() {
    setStatus('saving');
    await fetch('/api/lesson-complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: content.stage.key, learner: 'Demo learner' }),
    });
    setStatus('saved');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up" style={{ animationFillMode: 'both' }}>
        <SectionCard>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-apple-text-secondary">{content.stage.label} lesson</p>
              <h1 className="mt-2 text-4xl font-semibold text-apple-text">{content.lesson.title}</h1>
              <p className="mt-3 max-w-3xl text-apple-text-secondary">{content.lesson.description}</p>
            </div>
            <div className="rounded-2xl bg-apple-bg-secondary px-4 py-3 text-sm text-apple-text">
              <div>{content.lesson.estimatedMinutes} min</div>
              <div>{content.lesson.objectives.length} objectives</div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr,0.8fr]">
        {/* Lesson Sections */}
        <div className="space-y-4">
          {content.lesson.sections.map((section, index) => (
            <div 
              key={section.title}
              className="animate-fade-in-up"
              style={{ animationDelay: `${100 + index * 100}ms`, animationFillMode: 'both' }}
            >
              <SectionCard>
                <p className="text-xs uppercase tracking-[0.28em] text-apple-text-secondary">Section {index + 1}</p>
                <h2 className="mt-2 text-2xl font-semibold text-apple-text">{section.title}</h2>
                <p className="mt-3 text-apple-text-secondary leading-relaxed">{section.body}</p>
                {section.bullets ? (
                  <ul className="mt-4 space-y-2 text-sm text-apple-text">
                    {section.bullets.map((bullet, bulletIndex) => (
                      <li 
                        key={bullet} 
                        className="flex items-start gap-2 transition-all duration-200 hover:translate-x-1"
                        style={{ animationDelay: `${200 + bulletIndex * 50}ms` }}
                      >
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-apple-blue" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </SectionCard>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
            <SectionCard>
              <h3 className="text-xl font-semibold text-apple-text">Learning objectives</h3>
              <ul className="mt-4 space-y-3 text-sm text-apple-text">
                {content.lesson.objectives.map((objective, index) => (
                  <li 
                    key={objective} 
                    className="flex items-start gap-2 transition-all duration-200 hover:translate-x-1"
                    style={{ animationDelay: `${300 + index * 50}ms` }}
                  >
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-apple-green" />
                    {objective}
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
            <SectionCard>
              <h3 className="text-xl font-semibold text-apple-text">Key takeaway</h3>
              <p className="mt-3 text-apple-text-secondary leading-relaxed">{content.lesson.takeaway}</p>
            </SectionCard>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
            <SectionCard>
              <button
                onClick={markComplete}
                disabled={status === 'saved' || status === 'saving'}
                className={`w-full rounded-full px-4 py-3 font-medium text-white 
                           transition-all duration-200 ease-apple
                           hover:-translate-y-0.5 hover:shadow-md
                           active:scale-[0.98] active:shadow-none active:brightness-[0.97]
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                           ${status === 'saved' 
                             ? 'bg-apple-green hover:bg-apple-green animate-scale-bounce' 
                             : 'bg-apple-green hover:bg-apple-green-hover hover:shadow-apple-green/30'
                           }`}
              >
                {status === 'saved' ? '✓ Lesson marked complete' : status === 'saving' ? 'Saving...' : 'Mark lesson complete'}
              </button>
              <Link
                href={`/quiz/${content.quiz.slug}`}
                className="mt-3 flex w-full items-center justify-center rounded-full border border-apple-blue px-4 py-3 text-sm font-medium text-apple-blue 
                           transition-all duration-200 ease-apple
                           hover:bg-apple-blue hover:text-white hover:-translate-y-0.5 hover:shadow-md
                           active:scale-[0.98] active:shadow-none"
              >
                Continue to quiz →
              </Link>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
