'use client';

import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { createActor } from 'xstate';
import { StageContent } from '@/lib/types/content';
import { createScenarioMachine } from '@/lib/state/scenarioMachine';
import { SectionCard } from '@/components/SectionCard';

export function ScenarioView({ content }: { content: StageContent }) {
  const machine = useMemo(() => createScenarioMachine(content.scenario), [content.scenario]);
  const [actor] = useState(() => createActor(machine).start());
  const [snapshot, setSnapshot] = useState(actor.getSnapshot());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const nodeMap = useMemo(() => Object.fromEntries(content.scenario.nodes.map((node) => [node.id, node])), [content.scenario.nodes]);
  const currentNode = nodeMap[snapshot.context.currentNodeId];

  const persistResult = async () => {
    if (!currentNode.terminal || !currentNode.outcome) {
      return;
    }

    await fetch('/api/scenario-attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stage: content.stage.key,
        learner: 'Demo learner',
        scenarioSuccess: currentNode.outcome.success,
        readinessScore: Math.max(0, Math.min(100, snapshot.context.readinessScore + currentNode.outcome.readinessDelta)),
      }),
    });
  };

  const handleChoice = (choiceId: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      actor.send({ type: 'CHOOSE', choiceId });
      setSnapshot(actor.getSnapshot());
      setIsTransitioning(false);
    }, 300);
  };

  const handleReset = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      actor.send({ type: 'RESET' });
      setSnapshot(actor.getSnapshot());
      setIsTransitioning(false);
    }, 300);
  };

  useEffect(() => {
    const subscription = actor.subscribe((newSnapshot) => {
      setSnapshot(newSnapshot);
    });
    return () => subscription.unsubscribe();
  }, [actor]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up" style={{ animationFillMode: 'both' }}>
        <SectionCard>
          <p className="text-sm uppercase tracking-[0.3em] text-apple-text-secondary">{content.stage.label} scenario</p>
          <h1 className="mt-2 text-4xl font-semibold text-apple-text">{content.scenario.title}</h1>
          <p className="mt-3 max-w-3xl text-apple-text-secondary">{content.scenario.description}</p>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr,0.75fr]">
        {/* Main Scenario Card */}
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
          <SectionCard>
            <div className={`transition-all duration-300 ease-apple ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
              <p className="text-xs uppercase tracking-[0.28em] text-apple-text-secondary">Current situation</p>
              <h2 className="mt-2 text-2xl font-semibold text-apple-text">{currentNode.title}</h2>
              <p className="mt-3 text-apple-text-secondary leading-relaxed">{currentNode.narrative}</p>

              {currentNode.terminal && currentNode.outcome ? (
                <div className={`mt-6 rounded-3xl border px-5 py-5 animate-scale-in ${currentNode.outcome.success ? 'border-apple-green/30 bg-green-50' : 'border-apple-orange/30 bg-orange-50'}`}>
                  <h3 className="text-xl font-semibold text-apple-text">{currentNode.outcome.heading}</h3>
                  <p className="mt-2 text-sm text-apple-text-secondary">{currentNode.outcome.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={persistResult}
                      className="rounded-full bg-apple-blue px-4 py-2 text-sm font-medium text-white 
                                 transition-all duration-200 ease-apple
                                 hover:bg-apple-blue-hover hover:-translate-y-0.5 hover:shadow-md
                                 active:scale-[0.98] active:shadow-none active:brightness-[0.97]"
                    >
                      Save scenario result
                    </button>
                    <Link 
                      href={`/results/${content.stage.key}`} 
                      className="rounded-full border border-apple-border px-4 py-2 text-sm text-apple-text 
                                 transition-all duration-200 ease-apple
                                 hover:bg-apple-bg-secondary hover:-translate-y-0.5
                                 active:scale-[0.98]"
                    >
                      View result page
                    </Link>
                    <button
                      onClick={handleReset}
                      className="rounded-full border border-apple-border px-4 py-2 text-sm text-apple-text 
                                 transition-all duration-200 ease-apple
                                 hover:bg-apple-bg-secondary hover:-translate-y-0.5
                                 active:scale-[0.98]"
                    >
                      Replay scenario
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-6 grid gap-3">
                  {currentNode.choices?.map((choice, index) => (
                    <button
                      key={choice.id}
                      onClick={() => handleChoice(choice.id)}
                      disabled={isTransitioning}
                      className="rounded-2xl border border-apple-border/50 bg-white px-4 py-4 text-left 
                                 transition-all duration-200 ease-apple
                                 hover:border-apple-blue hover:bg-blue-50 hover:-translate-y-0.5 hover:shadow-sm
                                 active:scale-[0.99] active:duration-100
                                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                                 animate-fade-in-up"
                      style={{ animationDelay: `${200 + index * 100}ms` }}
                    >
                      <div className="font-medium text-apple-text">{choice.label}</div>
                      <div className="mt-1 text-sm text-apple-text-secondary">{choice.rationale}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        {/* Sidebar */}
        <div className="animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <SectionCard>
            <h3 className="text-xl font-semibold text-apple-text">Simulation pulse</h3>
            <div className="mt-4 space-y-3 text-sm text-apple-text">
              <div className="flex justify-between gap-4 group">
                <span className="text-apple-text-secondary transition-colors duration-200 group-hover:text-apple-text">Current node</span>
                <span className="font-mono">{snapshot.context.currentNodeId}</span>
              </div>
              <div className="flex justify-between gap-4 group">
                <span className="text-apple-text-secondary transition-colors duration-200 group-hover:text-apple-text">Readiness</span>
                <span className={`font-mono transition-all duration-300 ${isTransitioning ? 'scale-110 text-apple-blue' : ''}`}>
                  {snapshot.context.readinessScore}
                </span>
              </div>
              <div>
                <span className="text-apple-text-secondary">Decision path</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {snapshot.context.path.map((entry, index) => (
                    <span 
                      key={`${entry}-${index}`} 
                      className="rounded-full bg-apple-bg-secondary px-3 py-1 text-xs text-apple-text
                                 transition-all duration-200 hover:bg-apple-blue hover:text-white hover:-translate-y-0.5"
                    >
                      {entry}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
