import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AppShell from './components/layout/AppShell'
import LoginPage        from './pages/auth/LoginPage'
import RegisterPage     from './pages/auth/RegisterPage'
import AuthCallbackPage from './pages/auth/AuthCallbackPage'
import {
  SalesListPage, SalesDetailPage,
  CustomerLookupPage, EmployeeLookupPage, ProductLookupPage, PriceLookupPage,
  ReportsPage, AdminPage, DeletedItemsPage,
} from './pages/PlaceholderPages'

function Shell({ children }) {
  return <ProtectedRoute><AppShell>{children}</AppShell></ProtectedRoute>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login"          element={<LoginPage />} />
          <Route path="/register"       element={<RegisterPage />} />
          <Route path="/auth/callback"  element={<AuthCallbackPage />} />
          <Route path="/sales"          element={<Shell><SalesListPage /></Shell>} />
          <Route path="/sales/:transNo" element={<Shell><SalesDetailPage /></Shell>} />
          <Route path="/lookups/customers" element={<Shell><CustomerLookupPage /></Shell>} />
          <Route path="/lookups/employees" element={<Shell><EmployeeLookupPage /></Shell>} />
          <Route path="/lookups/products"  element={<Shell><ProductLookupPage /></Shell>} />
          <Route path="/lookups/prices"    element={<Shell><PriceLookupPage /></Shell>} />
          <Route path="/reports"        element={<Shell><ReportsPage /></Shell>} />
          <Route path="/admin"          element={<Shell><AdminPage /></Shell>} />
          <Route path="/deleted-items"  element={<Shell><DeletedItemsPage /></Shell>} />
          <Route path="*"              element={<Navigate to="/sales" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
