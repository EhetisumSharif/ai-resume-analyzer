using AIResumeAnalyzer.Api.Models;
using AIResumeAnalyzer.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AIResumeAnalyzer.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize] // 
    public class AiController : ControllerBase
    {
        private readonly IAiScoringService _aiScoringService;

        public AiController(IAiScoringService aiScoringService)
        {
            _aiScoringService = aiScoringService;
        }

        [HttpPost("analyze")]
        public async Task<IActionResult> AnalyzeResume([FromBody] AnalyzeResumeRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.ResumeText) || string.IsNullOrWhiteSpace(request.JobDescription))
            {
                return BadRequest(new { message = "Resume text and Job description are required." });
            }

            try
            {
                var result = await _aiScoringService.EvaluateResumeAsync(request.ResumeText, request.JobDescription);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while analyzing the resume.", error = ex.Message });
            }
        }
    }
}