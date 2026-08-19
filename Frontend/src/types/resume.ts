export interface CategoryScore {
  category: "Skills" | "Experience" | "Education" | "Formatting";
  score: number;
  feedback: string;
}

export interface AnalysisResult {
  score: number;
  summary: string;
  keywords: string[];
  improvements: string[];
  categoryScores: CategoryScore[];
  missingSkills: string[];
}