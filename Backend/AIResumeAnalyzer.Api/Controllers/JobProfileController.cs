using AIResumeAnalyzer.Api.Data;
using AIResumeAnalyzer.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AIResumeAnalyzer.Api.Controllers
{
    // [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class JobProfileController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public JobProfileController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Storage API 
        [HttpPost("save")]
        public async Task<IActionResult> SaveJobProfile([FromBody] JobProfileDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.DescriptionContent))
                return BadRequest(new { message = "Title and Description are required." });

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "test-user-id";

            var jobProfile = new JobProfile
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Title = request.Title,
                DescriptionContent = request.DescriptionContent
            };

            _context.JobProfiles.Add(jobProfile);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Job description saved successfully.", jobProfileId = jobProfile.Id });
        }

        // 2. Retrieval API 
        [HttpGet("list")]
        public async Task<IActionResult> GetSavedJobs()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "test-user-id";
            var jobs = await _context.JobProfiles
                .Where(j => j.UserId == userId)
                .OrderByDescending(j => j.CreatedAt)
                .ToListAsync();

            return Ok(new { message = "Saved jobs fetched", data = jobs });
        }
    }

    public class JobProfileDto
    {
        public string Title { get; set; } = string.Empty;
        public string DescriptionContent { get; set; } = string.Empty;
    }
}