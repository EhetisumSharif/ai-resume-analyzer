using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AIResumeAnalyzer.Api.Models
{
    public class Analysis
    {
        [Key]
        public Guid Id { get; set; }

        public Guid ResumeId { get; set; }
        [ForeignKey("ResumeId")]
        public Resume? Resume { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty;
        [ForeignKey("UserId")]
        public ApplicationUser? User { get; set; }

        [Required]
        public string JobDescription { get; set; } = string.Empty;

        public string Status { get; set; } = "Pending";

        public int? AtsScore { get; set; }

        // Storing complex data as JSON strings
        public string? CategoryScoresJson { get; set; }
        public string? MissingKeywordsJson { get; set; }
        public string? DetailedFeedback { get; set; }

        public int? UserRating { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }
    }
}