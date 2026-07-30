using System.Text.Json;
using AIResumeAnalyzer.Api.Models;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;

namespace AIResumeAnalyzer.Api.Services
{
    public interface IAiScoringService
    {
        Task<AtsAnalysisResultDto> EvaluateResumeAsync(string resumeText, string jobDescription);
    }

    public class AiScoringService : IAiScoringService
    {
        private readonly Kernel _kernel;

        public AiScoringService(Kernel kernel)
        {
            _kernel = kernel;
        }

        public async Task<AtsAnalysisResultDto> EvaluateResumeAsync(string resumeText, string jobDescription)
        {
            var chatService = _kernel.GetRequiredService<IChatCompletionService>();

            var systemPrompt = @"You are an expert Applicant Tracking System (ATS). 
Evaluate the resume against the job description.
Provide an ATS score from 0 to 100 based on exact keyword and skill match.

Output MUST be strictly valid raw JSON with NO markdown tags, backticks, or extra commentary.

JSON Structure:
{
  ""atsScore"": 85,
  ""summary"": ""Short evaluation summary"",
  ""matchedSkills"": [""Skill1"", ""Skill2""],
  ""missingSkills"": [""Skill1"", ""Skill2""],
  ""strengths"": [""Strength1""],
  ""improvements"": [""Improvement1""]
}";

            var userPrompt = $@"
JOB DESCRIPTION:
{jobDescription}

RESUME:
{resumeText}
";

            var chatHistory = new ChatHistory(systemPrompt);
            chatHistory.AddUserMessage(userPrompt);

            var response = await chatService.GetChatMessageContentAsync(chatHistory);
            string responseText = response.Content?.Trim() ?? string.Empty;

            // Extract valid JSON block between '{' and '}'
            if (responseText.Contains("{"))
            {
                int startIndex = responseText.IndexOf('{');
                int endIndex = responseText.LastIndexOf('}');
                if (startIndex != -1 && endIndex != -1 && endIndex > startIndex)
                {
                    responseText = responseText.Substring(startIndex, endIndex - startIndex + 1);
                }
            }

            try
            {
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    AllowTrailingCommas = true
                };

                var result = JsonSerializer.Deserialize<AtsAnalysisResultDto>(responseText, options);
                return result ?? new AtsAnalysisResultDto { AtsScore = 0, Summary = "Failed to parse AI response." };
            }
            catch (Exception)
            {
                // Clean Fallback: No hardcoded technical skills
                return new AtsAnalysisResultDto
                {
                    AtsScore = 0,
                    Summary = "Failed to evaluate ATS score due to formatting error from AI model. Please try again.",
                    MatchedSkills = new List<string>(),
                    MissingSkills = new List<string>(),
                    Strengths = new List<string> { "Raw Response: " + (responseText.Length > 100 ? responseText.Substring(0, 100) + "..." : responseText) },
                    Improvements = new List<string> { "Ensure Ollama/Llama 3 is properly loaded." }
                };
            }
        }
    }
}