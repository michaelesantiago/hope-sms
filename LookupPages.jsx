// M2 PR-04: feat/ui-lookup-pages
// Four read-only lookup pages. NO add/edit/delete buttons anywhere.
// CustomerLookupPage, EmployeeLookupPage, ProductLookupPage, PriceHistoryPage

import { useEffect, useState } from 'react';
import { getCustomers, getEmployees, getProducts, getPriceHistory } from '../services/lookupService';
import { LoadingSpinner, EmptyState, PageError } from '../components/ErrorBoundary';

// ─── Shared ──────────────────────────────────────────────────────────────────
function LookupPageShell({ title, subtitle, children }) {
  return (
    <div className="p-6 max-w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
        <div className="inline-block mt-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-medium">
          Read-only — reference data
        </div>
      </div>
      {children}
    </div>
  );
}

function SearchInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
    />
  );
}

// ════════════════════════════════════════════════════════════════
// CustomerLookupPage
// ════════════════════════════════════════════════════════════════
export function CustomerLookupPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCustomers()
      .then(setCustomers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.custname?.toLowerCase().includes(search.toLowerCase()) ||
      c.custno?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LookupPageShell title="Customers" subtitle={`${customers.length} customers on record`}>
      <SearchInput value={search} onChange={setSearch} placeholder="Search by name or ID…" />
      {loading && <LoadingSpinner />}
      {error && <PageError message={error} />}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Cust No</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Address</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Pay Term</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-400">No customers match your search.</td></tr>
              ) : filtered.map((c) => (
                <tr key={c.custno} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-gray-600">{c.custno}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{c.custname}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-xs">{c.address}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      c.payterm === 'COD' ? 'bg-yellow-100 text-yellow-700'
                      : c.payterm === '30D' ? 'bg-blue-100 text-blue-700'
                      : 'bg-purple-100 text-purple-700'
                    }`}>{c.payterm}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </LookupPageShell>
  );
}

// ════════════════════════════════════════════════════════════════
// EmployeeLookupPage
// ════════════════════════════════════════════════════════════════
export function EmployeeLookupPage() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEmployees()
      .then(setEmployees)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = employees.filter(
    (e) =>
      e.lastname?.toLowerCase().includes(search.toLowerCase()) ||
      e.firstname?.toLowerCase().includes(search.toLowerCase()) ||
      e.empno?.includes(search)
  );

  return (
    <LookupPageShell title="Employees" subtitle={`${employees.length} employees on record`}>
      <SearchInput value={search} onChange={setSearch} placeholder="Search by name or ID…" />
      {loading && <LoadingSpinner />}
      {error && <PageError message={error} />}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Emp No</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Gender</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Hire Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-400">No employees match your search.</td></tr>
              ) : filtered.map((e) => (
                <tr key={e.empno} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-gray-600">{e.empno}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{e.lastname}, {e.firstname}</td>
                  <td className="px-4 py-3 text-center text-gray-500">{e.gender === 'M' ? 'Male' : 'Female'}</td>
                  <td className="px-4 py-3 text-gray-500">{e.hiredate ? new Date(e.hiredate).toLocaleDateString('en-US') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </LookupPageShell>
  );
}

// ════════════════════════════════════════════════════════════════
// ProductLookupPage
// ════════════════════════════════════════════════════════════════
export function ProductLookupPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(
    (p) =>
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.prodCode?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LookupPageShell title="Products" subtitle={`${products.length} products on record`}>
      <SearchInput value={search} onChange={setSearch} placeholder="Search by name or code…" />
      {loading && <LoadingSpinner />}
      {error && <PageError message={error} />}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Code</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Description</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-8 text-gray-400">No products match your search.</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.prodCode} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-gray-600">{p.prodCode}</td>
                  <td className="px-4 py-3 text-gray-800">{p.description}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-mono">{p.unit}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </LookupPageShell>
  );
}

// ════════════════════════════════════════════════════════════════
// PriceHistoryPage
// ════════════════════════════════════════════════════════════════
export function PriceHistoryPage() {
  const [prices, setPrices] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPriceHistory()
      .then(setPrices)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = prices.filter((p) =>
    p.prodCode?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LookupPageShell title="Price History" subtitle={`${prices.length} price entries on record`}>
      <SearchInput value={search} onChange={setSearch} placeholder="Filter by product code…" />
      {loading && <LoadingSpinner />}
      {error && <PageError message={error} />}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Product Code</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Effective Date</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Unit Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-8 text-gray-400">No entries found.</td></tr>
              ) : filtered.map((p, i) => (
                <tr key={`${p.prodCode}-${p.effDate}`} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-gray-700">{p.prodCode}</td>
                  <td className="px-4 py-3 text-gray-600">{new Date(p.effDate).toLocaleDateString('en-US')}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-800">
                    ${Number(p.unitPrice).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </LookupPageShell>
  );
}
