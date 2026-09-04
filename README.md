<div align="center">

  <h1>🤖 AI Resume Analyzer Platform</h1>
  <p><b>An intelligent, web-based platform designed to parse resumes, evaluate job compatibility via local AI inference, and provide actionable ATS feedback.</b></p>

  <!-- Badges -->
  <img src="https://img.shields.io/badge/Course-CSC%20470%20(Software%20Engineering%20Lab)-blue?style=for-the-badge" alt="Course Code">
  <img src="https://img.shields.io/badge/Framework-.NET%208%20Web%20API%20%7C%20React%2019-green?style=for-the-badge" alt="Tech Stack">
  <img src="https://img.shields.io/badge/Status-Completed-brightgreen?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License">

</div>

---

## 📌 About The Project
The **AI Resume Analyzer Platform** is a specialized web application developed to help job seekers improve their resumes before applying for positions. Most online job applications are filtered by Applicant Tracking Systems (ATS) before a human reader ever reviews them, and rejected candidates rarely receive feedback. This platform bridges that gap by offering instant, free ATS scoring, categorical feedback, and missing keyword identification.

Developed as part of the Software Engineering Lab course (CSC 470) at **IUBAT** under the supervision of Avijit Biswas, the project utilizes an agile Scrum process model spanning six sprints.

For detailed documentation, system analysis, activity/sequence diagrams, function point estimations, and test cases, check the official project report:
👉 **[View Project Report PDF](https://github.com/EhetisumSharif/ai-resume-analyzer/blob/main/AI%20Resume%20Analyzer%20Project%20Report.pdf)**

---

## ✨ Key Features & Functionalities
- **Instant ATS Scoring:** Generates an ATS match score between 0% and 100% based on targeted job descriptions.
- **Categorized AI Feedback:** Automatically groups written feedback into four core pillars: *Skills*, *Content Quality*, *Structure*, and *Writing Style*.
- **Missing Keyword Tags:** Identifies critical skills and keywords missing from the resume and displays them as distinct recommendation tags.
- **Progress Tracking & Analytics:** Stores past analyses to render a dynamic *Score Over Time* chart and side-by-side resume/job description comparisons.
- **Centralized Administration:** Provides statistics on registered users, total analyses, average ATS scores, searchable user management, and system activity telemetry logs.
- **Complete Data Privacy:** Leverages a locally hosted **Llama 3** model via **Ollama**, ensuring personal resume data never leaves the local machine.

---

## 🛠️ Tech Stack & Architecture
- **Architecture:** Layered N-tier Application with separate client and API boundaries.
- **Backend:** ASP.NET Core 8 Web API (C#), secured with ASP.NET Core Identity & JWT tokens.
- **Database:** Microsoft SQL Server via Entity Framework Core 8.
- **Frontend:** React 19 built with Vite, styled with Tailwind CSS, managed via Zustand and Axios.
- **AI Engine:** Llama 3 (Meta) hosted locally via Ollama, integrated using Microsoft Semantic Kernel.
- **Document Processing:** iTextSharp for PDF text extraction and Magick.NET for preview rendering at 150 DPI.

---

## 🗄️ Database Schema & Core Entities
The relational database, structured via Entity Framework Core code-first migrations, consists of the following key entities:
1. **`User` / `Role`**: Manages account credentials, security hashing, and role-based access control (Job Seeker / Admin).
2. **`Resume`**: Stores uploaded document metadata, file paths, and extracted plain text.
3. **`JobDescription`**: Captures target job titles, company names, and description text.
4. **`AIAnalysisRun`**: Tracks individual scoring executions, processing time, and match metrics.
5. **`ScoreMetrics` & `FeedbackSuggestion`**: Hold category-wise scores and missing skill recommendations.
6. **`ActivityLog`**: Records timestamped system events, IP addresses, and operational logs.

---

## 🚀 Getting Started

To run this project locally, follow these steps:

### Prerequisites
- Node.js & npm (for running the React frontend)
- .NET 8 SDK & Visual Studio 2022 / VS Code
- Microsoft SQL Server (or LocalDB)
- **Ollama** installed locally with the **Llama 3** model pulled (`ollama run llama3`) running at `http://localhost:11434`

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/EhetisumSharif/ai-resume-analyzer.git](https://github.com/EhetisumSharif/ai-resume-analyzer.git)
