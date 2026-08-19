interface MissingSkillsHighlightProps {
  missingSkills: string[];
}

export default function MissingSkillsHighlight({ missingSkills }: MissingSkillsHighlightProps) {
  if (!missingSkills || missingSkills.length === 0) return null;

  return (
    <div
      style={{
        marginTop: "24px",
        border: "1px solid #fecaca",
        background: "#fef2f2",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <h4 style={{ margin: 0, color: "#b91c1c" }}>⚠ Missing Skills</h4>
      <p style={{ fontSize: "13px", color: "#7f1d1d", marginTop: "4px" }}>
        
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
        {missingSkills.map((skill) => (
          <span
            key={skill}
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "4px 10px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}