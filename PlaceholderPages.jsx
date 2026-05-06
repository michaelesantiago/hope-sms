function ComingSoon({ title, sprint }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-hope-50 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-hope-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h2 className="font-display text-2xl text-slate-900 mb-2">{title}</h2>
      <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">Implemented in {sprint}</span>
    </div>
  )
}

export function SalesListPage()     { return <ComingSoon title="Sales Transactions"  sprint="Sprint 2" /> }
export function SalesDetailPage()   { return <ComingSoon title="Transaction Detail"  sprint="Sprint 2" /> }
export function CustomerLookupPage(){ return <ComingSoon title="Customer Lookup"     sprint="Sprint 2" /> }
export function EmployeeLookupPage(){ return <ComingSoon title="Employee Lookup"     sprint="Sprint 2" /> }
export function ProductLookupPage() { return <ComingSoon title="Product Lookup"      sprint="Sprint 2" /> }
export function PriceLookupPage()   { return <ComingSoon title="Price History"       sprint="Sprint 2" /> }
export function ReportsPage()       { return <ComingSoon title="Reports"             sprint="Sprint 3" /> }
export function AdminPage()         { return <ComingSoon title="Admin"               sprint="Sprint 3" /> }
export function DeletedItemsPage()  { return <ComingSoon title="Deleted Items"       sprint="Sprint 2" /> }
