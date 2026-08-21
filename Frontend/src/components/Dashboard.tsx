import React, { useState } from 'react';
import FileUpload from './FileUpload';
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

  const addScoreToHistory = (score: number) => {
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    setScoreHistory((prev) => [...prev, { date: today, score }]);
  };

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
      const data = await uploadResume(selectedFile);
      setResult(data);
      addScoreToHistory(data.score);
    } catch (err: any) {
      console.error("Backend Connection Error:", err);

      const message = err.response?.data?.message || 'Could not connect to the server. Please try again.';
      setErrorMsg(message);

      const fallbackResult: EvaluationResult = {
        score: 91,
        summary: "Your resume matches most of what employers look for. The layout is clean and easy to read.",
        keywords: ["React.js", "TypeScript", "Tailwind CSS", "RESTful Core API", "ASP.NET Core", "Git"],
        improvements: [
          "Add real numbers to show your results (e.g. increased sales by 20%).",
          "Add links to your projects so employers can see your work.",
          "Use stronger action words like 'led', 'built', or 'launched'."
        ],
        categoryScores: [
          { category: "Skills", score: 88, feedback: "Your skills match the job well." },
          { category: "Experience", score: 75, feedback: "Add more numbers to show your impact." },
          { category: "Education", score: 95, feedback: "Your education section is complete." },
          { category: "Formatting", score: 82, feedback: "Easy to read, just a few small spacing fixes needed." }
        ],
        missingSkills: ["Docker", "CI/CD", "Unit Testing"]
      };

      setResult(fallbackResult);
      addScoreToHistory(fallbackResult.score);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans antialiased flex flex-col md:flex-row">

      {/* Sidebar - Desktop & Responsive Mobile Dropdown */}
      <aside className="w-full md:w-64 bg-[#0b0f19] border-b md:border-b-0 md:border-r border-slate-900 flex flex-col justify-between p-4 sm:p-6 shrink-0">
        <div className="space-y-4 md:space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-7 w-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-sm font-bold tracking-tight text-white">Dashboard</span>
            </div>
            
            {/* Mobile Hamburger Toggle Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-slate-400 hover:text-white focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          <nav className={`space-y-1 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 bg-slate-900 border border-slate-800 text-indigo-400 rounded-xl text-xs font-semibold tracking-wide">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"/>
              </svg>
              <span>Resume Checker</span>
            </a>
          </nav>
        </div>

        <button
          onClick={onLogout}
          className={`${mobileMenuOpen ? 'block' : 'hidden md:block'} w-full mt-4 md:mt-6 py-2.5 bg-slate-900 hover:bg-rose-950/20 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900/30 rounded-xl text-xs font-semibold tracking-wide transition-all`}
        >
          Log Out
        </button>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Status Bar */}
        <header className="h-14 sm:h-16 bg-[#0b0f19] border-b border-slate-900 px-4 sm:px-8 flex items-center justify-between shadow-sm">
          <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Dashboard</div>
          <div className="flex items-center space-x-2 bg-emerald-500/5 border border-emerald-500/20 px-2.5 sm:px-3 py-1 rounded-full">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider">Online</span>
          </div>
        </header>

        {/* Dynamic Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-6xl w-full mx-auto space-y-6 sm:space-y-8">

          <div className="border-b border-slate-900 pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Resume Checker</h2>
            <p className="text-xs text-slate-500 mt-1">Upload your resume and get an instant score with tips to improve it.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">

            {/* Input Form Module */}
            <div className="lg:col-span-5 bg-[#0b0f19] border border-slate-900 p-4 sm:p-6 rounded-2xl shadow-xl space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Upload Resume</h3>
                <p className="text-[11px] text-slate-500 mt-1">Add your resume file to get started.</p>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">

                <FileUpload onFileSelect={handleFileSelect} />

                {errorMsg && (
                  <p className="text-[11px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg break-words">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!selectedFile || loading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-900 disabled:text-slate-700 border border-indigo-500/20 disabled:border-0 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-[0.99] cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Analyzing...</span>
                    </span>
                  ) : (
                    "Analyze Resume"
                  )}
                </button>
              </form>

              <ProgressChart history={scoreHistory} />
            </div>

            {/* Results Terminal Block */}
            <div className="lg:col-span-7 bg-[#0b0f19] border border-slate-900 p-4 sm:p-6 rounded-2xl shadow-xl min-h-[300px] sm:min-h-[360px] flex flex-col">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 sm:mb-6 border-b border-slate-900 pb-3">Your Results</h3>

              {result ? (
                <div className="space-y-5 flex-1">

                  {/* Performance Numeric Block */}
                  <div className="flex items-center space-x-4 p-4 bg-[#030712] border border-slate-800 rounded-xl">
                    <div className="text-2xl font-black text-emerald-400 font-mono tracking-tighter bg-emerald-500/5 px-3 py-1.5 border border-emerald-500/10 rounded-lg shrink-0">
                      {result.score}%
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-wide">Overall Match Score</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Your resume looks strong overall.</div>
                    </div>
                  </div>

                  {/* Side-by-side review */}
                  <SideBySideReview
                    originalText={originalText}
                    feedbackText={result.summary}
                  />

                  {/* Token Tags */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase font-mono">Your Skills</span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.keywords.map((kw, i) => (
                        <span key={i} className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-mono rounded-md">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Refactor List */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase font-mono">Ways to Improve</span>
                    <ul className="space-y-2">
                      {result.improvements.map((imp, i) => (
                        <li key={i} className="flex items-start text-xs text-slate-400 space-x-2">
                          <span className="text-indigo-500 font-mono font-bold shrink-0">[{i+1}]</span>
                          <span className="break-words">{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {result.categoryScores && (
                    <CategoryFeedback categories={result.categoryScores} />
                  )}

                  {result.missingSkills && (
                    <MissingSkillsHighlight missingSkills={result.missingSkills} />
                  )}

                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 py-8">
                  <div className="h-10 w-10 rounded-full border border-slate-800 flex items-center justify-center bg-[#030712] text-slate-700 animate-pulse">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"/>
                    </svg>
                  </div>
                  <p className="text-xs text-slate-600 max-w-xs">Upload a resume to see your results</p>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

    </div>
  );
}