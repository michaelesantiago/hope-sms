import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signUpWithEmail, signInWithGoogle } from '../../services/authService'

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

function validate(f) {
  const e = {}
  if (!f.firstName.trim()) e.firstName = 'First name is required.'
  if (!f.lastName.trim()) e.lastName = 'Last name is required.'
  if (!f.username.trim()) e.username = 'Username is required.'
  else if (f.username.length < 3) e.username = 'At least 3 characters.'
  else if (!/^[a-zA-Z0-9_]+$/.test(f.username)) e.username = 'Letters, numbers, underscores only.'
  if (!f.email.trim()) e.email = 'Email is required.'
  else if (!/\S+@\S+\.\S+/.test(f.email)) e.email = 'Enter a valid email address.'
  if (!f.password) e.password = 'Password is required.'
  else if (f.password.length < 8) e.password = 'At least 8 characters.'
  if (f.password !== f.confirmPassword) e.confirmPassword = 'Passwords do not match.'
  return e
}

const EMPTY = { firstName:'', lastName:'', username:'', email:'', password:'', confirmPassword:'' }

export default function RegisterPage() {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [apiErr, setApiErr] = useState(null)
  const [loading, setLoading] = useState(false)
  const [gLoading, setGLoading] = useState(false)
  const [success, setSuccess] = useState(false)

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
    const { error } = await signUpWithEmail({ email: form.email, password: form.password, firstName: form.firstName, lastName: form.lastName, username: form.username })
    setLoading(false)
    if (error) { setApiErr(error.message?.includes('already') ? 'An account with this email already exists.' : error.message); return }
    setSuccess(true)
  }

  async function handleGoogle() {
    setGLoading(true)
    const { error } = await signInWithGoogle()
    if (error) { setApiErr(error.message); setGLoading(false) }
  }

  if (success) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-hope-50 px-4 py-12 page-enter">
      <div className="auth-card text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-display text-2xl text-slate-900 mb-2">Check your email</h2>
        <p className="text-slate-500 text-sm mb-4">We sent a confirmation link to <strong className="text-slate-700">{form.email}</strong>.</p>
        <div className="alert-info mb-4">
          <span>Your account will be <strong>USER / INACTIVE</strong>. A Sales Manager must activate it before you can log in.</span>
        </div>
        <Link to="/login" className="btn-primary inline-flex w-auto px-8">Back to Login</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-hope-50 px-4 py-12 page-enter">
      <div className="mb-8 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-hope-100 text-hope-700 text-xs font-semibold tracking-widest uppercase mb-3">Hope, Inc.</span>
        <h1 className="font-display text-3xl text-slate-900">Create an account</h1>
        <p className="text-slate-500 text-sm mt-1">Register to request SMS access</p>
      </div>
      <div className="auth-card">
        {apiErr && <div className="alert-error mb-5"><span>{apiErr}</span></div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="form-label" htmlFor="firstName">First name</label>
              <input id="firstName" name="firstName" type="text" value={form.firstName} onChange={handleChange}
                className={`form-input ${errors.firstName ? 'error' : ''}`} placeholder="Juan" disabled={loading || gLoading} />
              {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
            </div>
            <div>
              <label className="form-label" htmlFor="lastName">Last name</label>
              <input id="lastName" name="lastName" type="text" value={form.lastName} onChange={handleChange}
                className={`form-input ${errors.lastName ? 'error' : ''}`} placeholder="Dela Cruz" disabled={loading || gLoading} />
              {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label" htmlFor="username">Username</label>
            <input id="username" name="username" type="text" value={form.username} onChange={handleChange}
              className={`form-input ${errors.username ? 'error' : ''}`} placeholder="jdelacruz" disabled={loading || gLoading} />
            {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username}</p>}
          </div>
          <div className="mb-4">
            <label className="form-label" htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`} placeholder="you@example.com" disabled={loading || gLoading} />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="form-label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange}
              className={`form-input ${errors.password ? 'error' : ''}`} placeholder="Min. 8 characters" disabled={loading || gLoading} />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>
          <div className="mb-6">
            <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`} placeholder="Re-enter password" disabled={loading || gLoading} />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
          </div>
          <button type="submit" className="btn-primary" disabled={loading || gLoading}>
            {loading && <span className="spinner" />}
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <div className="or-divider">or</div>
        <button type="button" className="btn-secondary" onClick={handleGoogle} disabled={loading || gLoading}>
          {gLoading ? <span className="spinner" /> : <GoogleIcon />}
          {gLoading ? 'Redirecting…' : 'Register with Google'}
        </button>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-hope-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
