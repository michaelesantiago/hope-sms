// M2 PR-03: feat/ui-salesdetail-panel
// SalesDetailPage.jsx + AddLineItemModal + EditLineItemModal
// Price auto-fill: when product selected, calls getCurrentPrice(prodCode)

import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRights } from '../context/UserRightsContext';
import { getSaleByTransNo } from '../services/salesService';
import { getDetailByTrans, addDetailLine, updateDetailLine, softDeleteDetailLine, recoverDetailLine } from '../services/salesDetailService';
import { getProducts, getCurrentPrice } from '../services/lookupService';
import { LoadingSpinner, EmptyState, PageError } from '../components/ErrorBoundary';

// ════════════════════════════════════════════════════════════════
// SalesDetailPage
// ════════════════════════════════════════════════════════════════
export default function SalesDetailPage() {
  const { transNo } = useParams();
  const { currentUser } = useAuth();
  const { rights } = useRights();
  const navigate = useNavigate();

  const [sale, setSale] = useState(null);
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const isAdminPlus = ['ADMIN', 'SUPERADMIN'].includes(currentUser?.user_type);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [saleData, lineData] = await Promise.all([
        getSaleByTransNo(transNo),
        getDetailByTrans(transNo, currentUser.user_type),
      ]);
      setSale(saleData);
      setLines(lineData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [transNo, currentUser]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleSoftDelete = async (line) => {
    if (!window.confirm(`Soft-delete line item ${line.prodCode} from ${transNo}?`)) return;
    try {
      await softDeleteDetailLine(transNo, line.prodCode, {
        userId: currentUser.userId,
        username: currentUser.username,
      });
      fetchAll();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRecover = async (line) => {
    try {
      await recoverDetailLine(transNo, line.prodCode, {
        userId: currentUser.userId,
        username: currentUser.username,
      });
      fetchAll();
    } catch (err) {
      alert(err.message);
    }
  };

  const totalAmount = lines
    .filter((l) => l.record_status === 'ACTIVE')
    .reduce((sum, l) => sum + (l.quantity * l.unitPrice || 0), 0);

  const formatCurrency = (v) =>
    v != null ? `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—';

  if (loading) return <LoadingSpinner message="Loading transaction…" />;
  if (error) return <PageError message={error} onRetry={fetchAll} />;
  if (!sale) return <EmptyState icon="🔍" title="Transaction not found" />;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* ── Back ── */}
      <button onClick={() => navigate('/sales')} className="text-sm text-blue-600 hover:underline mb-4 flex items-center gap-1">
        ← Back to Transactions
      </button>

      {/* ── Transaction Header ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 font-mono">{sale.transNo}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                sale.record_status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
              }`}>
                {sale.record_status}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(sale.salesDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-800">{formatCurrency(totalAmount)}</div>
            <div className="text-xs text-gray-400">Total (active lines)</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 text-sm">
          <div>
            <span className="text-gray-500">Customer</span>
            <p className="font-medium text-gray-800">{sale.custname}</p>
            <p className="text-xs text-gray-400">{sale.payterm} · {sale.custNo}</p>
          </div>
          <div>
            <span className="text-gray-500">Sales Employee</span>
            <p className="font-medium text-gray-800">{sale.empName}</p>
            <p className="text-xs text-gray-400">{sale.empNo}</p>
          </div>
        </div>
        {isAdminPlus && sale.stamp && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-400 font-mono">{sale.stamp}</span>
          </div>
        )}
      </div>

      {/* ── Line Items ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-700">Line Items</h2>
          {rights.SD_ADD === 1 && sale.record_status === 'ACTIVE' && (
            <button
              onClick={() => setShowAdd(true)}
              className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              + Add Line Item
            </button>
          )}
        </div>

        {lines.length === 0 ? (
          <EmptyState icon="📦" title="No line items" description="Add a product to this transaction." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Product</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Description</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Unit</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Qty</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Unit Price</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Line Total</th>
                  {isAdminPlus && <th className="px-4 py-3 text-center font-semibold text-gray-600">Status</th>}
                  {isAdminPlus && <th className="px-4 py-3 text-left font-semibold text-gray-600">Stamp</th>}
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lines.map((line) => (
                  <tr key={line.prodCode} className={line.record_status === 'INACTIVE' ? 'bg-red-50 opacity-70' : 'hover:bg-gray-50'}>
                    <td className="px-4 py-3 font-mono text-gray-700">{line.prodCode}</td>
                    <td className="px-4 py-3 text-gray-700">{line.description}</td>
                    <td className="px-4 py-3 text-center text-gray-500">{line.unit}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{line.quantity}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(line.unitPrice)}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800">
                      {formatCurrency(line.quantity * line.unitPrice)}
                    </td>
                    {isAdminPlus && (
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          line.record_status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                        }`}>
                          {line.record_status}
                        </span>
                      </td>
                    )}
                    {isAdminPlus && (
                      <td className="px-4 py-3 text-xs text-gray-400 max-w-xs truncate" title={line.stamp}>
                        {line.stamp || '—'}
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        {rights.SD_EDIT === 1 && line.record_status === 'ACTIVE' && (
                          <button
                            onClick={() => setEditTarget(line)}
                            className="text-xs px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 transition"
                          >
                            Edit
                          </button>
                        )}
                        {rights.SD_DEL === 1 && line.record_status === 'ACTIVE' && (
                          <button
                            onClick={() => handleSoftDelete(line)}
                            className="text-xs px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 transition"
                          >
                            Delete
                          </button>
                        )}
                        {isAdminPlus && line.record_status === 'INACTIVE' && (
                          <button
                            onClick={() => handleRecover(line)}
                            className="text-xs px-2 py-1 rounded bg-green-100 hover:bg-green-200 text-green-700 transition"
                          >
                            Recover
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
      </div>

      {/* ── Line Item Modals ── */}
      {showAdd && (
        <AddLineItemModal
          transNo={transNo}
          existingProdCodes={lines.map((l) => l.prodCode)}
          onClose={() => setShowAdd(false)}
          onSuccess={() => { setShowAdd(false); fetchAll(); }}
        />
      )}
      {editTarget && (
        <EditLineItemModal
          transNo={transNo}
          line={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={() => { setEditTarget(null); fetchAll(); }}
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// AddLineItemModal — with price auto-fill from priceHist
// ════════════════════════════════════════════════════════════════
function AddLineItemModal({ transNo, existingProdCodes, onClose, onSuccess }) {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ prodCode: '', quantity: '' });
  const [unitPrice, setUnitPrice] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
  }, []);

  // Auto-fill price when product changes
  async function handleProductChange(prodCode) {
    setForm((f) => ({ ...f, prodCode }));
    setUnitPrice(null);
    if (!prodCode) return;
    try {
      setPriceLoading(true);
      const ph = await getCurrentPrice(prodCode);
      setUnitPrice(ph.unitPrice);
    } catch {
      setUnitPrice(null);
    } finally {
      setPriceLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.prodCode || !form.quantity) { setError('Product and quantity are required.'); return; }
    if (existingProdCodes.includes(form.prodCode)) {
      setError('This product already exists in the transaction. Edit the existing line item instead.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await addDetailLine({ transNo, ...form, userId: currentUser.userId, username: currentUser.username });
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalShell title={`Add Line Item — ${transNo}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
          <select
            value={form.prodCode}
            onChange={(e) => handleProductChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">— Select Product —</option>
            {products.map((p) => (
              <option key={p.prodCode} value={p.prodCode}>
                [{p.prodCode}] {p.description} ({p.unit})
              </option>
            ))}
          </select>
        </div>

        {/* Unit Price auto-fill (read-only display) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price (auto-filled)</label>
          <div className="border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 min-h-[36px]">
            {priceLoading ? 'Loading price…' : unitPrice != null ? `$${Number(unitPrice).toFixed(2)}` : '—'}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="0"
            required
          />
        </div>

        {/* Line total preview */}
        {unitPrice != null && form.quantity && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm text-blue-700">
            Line Total: <strong>${(unitPrice * Number(form.quantity)).toFixed(2)}</strong>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
            {loading ? 'Adding…' : 'Add Line Item'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ════════════════════════════════════════════════════════════════
// EditLineItemModal — quantity only (prodCode is PK, read-only)
// ════════════════════════════════════════════════════════════════
function EditLineItemModal({ transNo, line, onClose, onSuccess }) {
  const { currentUser } = useAuth();
  const [quantity, setQuantity] = useState(String(line.quantity));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await updateDetailLine(transNo, line.prodCode, {
        quantity: Number(quantity),
        userId: currentUser.userId,
        username: currentUser.username,
      });
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalShell title={`Edit Line Item — ${line.prodCode}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>}
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm">
          <p className="font-medium text-gray-700">{line.description}</p>
          <p className="text-gray-400 text-xs mt-0.5">
            {line.prodCode} · Unit Price: ${Number(line.unitPrice).toFixed(2)}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        {quantity && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm text-blue-700">
            New Line Total: <strong>${(line.unitPrice * Number(quantity)).toFixed(2)}</strong>
          </div>
        )}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function ModalShell({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
