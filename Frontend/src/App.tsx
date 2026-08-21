import React, { useState } from 'react';
import { useAuthStore } from './store/authStore';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';

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
        setError("Passwords do not match.");
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
        setError(res.message);
      }
    }
  };

  if (isLoggedIn && currentUser) {
    if (currentUser.role === 'Admin') {
      return <AdminDashboard onLogout={logout} />;
    }
    return <Dashboard onLogout={logout} />;
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans antialiased flex items-center justify-center p-3 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-[#0b0f19] rounded-2xl md:rounded-3xl shadow-2xl border border-slate-900/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[500px] sm:min-h-[600px] lg:min-h-[650px]">
        
        {/* Left Panel - Hidden on Mobile, Visible on Desktop */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 xl:p-12 bg-gradient-to-br from-[#0f172a] via-[#0b0f19] to-[#020617] relative border-b lg:border-b-0 lg:border-r border-slate-900">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center space-x-3 relative z-10">
            <div className="h-8 w-8 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <span className="text-base font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">ResumeIntellect</span>
          </div>

          <div className="space-y-4 sm:space-y-6 relative z-10 my-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              Improve Your Resume with AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xs">
              Upload your resume and get instant feedback to land more interviews.
            </p>
          </div>
          <div />
        </div>

        {/* Right Authentication Form - Responsive for Mobile & Tablet */}
        <div className="col-span-1 lg:col-span-7 p-6 sm:p-10 md:p-14 flex flex-col justify-center bg-[#0b0f19]">
          <div className="max-w-md w-full mx-auto">
            
            {/* Mobile Brand Header */}
            <div className="flex lg:hidden items-center space-x-3 mb-6">
              <div className="h-8 w-8 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </div>
              <span className="text-base font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">ResumeIntellect</span>
            </div>

            <div className="mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {isSignUpView ? "Create Your Account" : "Log In"}
              </h3>
              <p className="text-xs text-slate-400 mt-1 sm:mt-2">
                {isSignUpView ? "Sign up to get started." : "Log in to check your resume."}
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 sm:p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-5 p-3 sm:p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUpView && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 sm:py-3 bg-[#030712] border border-slate-800/80 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" placeholder="Your Name" />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 sm:py-3 bg-[#030712] border border-slate-800/80 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" placeholder="name@domain.com" />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 sm:py-3 bg-[#030712] border border-slate-800/80 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" placeholder="••••••••" />
              </div>

              {isSignUpView && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Confirm Password</label>
                  <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2.5 sm:py-3 bg-[#030712] border border-slate-800/80 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all" placeholder="••••••••" />
                </div>
              )}

              <button type="submit" className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-[0.99]">
                {isSignUpView ? "Create Account" : "Log In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button type="button" onClick={() => { setIsSignUpView(!isSignUpView); setError(''); setSuccess(''); }} className="text-xs text-slate-400 hover:text-indigo-400 transition-colors font-medium underline underline-offset-4">
                {isSignUpView ? "Already have an account? Log in" : "New here? Create an account"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}