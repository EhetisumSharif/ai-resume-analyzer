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
        private readonly IAiScoringService _aiScoringService;

        public ResumeController(
            ApplicationDbContext context,
            IWebHostEnvironment env,
            ResumeProcessor resumeProcessor,
            IAiScoringService aiScoringService)
        {
            _context = context;
            _env = env;
            _resumeProcessor = resumeProcessor;
            _aiScoringService = aiScoringService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadResume(IFormFile file, [FromForm] string? jobDescription)
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

                var resumeId = Guid.NewGuid();
                string uniqueFileName = resumeId.ToString() + extension;
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                string? extractedText = null;
                string? previewUrl = null;

                // 🚀 MASTER FIX: Convert file to byte array once!
                byte[] fileBytes;
                using (var ms = new MemoryStream())
                {
                    await file.CopyToAsync(ms);
                    fileBytes = ms.ToArray(); // Save in memory
                }

                // 1. Save physical file using the byte array
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await fileStream.WriteAsync(fileBytes, 0, fileBytes.Length);
                }

                // 2. Process PDF Specifically
                if (extension == ".pdf")
                {
                    // Create a FRESH stream just for Text Extraction
                    using (var pdfStreamForText = new MemoryStream(fileBytes))
                    {
                        extractedText = _resumeProcessor.ExtractTextFromPdf(pdfStreamForText);
                    } // iTextSharp closes this stream? No problem!

                    // Create another FRESH stream just for Image Generation
                    using (var pdfStreamForImage = new MemoryStream(fileBytes))
                    {
                        _resumeProcessor.GeneratePreviewImage(pdfStreamForImage, previewsFolder, resumeId.ToString());
                        previewUrl = $"/uploads/previews/{resumeId}_preview.png";
                    } // ImageMagick closes this one? Also fine!
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                var resume = new Resume
                {
                    Id = resumeId,
                    FileName = file.FileName,
                    FilePath = filePath,
                    FileType = extension.Replace(".", ""),
                    ExtractedText = extractedText,
                    UploadedAt = DateTime.UtcNow,
                    UserId = userId
                };

                _context.Resumes.Add(resume);
                await _context.SaveChangesAsync();

                // 3. Auto AI Analysis Logic
                AtsAnalysisResultDto? aiAnalysis = null;
                if (!string.IsNullOrWhiteSpace(extractedText) && !string.IsNullOrWhiteSpace(jobDescription))
                {
                    aiAnalysis = await _aiScoringService.EvaluateResumeAsync(extractedText, jobDescription);
                }

                return Ok(new
                {
                    message = "Resume uploaded and processed successfully!",
                    fileName = file.FileName,
                    resumeId = resume.Id,
                    preview = previewUrl,
                    extractedText = extractedText,
                    analysis = aiAnalysis
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Internal server error",
                    error = ex.Message,
                    innerError = ex.InnerException?.Message
                });
            }
        }
    }
}