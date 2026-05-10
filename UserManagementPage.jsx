// M2 PR-01: feat/ui-admin-users
// UserManagementPage.jsx
// Shows all users. SUPERADMIN rows are fully disabled and greyed out.
// ADMIN can Activate/Deactivate non-SUPERADMIN users only.
// Requires: ADM_USER = 1 (enforced by sidebar gating + route guard)

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUsers, activateUser, deactivateUser } from '../services/adminService';
import { LoadingSpinner, EmptyState, PageError, TableSkeleton } from '../components/ErrorBoundary';

export default function UserManagementPage() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  async function handleActivate(user) {
    try {
      setActionLoading(user.userId);
      await activateUser(user.userId, {
        userId: currentUser.userId,
        username: currentUser.username,
      });
      await fetchUsers();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDeactivate(user) {
    if (!window.confirm(`Deactivate account "${user.username}"? They will not be able to log in.`)) return;
    try {
      setActionLoading(user.userId);
      await deactivateUser(user.userId, {
        userId: currentUser.userId,
        username: currentUser.username,
      });
      await fetchUsers();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  }

  const filtered = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.user_type?.toLowerCase().includes(search.toLowerCase())
  );

  const userTypeColor = (type) => {
    if (type === 'SUPERADMIN') return 'bg-purple-100 text-purple-700';
    if (type === 'ADMIN') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-600';
  };

  const statusColor = (status) =>
    status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600';

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          Activate or deactivate user accounts. SUPERADMIN accounts cannot be modified.
        </p>
      </div>

      {/* ── Search ── */}
      <input
        type="text"
        placeholder="Search by username or role…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full max-w-sm mb-5 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {['SUPERADMIN', 'ADMIN', 'USER'].map((type) => {
          const count = users.filter((u) => u.user_type === type).length;
          const active = users.filter((u) => u.user_type === type && u.record_status === 'ACTIVE').length;
          return (
            <div key={type} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{type}</p>
              <p className="text-2xl font-bold text-gray-800">{count}</p>
              <p className="text-xs text-gray-400">{active} active</p>
            </div>
          );
        })}
      </div>

      {/* ── Table ── */}
      {loading && <TableSkeleton rows={5} cols={5} />}
      {error && <PageError message={error} onRetry={fetchUsers} />}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Username</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Role</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-400">
                    No users match your search.
                  </td>
                </tr>
              ) : filtered.map((user) => {
                const isSuperAdmin = user.user_type === 'SUPERADMIN';
                const isCurrentUser = user.userId === currentUser.userId;
                const isLoading = actionLoading === user.userId;

                return (
                  <tr
                    key={user.userId}
                    className={`transition-colors ${
                      isSuperAdmin
                        ? 'bg-purple-50/40 opacity-70'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                          {user.username?.[0]?.toUpperCase()}
                        </div>
                        <span className={`font-medium ${isSuperAdmin ? 'text-gray-400' : 'text-gray-800'}`}>
                          {user.username}
                        </span>
                        {isCurrentUser && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-medium">you</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${userTypeColor(user.user_type)}`}>
                        {user.user_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor(user.record_status)}`}>
                        {user.record_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isSuperAdmin ? (
                        <span
                          className="text-xs text-gray-300 cursor-not-allowed"
                          title="SUPERADMIN accounts cannot be modified"
                        >
                          Protected
                        </span>
                      ) : isCurrentUser ? (
                        <span className="text-xs text-gray-300">—</span>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          {user.record_status === 'INACTIVE' ? (
                            <button
                              onClick={() => handleActivate(user)}
                              disabled={isLoading}
                              className="text-xs px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition"
                            >
                              {isLoading ? 'Activating…' : 'Activate'}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeactivate(user)}
                              disabled={isLoading}
                              className="text-xs px-3 py-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 transition"
                            >
                              {isLoading ? 'Deactivating…' : 'Deactivate'}
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── SUPERADMIN notice ── */}
      <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
        <span className="inline-block w-2 h-2 rounded-full bg-purple-300"></span>
        SUPERADMIN rows are greyed out and cannot be activated or deactivated by any user.
      </p>
    </div>
  );
}
