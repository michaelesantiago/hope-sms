// M2 PR-02: feat/ui-reports
// Four report pages using Recharts for bar chart visualizations.
// All data from SQL views via reportsService.js (M1 PR-02).
// Import Recharts: already available in the project.

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import {
  getSalesByEmployee,
  getSalesByCustomer,
  getTopProducts,
  getMonthlySalesTrend,
  formatCurrency,
  formatMonth,
} from '../services/reportsService';
import { LoadingSpinner, EmptyState, PageError } from '../components/ErrorBoundary';

// ─── Shared ──────────────────────────────────────────────────────────────────
function ReportShell({ title, subtitle, children }) {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function StatCards({ data, valueKey, labelKey, valueFormatter }) {
  if (!data.length) return null;
  const top = data[0];
  const total = data.reduce((sum, r) => sum + (r[valueKey] || 0), 0);
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-xs text-blue-400 uppercase tracking-wider mb-1">Total</p>
        <p className="text-xl font-bold text-blue-800">{valueFormatter(total)}</p>
      </div>
      <div className="bg-green-50 border border-green-100 rounded-xl p-4">
        <p className="text-xs text-green-400 uppercase tracking-wider mb-1">Top performer</p>
        <p className="text-base font-bold text-green-800 truncate">{top[labelKey]}</p>
        <p className="text-xs text-green-500">{valueFormatter(top[valueKey])}</p>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Records</p>
        <p className="text-xl font-bold text-gray-800">{data.length}</p>
      </div>
    </div>
  );
}

const CHART_COLORS = ['#378ADD', '#1D9E75', '#EF9F27', '#D85A30', '#7F77DD', '#D4537E'];
const tooltipStyle = {
  contentStyle: { borderRadius: 8, border: '0.5px solid #D3D1C7', fontSize: 12 },
  cursor: { fill: '#F1EFE8' },
};

