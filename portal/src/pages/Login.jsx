import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Mail } from 'lucide-react'
import logoImg from '../assets/logo.jfif'
import authPanelImg from '../assets/auth-panel.png'

// ─── Right panel — reused on all auth pages ─────────────────────────────────
function AuthRightPanel() {
  return (
    <div className="hidden md:block md:w-[60%] h-screen overflow-hidden bg-[#022C22] relative">
      <img
        src={authPanelImg}
        alt="One platform. Complete ESG. Trace. Report. Improve."
        className="h-full w-full object-cover"
      />
      <div className="absolute left-10 top-10 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
        <img src={logoImg} alt="K.GIRDHARLAL" className="h-10 w-auto rounded bg-white object-contain p-1" />
        <div>
          <p className="text-sm font-bold tracking-wide text-white">K.GIRDHARLAL</p>
          <p className="text-[8px] uppercase tracking-[0.22em] text-white/55">ESG Portal</p>
        </div>
      </div>
    </div>
  )
}

// ─── Login Page ────────────────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans">
      {/* ── Left panel ────────────────────────────────────────────────────── */}
      <div className="flex h-screen flex-col w-full md:w-[40%] bg-white px-10 py-8 justify-center overflow-y-auto">
        {/* Logo block */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <img src={logoImg} alt="K.GIRDHARLAL" className="h-10 w-auto object-contain rounded" />
            <span
              className="font-bold text-[#064E3B]"
              style={{ fontFamily: '"Hanken Grotesk", Inter, sans-serif', fontSize: '1.1rem' }}
            >
              K.GIRDHARLAL
            </span>
          </div>
          <p
            className="text-[#064E3B]/60 uppercase"
            style={{ fontSize: '8px', letterSpacing: '0.2em' }}
          >
            THERE&apos;S MORE TO MAKING DIAMONDS
          </p>
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
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/30 focus:border-[#064E3B] transition"
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 transition hover:opacity-90 active:scale-[0.98]"
            style={{ background: '#064E3B' }}
          >
            Submit <span aria-hidden="true">→</span>
          </button>
        </form>
      </div>

      {/* ── Right panel ───────────────────────────────────────────────────── */}
      <AuthRightPanel />
    </div>
  )
}
