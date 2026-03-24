'use client';

import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { AttemptRecord } from '@/lib/types/content';
import { StageSummary } from '@/lib/utils/analytics';
import { SectionCard } from '@/components/SectionCard';

function useCountUp(target: number, duration: number = 1000) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
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

export function TeacherDashboardClient({
  attempts,
  summaries,
  metrics,
  accuracy,
}: {
  attempts: AttemptRecord[];
  summaries: StageSummary[];
  metrics: { totalAttempts: number; totalCompleted: number; averageReadiness: number };
  accuracy: Array<{ skill: string; primary: number; middle: number; high: number }>;
}) {
  const attemptsCount = useCountUp(metrics.totalAttempts, 1000);
  const completedCount = useCountUp(metrics.totalCompleted, 1000);
  const readinessCount = useCountUp(metrics.averageReadiness, 1200);

  const completionOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: summaries.map((entry) => entry.stageLabel), axisLabel: { color: '#86868B' } },
    yAxis: { type: 'value', max: 100, axisLabel: { color: '#86868B' } },
    series: [{ 
      type: 'bar', 
      data: summaries.map((entry) => entry.completionRate), 
      itemStyle: { color: '#0071E3' },
      animationDuration: 1000,
      animationEasing: 'cubicOut',
    }],
    backgroundColor: 'transparent',
  };

  const scoreOption = {
    tooltip: { trigger: 'axis' },
    legend: { textStyle: { color: '#86868B' } },
    xAxis: { type: 'category', data: summaries.map((entry) => entry.stageLabel), axisLabel: { color: '#86868B' } },
    yAxis: { type: 'value', max: 100, axisLabel: { color: '#86868B' } },
    series: [
      { 
        name: 'Quiz %', 
        type: 'line', 
        data: summaries.map((entry) => entry.averageQuizPercent), 
        smooth: true, 
        lineStyle: { color: '#34C759' },
        itemStyle: { color: '#34C759' },
        animationDuration: 1000,
        animationEasing: 'cubicOut',
      },
      { 
        name: 'Scenario success %', 
        type: 'line', 
        data: summaries.map((entry) => entry.scenarioSuccessRate), 
        smooth: true, 
        lineStyle: { color: '#FF9500' },
        itemStyle: { color: '#FF9500' },
        animationDuration: 1000,
        animationEasing: 'cubicOut',
      },
    ],
    backgroundColor: 'transparent',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up" style={{ animationFillMode: 'both' }}>
        <SectionCard>
          <p className="text-sm uppercase tracking-[0.3em] text-apple-text-secondary">Teacher analytics</p>
          <h1 className="mt-2 text-4xl font-semibold text-apple-text">Stage-aware feedback dashboard</h1>
          <p className="mt-3 max-w-3xl text-apple-text-secondary leading-relaxed">
            Compare completion, quiz performance, scenario success, and readiness signals across primary, middle, and high school loops.
          </p>
        </SectionCard>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: 'Total attempts', value: attemptsCount },
          { label: 'Completions', value: completedCount },
          { label: 'Average readiness', value: readinessCount },
        ].map((stat, index) => (
          <div 
            key={stat.label}
            className="animate-fade-in-up"
            style={{ animationDelay: `${100 + index * 100}ms`, animationFillMode: 'both' }}
          >
            <SectionCard className="group">
              <p className="text-sm text-apple-text-secondary transition-colors duration-200 group-hover:text-apple-text">{stat.label}</p>
              <div className="mt-2 text-4xl font-semibold text-apple-text transition-transform duration-300 group-hover:scale-105">
                {stat.value}
              </div>
            </SectionCard>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
          <SectionCard>
            <h2 className="text-2xl font-semibold text-apple-text">Completion by stage</h2>
            <ReactECharts option={completionOption} style={{ height: 320 }} />
          </SectionCard>
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
          <SectionCard>
            <h2 className="text-2xl font-semibold text-apple-text">Score and scenario comparison</h2>
            <ReactECharts option={scoreOption} style={{ height: 320 }} />
          </SectionCard>
        </div>
      </div>

      {/* Tables */}
      <div className="animate-fade-in-up" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
        <SectionCard>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-apple-text">Stage summaries</h2>
            <p className="text-sm text-apple-text-secondary">Awareness = quiz confidence proxy · Readiness = scenario response quality</p>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-apple-text">
              <thead className="text-apple-text-secondary">
                <tr>
                  <th className="px-3 py-2 font-medium">Stage</th>
                  <th className="px-3 py-2 font-medium">Attempts</th>
                  <th className="px-3 py-2 font-medium">Completion rate</th>
                  <th className="px-3 py-2 font-medium">Avg quiz %</th>
                  <th className="px-3 py-2 font-medium">Scenario success</th>
                  <th className="px-3 py-2 font-medium">Awareness</th>
                  <th className="px-3 py-2 font-medium">Readiness</th>
                </tr>
              </thead>
              <tbody>
                {summaries.map((summary, index) => (
                  <tr 
                    key={summary.stage} 
                    className="border-t border-apple-border/50 transition-colors duration-200 hover:bg-apple-bg-secondary/50"
                    style={{ animationDelay: `${700 + index * 50}ms` }}
                  >
                    <td className="px-3 py-3 font-medium text-apple-text">{summary.stageLabel}</td>
                    <td className="px-3 py-3">{summary.attempts}</td>
                    <td className="px-3 py-3">{summary.completionRate}%</td>
                    <td className="px-3 py-3">{summary.averageQuizPercent}%</td>
                    <td className="px-3 py-3">{summary.scenarioSuccessRate}%</td>
                    <td className="px-3 py-3">{summary.averageAwareness}</td>
                    <td className="px-3 py-3">{summary.averageReadiness}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      {/* Detail Tables */}
      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <div className="animate-fade-in-up" style={{ animationDelay: '700ms', animationFillMode: 'both' }}>
          <SectionCard>
            <h2 className="text-2xl font-semibold text-apple-text">Question accuracy by stage</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm text-apple-text">
                <thead className="text-apple-text-secondary">
                  <tr>
                    <th className="px-3 py-2 font-medium">Skill</th>
                    <th className="px-3 py-2 font-medium">Primary</th>
                    <th className="px-3 py-2 font-medium">Middle</th>
                    <th className="px-3 py-2 font-medium">High</th>
                  </tr>
                </thead>
                <tbody>
                  {accuracy.map((row) => (
                    <tr key={row.skill} className="border-t border-apple-border/50 transition-colors duration-200 hover:bg-apple-bg-secondary/50">
                      <td className="px-3 py-3 font-medium text-apple-text">{row.skill}</td>
                      <td className="px-3 py-3">{row.primary}%</td>
                      <td className="px-3 py-3">{row.middle}%</td>
                      <td className="px-3 py-3">{row.high}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>
        
        <div className="animate-fade-in-up" style={{ animationDelay: '800ms', animationFillMode: 'both' }}>
          <SectionCard>
            <h2 className="text-2xl font-semibold text-apple-text">Attempts table</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm text-apple-text">
                <thead className="text-apple-text-secondary">
                  <tr>
                    <th className="px-3 py-2 font-medium">Learner</th>
                    <th className="px-3 py-2 font-medium">Stage</th>
                    <th className="px-3 py-2 font-medium">Quiz</th>
                    <th className="px-3 py-2 font-medium">Scenario</th>
                    <th className="px-3 py-2 font-medium">Readiness</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt, index) => (
                    <tr 
                      key={attempt.id} 
                      className="border-t border-apple-border/50 transition-colors duration-200 hover:bg-apple-bg-secondary/50"
                      style={{ animationDelay: `${900 + index * 50}ms` }}
                    >
                      <td className="px-3 py-3 font-medium text-apple-text">{attempt.learner}</td>
                      <td className="px-3 py-3 capitalize">{attempt.stage}</td>
                      <td className="px-3 py-3">{attempt.quizScore}/{attempt.quizTotal}</td>
                      <td className="px-3 py-3">{attempt.scenarioSuccess ? 'Success' : 'Needs support'}</td>
                      <td className="px-3 py-3">{attempt.readinessScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
