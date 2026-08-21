interface SideBySideReviewProps {
  originalText: string;
  feedbackText: string;
}

export default function SideBySideReview({
  originalText,
  feedbackText,
}: SideBySideReviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left: Original Resume */}
      <div className="bg-[#030712]/50 p-4 rounded-lg border border-slate-800">
        <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase font-mono">
          Original Resume
        </span>
        <p className="text-xs text-slate-300 leading-relaxed mt-2 whitespace-pre-wrap">
          {originalText}
        </p>
      </div>

      {/* Right: AI Feedback */}
      <div className="bg-[#030712]/50 p-4 rounded-lg border border-slate-800">
        <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase font-mono">
          AI Feedback
        </span>
        <p className="text-xs text-slate-300 leading-relaxed mt-2 whitespace-pre-wrap">
          {feedbackText}
        </p>
      </div>
    </div>
  );
}