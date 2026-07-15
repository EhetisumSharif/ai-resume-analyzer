import React, { useState } from 'react';

interface DashboardProps {
  onLogout: () => void;
}

interface EvaluationResult {
  score: number;
  summary: string;
  keywords: string[];
  improvements: string[];
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResult({
        score: 91,
        summary: "Profile data array registers inside top tier percentiles. Layout configuration demonstrates structured semantic taxonomy. Recommended actions require refining dynamic impact parameters.",
        keywords: ["React.js", "TypeScript", "Tailwind CSS", "RESTful Core API", "Node.js Architecture", "Git Version Control"],
        improvements: [
          "Inject precise numerical analytics into historical performance metrics.",
          "Expose relative production hyperlinks within core repository modules.",
          "Strengthen imperative operational verbs across asset descriptions."
        ]
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans antialiased flex flex-col md:flex-row">
      
      {/* Premium Flat Sidebar */}
      <aside className="w-full md:w-64 bg-[#0b0f19] border-b md:border-b-0 md:border-r border-slate-900 flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          <div className="flex items-center space-x-3">
            <div className="h-7 w-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-sm font-bold tracking-tight text-white">System Panel</span>
          </div>
          
          <nav className="space-y-1">
            <a href="#" className="flex items-center space-x-3 px-3 py-2 bg-slate-900 border border-slate-800 text-indigo-400 rounded-xl text-xs font-semibold tracking-wide">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"/>
              </svg>
              <span>Parser Terminal</span>
            </a>
          </nav>
        </div>

        <button 
          onClick={onLogout}
          className="w-full mt-6 py-2.5 bg-slate-900 hover:bg-rose-950/20 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900/30 rounded-xl text-xs font-semibold tracking-wide transition-all"
        >
          Disconnect Stream
        </button>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Horizontal Status Bar */}
        <header className="h-16 bg-[#0b0f19] border-b border-slate-900 px-8 flex items-center justify-between shadow-sm">
          <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Analytical Engine</div>
          <div className="flex items-center space-x-2 bg-emerald-500/5 border border-emerald-500/20 px-3 py-1 rounded-full">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider">Node Active</span>
          </div>
        </header>

        {/* Dynamic Workspace Container */}
        <main className="flex-1 p-6 lg:p-10 max-w-6xl w-full mx-auto space-y-8">
          
          <div className="border-b border-slate-900 pb-4">
            <h2 className="text-xl font-bold text-white tracking-tight">ATS Matrix Evaluation</h2>
            <p className="text-xs text-slate-500 mt-1">Expose file layouts to scanning algorithms to trace data structural index ratings.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Input Form Module */}
            <div className="lg:col-span-5 bg-[#0b0f19] border border-slate-900 p-6 rounded-2xl shadow-xl space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">File Ingestion</h3>
                <p className="text-[11px] text-slate-500 mt-1">Direct verification mapping for pipeline records.</p>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">
                <div className="group border border-slate-800 hover:border-slate-700 rounded-xl p-8 text-center transition-all relative bg-[#030712] flex flex-col items-center justify-center min-h-[160px]">
                  <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  <div className="h-10 w-10 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center mb-3 group-hover:border-indigo-500/30 transition-colors">
                    <svg className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-slate-300 max-w-[200px] truncate px-2">
                    {file ? file.name : "Inject profile record"}
                  </p>
                  {!file && <p className="text-[10px] text-slate-600 mt-1">PDF, DOCX formats verified</p>}
                </div>

                <button
                  type="submit"
                  disabled={!file || loading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-900 disabled:text-slate-700 border border-indigo-500/20 disabled:border-0 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-[0.99]"
                >
                  {loading ? "Compiling Evaluation Matrix..." : "Initialize Verification"}
                </button>
              </form>
            </div>

            {/* Results Terminal Block */}
            <div className="lg:col-span-7 bg-[#0b0f19] border border-slate-900 p-6 rounded-2xl shadow-xl min-h-[360px] flex flex-col">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-900 pb-3">Operational Log</h3>

              {result ? (
                <div className="space-y-5 flex-1">
                  
                  {/* Performance Numeric Block */}
                  <div className="flex items-center space-x-4 p-4 bg-[#030712] border border-slate-800 rounded-xl">
                    <div className="text-2xl font-black text-emerald-400 font-mono tracking-tighter bg-emerald-500/5 px-3 py-1.5 border border-emerald-500/10 rounded-lg">
                      {result.score}%
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-wide">Compliance Index Matching</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Structure registers within optimal operating metrics.</div>
                    </div>
                  </div>

                  {/* Text Summary */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase font-mono">Telemetry Feedback</span>
                    <p className="text-xs text-slate-300 leading-relaxed bg-[#030712]/50 p-3 rounded-lg border border-slate-850/60">
                      {result.summary}
                    </p>
                  </div>

                  {/* Token Tags */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase font-mono">Identified Assets</span>
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
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase font-mono">Optimization Sequence</span>
                    <ul className="space-y-2">
                      {result.improvements.map((imp, i) => (
                        <li key={i} className="flex items-start text-xs text-slate-400 space-x-2">
                          <span className="text-indigo-500 font-mono font-bold">[{i+1}]</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="h-10 w-10 rounded-full border border-slate-800 flex items-center justify-center bg-[#030712] text-slate-700 animate-pulse">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"/>
                    </svg>
                  </div>
                  <p className="text-xs text-slate-600 max-w-xs font-mono">SYSTEM AWAITING DOCUMENT FEED VARIABLE...</p>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
      
    </div>
  );
}