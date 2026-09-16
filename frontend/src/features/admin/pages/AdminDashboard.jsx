import { useState, useEffect } from "react";
import { getAdminUsersApi, toggleBanApi, getAdminReportsApi, updateReportStatusApi } from "../services/admin.service";
import useAuth from "../../auth/hooks/useAuth";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("reports"); // 'reports' or 'users'
  
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === "users") {
          const res = await getAdminUsersApi();
          setUsers(res.data);
        } else {
          const res = await getAdminReportsApi();
          setReports(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  // Handle Ban Toggle
  const handleBanToggle = async (userId) => {
    try {
      const res = await toggleBanApi(userId);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: res.isBanned } : u));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update ban status");
    }
  };

  // Handle Report Status Update
  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      await updateReportStatusApi(reportId, newStatus);
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Failed to update report status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex fixed h-full z-10">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-black text-indigo-600 tracking-tight">Admin<span className="text-gray-900">Panel</span></h1>
          <p className="text-xs text-gray-500 font-medium mt-1">Logged in as <strong className="font-bold">{user?.name}</strong></p>
        </div>
        
        <div className="flex-1 px-4 py-6 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === "reports" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            Manage Reports
          </button>
          
          <button 
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === "users" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            Manage Users
          </button>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-600 font-bold hover:bg-red-50 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Exit Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {activeTab === "reports" ? "Community Reports" : "User Database"}
          </h2>
          <p className="text-gray-500 mt-1">
            {activeTab === "reports" ? "Review and resolve user-submitted reports." : "Manage user accounts and platform access."}
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-8 w-8 text-indigo-600 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              
              {/* REPORTS TABLE */}
              {activeTab === "reports" && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                      <th className="p-4">Reported User</th>
                      <th className="p-4">Reported By</th>
                      <th className="p-4">Reason & Details</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reports.length === 0 ? (
                      <tr><td colSpan="5" className="p-8 text-center text-gray-500">No reports found.</td></tr>
                    ) : (
                      reports.map(report => (
                        <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 font-bold text-gray-900">{report.Reported?.name}</td>
                          <td className="p-4 text-sm text-gray-600">{report.Reporter?.name}</td>
                          <td className="p-4 max-w-xs">
                            <p className="font-bold text-sm text-gray-800">{report.reason}</p>
                            <p className="text-xs text-gray-500 truncate">{report.description || "No additional details"}</p>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                              report.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {report.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {report.status === 'pending' && (
                              <div className="flex justify-end gap-2">
                                <button onClick={() => handleStatusUpdate(report.id, 'resolved')} className="text-xs font-bold px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors border border-green-200">
                                  Resolve
                                </button>
                                <button onClick={() => handleStatusUpdate(report.id, 'reviewed')} className="text-xs font-bold px-3 py-1.5 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                                  Mark Reviewed
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {/* USERS TABLE */}
              {activeTab === "users" && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                      <th className="p-4">User</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Joined</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-gray-900 text-sm">{u.name}</div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                        </td>
                        <td className="p-4 text-sm font-medium text-gray-600 capitalize">{u.role}</td>
                        <td className="p-4 text-sm text-gray-600">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            u.isBanned ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {u.isBanned ? 'BANNED' : 'ACTIVE'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleBanToggle(u.id)}
                            disabled={u.id === user.id || u.role === 'admin'}
                            className={`text-xs font-bold px-4 py-1.5 rounded-lg transition-colors border ${
                              u.isBanned 
                                ? 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200' 
                                : 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200 disabled:opacity-50'
                            }`}
                          >
                            {u.isBanned ? 'Unban User' : 'Ban User'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

            </div>
          </div>
        )}
      </main>
    </div>
  );
}