namespace AIResumeAnalyzer.Api.Models
{
    public class AtsAnalysisResultDto
    {
        public int AtsScore { get; set; }
        public string Summary { get; set; } = string.Empty;
        public List<string> MatchedSkills { get; set; } = new();
        public List<string> MissingSkills { get; set; } = new();
        public List<string> Strengths { get; set; } = new();
        public List<string> Improvements { get; set; } = new();
    }
}