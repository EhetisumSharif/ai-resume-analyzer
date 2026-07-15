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
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans antialiased flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#0b0f19] border-b md:border-b-0 md:border-r border-slate-900 flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          <div className="flex items-center space-x-3">
            <div className="h-7 w-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="text-sm font-bold tracking-tight text-white">Root Authority</span>
          </div>
          
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('console')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${activeTab === 'console' ? 'bg-slate-900 border border-slate-800 text-indigo-400' : 'text-slate-400 hover:bg-slate-900/40 border border-transparent'}`}
            >
              <span>Admin Console</span>
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${activeTab === 'security' ? 'bg-slate-900 border border-slate-800 text-indigo-400' : 'text-slate-400 hover:bg-slate-900/40 border border-transparent'}`}
            >
              <span>Security Settings</span>
            </button>
          </nav>
        </div>
        
        <button onClick={onLogout} className="w-full mt-6 py-2.5 bg-slate-900 hover:bg-rose-950/20 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900/30 rounded-xl text-xs font-semibold tracking-wide transition-all">
          Terminate Core Session
        </button>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-[#0b0f19] border-b border-slate-900 px-8 flex items-center justify-between">
          <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Management Node // {activeTab === 'console' ? 'System Control' : 'Credential Workspace'}
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 max-w-6xl w-full mx-auto space-y-8">
          
          {activeTab === 'console' ? (
            <>
              {/* Statistics Panel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0b0f19] border border-slate-900 p-5 rounded-2xl">
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Total Registered Users</div>
                  <div className="text-2xl font-bold text-white mt-2 font-mono">{registeredUsers.length}</div>
                </div>
                <div className="bg-[#0b0f19] border border-slate-900 p-5 rounded-2xl">
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Total Resumes Analyzed</div>
                  <div className="text-2xl font-bold text-white mt-2 font-mono">1,424</div>
                </div>
                <div className="bg-[#0b0f19] border border-slate-900 p-5 rounded-2xl">
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Average ATS Score</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-2 font-mono">74.8%</div>
                </div>
                <div className="bg-[#0b0f19] border border-slate-900 p-5 rounded-2xl">
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Active User Sessions</div>
                  <div className="text-2xl font-bold text-indigo-400 mt-2 font-mono">32</div>
                </div>
              </div>

              {/* User Data Table Component */}
              <div className="bg-[#0b0f19] border border-slate-900 rounded-2xl shadow-xl overflow-hidden p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white">System Operator Matrix</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">Search, filter roles, and toggle user environmental clearance states.</p>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search database nodes..." 
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="px-4 py-2 bg-[#030712] border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-full sm:w-64 transition-all"
                  />
                </div>

                <div className="overflow-x-auto border border-slate-900 rounded-xl bg-[#030712]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-900 text-[10px] font-bold tracking-wider text-slate-500 uppercase bg-[#0b0f19]/30">
                        <th className="p-4">Identity Parameters</th>
                        <th className="p-4">Access Protocol Role</th>
                        <th className="p-4">Environmental State</th>
                        <th className="p-4 text-right">System Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60 text-xs">
                      {currentUsers.map((user) => (
                        <tr key={user.email} className="hover:bg-slate-900/20 transition-colors">
                          <td className="p-4">
                            <div className="font-semibold text-slate-200">{user.name || 'Anonymous'}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5 font-mono">{user.email}</div>
                          </td>
                          <td className="p-4 font-mono">
                            <span className={`px-2 py-0.5 rounded text-[10px] ${user.role === 'Admin' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-800 text-slate-400'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${user.status === 'Active' ? 'bg-emerald-500/5 text-emerald-400' : 'bg-rose-500/5 text-rose-400'}`}>
                              <span className={`h-1 w-1 rounded-full ${user.status === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                              <span>{user.status}</span>
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {user.role !== 'Admin' ? (
                              <button 
                                onClick={() => toggleUserStatus(user.email)}
                                className={`px-3 py-1.5 rounded-lg font-semibold text-[10px] uppercase tracking-wider transition-all border ${user.status === 'Active' ? 'bg-rose-950/20 border-rose-900/30 text-rose-400 hover:bg-rose-900/30' : 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400 hover:bg-emerald-900/30'}`}
                              >
                                {user.status === 'Active' ? 'Suspend Node' : 'Authorize Node'}
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-600 font-mono italic">Protected Node</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {currentUsers.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-500 font-mono text-[11px]">
                            No data segments matching query constraints.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-900/40 text-[11px] font-mono">
                    <div className="text-slate-500">
                      Showing rows {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length}
                    </div>
                    <div className="flex items-center space-x-1">
                      <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="px-2.5 py-1.5 bg-[#030712] border border-slate-800 hover:border-slate-700 disabled:opacity-30 rounded-lg text-slate-400 font-bold">&lt;</button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button key={page} onClick={() => handlePageChange(page)} className={`px-2.5 py-1.5 rounded-lg border ${currentPage === page ? 'bg-indigo-600 border-indigo-500 text-white font-bold' : 'bg-[#030712] border-slate-800 text-slate-400'}`}>{page}</button>
                      ))}
                      <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className="px-2.5 py-1.5 bg-[#030712] border border-slate-800 hover:border-slate-700 disabled:opacity-30 rounded-lg text-slate-400 font-bold">&gt;</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Console System Log Terminal */}
              <div className="bg-[#0b0f19] border border-slate-900 p-6 rounded-2xl shadow-xl space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">System Telemetry Log</h3>
                <div className="bg-[#030712] border border-slate-900 p-4 rounded-xl font-mono text-[11px] text-slate-400 space-y-2 h-36 overflow-y-auto">
                  <p className="text-slate-500">[2026-07-15 14:10:02] <span className="text-emerald-500">INFO</span>: AI Model core infrastructure optimized. Pipeline ready.</p>
                  <p className="text-slate-500">[2026-07-15 14:10:35] <span className="text-emerald-500">INFO</span>: Secure login session established for application core.</p>
                </div>
              </div>
            </>
          ) : (
            /* Settings Management Panel */
            <div className="bg-[#0b0f19] border border-slate-900 rounded-2xl shadow-xl p-6 max-w-xl">
              <div className="mb-6">
                <h3 className="text-base font-bold text-white">Security Settings</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Modify root authorization email structure and primary access passkey.</p>
              </div>

              {secError && (
                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">{secError}</div>
              )}
              {secSuccess && (
                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl">{secSuccess}</div>
              )}

              <form onSubmit={handleSecurityUpdate} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Authority Email</label>
                  <input 
                    type="email" 
                    required 
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#030712] border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">New Security Passkey</label>
                  <input 
                    type="password" 
                    required 
                    placeholder="Minimum 6 characters"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#030712] border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Confirm New Passkey</label>
                  <input 
                    type="password" 
                    required 
                    placeholder="Repeat new passkey"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#030712] border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all">
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