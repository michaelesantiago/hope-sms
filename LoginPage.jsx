import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { signInWithEmail, signInWithGoogle } from '../../services/authService'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.185l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 6.294C4.672 4.169 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

function validate({ email, password }) {
  const e = {}
  if (!email.trim()) e.email = 'Email is required.'
  else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address.'
  if (!password) e.password = 'Password is required.'
  else if (password.length < 6) e.password = 'Password must be at least 6 characters.'
  return e
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/sales'
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiErr, setApiErr] = useState(null)
  const [loading, setLoading] = useState(false)
  const [gLoading, setGLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: undefined }))
    setApiErr(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    const { error } = await signInWithEmail(form)
    setLoading(false)
    if (error) { setApiErr(error.message?.includes('Invalid') ? 'Incorrect email or password.' : error.message); return }
    navigate(from, { replace: true })
  }

  async function handleGoogle() {
    setGLoading(true)
    const { error } = await signInWithGoogle()
    if (error) { setApiErr(error.message); setGLoading(false) }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-hope-50 px-4 py-12 page-enter">
      <div className="mb-8 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-hope-100 text-hope-700 text-xs font-semibold tracking-widest uppercase mb-3">Hope, Inc.</span>
        <h1 className="font-display text-3xl text-slate-900">Sales Management</h1>
        <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>
      </div>
      <div className="auth-card">
        {apiErr && (
          <div className="alert-error mb-5" role="alert">
            <span>{apiErr}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="form-label" htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" autoComplete="email"
              value={form.email} onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="you@example.com" disabled={loading || gLoading} />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
          <div className="mb-6">
            <label className="form-label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password"
              value={form.password} onChange={handleChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="••••••••" disabled={loading || gLoading} />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>
          <button type="submit" className="btn-primary" disabled={loading || gLoading}>
            {loading && <span className="spinner" />}
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <div className="or-divider">or</div>
        <button type="button" className="btn-secondary" onClick={handleGoogle} disabled={loading || gLoading}>
          {gLoading ? <span className="spinner" /> : <GoogleIcon />}
          {gLoading ? 'Redirecting…' : 'Sign in with Google'}
        </button>
        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-hope-600 hover:underline">Register</Link>
        </p>
      </div>
      <p className="mt-8 text-xs text-slate-400 text-center max-w-sm">
        New accounts require activation by a Sales Manager before access is granted.
      </p>
    </div>
  )
}
