import React from 'react';

interface MissingSkillComparison {
  skill: string;
  status: 'Resolved' | 'Still Missing' | 'Partially Addressed';
}

interface SideBySideReviewProps {
  originalResumeSummary?: string;
  updatedResumeSummary?: string;
  missingSkillsComparison?: MissingSkillComparison[];
  resolutionPercentage?: number;
}

export default function SideBySideReview({
  originalResumeSummary,
  updatedResumeSummary,
  missingSkillsComparison = [],
  resolutionPercentage = 0,
}: SideBySideReviewProps) {
  return (
    <div className="space-y-6">

      {/* Side-by-Side Comparison: Old vs Updated Resume Analysis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Left: Previous Analysis (Missing Skills Found) */}
        <div className="bg-slate-950/70 backdrop-blur-xl p-5 rounded-3xl border border-slate-800 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <span className="text-[10px] font-black text-rose-400 tracking-widest uppercase font-mono block mb-2.5 flex items-center space-x-1.5">
              <span>⚠️ Previous Analysis (Missing Skills)</span>
            </span>
            <div className="max-h-52 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3.5 rounded-2xl border border-slate-800/80 shadow-inner whitespace-pre-wrap">
                {originalResumeSummary || "No previous analysis data recorded yet."}
              </p>
            </div>
          </div>
        </div>

        {/* Right: New Analysis (Updated Resume Feedback) */}
        <div className="bg-slate-950/70 backdrop-blur-xl p-5 rounded-3xl border border-slate-800 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <span className="text-[10px] font-black text-emerald-400 tracking-widest uppercase font-mono block mb-2.5 flex items-center space-x-1.5">
              <span>✨ Updated Resume Diagnostics (Resolved)</span>
            </span>
            <div className="max-h-52 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3.5 rounded-2xl border border-slate-800/80 shadow-inner whitespace-pre-wrap">
                {updatedResumeSummary || "Waiting for latest evaluation results..."}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Missing Skills Resolution Status Table */}
      <div className="bg-slate-950/70 backdrop-blur-xl p-5 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <span className="text-[10px] font-black text-indigo-400 tracking-widest uppercase font-mono block mb-4">
          🔍 Missing Skills Resolution Breakdown
        </span>

        {missingSkillsComparison.length > 0 ? (
          <div className="space-y-2.5">
            {missingSkillsComparison.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800/60 text-xs">
                <span className="text-slate-200 font-medium">{item.skill}</span>
                <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold ${item.status === 'Resolved'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : item.status === 'Partially Addressed'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No missing skill tracking data available for this session.</p>
        )}
      </div>

      {/* Progress Bar for Missing Skills Resolution */}
      <div className="bg-slate-950/70 backdrop-blur-xl p-5 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-black text-emerald-400 tracking-widest uppercase font-mono">
            🚀 Missing Skills Fixed Progress
          </span>
          <span className="text-xs font-mono font-bold text-emerald-400">
            {resolutionPercentage}% Resolved
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full bg-slate-900 rounded-full h-3.5 p-0.5 border border-slate-800 shadow-inner overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-md"
            style={{ width: `${resolutionPercentage}%` }}
          ></div>
        </div>
        <p className="text-[11px] text-slate-400 mt-2 italic">
          Showing how many previously missing requirements have been successfully updated in the new resume version.
        </p>
      </div>

    </div>
  );
}