// M2 PR-01: feat/ui-sales-list
// SalesListPage.jsx
// Shows enriched sales list from sales_with_lookup view.
// - Stamp column: ADMIN/SUPERADMIN only
// - INACTIVE rows: hidden for USER (also enforced by RLS)
// - Filter by date range and customer name

import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRights } from '../context/UserRightsContext';
import { getSales } from '../services/salesService';
import { LoadingSpinner, EmptyState, PageError, TableSkeleton } from '../components/ErrorBoundary';
import AddSaleModal from '../components/modals/AddSaleModal';
import EditSaleModal from '../components/modals/EditSaleModal';
import SoftDeleteSaleDialog from '../components/modals/SoftDeleteSaleDialog';

export default function SalesListPage() {
  const { currentUser } = useAuth();
  const { rights } = useRights();
  const navigate = useNavigate();

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // Modals
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const isAdminPlus = ['ADMIN', 'SUPERADMIN'].includes(currentUser?.user_type);
  const isSuperAdmin = currentUser?.user_type === 'SUPERADMIN';

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSales(currentUser.user_type);
      setSales(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => { fetchSales(); }, [fetchSales]);

  // Client-side filter (RLS already handles ACTIVE/INACTIVE)
  const filtered = sales.filter((s) => {
    if (filterCustomer && !s.custname?.toLowerCase().includes(filterCustomer.toLowerCase())) return false;
    if (filterDateFrom && s.salesDate < filterDateFrom) return false;
    if (filterDateTo && s.salesDate > filterDateTo) return false;
    return true;
  });

  const formatCurrency = (val) =>
    val != null ? `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—';

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-US') : '—');

  return (
    <div className="p-6 max-w-full">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sales Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} transaction{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
        {rights.SALES_ADD === 1 && (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
          >
            + Create Transaction
          </button>
        )}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3 mb-5 bg-gray-50 border border-gray-200 rounded-lg p-3">
        <input
          type="text"
          placeholder="Filter by customer name…"
          value={filterCustomer}
          onChange={(e) => setFilterCustomer(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="date"
          value={filterDateFrom}
          onChange={(e) => setFilterDateFrom(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="date"
          value={filterDateTo}
          onChange={(e) => setFilterDateTo(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={() => { setFilterCustomer(''); setFilterDateFrom(''); setFilterDateTo(''); }}
          className="text-sm text-gray-500 hover:text-gray-700 underline px-2"
        >
          Clear
        </button>
      </div>

      {/* ── Content ── */}
      {error && <PageError message={error} onRetry={fetchSales} />}
      {loading && <TableSkeleton rows={6} cols={isAdminPlus ? 8 : 7} />}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          icon="📋"
          title="No transactions found"
          description="Try adjusting your filters or create a new transaction."
        />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Trans No</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Employee</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Items</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Total</th>
                {isAdminPlus && (
                  <>
                    <th className="px-4 py-3 text-center font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 max-w-xs">Stamp</th>
                  </>
                )}
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((s) => (
                <tr
                  key={s.transNo}
                  className={`hover:bg-blue-50 transition-colors ${
                    s.record_status === 'INACTIVE' ? 'bg-red-50 opacity-70' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/sales/${s.transNo}`)}
                      className="text-blue-600 hover:underline font-mono font-medium"
                    >
                      {s.transNo}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{formatDate(s.salesDate)}</td>
                  <td className="px-4 py-3 text-gray-700">
                    <div className="font-medium">{s.custname}</div>
                    <div className="text-xs text-gray-400">{s.payterm}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{s.empName}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{s.lineItemCount ?? 0}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-800">
                    {formatCurrency(s.totalAmount)}
                  </td>
                  {isAdminPlus && (
                    <>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          s.record_status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {s.record_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 max-w-xs truncate" title={s.stamp}>
                        {s.stamp || '—'}
                      </td>
                    </>
                  )}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => navigate(`/sales/${s.transNo}`)}
                        className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                      >
                        View
                      </button>
                      {rights.SALES_EDIT === 1 && s.record_status === 'ACTIVE' && (
                        <button
                          onClick={() => setEditTarget(s)}
                          className="text-xs px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 transition"
                        >
                          Edit
                        </button>
                      )}
                      {rights.SALES_DEL === 1 && s.record_status === 'ACTIVE' && (
                        <button
                          onClick={() => setDeleteTarget(s)}
                          className="text-xs px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 transition"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modals ── */}
      {showAdd && (
        <AddSaleModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => { setShowAdd(false); fetchSales(); }}
        />
      )}
      {editTarget && (
        <EditSaleModal
          sale={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={() => { setEditTarget(null); fetchSales(); }}
        />
      )}
      {deleteTarget && (
        <SoftDeleteSaleDialog
          sale={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={() => { setDeleteTarget(null); fetchSales(); }}
        />
      )}
    </div>
  );
}
