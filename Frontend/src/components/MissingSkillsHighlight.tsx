interface MissingSkillsHighlightProps {
  missingSkills: string[];
}

export default function MissingSkillsHighlight({ missingSkills }: MissingSkillsHighlightProps) {
  if (!missingSkills || missingSkills.length === 0) return null;

  return (
    <div className="mt-2 border border-rose-900/30 bg-rose-950/20 rounded-xl p-4">
      <h4 className="m-0 text-xs font-bold text-rose-400 flex items-center gap-1.5">
        ⚠ Missing Skills
      </h4>
      <p className="text-[11px] text-rose-300/70 mt-1">
        Consider adding these skills to strengthen your resume.
      </p>
      <div className="flex flex-wrap gap-2 mt-2.5">
        {missingSkills.map((skill) => (
          <span
            key={skill}
            className="bg-rose-500/10 text-rose-400 px-2.5 py-1 rounded-full text-[11px] font-medium border border-rose-500/20"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}