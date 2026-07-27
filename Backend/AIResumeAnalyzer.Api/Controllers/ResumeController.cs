using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AIResumeAnalyzer.Api.Data;
using AIResumeAnalyzer.Api.Models;
using AIResumeAnalyzer.Api.Services; 
using System.Security.Claims;
using System.IO;

namespace AIResumeAnalyzer.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ResumeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly ResumeProcessor _resumeProcessor;

        public ResumeController(ApplicationDbContext context, IWebHostEnvironment env, ResumeProcessor resumeProcessor)
        {
            _context = context;
            _env = env;
            _resumeProcessor = resumeProcessor;
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
                // Setup Folders
                string uploadsFolder = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads");
                string previewsFolder = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads", "previews");

                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
                if (!Directory.Exists(previewsFolder)) Directory.CreateDirectory(previewsFolder);

                var resumeId = Guid.NewGuid(); // Generate ID early for naming files
                string uniqueFileName = resumeId.ToString() + extension;
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                // Save physical file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                string extractedText = null;
                string previewUrl = null;

                // Process PDF specifically
                if (extension == ".pdf")
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        await file.CopyToAsync(memoryStream);

                        // Extract text
                        extractedText = _resumeProcessor.ExtractTextFromPdf(memoryStream);

                        // Generate preview image
                        _resumeProcessor.GeneratePreviewImage(memoryStream, previewsFolder, resumeId.ToString());
                        previewUrl = $"/uploads/previews/{resumeId}_preview.png";
                    }
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                var resume = new Resume
                {
                    Id = resumeId, // Use the generated Guid (if your model uses Guid for Id)
                    FileName = file.FileName,
                    FilePath = filePath,
                    FileType = extension.Replace(".", ""), // "pdf" or "docx"
                    ExtractedText = extractedText, // Save extracted text to DB
                    UploadedAt = DateTime.UtcNow,
                    UserId = userId
                };

                _context.Resumes.Add(resume);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Resume uploaded and processed successfully!",
                    fileName = file.FileName,
                    resumeId = resume.Id,
                    preview = previewUrl
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
    }
}