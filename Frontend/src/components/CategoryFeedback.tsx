import { CategoryScore } from "../types/resume";

interface CategoryFeedbackProps {
  categories: CategoryScore[];
}

const getColor = (score: number) => {
  if (score >= 80) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
};

export default function CategoryFeedback({ categories }: CategoryFeedbackProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "24px" }}>
      {categories.map((cat) => (
        <div
          key={cat.category}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "16px",
            background: "#fff",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0 }}>{cat.category}</h4>
            <span style={{ color: getColor(cat.score), fontWeight: 700 }}>
              {cat.score}/100
            </span>
          </div>
          <div
            style={{
              height: "6px",
              background: "#f3f4f6",
              borderRadius: "4px",
              marginTop: "8px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${cat.score}%`,
                height: "100%",
                background: getColor(cat.score),
              }}
            />
          </div>
          <p style={{ marginTop: "10px", fontSize: "14px", color: "#4b5563" }}>
            {cat.feedback}
          </p>
        </div>
      ))}
    </div>
  );
}