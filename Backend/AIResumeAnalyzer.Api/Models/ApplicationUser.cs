using Microsoft.AspNetCore.Identity;

namespace AIResumeAnalyzer.Api.Models
{
    // Extends the default IdentityUser to add custom properties
    public class ApplicationUser : IdentityUser
    {
        // Stores the custom name of the user/operator
        public string OperatorName { get; set; } = string.Empty;
    }
}