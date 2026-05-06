import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const NAV = [
  { section:'Sales', items:[{ to:'/sales', label:'Transactions' }] },
  { section:'Lookups', items:[
    { to:'/lookups/customers', label:'Customers' },
    { to:'/lookups/employees', label:'Employees' },
    { to:'/lookups/products',  label:'Products' },
    { to:'/lookups/prices',    label:'Price History' },
  ]},
  { section:'Reports', items:[{ to:'/reports', label:'Reports' }] },
  { section:'Management', items:[
    { to:'/deleted-items', label:'Deleted Items' },
    { to:'/admin', label:'Admin' },
  ]},
]

export default function AppShell({ children }) {
  const [open, setOpen] = useState(false)
  const { currentUser, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() { await signOut(); navigate('/login') }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {open && <div className="fixed inset-0 z-20 bg-black/30 lg:hidden" onClick={() => setOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-30 flex flex-col w-60 bg-white border-r border-slate-100 transform transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-hope-600 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 5a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" />
            </svg>
          </div>
          <div>
            <p className="font-display text-sm text-slate-900">Hope, Inc.</p>
            <p className="text-xs text-slate-400">Sales Management</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {NAV.map(({ section, items }) => (
            <div key={section}>
              <p className="px-2 mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{section}</p>
              <ul className="space-y-0.5">
                {items.map(item => (
                  <li key={item.to}>
                    <NavLink to={item.to} end={item.to === '/sales'} onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ` +
                        (isActive ? 'bg-hope-50 text-hope-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900')
                      }>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-hope-100 flex items-center justify-center shrink-0">
              <span className="text-hope-700 text-xs font-bold">{currentUser?.username?.[0]?.toUpperCase() ?? '?'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{currentUser?.username ?? 'User'}</p>
              <p className="text-xs text-slate-400 truncate">{currentUser?.user_type}</p>
            </div>
            <button onClick={handleSignOut} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" title="Sign out">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 flex items-center gap-3 h-14 px-4 bg-white border-b border-slate-100 lg:hidden">
          <button onClick={() => setOpen(true)} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-display text-slate-900 text-sm">Hope SMS</span>
        </header>
        <main className="flex-1 overflow-y-auto p-6 page-enter">{children}</main>
      </div>
    </div>
  )
}
