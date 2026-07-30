namespace AIResumeAnalyzer.Api.Models
{
    public class AnalyzeResumeRequestDto
    {
        public string ResumeText { get; set; } = string.Empty;
        public string JobDescription { get; set; } = string.Empty;
    }
}