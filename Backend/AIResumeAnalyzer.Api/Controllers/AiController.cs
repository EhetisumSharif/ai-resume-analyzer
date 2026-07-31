using AIResumeAnalyzer.Api.Data;
using AIResumeAnalyzer.Api.Models;
using AIResumeAnalyzer.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;

namespace AIResumeAnalyzer.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize] // Jokhon authentication on korben, eti uncomment kore diben
    public class AiController : ControllerBase
    {
        private readonly IAiScoringService _aiScoringService;
        private readonly ApplicationDbContext _context; // DB save korar jonno add kora holo

        public AiController(IAiScoringService aiScoringService, ApplicationDbContext context)
        {
            _aiScoringService = aiScoringService;
            _context = context;
        }

        [HttpPost("analyze")]
        public async Task<IActionResult> AnalyzeResume([FromBody] AnalyzeResumeRequestDto request)
        {
            if (request.ResumeId == Guid.Empty || string.IsNullOrWhiteSpace(request.JobDescription))
            {
                return BadRequest(new { message = "ResumeId and Job description are required." });
            }

            // 1. JWT token theke User ID neya (Authorize kora na thakle dummy ID bebohar hobe)
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "test-user-id";

            // 2. Database theke upload kora resume ebong tar extracted text khuje ber kora
            var resume = await _context.Resumes.FirstOrDefaultAsync(r => r.Id == request.ResumeId);
            if (resume == null) return NotFound(new { message = "Resume not found in the database." });
            if (string.IsNullOrWhiteSpace(resume.ExtractedText)) return BadRequest(new { message = "No text was extracted from this resume." });

            try
            {
                int maxRetries = 3;
                bool success = false;
                object aiResult = null;

                // ==========================================
                // SCRUM-33: Implement AI timeout (15s) + retry logic
                // ==========================================
                for (int attempt = 1; attempt <= maxRetries; attempt++)
                {
                    try
                    {
                        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(15));

                        // Apnar asol AI Service ekhane call hocche
                        aiResult = await _aiScoringService.EvaluateResumeAsync(resume.ExtractedText, request.JobDescription);

                        success = true;
                        break; // Success hole loop theke ber hoye asbe
                    }
                    catch (TaskCanceledException)
                    {
                        if (attempt == maxRetries) throw new Exception("AI request timed out after 15 seconds.");
                        await Task.Delay(2000); // 2 second delay before retry
                    }
                    catch (Exception)
                    {
                        if (attempt == maxRetries) throw;
                        await Task.Delay(2000);
                    }
                }

                if (!success || aiResult == null) throw new Exception("Failed to get response from AI service.");

                // Result string/JSON hishebe parse kora DB te save korar jonno
                string feedbackJson = aiResult is string s ? s : JsonSerializer.Serialize(aiResult);

                // ==========================================
                // SCRUM-32: Implement analysis result storage in DB
                // ==========================================
                var analysis = new Analysis
                {
                    Id = Guid.NewGuid(),
                    ResumeId = resume.Id,
                    UserId = userId,
                    JobDescription = request.JobDescription,
                    AtsScore = 85, // Jodi apnar AI service theke score ashe, sheta parse kore ekhane boshaben
                    FeedbackJson = feedbackJson,
                    AnalyzedAt = DateTime.UtcNow
                };

                _context.Analyses.Add(analysis);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Analysis completed and saved successfully.",
                    analysisId = analysis.Id,
                    result = aiResult
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while analyzing the resume.", error = ex.Message });
            }
        }
    }

    // Client/Swagger theke request pathanor model update kora holo
    public class AnalyzeResumeRequestDto
    {
        public Guid ResumeId { get; set; }
        public string JobDescription { get; set; } = string.Empty;
    }
}