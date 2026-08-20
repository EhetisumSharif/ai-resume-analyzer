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

  
        [HttpGet("compare")]
        public async Task<IActionResult> CompareResumes([FromQuery] Guid resumeId1, [FromQuery] Guid resumeId2)
        {
            if (resumeId1 == Guid.Empty || resumeId2 == Guid.Empty)
                return BadRequest(new { message = "Please provide both resumeId1 and resumeId2 for comparison." });

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "test-user-id";

            // Duti resume er-i analysis result database theke eksathe fetch kora
            var analysis1 = await _context.Analyses
                .FirstOrDefaultAsync(a => a.ResumeId == resumeId1 && a.UserId == userId);

            var analysis2 = await _context.Analyses
                .FirstOrDefaultAsync(a => a.ResumeId == resumeId2 && a.UserId == userId);

            if (analysis1 == null || analysis2 == null)
                return NotFound(new { message = "Could not find analysis data for one or both resumes. Ensure both are analyzed." });

            // Comparison result toiri kora
            var comparisonResult = new
            {
                message = "Comparison generated successfully",
                winner = analysis1.AtsScore > analysis2.AtsScore ? "Resume 1 is better" : (analysis2.AtsScore > analysis1.AtsScore ? "Resume 2 is better" : "Both are equal"),
                resume1 = new
                {
                    resumeId = analysis1.ResumeId,
                    score = analysis1.AtsScore,
                    feedback = analysis1.FeedbackJson,
                    analyzedOn = analysis1.AnalyzedAt
                },
                resume2 = new
                {
                    resumeId = analysis2.ResumeId,
                    score = analysis2.AtsScore,
                    feedback = analysis2.FeedbackJson,
                    analyzedOn = analysis2.AnalyzedAt
                }
            };

            return Ok(comparisonResult);
        }
    }
}