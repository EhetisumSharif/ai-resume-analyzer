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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isSignUpView) {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      const res = await signUp({ name, email, password });
      if (res.success) {
        setSuccess(res.message);
        setIsSignUpView(false);
        setName('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(res.message);
      }
    } else {
      const res = await signIn({ email, password });
      if (!res.success) {
        setError(res.message);
      }
    }
  };

  // রোল বেসড রাউটিং লজিক
  if (isLoggedIn && currentUser) {
    if (currentUser.role === 'Admin') {
      return <AdminDashboard onLogout={logout} />;
    }
    return <Dashboard onLogout={logout} />;
  }

  return (
    <div className="min-h-screen bg-emerald-50/40 text-slate-800 font-sans antialiased flex items-center justify-center p-0 md:p-6">
      <div className="w-full max-w-5xl bg-white rounded-none md:rounded-3xl shadow-2xl border-0 md:border border-emerald-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[650px]">

        {/* Left Panel - Greenish Gradient Branding */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white relative border-r border-emerald-100">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="flex items-center space-x-3 relative z-10">
            <div className="h-8 w-8 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <span className="text-base font-bold tracking-tight text-white">ResumeAI Pro</span>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-semibold tracking-wider uppercase">
              AI Powered Intelligence
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight leading-tight">
              Smart Resume Analysis & Matching.
            </h2>
            <p className="text-xs text-emerald-100/80 leading-relaxed max-w-xs">
              Evaluate resumes against target job descriptions instantly with precision AI insights and modern scoring metrics.
            </p>
          </div>
          <div className="text-[10px] tracking-wider text-emerald-300/60 relative z-10 font-mono">SECURE AUTHENTICATION // 2026</div>
        </div>

        {/* Right Authentication Form */}
        <div className="col-span-1 lg:col-span-7 p-8 md:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                {isSignUpView ? "Create Account" : "Welcome Back"}
              </h3>
              <p className="text-xs text-slate-500 mt-2">
                {isSignUpView ? "Register your details to start analyzing resumes." : "Sign in to access your evaluation dashboard."}
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl flex items-center space-x-2 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center space-x-2 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUpView && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-emerald-50/30 border border-emerald-200/60 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition-all" placeholder="Your Name" />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-emerald-50/30 border border-emerald-200/60 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition-all" placeholder="name@domain.com" />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-emerald-50/30 border border-emerald-200/60 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition-all" placeholder="••••••••" />
              </div>

              {isSignUpView && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Confirm Password</label>
                  <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 bg-emerald-50/30 border border-emerald-200/60 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition-all" placeholder="••••••••" />
                </div>
              )}

              <button type="submit" className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-[0.99] cursor-pointer">
                {isSignUpView ? "Create Account" : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button type="button" onClick={() => { setIsSignUpView(!isSignUpView); setError(''); setSuccess(''); }} className="text-xs text-slate-500 hover:text-emerald-600 transition-colors font-semibold underline underline-offset-4 cursor-pointer">
                {isSignUpView ? "Already have an account? Sign In" : "New user? Create an account"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}