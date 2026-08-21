import { CategoryScore } from "../types/resume";

interface CategoryFeedbackProps {
  categories: CategoryScore[];
}

const getColor = (score: number) => {
  if (score >= 80) return "#34d399"; // emerald-400
  if (score >= 50) return "#fbbf24"; // amber-400
  return "#f87171"; // rose-400
};

export default function CategoryFeedback({ categories }: CategoryFeedbackProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
      {categories.map((cat) => (
        <div
          key={cat.category}
          className="border border-slate-800 rounded-xl p-4 bg-[#030712]/50"
        >
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-slate-200 m-0">{cat.category}</h4>
            <span style={{ color: getColor(cat.score) }} className="text-xs font-bold">
              {cat.score}/100
            </span>
          </div>
          <div className="h-1.5 bg-slate-900 rounded-full mt-2 overflow-hidden">
            <div
              style={{ width: `${cat.score}%`, background: getColor(cat.score) }}
              className="h-full rounded-full transition-all duration-500"
            />
          </div>
          <p className="mt-2.5 text-xs text-slate-400 leading-relaxed">
            {cat.feedback}
          </p>
        </div>
      ))}
    </div>
  );
}