// M2 PR-02: feat/ui-sales-crud
// AddSaleModal.jsx, EditSaleModal.jsx, SoftDeleteSaleDialog.jsx
// All modals use lookup dropdowns populated from customer and employee tables.

// ════════════════════════════════════════════════════════════════
// AddSaleModal.jsx
// ════════════════════════════════════════════════════════════════
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createSale } from '../../services/salesService';
import { getCustomers, getEmployees, formatEmpName } from '../../services/lookupService';

export function AddSaleModal({ onClose, onSuccess }) {
  const { currentUser } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ salesDate: '', custNo: '', empNo: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getCustomers(), getEmployees()])
      .then(([c, e]) => { setCustomers(c); setEmployees(e); })
      .catch(console.error);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.salesDate || !form.custNo || !form.empNo) {
      setError('All fields are required.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await createSale({ ...form, userId: currentUser.userId, username: currentUser.username });
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalShell title="Create Transaction" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sales Date</label>
          <input
            type="date"
            value={form.salesDate}
            onChange={(e) => setForm({ ...form, salesDate: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
          <select
            value={form.custNo}
            onChange={(e) => setForm({ ...form, custNo: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">— Select Customer —</option>
            {customers.map((c) => (
              <option key={c.custno} value={c.custno}>{c.custname} ({c.custno})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sales Employee</label>
          <select
            value={form.empNo}
            onChange={(e) => setForm({ ...form, empNo: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">— Select Employee —</option>
            {employees.map((e) => (
              <option key={e.empno} value={e.empno}>{formatEmpName(e)} ({e.empno})</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg transition">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
            {loading ? 'Creating…' : 'Create Transaction'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ════════════════════════════════════════════════════════════════
// EditSaleModal.jsx
// ════════════════════════════════════════════════════════════════
import { updateSale } from '../../services/salesService';

export function EditSaleModal({ sale, onClose, onSuccess }) {
  const { currentUser } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    salesDate: sale.salesDate || '',
    custNo: sale.custNo || '',
    empNo: sale.empNo || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getCustomers(), getEmployees()])
      .then(([c, e]) => { setCustomers(c); setEmployees(e); })
      .catch(console.error);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await updateSale(sale.transNo, { ...form, userId: currentUser.userId, username: currentUser.username });
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalShell title={`Edit Transaction ${sale.transNo}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sales Date</label>
          <input
            type="date"
            value={form.salesDate}
            onChange={(e) => setForm({ ...form, salesDate: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
          <select
            value={form.custNo}
            onChange={(e) => setForm({ ...form, custNo: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">— Select Customer —</option>
            {customers.map((c) => (
              <option key={c.custno} value={c.custno}>{c.custname} ({c.custno})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sales Employee</label>
          <select
            value={form.empNo}
            onChange={(e) => setForm({ ...form, empNo: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">— Select Employee —</option>
            {employees.map((e) => (
              <option key={e.empno} value={e.empno}>{formatEmpName(e)} ({e.empno})</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg transition">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ════════════════════════════════════════════════════════════════
// SoftDeleteSaleDialog.jsx — SUPERADMIN only
// ════════════════════════════════════════════════════════════════
import { softDeleteSale } from '../../services/salesService';

export function SoftDeleteSaleDialog({ sale, onClose, onSuccess }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleDelete() {
    try {
      setLoading(true);
      setError(null);
      await softDeleteSale(sale.transNo, { userId: currentUser.userId, username: currentUser.username });
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalShell title="Confirm Delete" onClose={onClose}>
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700 font-medium">
            Soft-delete transaction <span className="font-mono font-bold">{sale.transNo}</span>?
          </p>
          <p className="text-xs text-red-500 mt-2">
            This will also hide all line items for this transaction from USER accounts.
            The transaction can be recovered by ADMIN or SUPERADMIN.
          </p>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancel</button>
          <button onClick={handleDelete} disabled={loading} className="px-4 py-2 text-sm bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition">
            {loading ? 'Deleting…' : 'Yes, Soft Delete'}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

// ════════════════════════════════════════════════════════════════
// Shared ModalShell (backdrop + container)
// ════════════════════════════════════════════════════════════════
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

export default AddSaleModal;
