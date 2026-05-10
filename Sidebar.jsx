// M2 PR-06: fix/ui-responsive-forms + Sidebar with visibility gating
// Sidebar.jsx — navigation links with USER visibility gating
// Deleted Items + Admin links hidden for USER accounts

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRights } from '../../context/UserRightsContext';
import { supabase } from '../../supabaseClient';

const NAV_GROUPS = [
  {
    label: 'Sales',
    items: [
      { to: '/sales', icon: '🧾', label: 'Transactions' },
    ],
  },
  {
    label: 'Lookups',
    items: [
      { to: '/lookups/customers', icon: '👥', label: 'Customers' },
      { to: '/lookups/employees', icon: '🧑‍💼', label: 'Employees' },
      { to: '/lookups/products', icon: '📦', label: 'Products' },
      { to: '/lookups/prices', icon: '💰', label: 'Price History' },
    ],
  },
  {
    label: 'Reports',
    items: [
      { to: '/reports/by-employee', icon: '📊', label: 'By Employee' },
      { to: '/reports/by-customer', icon: '📈', label: 'By Customer' },
      { to: '/reports/top-products', icon: '🏆', label: 'Top Products' },
      { to: '/reports/monthly-trend', icon: '📅', label: 'Monthly Trend' },
    ],
  },
];

export default function Sidebar() {
  const { currentUser } = useAuth();
  const { rights } = useRights();
  const navigate = useNavigate();

  const isAdminPlus = ['ADMIN', 'SUPERADMIN'].includes(currentUser?.user_type);
  const isSuperAdmin = currentUser?.user_type === 'SUPERADMIN';

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/login');
  }

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-100 flex flex-col shadow-sm">
      {/* ── Brand ── */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="text-lg font-bold text-blue-700 tracking-tight">Hope SMS</div>
        <div className="text-xs text-gray-400 mt-0.5">Sales Management System</div>
      </div>

      {/* ── Nav Groups ── */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-widest">
              {group.label}
            </p>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`
                }
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}

        {/* ── Deleted Items — ADMIN/SUPERADMIN only ── */}
        {isAdminPlus && (
          <div>
            <p className="px-3 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Management
            </p>
            <NavLink
              to="/deleted-items"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-red-50 text-red-700'
                    : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                }`
              }
            >
              <span className="text-base">🗑️</span>
              Deleted Items
            </NavLink>
          </div>
        )}

        {/* ── Admin — ADM_USER right gated ── */}
        {rights.ADM_USER === 1 && (
          <div>
            <p className="px-3 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Admin
            </p>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-50 text-orange-700'
                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                }`
              }
            >
              <span className="text-base">⚙️</span>
              User Management
            </NavLink>
          </div>
        )}
      </nav>

      {/* ── User Footer ── */}
      <div className="border-t border-gray-100 px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">
            {currentUser?.username?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">{currentUser?.username}</p>
            <p className="text-xs text-gray-400">{currentUser?.user_type}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-sm text-gray-500 hover:text-red-600 text-left px-2 py-1 rounded hover:bg-red-50 transition"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
