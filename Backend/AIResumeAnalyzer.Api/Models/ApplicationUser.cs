using Microsoft.AspNetCore.Identity;

namespace AIResumeAnalyzer.Api.Models
{
    // Extends the default IdentityUser to add custom properties
    public class ApplicationUser : IdentityUser
    {
        // Stores the custom name of the user/operator (Apnar original property)
        public string OperatorName { get; set; } = string.Empty;

        // Stores the user's role: "Admin" or "User"
        public string Role { get; set; } = "User";

        // Stores account status: "Active" or "Banned"
        public string AccountStatus { get; set; } = "Active";

        // Navigation Properties for Entity Relationships (1-to-Many)
        public ICollection<Resume>? Resumes { get; set; }
        public ICollection<Analysis>? Analyses { get; set; }
    }
}