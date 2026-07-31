using AIResumeAnalyzer.Api.Data;
using AIResumeAnalyzer.Api.Models;
using System.Text.Json;

namespace AIResumeAnalyzer.Api.Services
{
    public class AiAnalysisService
    {
        private readonly ApplicationDbContext _context;

        public AiAnalysisService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Analysis> ProcessAndSaveAnalysisAsync(Guid resumeId, string userId, string jobDescription, string extractedText)
        {
            string aiFeedbackJson = string.Empty;
            int atsScore = 0;

            int maxRetries = 3;
            bool success = false;

            
            // Implement AI timeout (15s) + retry logic

            for (int attempt = 1; attempt <= maxRetries; attempt++)
            {
                try
                {
                    // 15 seconds timeout
                    using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(15));

                    // Call the dummy/real AI API with the cancellation token
                    aiFeedbackJson = await CallAiApiAsync(extractedText, jobDescription, cts.Token);

                    atsScore = 85; // Example score, update this based on actual AI response
                    success = true;
                    break;
                }
                catch (TaskCanceledException)
                {
                    if (attempt == maxRetries)
                        throw new Exception("AI API request timed out after 3 attempts.");

                    await Task.Delay(2000); // 2 second delay before next try
                }
                catch (Exception)
                {
                    if (attempt == maxRetries)
                        throw;

                    await Task.Delay(2000);
                }
            }

            if (!success) throw new Exception("Failed to get response from AI service.");

            //Implement analysis result storage in DB

            var analysis = new Analysis
            {
                Id = Guid.NewGuid(),
                ResumeId = resumeId,
                UserId = userId,
                JobDescription = jobDescription,
                AtsScore = atsScore,
                FeedbackJson = aiFeedbackJson,
                AnalyzedAt = DateTime.UtcNow
            };

            _context.Analyses.Add(analysis);
            await _context.SaveChangesAsync();

            return analysis;
        }

        // Dummy AI Call - Replace with actual implementation later
        private async Task<string> CallAiApiAsync(string resumeText, string jobDesc, CancellationToken token)
        {
            // Simulating API processing time
            await Task.Delay(3000, token);

            return JsonSerializer.Serialize(new
            {
                Summary = "Strong profile match for backend developer.",
                MatchingSkills = new[] { "C#", "SQL Server", "EF Core" },
                MissingSkills = new[] { "Docker", "Azure" }
            });
        }
    }
}