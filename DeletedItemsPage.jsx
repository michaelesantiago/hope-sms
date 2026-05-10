// M2 PR-05: feat/ui-deleted-items
// DeletedItemsPage.jsx — ADMIN/SUPERADMIN only
// Two tabs: Transactions | Line Items
// Recover buttons on each row

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDeletedSales, recoverSale } from '../services/salesService';
import { getDeletedDetailLines, recoverDetailLine } from '../services/salesDetailService';
import { LoadingSpinner, EmptyState, PageError } from '../components/ErrorBoundary';

const TABS = ['Transactions', 'Line Items'];

export default function DeletedItemsPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [deletedSales, setDeletedSales] = useState([]);
  const [deletedLines, setDeletedLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recovering, setRecovering] = useState(null);

  async function fetchAll() {
    try {
      setLoading(true);
      setError(null);
      const [sales, lines] = await Promise.all([getDeletedSales(), getDeletedDetailLines()]);
      setDeletedSales(sales);
      setDeletedLines(lines);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAll(); }, []);

  async function handleRecoverSale(transNo) {
    try {
      setRecovering(transNo);
      await recoverSale(transNo, { userId: currentUser.userId, username: currentUser.username });
      await fetchAll();
    } catch (err) {
      alert(err.message);
    } finally {
      setRecovering(null);
    }
  }

  async function handleRecoverLine(transNo, prodCode) {
    const key = `${transNo}-${prodCode}`;
    try {
      setRecovering(key);
      await recoverDetailLine(transNo, prodCode, { userId: currentUser.userId, username: currentUser.username });
      await fetchAll();
    } catch (err) {
      alert(err.message);
    } finally {
      setRecovering(null);
    }
  }

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-US') : '—');
  const formatCurrency = (v) =>
    v != null ? `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—';

  return (
    <div className="p-6 max-w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Deleted Items</h1>
        <p className="text-sm text-gray-500 mt-1">Soft-deleted records — visible to ADMIN and SUPERADMIN only</p>
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-gray-200 mb-5">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-6 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === i
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
            <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
              {i === 0 ? deletedSales.length : deletedLines.length}
            </span>
          </button>
        ))}
      </div>

      {loading && <LoadingSpinner />}
      {error && <PageError message={error} onRetry={fetchAll} />}

      {/* ── Tab 0: Transactions ── */}
      {!loading && !error && activeTab === 0 && (
        deletedSales.length === 0
          ? <EmptyState icon="🗑️" title="No deleted transactions" description="Soft-deleted transactions will appear here." />
          : (
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="min-w-full text-sm">
                <thead className="bg-red-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Trans No</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Customer</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Employee</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 max-w-xs">Stamp</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {deletedSales.map((s) => (
                    <tr key={s.transNo} className="bg-red-50/50 hover:bg-red-50">
                      <td className="px-4 py-3 font-mono text-red-700 font-medium">{s.transNo}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(s.salesDate)}</td>
                      <td className="px-4 py-3 text-gray-700">{s.custname}</td>
                      <td className="px-4 py-3 text-gray-700">{s.empName}</td>
                      <td className="px-4 py-3 text-xs text-gray-400 max-w-xs truncate" title={s.stamp}>{s.stamp}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleRecoverSale(s.transNo)}
                          disabled={recovering === s.transNo}
                          className="text-xs px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition"
                        >
                          {recovering === s.transNo ? 'Recovering…' : 'Recover'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
      )}

      {/* ── Tab 1: Line Items ── */}
      {!loading && !error && activeTab === 1 && (
        deletedLines.length === 0
          ? <EmptyState icon="🗑️" title="No deleted line items" description="Soft-deleted line items will appear here." />
          : (
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="min-w-full text-sm">
                <thead className="bg-red-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Trans No</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Product</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Description</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">Qty</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">Unit Price</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 max-w-xs">Stamp</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {deletedLines.map((l) => {
                    const key = `${l.transNo}-${l.prodCode}`;
                    return (
                      <tr key={key} className="bg-red-50/50 hover:bg-red-50">
                        <td className="px-4 py-3 font-mono text-red-700">{l.transNo}</td>
                        <td className="px-4 py-3 font-mono text-gray-700">{l.prodCode}</td>
                        <td className="px-4 py-3 text-gray-700">{l.description}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{l.quantity}</td>
                        <td className="px-4 py-3 text-right text-gray-600">${Number(l.unitPrice).toFixed(2)}</td>
                        <td className="px-4 py-3 text-xs text-gray-400 max-w-xs truncate" title={l.stamp}>{l.stamp}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleRecoverLine(l.transNo, l.prodCode)}
                            disabled={recovering === key}
                            className="text-xs px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition"
                          >
                            {recovering === key ? 'Recovering…' : 'Recover'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
      )}
    </div>
  );
}
