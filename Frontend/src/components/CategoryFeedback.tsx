import React from 'react';
import { CategoryScore } from '../types/resume';

interface CategoryFeedbackProps {
  categories?: CategoryScore[];
}

const getColor = (score: number) => {
  if (score >= 80) return "#34d399"; // bright emerald-400 for dark mode
  if (score >= 50) return "#fbbf24"; // bright amber-400 for dark mode
  return "#f87171"; // bright rose-400 for dark mode
};

export default function CategoryFeedback({ categories }: CategoryFeedbackProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
      {(categories || []).map((cat) => (
        <div
          key={cat.category}
          className="border border-slate-800 rounded-2xl p-4 bg-slate-950/70 backdrop-blur-xl shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all"
        >
          {/* Subtle Glow Effect */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>

          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black text-white m-0 tracking-wide">{cat.category}</h4>
            <span style={{ color: getColor(cat.score) }} className="text-xs font-black font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 shadow-inner">
              {cat.score}/100
            </span>
          </div>

          <div className="h-2 bg-slate-900 border border-slate-800 rounded-full mt-3 overflow-hidden p-0.5 shadow-inner">
            <div
              style={{ width: `${cat.score}%`, background: getColor(cat.score) }}
              className="h-full rounded-full transition-all duration-700 shadow-md"
            />
          </div>

          <p className="mt-3 text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 shadow-inner">
            {cat.feedback || "Detailed category metric analyzed successfully."}
          </p>
        </div>
      ))}
    </div>
  );
}