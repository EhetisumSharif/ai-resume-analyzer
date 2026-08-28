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
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 text-slate-100 font-sans antialiased flex items-center justify-center p-0 md:p-6 relative overflow-hidden">

      {/* Background Decorative Glow Elements */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-5xl bg-slate-900/80 backdrop-blur-2xl rounded-none md:rounded-3xl shadow-2xl border-0 md:border border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px] z-10">

        {/* Left Panel - Deep Dark Branding */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white relative border-r border-slate-800/80">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="flex items-center space-x-3 relative z-10">
            <div className="h-10 w-10 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <span className="text-white font-black text-lg">R</span>
            </div>
            <span className="text-sm font-extrabold tracking-tight text-white">ResumeAI <span className="text-emerald-400">Pro</span></span>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-black tracking-widest uppercase">
              <span>✨ AI Powered Intelligence</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
              Smart Resume Analysis & Matching.
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs">
              Evaluate resumes against target job descriptions instantly with precision AI insights and modern scoring metrics.
            </p>
          </div>

          <div className="text-[10px] tracking-widest text-slate-500 relative z-10 font-mono">
            SECURE AUTHENTICATION // 2026
          </div>
        </div>

        {/* Right Authentication Form */}
        <div className="col-span-1 lg:col-span-7 p-8 md:p-16 flex flex-col justify-center bg-slate-900/50 backdrop-blur-md">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-8">
              <h3 className="text-2xl font-black text-white tracking-tight">
                {isSignUpView ? "Create Account" : "Welcome Back"}
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                {isSignUpView ? "Register your details to start analyzing resumes." : "Sign in to access your evaluation dashboard."}
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-2xl flex items-center space-x-2 font-medium">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-2xl flex items-center space-x-2 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUpView && (
                <div>
                  <label className="block text-[11px] font-black text-slate-300 uppercase tracking-wider mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all shadow-inner"
                    placeholder="Ehetisum Sharif"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-black text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all shadow-inner"
                  placeholder="name@domain.com"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-300 uppercase tracking-wider mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all shadow-inner"
                  placeholder="••••••••"
                />
              </div>

              {isSignUpView && (
                <div>
                  <label className="block text-[11px] font-black text-slate-300 uppercase tracking-wider mb-2">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all shadow-inner"
                    placeholder="••••••••"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-4 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-600/30 active:scale-[0.98] cursor-pointer"
              >
                {isSignUpView ? "Create Account" : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => { setIsSignUpView(!isSignUpView); setError(''); setSuccess(''); }}
                className="text-xs text-slate-400 hover:text-emerald-400 transition-colors font-bold underline underline-offset-4 cursor-pointer"
              >
                {isSignUpView ? "Already have an account? Sign In" : "New user? Create an account"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}