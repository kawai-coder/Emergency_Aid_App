'use client';

import Link from 'next/link';
import { StageContent } from '@/lib/types/content';
import { SectionCard } from '@/components/SectionCard';

interface StageCardProps {
  content: StageContent;
  index?: number;
}

export function StageCard({ content, index = 0 }: StageCardProps) {
  const delay = index * 100;
  
  return (
    <div 
      className="animate-fade-in-up h-full"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <SectionCard className="flex h-full flex-col justify-between group">
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-apple-text-secondary transition-colors duration-200 group-hover:text-apple-blue">
              {content.stage.label}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-apple-text transition-transform duration-300 group-hover:translate-x-1">
              {content.stage.journeyLabel}
            </h3>
          </div>
          <p className="text-sm text-apple-text-secondary leading-relaxed">{content.stageSummary}</p>
          <ul className="space-y-2 text-sm text-apple-text">
            <li className="flex items-center gap-2 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-apple-blue transition-all duration-200 group-hover/item:scale-125 group-hover/item:shadow-[0_0_8px_rgba(0,113,227,0.6)]" />
              <span className="transition-colors duration-200 group-hover/item:text-apple-blue">Lesson: {content.lesson.title}</span>
            </li>
            <li className="flex items-center gap-2 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-apple-green transition-all duration-200 group-hover/item:scale-125 group-hover/item:shadow-[0_0_8px_rgba(52,199,89,0.6)]" />
              <span className="transition-colors duration-200 group-hover/item:text-apple-green">Quiz: {content.quiz.badgeLabel}</span>
            </li>
            <li className="flex items-center gap-2 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-apple-orange transition-all duration-200 group-hover/item:scale-125 group-hover/item:shadow-[0_0_8px_rgba(255,149,0,0.6)]" />
              <span className="transition-colors duration-200 group-hover/item:text-apple-orange">Scenario: {content.scenario.title}</span>
            </li>
          </ul>
        </div>
        <div className="mt-6 flex items-center justify-between text-sm">
          <span className="text-apple-text-secondary text-xs">Tone: {content.stage.tone}</span>
          <Link 
            href={`/stage/${content.stage.key}`} 
            className="rounded-full bg-apple-blue px-4 py-2 font-medium text-white 
                       transition-all duration-200 ease-apple
                       hover:bg-apple-blue-hover hover:-translate-y-0.5 hover:shadow-md
                       active:scale-[0.98] active:shadow-none active:brightness-[0.97]
                       whitespace-nowrap"
          >
            Enter stage
          </Link>
        </div>
      </SectionCard>
    </div>
  );
}
