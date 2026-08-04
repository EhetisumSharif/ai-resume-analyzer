import React from 'react';

export interface ScoreCardProps {
  score: number;
  feedback: string[];
}

export default function ScoreCard({ score, feedback }: ScoreCardProps) {
  return (
    <div className="w-full bg-[#0b0f19] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl mt-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100">Resume Score</h3>
          <p className="text-xs text-slate-400">AI Evaluation & Feedback</p>
        </div>
        <div className="flex items-baseline space-x-1">
          <span className="text-3xl font-extrabold text-indigo-400">{score}</span>
          <span className="text-xs font-mono text-slate-500">/100</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-800 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Key AI Feedback</h4>
        <ul className="space-y-2">
          {feedback.map((item, index) => (
            <li key={index} className="flex items-start space-x-2 text-sm text-slate-300">
              <span className="text-indigo-400 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}