import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function AuthCallbackPage() {
  const { currentUser, authLoading, authError } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (authLoading) return
    if (authError) { navigate(`/login?error=${encodeURIComponent(authError)}`, { replace: true }); return }
    if (currentUser) navigate('/sales', { replace: true })
    else navigate('/login', { replace: true })
  }, [authLoading, currentUser, authError, navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-hope-50 page-enter">
      <div className="text-center">
        <div className="spinner text-hope-600 mx-auto mb-4" style={{ width:'2rem', height:'2rem', borderWidth:'3px' }} />
        <p className="font-display text-xl text-slate-700 mb-1">Signing you in…</p>
        <p className="text-sm text-slate-400">Just a moment</p>
      </div>
    </div>
  )
}
