import React from 'react';
import { CategoryScore } from '../types/resume';

interface CategoryFeedbackProps {
  categories?: CategoryScore[]; // নিরাপদ করার জন্য অপশনাল করা হলো
}

const getColor = (score: number) => {
  if (score >= 80) return "#059669"; // emerald-600
  if (score >= 50) return "#d97706"; // amber-600
  return "#dc2626"; // rose-600
};

export default function CategoryFeedback({ categories }: CategoryFeedbackProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
      {(categories || []).map((cat) => (
        <div
          key={cat.category}
          className="border border-emerald-100 rounded-xl p-4 bg-white/90 backdrop-blur-sm shadow-xs"
        >
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-slate-800 m-0">{cat.category}</h4>
            <span style={{ color: getColor(cat.score) }} className="text-xs font-bold font-mono">
              {cat.score}/100
            </span>
          </div>
          <div className="h-1.5 bg-slate-100 border border-emerald-100/50 rounded-full mt-2 overflow-hidden">
            <div
              style={{ width: `${cat.score}%`, background: getColor(cat.score) }}
              className="h-full rounded-full transition-all duration-500 shadow-xs"
            />
          </div>
          <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
            {cat.feedback}
          </p>
        </div>
      ))}
    </div>
  );
}