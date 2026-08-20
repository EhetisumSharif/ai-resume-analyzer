using AIResumeAnalyzer.Api.Data;
using AIResumeAnalyzer.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AIResumeAnalyzer.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize(Roles = "Admin")] // Jokhon Role based auth setup hobe, tokhon eti on kore diben
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        // Constructor-e DbContext ebong UserManager inject kora holo
        public AdminController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // ==========================================
        // SCRUM-55: Build Admin Analytics API
        // ==========================================
        [HttpGet("analytics")]
        public async Task<IActionResult> GetSystemAnalytics()
        {
            try
            {
                // Database theke system er overall statistics ber kora
                var totalUsers = await _userManager.Users.CountAsync();
                var totalResumes = await _context.Resumes.CountAsync();
                var totalAnalyses = await _context.Analyses.CountAsync();

                // Nullable er jhamela eranor jonno safe calculation
                double averageScore = 0;
                if (totalAnalyses > 0)
                {
                    var avg = await _context.Analyses.AverageAsync(a => a.AtsScore);
                    averageScore = Convert.ToDouble(avg); // Explicitly double e convert kora holo
                }

                return Ok(new
                {
                    message = "Analytics fetched successfully",
                    data = new
                    {
                        TotalUsers = totalUsers,
                        TotalResumes = totalResumes,
                        TotalAnalyses = totalAnalyses,
                        AverageAtsScore = Math.Round(averageScore, 2)
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching analytics", error = ex.Message });
            }
        }

        // ==========================================
        // SCRUM-46: DB Cleanup
        // ==========================================
        [HttpDelete("cleanup")]
        public async Task<IActionResult> CleanupDatabase()
        {
            try
            {
                // 30 diner purano resume jegulor kono analysis nai shegulo khuje ber kora
                var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);

                var orphanedResumes = await _context.Resumes
                    .Where(r => r.UploadedAt < thirtyDaysAgo && !_context.Analyses.Any(a => a.ResumeId == r.Id))
                    .ToListAsync();

                if (!orphanedResumes.Any())
                    return Ok(new { message = "Database is clean. No orphaned resumes found." });

                _context.Resumes.RemoveRange(orphanedResumes);
                await _context.SaveChangesAsync();

                return Ok(new { message = $"Cleanup successful. Deleted {orphanedResumes.Count} old unused resumes." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Cleanup failed.", error = ex.Message });
            }
        }

        // ==========================================
        // SCRUM-56: Build User Management CRUD API
        // ==========================================

        // 1. READ: Get All Users
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users
                .Select(u => new
                {
                    u.Id,
                    u.UserName,
                    u.Email,
                    u.EmailConfirmed
                })
                .ToListAsync();

            return Ok(new { message = "Users fetched successfully", data = users });
        }

        // 2. READ: Get User By ID
        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound(new { message = "User not found." });

            return Ok(new
            {
                data = new { user.Id, user.UserName, user.Email, user.PhoneNumber }
            });
        }

        // 3. DELETE: Remove a User
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound(new { message = "User not found." });

            var result = await _userManager.DeleteAsync(user);
            if (result.Succeeded)
            {
                return Ok(new { message = "User deleted successfully." });
            }

            return BadRequest(new { message = "Failed to delete user.", errors = result.Errors });
        }
    }
}