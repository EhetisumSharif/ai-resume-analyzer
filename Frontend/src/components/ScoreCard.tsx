import React from 'react';

export interface ScoreCardProps {
  score: number;
  feedback?: string[]; // অপশনাল করা হলো যাতে undefined হলেও ক্র্যাশ না করে
}

export default function ScoreCard({ score, feedback }: ScoreCardProps) {
  return (
    <div className="w-full bg-white border border-emerald-100 rounded-2xl p-6 space-y-6 shadow-sm mt-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-50 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Resume Score</h3>
          <p className="text-xs text-slate-500">AI Evaluation & Feedback</p>
        </div>
        <div className="flex items-baseline space-x-1">
          <span className="text-3xl font-extrabold text-emerald-600">{score}</span>
          <span className="text-xs font-mono text-slate-400">/100</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="w-full bg-slate-100 rounded-full h-3 border border-emerald-100 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 shadow-xs"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Feedback List (নিরাপদ চেইনিং সহ) */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800/80">Key AI Feedback</h4>
        <ul className="space-y-2">
          {(feedback || []).map((item, index) => (
            <li key={index} className="flex items-start space-x-2 text-sm text-slate-700 bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100/50 shadow-xs">
              <span className="text-emerald-600 font-bold mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}