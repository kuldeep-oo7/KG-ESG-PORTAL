import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Mail } from 'lucide-react'
import logoImg from '../assets/logo-full.png'
import authPanelImg from '../assets/auth-panel.png'
import { apiUrl, isNetworkError, LOCAL_FALLBACK_ENABLED } from '../lib/api'

// ─── Right panel — reused on all auth pages ─────────────────────────────────
function AuthRightPanel() {
  return (
    <div className="hidden md:block md:w-[60%] h-screen overflow-hidden bg-[#022C22] relative">
      <img
        src={authPanelImg}
        alt="One platform. Complete ESG. Trace. Report. Improve."
        className="h-full w-full object-cover"
      />
    </div>
  )
}

// ─── Login Page ────────────────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const url = apiUrl('/api/auth/login')

    // No backend configured — use built-in local fallback directly
    if (!url) {
      const DEFAULT_ADMIN = {
        name: 'K. Girdharlal',
        email: 'csr@kgirdharlal.com',
        password: 'password123',
        role: 'admin',
      }
      const stored = localStorage.getItem('kg_users_v1')
      let users
      try { users = stored ? JSON.parse(stored) : [] } catch { users = [] }

      const allUsers = [DEFAULT_ADMIN, ...users.filter(u => u.email.toLowerCase() !== DEFAULT_ADMIN.email)]
      const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase())

      if (!found) { setError('Email address not registered.'); return }
      if (found.password !== password) { setError('Incorrect password.'); return }

      const { password: _pw, ...safeUser } = found
      localStorage.setItem('kg_current_user_v1', JSON.stringify(safeUser))
      navigate('/dashboard')
      return
    }

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then(res => {
        if (!res.ok) return res.json().then(data => { throw new Error(data.error || 'Login failed') })
        return res.json()
      })
      .then(user => {
        localStorage.setItem('kg_current_user_v1', JSON.stringify(user))
        navigate('/dashboard')
      })
      .catch(err => {
        if (LOCAL_FALLBACK_ENABLED && isNetworkError(err)) {
          const DEFAULT_ADMIN = {
            name: 'K. Girdharlal',
            email: 'csr@kgirdharlal.com',
            password: 'password123',
            role: 'admin',
          }
          const stored = localStorage.getItem('kg_users_v1')
          let users
          try { users = stored ? JSON.parse(stored) : [] } catch { users = [] }

          const allUsers = [DEFAULT_ADMIN, ...users.filter(u => u.email.toLowerCase() !== DEFAULT_ADMIN.email)]
          const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase())

          if (!found) { setError('Email address not registered.'); return }
          if (found.password !== password) { setError('Incorrect password.'); return }

          const { password: _pw, ...safeUser } = found
          localStorage.setItem('kg_current_user_v1', JSON.stringify(safeUser))
          navigate('/dashboard')
        } else {
          setError(err.message)
        }
      })
  }



  return (
    <div className="flex h-screen w-full overflow-hidden font-sans">
      {/* ── Left panel ────────────────────────────────────────────────────── */}
      <div className="flex h-screen flex-col w-full md:w-[40%] bg-white px-10 py-8 justify-center overflow-y-auto">
        {/* Logo block — centered */}
        <div className="mb-8 flex justify-center">
          <img src={logoImg} alt="K.GIRDHARLAL" className="w-56 h-auto object-contain" />
        </div>

        {/* Heading */}
        <h1
          className="font-bold text-2xl text-slate-900 mb-1"
          style={{ fontFamily: '"Hanken Grotesk", Inter, sans-serif' }}
        >
          Sign In
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Welcome back! Please enter your details.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                required
                className="w-full pl-4 pr-9 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/30 focus:border-[#064E3B] transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-[#10B981] hover:underline font-medium"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                required
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/30 focus:border-[#064E3B] transition"
              />
              <button
                type="button"
                aria-label={showPass ? 'Hide password' : 'Show password'}
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 transition hover:opacity-90 active:scale-[0.98]"
            style={{ background: '#064E3B' }}
          >
            Submit <span aria-hidden="true">→</span>
          </button>
        </form>

        <p className="text-sm text-center text-slate-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-[#10B981] font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>

      {/* ── Right panel ───────────────────────────────────────────────────── */}
      <AuthRightPanel />
    </div>
  )
}
