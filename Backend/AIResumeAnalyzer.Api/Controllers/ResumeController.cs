using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AIResumeAnalyzer.Api.Data;
using AIResumeAnalyzer.Api.Models;
using System.Security.Claims;

namespace AIResumeAnalyzer.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ResumeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ResumeController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadResume(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file uploaded." });

            long maxFileSize = 5 * 1024 * 1024; // 5 MB
            if (file.Length > maxFileSize)
                return BadRequest(new { message = "File size exceeds the 5MB limit." });

            var permittedExtensions = new[] { ".pdf", ".docx" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (string.IsNullOrEmpty(extension) || !permittedExtensions.Contains(extension))
                return BadRequest(new { message = "Invalid file type. Only .pdf and .docx files are allowed." });

            try
            {
                string uploadsFolder = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                string uniqueFileName = Guid.NewGuid().ToString() + extension;
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                var resume = new Resume
                {
                    FileName = file.FileName,
                    FilePath = filePath,
                    UploadedAt = DateTime.UtcNow,
                    UserId = userId
                };

                _context.Resumes.Add(resume);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Resume uploaded and validated successfully!",
                    fileName = file.FileName,
                    resumeId = resume.Id
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
    }
}