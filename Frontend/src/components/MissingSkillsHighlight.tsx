interface MissingSkillsHighlightProps {
  missingSkills: string[];
}

export default function MissingSkillsHighlight({ missingSkills }: MissingSkillsHighlightProps) {
  if (!missingSkills || missingSkills.length === 0) return null;

  return (
    <div className="mt-3 border border-rose-500/20 bg-gradient-to-br from-rose-950/30 via-slate-900/60 to-slate-950/80 backdrop-blur-xl rounded-2xl p-5 shadow-lg relative overflow-hidden">

      {/* Decorative Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none"></div>

      <h4 className="m-0 text-xs font-black text-rose-400 flex items-center gap-2 uppercase tracking-wider">
        <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
        <span>⚠️ Missing Skills & Requirements</span>
      </h4>

      <p className="text-[11px] text-slate-400 mt-1">
        Incorporate these core technical keywords or technologies into your resume to significantly boost ATS compatibility.
      </p>

      <div className="flex flex-wrap gap-2 mt-3.5">
        {missingSkills.map((skill) => (
          <span
            key={skill}
            className="bg-rose-500/10 text-rose-300 px-3 py-1.5 rounded-xl text-[11px] font-bold border border-rose-500/30 shadow-inner flex items-center space-x-1 hover:bg-rose-500/20 transition-colors"
          >
            <span>✖</span>
            <span>{skill}</span>
          </span>
        ))}
      </div>
    </div>
  );
}