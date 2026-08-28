import React from 'react';

export interface ScoreCardProps {
  score: number;
  feedback?: string[];
}

export default function ScoreCard({ score, feedback }: ScoreCardProps) {
  return (
    <div className="w-full bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden mt-4 group">

      {/* Decorative Glow Background */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider">Resume Score Matrix</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Comprehensive AI Evaluation & Diagnostics</p>
        </div>
        <div className="flex items-baseline space-x-1 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 shadow-inner">
          <span className="text-3xl font-black text-emerald-400 tracking-tighter">{score}</span>
          <span className="text-xs font-mono text-slate-500">/100</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="w-full bg-slate-950 rounded-full h-3.5 border border-slate-800 overflow-hidden p-0.5 shadow-inner">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700 shadow-lg shadow-emerald-500/30"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-teal-300">💡 Key AI Diagnostics Feedback</h4>
        <ul className="space-y-2.5">
          {(feedback || []).map((item, index) => (
            <li key={index} className="flex items-start space-x-3 text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 shadow-inner leading-relaxed">
              <span className="text-emerald-400 font-black text-sm leading-none">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}