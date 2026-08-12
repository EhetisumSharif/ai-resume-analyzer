using System.ComponentModel.DataAnnotations;

namespace AIResumeAnalyzer.Api.Models
{
    public class JobProfile
    {
        [Key]
        public Guid Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string DescriptionContent { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}