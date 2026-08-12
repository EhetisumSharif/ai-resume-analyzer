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
        public FeedbackDto Feedback { get; set; } = new();
    }

    public class FeedbackDto
    {
        public List<string> Skills { get; set; } = new();
        public List<string> Content { get; set; } = new();
        public List<string> Structure { get; set; } = new();
        public List<string> Style { get; set; } = new();
    }
}