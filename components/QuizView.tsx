'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { StageContent } from '@/lib/types/content';
import { SectionCard } from '@/components/SectionCard';

export function QuizView({ content }: { content: StageContent }) {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [shakeQuestion, setShakeQuestion] = useState<string | null>(null);
  const total = content.quiz.questions.length;

  const score = useMemo(
    () =>
      content.quiz.questions.reduce((sum, question) => sum + Number(selected[question.id] === question.correctOptionId), 0),
    [content.quiz.questions, selected],
  );

  const awarenessScore = Math.round((score / total) * 100);

  async function submitQuiz() {
    // Check if all questions are answered
    const unanswered = content.quiz.questions.find(q => !selected[q.id]);
    if (unanswered) {
      setShakeQuestion(unanswered.id);
      setTimeout(() => setShakeQuestion(null), 500);
      return;
    }
    
    setSubmitted(true);
    await fetch('/api/quiz-attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stage: content.stage.key,
        learner: 'Demo learner',
        quizScore: score,
        quizTotal: total,
        awarenessScore,
      }),
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up" style={{ animationFillMode: 'both' }}>
        <SectionCard>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-apple-text-secondary">{content.stage.label} quiz</p>
              <h1 className="mt-2 text-4xl font-semibold text-apple-text">{content.quiz.title}</h1>
              <p className="mt-3 max-w-3xl text-apple-text-secondary">{content.quiz.description}</p>
            </div>
            <div className="rounded-full border border-amber-400 bg-amber-50 px-4 py-2 text-sm text-amber-700">
              Badge: {content.quiz.badgeLabel}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {content.quiz.questions.map((question, index) => {
          const selectedOption = selected[question.id];
          const answeredCorrectly = selectedOption === question.correctOptionId;
          const isShaking = shakeQuestion === question.id;
          
          return (
            <div 
              key={question.id}
              className={`animate-fade-in-up ${isShaking ? 'animate-shake' : ''}`}
              style={{ animationDelay: `${100 + index * 100}ms`, animationFillMode: 'both' }}
            >
              <SectionCard>
                <p className="text-xs uppercase tracking-[0.28em] text-apple-text-secondary">
                  Question {index + 1} · {question.competency}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-apple-text">{question.prompt}</h2>
                <div className="mt-4 grid gap-3">
                  {question.options.map((option) => {
                    const isSelected = selectedOption === option.id;
                    const isCorrect = option.id === question.correctOptionId;
                    const showResult = submitted;
                    
                    return (
                      <button
                        key={option.id}
                        onClick={() => !submitted && setSelected((current) => ({ ...current, [question.id]: option.id }))}
                        disabled={submitted}
                        className={`relative rounded-2xl border px-4 py-3 text-left text-sm 
                                   transition-all duration-200 ease-apple
                                   ${showResult 
                                     ? isCorrect
                                       ? 'border-apple-green bg-green-50 text-apple-text shadow-[0_0_0_3px_rgba(52,199,89,0.2)]'
                                       : isSelected
                                         ? 'border-apple-red bg-red-50 text-apple-text'
                                         : 'border-apple-border/50 bg-white text-apple-text-secondary'
                                     : isSelected
                                       ? 'border-apple-blue bg-blue-50 text-apple-text shadow-[0_0_0_3px_rgba(0,113,227,0.2)] -translate-y-0.5'
                                       : 'border-apple-border/50 bg-white text-apple-text hover:border-apple-blue/50 hover:-translate-y-0.5 hover:shadow-sm'
                                   }
                                   disabled:cursor-not-allowed`}
                      >
                        <span className="flex items-center gap-2">
                          {showResult && isCorrect && <span className="text-apple-green">✓</span>}
                          {showResult && isSelected && !isCorrect && <span className="text-apple-red">✗</span>}
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {submitted ? (
                  <div className={`mt-4 rounded-2xl px-4 py-3 text-sm animate-fade-in ${answeredCorrectly ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {answeredCorrectly ? '✓ ' : '✗ '}{question.explanation}
                  </div>
                ) : null}
              </SectionCard>
            </div>
          );
        })}
      </div>

      {/* Submit Section */}
      <div className="animate-fade-in-up" style={{ animationDelay: `${100 + content.quiz.questions.length * 100}ms`, animationFillMode: 'both' }}>
        <SectionCard>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-apple-text-secondary">Score preview: {score}/{total}</p>
              <p className="text-sm text-apple-text-secondary">Awareness score: {awarenessScore}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={submitQuiz}
                disabled={submitted}
                className={`rounded-full px-5 py-3 font-medium text-white 
                           transition-all duration-200 ease-apple
                           hover:-translate-y-0.5 hover:shadow-md
                           active:scale-[0.98] active:shadow-none active:brightness-[0.97]
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                           ${submitted 
                             ? 'bg-apple-green' 
                             : 'bg-apple-blue hover:bg-apple-blue-hover hover:shadow-apple-blue/30'
                           }`}
              >
                {submitted ? 'Quiz submitted ✓' : 'Submit quiz'}
              </button>
              <Link 
                href={`/scenario/${content.scenario.slug}`} 
                className="rounded-full border border-apple-border px-5 py-3 text-sm text-apple-text 
                           transition-all duration-200 ease-apple
                           hover:bg-apple-bg-secondary hover:-translate-y-0.5 hover:shadow-md
                           active:scale-[0.98] active:shadow-none"
              >
                Continue to scenario →
              </Link>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
