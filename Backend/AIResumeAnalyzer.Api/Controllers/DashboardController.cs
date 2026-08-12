using AIResumeAnalyzer.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AIResumeAnalyzer.Api.Controllers
{
    // [Authorize] // Frontend-e auth add korar por eti uncomment korben
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetUserHistory()
        {
            // Token theke user ID neya (na thakle test-user-id fallback)
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "test-user-id";

            // Database theke User er Resume ebong sathe tar Analysis result join kore ana
            var history = await _context.Resumes
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.UploadedAt)
                .Select(r => new
                {
                    resumeId = r.Id,
                    fileName = r.FileName,
                    uploadedAt = r.UploadedAt,
                    // Jodi ei resume er kono analysis thake tahole shetao niye asha
                    analysisResult = _context.Analyses
                        .Where(a => a.ResumeId == r.Id)
                        .OrderByDescending(a => a.AnalyzedAt)
                        .Select(a => new
                        {
                            analysisId = a.Id,
                            atsScore = a.AtsScore,
                            jobDescription = a.JobDescription,
                            analyzedAt = a.AnalyzedAt
                        })
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(new { message = "History fetched successfully", data = history });
        }
    }
}