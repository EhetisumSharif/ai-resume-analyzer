interface SideBySideReviewProps {
  originalText: string;
  feedbackText: string;
}

export default function SideBySideReview({
  originalText,
  feedbackText,
}: SideBySideReviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {/* Left: Original Resume */}
      <div className="bg-[#030712]/50 p-3.5 sm:p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase font-mono block mb-1">
            Original Resume
          </span>
          <div className="max-h-48 sm:max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
              {originalText}
            </p>
          </div>
        </div>
      </div>

      {/* Right: AI Feedback */}
      <div className="bg-[#030712]/50 p-3.5 sm:p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase font-mono block mb-1">
            AI Feedback
          </span>
          <div className="max-h-48 sm:max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
              {feedbackText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}