'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const stages = [
  {
    key: 'primary',
    label: 'Primary School',
    description: 'Grades 1-6 • Ages 6-12',
    icon: '🎒',
    color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    selectedColor: 'bg-apple-blue text-white border-apple-blue',
  },
  {
    key: 'middle',
    label: 'Middle School',
    description: 'Grades 7-9 • Ages 12-15',
    icon: '📚',
    color: 'bg-green-50 hover:bg-green-100 border-green-200',
    selectedColor: 'bg-apple-green text-white border-apple-green',
  },
  {
    key: 'high',
    label: 'High School',
    description: 'Grades 10-12 • Ages 15-18',
    icon: '🎓',
    color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
    selectedColor: 'bg-purple-500 text-white border-purple-500',
  },
];

export function StageSelector({ userId }: { userId: string }) {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleContinue = async () => {
    if (!selectedStage) return;
    
    setLoading(true);
    setError(null);

    try {
      // Use API route instead of direct Supabase call
      const response = await fetch('/api/profile/stage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: selectedStage }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update stage');
      }

      // Success - redirect
      router.push(`/stage/${selectedStage}`);
      router.refresh();
    } catch (err: any) {
      console.error('Error:', err);
      setError(err?.message || 'Failed to update stage. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {stages.map((stage, index) => (
          <button
            key={stage.key}
            onClick={() => setSelectedStage(stage.key)}
            className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 ease-apple
              ${selectedStage === stage.key 
                ? stage.selectedColor 
                : `${stage.color} border-transparent hover:shadow-md hover:-translate-y-0.5`
              }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{stage.icon}</span>
              <div className="flex-1">
                <h3 className={`text-xl font-semibold ${
                  selectedStage === stage.key ? 'text-white' : 'text-apple-text'
                }`}>
                  {stage.label}
                </h3>
                <p className={`text-sm ${
                  selectedStage === stage.key ? 'text-white/80' : 'text-apple-text-secondary'
                }`}>
                  {stage.description}
                </p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                ${selectedStage === stage.key 
                  ? 'bg-white border-white' 
                  : 'border-apple-border'
                }`}>
                {selectedStage === stage.key && (
                  <svg className="w-4 h-4 text-apple-blue" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm animate-fade-in">
          <p className="font-medium">Error: {error}</p>
          <p className="mt-1 text-red-500 text-xs">
            If this persists, try refreshing the page or contact support.
          </p>
        </div>
      )}

      <button
        onClick={handleContinue}
        disabled={!selectedStage || loading}
        className="w-full bg-apple-blue text-white font-medium py-4 rounded-full text-lg
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
            Setting up...
          </span>
        ) : (
          'Continue'
        )}
      </button>
    </div>
  );
}
