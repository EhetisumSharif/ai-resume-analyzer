import React, { useState } from 'react';
import { useAuthStore } from './store/authStore';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard'; // ১. ইমপোর্ট করো

export default function App() {
  const { isLoggedIn, currentUser, signUp, signIn, logout } = useAuthStore();
  const [isSignUpView, setIsSignUpView] = useState<boolean>(false);
  
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isSignUpView) {
      if (password !== confirmPassword) {
        setError("Passwords do not match."); // SRS 1.2
        return;
      }
      const res = signUp({ name, email, password });
      if (res.success) {
        setSuccess(res.message);
        setIsSignUpView(false);
        setName(''); setPassword(''); setConfirmPassword('');
      } else {
        setError(res.message);
      }
    } else {
      const res = signIn({ email, password });
      if (!res.success) {
        setError(res.message); // SRS 1.5
      }
    }
  };

  // ২. ডাইনামিক রোল বেসড রাউটিং লজিক (SRS 1.6, 1.7, 1.8)
  if (isLoggedIn && currentUser) {
    if (currentUser.role === 'Admin') {
      return <AdminDashboard onLogout={logout} />;
    }
    return <Dashboard onLogout={logout} />;
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans antialiased flex items-center justify-center p-0 md:p-6">
      <div className="w-full max-w-5xl bg-[#0b0f19] rounded-none md:rounded-3xl shadow-2xl border-0 md:border border-slate-900 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[650px]">
        
        {/* Left Panel */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 bg-gradient-to-br from-[#0f172a] via-[#0b0f19] to-[#020617] relative border-r border-slate-900">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
          <div className="flex items-center space-x-3 relative z-10">
            <div className="h-8 w-8 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <span className="text-base font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">ResumeIntellect</span>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-semibold tracking-wider uppercase">
              System Node v2.4.0
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight leading-tight">
              Next-Gen Application Parsing Infrastructure.
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Deconstruct asynchronous applicant documentation down to base token key structures with zero system latency.
            </p>
          </div>
          <div className="text-[10px] tracking-wider text-slate-600 relative z-10 font-mono">SECURE ACCESS PROTOCOL // 2026</div>
        </div>

        {/* Right Authentication Form */}
        <div className="col-span-1 lg:col-span-7 p-8 md:p-16 flex flex-col justify-center bg-[#0b0f19]">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {isSignUpView ? "Create Architecture Profile" : "System Authentication"}
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                {isSignUpView ? "Register structural credentials for access authorization." : "Initialize secure session to access production parsing environments."}
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUpView && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Operator Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-[#030712] border border-slate-800/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" placeholder="Your Name" />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Identification Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-[#030712] border border-slate-800/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" placeholder="name@domain.com" />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Access Passkey</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-[#030712] border border-slate-800/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" placeholder="••••••••" />
              </div>

              {isSignUpView && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Confirm Passkey</label>
                  <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 bg-[#030712] border border-slate-800/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" placeholder="••••••••" />
                </div>
              )}

              <button type="submit" className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-[0.99]">
                {isSignUpView ? "Execute Profile Registration" : "Establish Secure Connection"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button type="button" onClick={() => { setIsSignUpView(!isSignUpView); setError(''); setSuccess(''); }} className="text-xs text-slate-400 hover:text-indigo-400 transition-colors font-medium underline underline-offset-4">
                {isSignUpView ? "Already have an account? Sign In" : "New operator? Create an account"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}