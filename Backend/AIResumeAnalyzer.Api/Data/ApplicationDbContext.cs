using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using AIResumeAnalyzer.Api.Models;

namespace AIResumeAnalyzer.Api.Data
{
    // Inherits from IdentityDbContext to manage Identity tables automatically
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            // Essential for configuring Identity internal table mappings
            base.OnModelCreating(builder);
        }
    }
}