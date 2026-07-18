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

        // Register the new tables for the database
        public DbSet<Resume> Resumes { get; set; }
        public DbSet<Analysis> Analyses { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            // Essential for configuring Identity internal table mappings
            base.OnModelCreating(builder);

            // Configure relationships mapping to prevent cascade delete errors
            builder.Entity<Analysis>()
                .HasOne(a => a.Resume)
                .WithMany(r => r.Analyses)
                .HasForeignKey(a => a.ResumeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Analysis>()
                .HasOne(a => a.User)
                .WithMany(u => u.Analyses)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}