import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError,   setAuthError]   = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) runLoginGuard(session)
      else setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') { setCurrentUser(null); setAuthLoading(false); return }
      if (session) await runLoginGuard(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function runLoginGuard(session) {
    setAuthLoading(true)
    setAuthError(null)
    try {
      const { data: userRow, error } = await supabase
        .from('user').select('record_status,user_type,username,userId')
        .eq('userId', session.user.id).single()

      if (error || !userRow) {
        await supabase.auth.signOut()
        setAuthError('Your account is being set up. Please try again in a moment.')
        setCurrentUser(null)
        return
      }
      if (userRow.record_status !== 'ACTIVE') {
        await supabase.auth.signOut()
        setAuthError('Your account is pending activation by a Sales Manager.')
        setCurrentUser(null)
        return
      }
      setCurrentUser({ ...session.user, ...userRow })
    } catch {
      await supabase.auth.signOut()
      setAuthError('An unexpected error occurred. Please try logging in again.')
      setCurrentUser(null)
    } finally {
      setAuthLoading(false)
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider value={{ currentUser, authLoading, authError, setAuthError, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
