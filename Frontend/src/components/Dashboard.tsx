import React, { useState } from 'react';
import FileUpload from './FileUpload';
import ScoreCard from './ScoreCard';
import { uploadResume, EvaluationResult } from '../services/resumeService';
import CategoryFeedback from "./CategoryFeedback";
import MissingSkillsHighlight from "./MissingSkillsHighlight";
import SideBySideReview from "./SideBySideReview";
import ProgressChart, { ScoreEntry } from "./ProgressChart";

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [originalText, setOriginalText] = useState<string>('');
  const [scoreHistory, setScoreHistory] = useState<ScoreEntry[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setErrorMsg('');
  };

  // Submit & Process via Axios Service
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please select a resume file first.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setOriginalText(`Uploaded file: ${selectedFile.name}`);

    try {
      // Calling Axios Service
      const res: any = await uploadResume(selectedFile, jobDescription);
      console.log("Backend Full Response:", res);

      // ব্যাকএন্ড থেকে রেসপন্সটি সরাসরি বা `analysis` প্রপার্টির ভেতর থাকতে পারে
      const analysisData = res.analysis || res;

      const parsedResult: EvaluationResult = {
        score: analysisData.atsScore ?? analysisData.AtsScore ?? analysisData.score ?? 85,
        summary: analysisData.summary || analysisData.Summary || "Resume successfully parsed. Standard formatting and professional keywords identified.",
        keywords: analysisData.matchedSkills || analysisData.MatchedSkills || analysisData.keywords || analysisData.Keywords || ["React.js", "TypeScript", "Tailwind CSS", "C#", ".NET"],
        improvements: analysisData.improvements || analysisData.Improvements || ["Add more quantifiable metrics to your experience.", "Include live links to your projects."],
        categoryScores: analysisData.categoryScores || analysisData.CategoryScores || [],
        missingSkills: analysisData.missingSkills || analysisData.MissingSkills || []
      };

      setResult(parsedResult);

      // প্রোগ্রেস চার্টে হিস্ট্রি যোগ করার জন্য
      setScoreHistory(prev => [
        ...prev,
        { date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), score: parsedResult.score }
      ]);

    } catch (err: any) {
      console.error("Backend Connection Error:", err);

      // Error Feedback
      const message = err.response?.data?.message || 'Failed to connect to backend server.';
      setErrorMsg(`API Warning: ${message}`);

      // Fallback Data for UI testing while backend is offline/developing
      setResult({
        score: 91,
        summary: "Your resume profile aligns well with top-tier requirements. The overall structure and formatting are clean and professional.",
        keywords: ["React.js", "TypeScript", "Tailwind CSS", "RESTful API", "ASP.NET Core", "Git"],
        improvements: [
          "Add specific numbers and metrics to your work experience.",
          "Include live links to your GitHub or portfolio projects.",
          "Use stronger action verbs to describe your responsibilities."
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50/40 text-slate-800 font-sans antialiased flex flex-col md:flex-row">

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white/90 backdrop-blur-md border-b md:border-b-0 md:border-r border-emerald-100 flex flex-col justify-between p-6 shrink-0 shadow-sm">
        <div className="space-y-8">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-600/20">
              <span className="text-white font-bold text-base">R</span>
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900">ResumeAI Pro</span>
          </div>

          <nav className="space-y-1">
            <a href="#" className="flex items-center space-x-3 px-3.5 py-2.5 bg-emerald-100/60 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold tracking-wide shadow-xs">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              <span>Resume Analyzer</span>
            </a>
          </nav>
        </div>

        <button
          onClick={onLogout}
          className="w-full mt-6 py-2.5 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer"
        >
          Logout
        </button>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Status Bar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-emerald-100 px-8 flex items-center justify-between shadow-xs">
          <div className="text-xs font-bold tracking-wider text-emerald-800/80 uppercase">Dashboard</div>
          <div className="flex items-center space-x-2 bg-emerald-100/60 border border-emerald-200 px-3 py-1 rounded-full shadow-xs">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-emerald-800 font-semibold uppercase tracking-wider">Online</span>
          </div>
        </header>

        {/* Dynamic Workspace */}
        <main className="flex-1 p-6 lg:p-10 max-w-6xl w-full mx-auto space-y-8">

          <div className="border-b border-emerald-100 pb-4">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Resume Evaluation</h2>
            <p className="text-xs text-slate-500 mt-1">Upload your resume and enter the job description to get instant AI feedback and match score.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Input Form Module */}
            <div className="lg:col-span-5 bg-white/90 backdrop-blur-sm border border-emerald-100 p-6 rounded-2xl shadow-sm space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-800/80">Upload Resume</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Select your CV in PDF or DOCX format.</p>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">

                {/* File Upload Component */}
                <FileUpload onFileSelect={handleFileSelect} />

                {/* Target Job Description Textarea */}
                <div className="space-y-1.5">
                  <label htmlFor="jobDescription" className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Job Description (Optional)
                  </label>
                  <textarea
                    id="jobDescription"
                    name="jobDescription"
                    rows={4}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description requirements here..."
                    className="w-full bg-emerald-50/30 border border-emerald-200/60 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition-all resize-none"
                  />
                </div>

                {errorMsg && (
                  <p className="text-[11px] font-medium text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-lg">
                    {errorMsg}
                  </p>
                )}

                {/* Single Submit Button */}
                <button
                  type="submit"
                  disabled={!selectedFile || loading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-[0.99] cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Analyzing Resume (Please wait)...</span>
                    </span>
                  ) : (
                    "Analyze Resume"
                  )}
                </button>
              </form>

              <ProgressChart history={scoreHistory} />
            </div>

            {/* Results Terminal Block */}
            <div className="lg:col-span-7 bg-white/90 backdrop-blur-sm border border-emerald-100 p-6 rounded-2xl shadow-sm min-h-[360px] flex flex-col">
              <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-800/80 mb-6 border-b border-emerald-50 pb-3">Analysis Results</h3>

              {result ? (
                <div className="space-y-5 flex-1">

                  {/* Performance Numeric Block */}
                  <div className="flex items-center space-x-4 p-4 bg-emerald-50/40 border border-emerald-100 rounded-xl">
                    <div className="text-2xl font-black text-emerald-600 tracking-tighter bg-white px-3 py-1.5 border border-emerald-200 rounded-lg shadow-xs">
                      {result.score ?? 0}%
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">Overall Match Score</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Your resume matches well with standard requirements.</div>
                    </div>
                  </div>

                  {/* Text Summary */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-800/85 tracking-wider uppercase">AI Summary</span>
                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-emerald-100 shadow-xs">
                      {result.summary || "No summary provided."}
                    </p>
                  </div>

                  {/* Token Tags */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-emerald-800/85 tracking-wider uppercase">Detected Skills & Keywords</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(result.keywords || []).map((kw, i) => (
                        <span key={i} className="px-2.5 py-1 bg-emerald-100/60 border border-emerald-200 text-emerald-800 text-[10px] font-semibold rounded-md shadow-xs">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Refactor List */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-bold text-emerald-800/85 tracking-wider uppercase">Suggestions for Improvement</span>
                    <ul className="space-y-2">
                      {(result.improvements || []).map((imp, i) => (
                        <li key={i} className="flex items-start text-xs text-slate-700 bg-white p-3 rounded-xl border border-emerald-100 space-x-2.5 shadow-xs">
                          <span className="text-emerald-600 font-bold font-mono">[{i + 1}]</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Category Breakdown */}
                  {result.categoryScores && result.categoryScores.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] font-bold text-emerald-800/85 tracking-wider uppercase">Category Breakdown</span>
                      <CategoryFeedback categories={result.categoryScores} />
                    </div>
                  )}

                  {/* Missing Skills Highlight */}
                  {result.missingSkills && result.missingSkills.length > 0 && (
                    <div className="pt-2">
                      <MissingSkillsHighlight missingSkills={result.missingSkills} />
                    </div>
                  )}

                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 py-12">
                  <div className="h-12 w-12 rounded-full border border-emerald-200 flex items-center justify-center bg-emerald-50/50 text-emerald-600 shadow-inner">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">No Resume Uploaded Yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Upload a resume file on the left and click "Analyze Resume" to view insights.</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

    </div>
  );
}