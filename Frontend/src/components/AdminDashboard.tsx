import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { registeredUsers, currentUser, toggleUserStatus, updateAdminCredentials } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'console' | 'security'>('console');

  // Console Tab States
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 5;

  // Security Tab States
  const [adminEmail, setAdminEmail] = useState<string>(currentUser?.email || '');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [secError, setSecError] = useState<string>('');
  const [secSuccess, setSecSuccess] = useState<string>('');

  // Filtering System
  const filteredUsers = registeredUsers.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSecurityUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSecError('');
    setSecSuccess('');

    if (adminPassword !== confirmPassword) {
      setSecError("Passwords do not match.");
      return;
    }

    if (adminPassword.length < 6) {
      setSecError("Password must be at least 6 characters long.");
      return;
    }

    const res = updateAdminCredentials(adminEmail, adminPassword);
    if (res.success) {
      setSecSuccess(res.message);
      setAdminPassword('');
      setConfirmPassword('');
    } else {
      setSecError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 text-slate-100 font-sans antialiased flex flex-col md:flex-row relative overflow-hidden">

      {/* Background Decorative Glow Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Admin Sidebar */}
      <aside className="w-full md:w-72 bg-slate-900/80 backdrop-blur-xl border-b md:border-b-0 md:border-r border-slate-800/80 flex flex-col justify-between p-6 shrink-0 shadow-2xl z-10">
        <div className="space-y-8">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <span className="text-white font-black text-sm">A</span>
            </div>
            <div>
              <span className="text-sm font-extrabold tracking-tight text-white block">Root Authority</span>
              <span className="text-[10px] text-slate-400">Admin Control Panel</span>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('console')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all cursor-pointer ${activeTab === 'console' ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-300 shadow-inner' : 'text-slate-400 hover:bg-slate-800/50 border border-transparent hover:text-slate-200'}`}
            >
              <span>📊 Admin Console</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all cursor-pointer ${activeTab === 'security' ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-300 shadow-inner' : 'text-slate-400 hover:bg-slate-800/50 border border-transparent hover:text-slate-200'}`}
            >
              <span>⚙️ Security Settings</span>
            </button>
          </nav>
        </div>

        <button
          onClick={onLogout}
          className="w-full mt-6 py-3 bg-slate-800/80 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 rounded-2xl text-xs font-bold tracking-wide transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2"
        >
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <header className="h-16 bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 px-8 flex items-center justify-between shadow-sm">
          <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">
            Management Node // {activeTab === 'console' ? 'System Control' : 'Credential Workspace'}
          </div>
          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full shadow-sm">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider">Root Access Active</span>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 max-w-6xl w-full mx-auto space-y-8">

          {activeTab === 'console' ? (
            <>
              {/* Statistics Panel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-5 rounded-3xl shadow-xl">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Registered Users</div>
                  <div className="text-3xl font-black text-white mt-2">{registeredUsers.length}</div>
                </div>
                <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-5 rounded-3xl shadow-xl">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Resumes Analyzed</div>
                  <div className="text-3xl font-black text-white mt-2">1,424</div>
                </div>
                <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-5 rounded-3xl shadow-xl">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Average ATS Score</div>
                  <div className="text-3xl font-black text-emerald-400 mt-2">74.8%</div>
                </div>
                <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-5 rounded-3xl shadow-xl">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active User Sessions</div>
                  <div className="text-3xl font-black text-emerald-400 mt-2">32</div>
                </div>
              </div>

              {/* User Data Table Component */}
              <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-base font-black text-white">System Operator Matrix</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Search, filter roles, and toggle user environmental clearance states.</p>
                  </div>
                  <input
                    type="text"
                    placeholder="Search database nodes..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 w-full sm:w-72 transition-all shadow-inner"
                  />
                </div>

                <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950/50 shadow-inner">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] font-black tracking-widest text-slate-400 uppercase bg-slate-900/50">
                        <th className="p-4">Identity Parameters</th>
                        <th className="p-4">Access Protocol Role</th>
                        <th className="p-4">Environmental State</th>
                        <th className="p-4 text-right">System Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-xs">
                      {currentUsers.map((user, index) => (
                        <tr key={`${user.email}-${index}`} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-white">{user.name || 'Anonymous'}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{user.email}</div>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-xl text-[10px] font-black ${user.role === 'Admin' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                              <span>{user.status}</span>
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {user.role !== 'Admin' ? (
                              <button
                                onClick={() => toggleUserStatus(user.email)}
                                className={`px-3.5 py-2 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all border cursor-pointer shadow-sm ${user.status === 'Active' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'}`}
                              >
                                {user.status === 'Active' ? 'Suspend Node' : 'Authorize Node'}
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-500 italic">Protected Node</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {currentUsers.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-10 text-center text-slate-500 text-xs font-medium">
                            No data segments matching query constraints.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                    <div className="text-slate-400 font-medium">
                      Showing rows {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length}
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 disabled:opacity-30 rounded-xl text-slate-300 font-bold cursor-pointer">&lt;</button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button key={page} onClick={() => handlePageChange(page)} className={`px-3.5 py-1.5 rounded-xl border cursor-pointer font-bold ${currentPage === page ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/30' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}`}>{page}</button>
                      ))}
                      <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 disabled:opacity-30 rounded-xl text-slate-300 font-bold cursor-pointer">&gt;</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Console System Log Terminal */}
              <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-2xl space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400">System Telemetry Log</h3>
                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-xs text-slate-300 space-y-2 h-36 overflow-y-auto font-mono shadow-inner">
                  <p className="text-slate-400">[2026-07-15 14:10:02] <span className="text-emerald-400 font-bold">INFO</span>: AI Model core infrastructure optimized. Pipeline ready.</p>
                  <p className="text-slate-400">[2026-07-15 14:10:35] <span className="text-emerald-400 font-bold">INFO</span>: Secure login session established for application core.</p>
                </div>
              </div>
            </>
          ) : (
            /* Settings Management Panel */
            <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 max-w-xl">
              <div className="mb-6">
                <h3 className="text-lg font-black text-white">Security Settings</h3>
                <p className="text-xs text-slate-400 mt-0.5">Modify root authorization email structure and primary access passkey.</p>
              </div>

              {secError && (
                <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-2xl font-medium">{secError}</div>
              )}
              {secSuccess && (
                <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-2xl font-medium">{secSuccess}</div>
              )}

              <form onSubmit={handleSecurityUpdate} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-300 uppercase tracking-wider mb-2">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 6 characters"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-300 uppercase tracking-wider mb-2">Confirm Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat new passkey"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-emerald-600/30 active:scale-[0.98] cursor-pointer"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}