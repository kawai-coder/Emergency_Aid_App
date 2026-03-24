import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SectionCard } from '@/components/SectionCard';
import { getStageContent, isStageKey } from '@/lib/content/stages';

export default async function StagePage({ params }: { params: Promise<{ stage: string }> }) {
  const { stage } = await params;
  if (!isStageKey(stage)) {
    notFound();
  }

  const content = getStageContent(stage);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="animate-fade-in-up" style={{ animationFillMode: 'both' }}>
        <SectionCard>
          <p className="text-sm uppercase tracking-[0.32em] text-apple-text-secondary">{content.stage.label}</p>
          <h1 className="mt-2 text-4xl font-semibold text-apple-text">{content.stage.journeyLabel}</h1>
          <p className="mt-3 max-w-3xl text-apple-text-secondary leading-relaxed">{content.stageSummary}</p>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
        {/* Stage Loop */}
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
          <SectionCard>
            <h2 className="text-2xl font-semibold text-apple-text">Stage loop</h2>
            <div className="mt-4 grid gap-3 text-sm">
              {[
                { step: '1', title: 'Learn', desc: content.lesson.title },
                { step: '2', title: 'Quiz', desc: content.quiz.description },
                { step: '3', title: 'Scenario', desc: content.scenario.description },
                { step: '4', title: 'Feedback', desc: content.results.nextStep },
              ].map((item, index) => (
                <div 
                  key={item.step}
                  className="rounded-2xl border border-apple-border/50 bg-white px-4 py-4
                             transition-all duration-200 ease-apple
                             hover:border-apple-blue/50 hover:shadow-apple-sm hover:-translate-y-0.5"
                  style={{ animationDelay: `${200 + index * 50}ms` }}
                >
                  <strong className="text-apple-text">{item.step}. {item.title}</strong>
                  <p className="mt-1 text-apple-text-secondary">{item.desc}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Stage Profile */}
        <div className="animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <SectionCard>
            <h2 className="text-2xl font-semibold text-apple-text">Stage profile</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="group">
                <dt className="text-apple-text-secondary transition-colors duration-200 group-hover:text-apple-text">Audience</dt>
                <dd className="text-apple-text">{content.stage.audience}</dd>
              </div>
              <div className="group">
                <dt className="text-apple-text-secondary transition-colors duration-200 group-hover:text-apple-text">Tone</dt>
                <dd className="text-apple-text">{content.stage.tone}</dd>
              </div>
              <div className="group">
                <dt className="text-apple-text-secondary transition-colors duration-200 group-hover:text-apple-text">Objectives</dt>
                <dd className="text-apple-text">{content.lesson.objectives.length} objectives in this loop</dd>
              </div>
            </dl>
            <Link 
              href={`/lesson/${content.lesson.slug}`} 
              className="mt-6 flex w-full items-center justify-center rounded-full bg-apple-blue px-4 py-3 font-medium text-white 
                         transition-all duration-200 ease-apple
                         hover:bg-apple-blue-hover hover:-translate-y-0.5 hover:shadow-md hover:shadow-apple-blue/30
                         active:scale-[0.98] active:shadow-none active:brightness-[0.97]"
            >
              Start {content.stage.shortLabel} lesson
            </Link>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
