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
    <div className="min-h-screen bg-emerald-50/40 text-slate-800 font-sans antialiased flex flex-col md:flex-row">

      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-white/90 backdrop-blur-md border-b md:border-b-0 md:border-r border-emerald-100 flex flex-col justify-between p-6 shrink-0 shadow-sm">
        <div className="space-y-8">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-600/20">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900">Root Authority</span>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('console')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${activeTab === 'console' ? 'bg-emerald-100/60 border border-emerald-200 text-emerald-800 shadow-xs' : 'text-slate-600 hover:bg-emerald-50/50 border border-transparent'}`}
            >
              <span>Admin Console</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${activeTab === 'security' ? 'bg-emerald-100/60 border border-emerald-200 text-emerald-800 shadow-xs' : 'text-slate-600 hover:bg-emerald-50/50 border border-transparent'}`}
            >
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <button onClick={onLogout} className="w-full mt-6 py-2.5 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer">
          Terminate Core Session
        </button>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-emerald-100 px-8 flex items-center justify-between shadow-xs">
          <div className="text-xs font-bold tracking-wider text-emerald-800/80 uppercase">
            Management Node // {activeTab === 'console' ? 'System Control' : 'Credential Workspace'}
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 max-w-6xl w-full mx-auto space-y-8">

          {activeTab === 'console' ? (
            <>
              {/* Statistics Panel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/90 backdrop-blur-sm border border-emerald-100 p-5 rounded-2xl shadow-sm">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Registered Users</div>
                  <div className="text-2xl font-bold text-slate-900 mt-2">{registeredUsers.length}</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm border border-emerald-100 p-5 rounded-2xl shadow-sm">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Resumes Analyzed</div>
                  <div className="text-2xl font-bold text-slate-900 mt-2">1,424</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm border border-emerald-100 p-5 rounded-2xl shadow-sm">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average ATS Score</div>
                  <div className="text-2xl font-bold text-emerald-600 mt-2">74.8%</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm border border-emerald-100 p-5 rounded-2xl shadow-sm">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active User Sessions</div>
                  <div className="text-2xl font-bold text-emerald-600 mt-2">32</div>
                </div>
              </div>

              {/* User Data Table Component */}
              <div className="bg-white/90 backdrop-blur-sm border border-emerald-100 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">System Operator Matrix</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">Search, filter roles, and toggle user environmental clearance states.</p>
                  </div>
                  <input
                    type="text"
                    placeholder="Search database nodes..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="px-4 py-2 bg-emerald-50/30 border border-emerald-200/60 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 w-full sm:w-64 transition-all"
                  />
                </div>

                <div className="overflow-x-auto border border-emerald-100 rounded-xl bg-white shadow-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-emerald-100 text-[10px] font-bold tracking-wider text-slate-500 uppercase bg-emerald-50/50">
                        <th className="p-4">Identity Parameters</th>
                        <th className="p-4">Access Protocol Role</th>
                        <th className="p-4">Environmental State</th>
                        <th className="p-4 text-right">System Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-50 text-xs">
                      {currentUsers.map((user, index) => (
                        <tr key={`${user.email}-${index}`} className="hover:bg-emerald-50/30 transition-colors">
                          <td className="p-4">
                            <div className="font-semibold text-slate-800">{user.name || 'Anonymous'}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{user.email}</div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold ${user.role === 'Admin' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                              <span>{user.status}</span>
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {user.role !== 'Admin' ? (
                              <button
                                onClick={() => toggleUserStatus(user.email)}
                                className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all border cursor-pointer ${user.status === 'Active' ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'}`}
                              >
                                {user.status === 'Active' ? 'Suspend Node' : 'Authorize Node'}
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">Protected Node</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {currentUsers.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-400 text-xs">
                            No data segments matching query constraints.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-2 border-t border-emerald-100 text-xs">
                    <div className="text-slate-500">
                      Showing rows {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length}
                    </div>
                    <div className="flex items-center space-x-1">
                      <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="px-3 py-1.5 bg-white border border-slate-200 hover:border-emerald-300 disabled:opacity-30 rounded-lg text-slate-600 font-bold cursor-pointer">&lt;</button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-1.5 rounded-lg border cursor-pointer ${currentPage === page ? 'bg-emerald-600 border-emerald-600 text-white font-bold shadow-xs' : 'bg-white border-slate-200 text-slate-600'}`}>{page}</button>
                      ))}
                      <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className="px-3 py-1.5 bg-white border border-slate-200 hover:border-emerald-300 disabled:opacity-30 rounded-lg text-slate-600 font-bold cursor-pointer">&gt;</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Console System Log Terminal */}
              <div className="bg-white/90 backdrop-blur-sm border border-emerald-100 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-800/80">System Telemetry Log</h3>
                <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-xl text-xs text-slate-700 space-y-2 h-36 overflow-y-auto">
                  <p className="text-slate-600">[2026-07-15 14:10:02] <span className="text-emerald-600 font-bold">INFO</span>: AI Model core infrastructure optimized. Pipeline ready.</p>
                  <p className="text-slate-600">[2026-07-15 14:10:35] <span className="text-emerald-600 font-bold">INFO</span>: Secure login session established for application core.</p>
                </div>
              </div>
            </>
          ) : (
            /* Settings Management Panel */
            <div className="bg-white/90 backdrop-blur-sm border border-emerald-100 rounded-2xl shadow-sm p-8 max-w-xl">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">Security Settings</h3>
                <p className="text-xs text-slate-500 mt-0.5">Modify root authorization email structure and primary access passkey.</p>
              </div>

              {secError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl font-medium">{secError}</div>
              )}
              {secSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-medium">{secSuccess}</div>
              )}

              <form onSubmit={handleSecurityUpdate} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Authority Email</label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-emerald-50/30 border border-emerald-200/60 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">New Security Passkey</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 6 characters"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-emerald-50/30 border border-emerald-200/60 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Confirm New Passkey</label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat new passkey"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-emerald-50/30 border border-emerald-200/60 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-600/20 cursor-pointer">
                  Commit Security Changes
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}