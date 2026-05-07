import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { currentUser, authLoading } = useAuth()
  const location = useLocation()

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="spinner text-hope-600 mx-auto mb-3" />
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    </div>
  )

  if (!currentUser) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}