// ════════════════════════════════════════════════════════════════
// SalesByEmployeePage
// ════════════════════════════════════════════════════════════════
export function SalesByEmployeePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('totalRevenue');

  useEffect(() => {
    getSalesByEmployee()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...data].sort((a, b) => b[sort] - a[sort]);

  return (
    <ReportShell title="Sales by Employee" subtitle="Total transactions and revenue per sales employee">
      {loading && <LoadingSpinner />}
      {error && <PageError message={error} />}
      {!loading && !error && data.length === 0 && <EmptyState icon="📊" title="No data available" />}
      {!loading && !error && data.length > 0 && (
        <>
          <StatCards data={sorted} valueKey="totalRevenue" labelKey="empName" valueFormatter={formatCurrency} />

          {/* Chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-4">Revenue by employee</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={sorted} margin={{ top: 0, right: 20, left: 10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1EFE8" />
                <XAxis dataKey="empName" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => formatCurrency(v)} {...tooltipStyle} />
                <Bar dataKey="totalRevenue" radius={[4, 4, 0, 0]}>
                  {sorted.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Rank</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Employee</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600 cursor-pointer hover:text-blue-600" onClick={() => setSort('totalTransactions')}>
                    Transactions {sort === 'totalTransactions' && '↓'}
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600 cursor-pointer hover:text-blue-600" onClick={() => setSort('totalRevenue')}>
                    Revenue {sort === 'totalRevenue' && '↓'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sorted.map((row, i) => (
                  <tr key={row.empNo} className={`hover:bg-gray-50 ${i === 0 ? 'bg-yellow-50/50' : ''}`}>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                      {i === 0 ? '🏆' : `#${i + 1}`}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{row.empName}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{row.totalTransactions}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800">{formatCurrency(row.totalRevenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </ReportShell>
  );
}

// ════════════════════════════════════════════════════════════════
// SalesByCustomerPage
// ════════════════════════════════════════════════════════════════
export function SalesByCustomerPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('totalSpend');

  useEffect(() => {
    getSalesByCustomer()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...data].sort((a, b) => b[sort] - a[sort]);
  const top10 = sorted.slice(0, 10);

  return (
    <ReportShell title="Sales by Customer" subtitle="Total transactions and spend per customer">
      {loading && <LoadingSpinner />}
      {error && <PageError message={error} />}
      {!loading && !error && data.length === 0 && <EmptyState icon="👥" title="No data available" />}
      {!loading && !error && data.length > 0 && (
        <>
          <StatCards data={sorted} valueKey="totalSpend" labelKey="custname" valueFormatter={formatCurrency} />

          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-4">Top 10 customers by spend</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={top10} margin={{ top: 0, right: 20, left: 10, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1EFE8" />
                <XAxis dataKey="custname" tick={{ fontSize: 10 }} angle={-40} textAnchor="end" interval={0} />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => formatCurrency(v)} {...tooltipStyle} />
                <Bar dataKey="totalSpend" radius={[4, 4, 0, 0]}>
                  {top10.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Rank</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Customer</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Pay Term</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600 cursor-pointer hover:text-blue-600" onClick={() => setSort('totalTransactions')}>
                    Transactions {sort === 'totalTransactions' && '↓'}
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600 cursor-pointer hover:text-blue-600" onClick={() => setSort('totalSpend')}>
                    Total Spend {sort === 'totalSpend' && '↓'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sorted.map((row, i) => (
                  <tr key={row.custNo} className={`hover:bg-gray-50 ${i === 0 ? 'bg-yellow-50/50' : ''}`}>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{i === 0 ? '🏆' : `#${i + 1}`}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{row.custname}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-mono">{row.payterm}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">{row.totalTransactions}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800">{formatCurrency(row.totalSpend)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </ReportShell>
  );
}

// ════════════════════════════════════════════════════════════════
// TopProductsPage
// ════════════════════════════════════════════════════════════════
export function TopProductsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('totalRevenue');

  useEffect(() => {
    getTopProducts()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...data].sort((a, b) => b[sort] - a[sort]);
  const top10 = sorted.slice(0, 10);

  return (
    <ReportShell title="Top Products Sold" subtitle="Products ranked by total quantity sold and revenue generated">
      {loading && <LoadingSpinner />}
      {error && <PageError message={error} />}
      {!loading && !error && data.length === 0 && <EmptyState icon="📦" title="No data available" />}
      {!loading && !error && data.length > 0 && (
        <>
          <StatCards data={sorted} valueKey="totalRevenue" labelKey="description" valueFormatter={formatCurrency} />

          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-4">Top 10 products by revenue</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={top10} layout="vertical" margin={{ top: 0, right: 60, left: 160, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1EFE8" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="description" tick={{ fontSize: 11 }} width={155} />
                <Tooltip formatter={(v) => formatCurrency(v)} {...tooltipStyle} />
                <Bar dataKey="totalRevenue" radius={[0, 4, 4, 0]}>
                  {top10.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Rank</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Product</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Unit</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600 cursor-pointer hover:text-blue-600" onClick={() => setSort('totalQtySold')}>
                    Qty Sold {sort === 'totalQtySold' && '↓'}
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600 cursor-pointer hover:text-blue-600" onClick={() => setSort('totalRevenue')}>
                    Revenue {sort === 'totalRevenue' && '↓'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sorted.map((row, i) => (
                  <tr key={row.prodCode} className={`hover:bg-gray-50 ${i === 0 ? 'bg-yellow-50/50' : ''}`}>
                    <td className="px-4 py-3 text-gray-400 text-xs">{i === 0 ? '🏆' : `#${i + 1}`}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{row.description}</p>
                      <p className="text-xs text-gray-400 font-mono">{row.prodCode}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-mono">{row.unit}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">{row.totalQtySold}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800">{formatCurrency(row.totalRevenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </ReportShell>
  );
}

// ════════════════════════════════════════════════════════════════
// MonthlySalesTrendPage
// ════════════════════════════════════════════════════════════════
export function MonthlySalesTrendPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  function fetchData() {
    setLoading(true);
    setError(null);
    getMonthlySalesTrend({ from: from || null, to: to || null })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchData(); }, []);

  const chartData = data.map((d) => ({ ...d, label: formatMonth(d.saleMonth) }));
  const totalRevenue = data.reduce((s, r) => s + (r.totalRevenue || 0), 0);
  const totalTx = data.reduce((s, r) => s + (r.transactionCount || 0), 0);

  return (
    <ReportShell title="Monthly Sales Trend" subtitle="Transaction count and revenue grouped by month">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5 items-end">
        <div>
          <label className="block text-xs text-gray-500 mb-1">From (YYYY-MM)</label>
          <input type="month" value={from} onChange={(e) => setFrom(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">To (YYYY-MM)</label>
          <input type="month" value={to} onChange={(e) => setTo(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <button onClick={fetchData}
          className="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
          Apply
        </button>
        <button onClick={() => { setFrom(''); setTo(''); }}
          className="text-sm text-gray-400 hover:text-gray-600 underline px-2">
          Clear
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {error && <PageError message={error} onRetry={fetchData} />}
      {!loading && !error && data.length === 0 && <EmptyState icon="📅" title="No data for this period" />}
      {!loading && !error && data.length > 0 && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-xs text-blue-400 uppercase tracking-wider mb-1">Total Revenue</p>
              <p className="text-xl font-bold text-blue-800">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <p className="text-xs text-green-400 uppercase tracking-wider mb-1">Total Transactions</p>
              <p className="text-xl font-bold text-green-800">{totalTx}</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Months shown</p>
              <p className="text-xl font-bold text-gray-800">{data.length}</p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-4">Monthly revenue</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 0, right: 20, left: 10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1EFE8" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v, name) => name === 'totalRevenue' ? formatCurrency(v) : v}
                  labelFormatter={(l) => l} {...tooltipStyle} />
                <Bar dataKey="totalRevenue" fill="#378ADD" radius={[4, 4, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Month</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Transactions</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {chartData.map((row) => (
                  <tr key={row.saleMonth} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{row.label}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{row.transactionCount}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800">{formatCurrency(row.totalRevenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </ReportShell>
  );
}
