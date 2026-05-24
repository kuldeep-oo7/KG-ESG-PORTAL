import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import logoImg from '../assets/logo.jfif'

// ─── Right panel ───────────────────────────────────────────────────────────────
function AuthRightPanel() {
  return (
    <div
      className="hidden md:flex md:w-[60%] relative flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #022C22 0%, #064E3B 55%, #0D9488 100%)',
      }}
    >
      {/* Radial circuit overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(16,185,129,0.12) 0%, transparent 50%), ' +
            'radial-gradient(circle at 80% 70%, rgba(6,78,59,0.35) 0%, transparent 55%), ' +
            'radial-gradient(circle at 60% 15%, rgba(13,148,136,0.10) 0%, transparent 40%)',
          pointerEvents: 'none',
        }}
      />

      {/* Geometric grid SVG */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.06,
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="reset-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10B981" strokeWidth="0.8" />
          </pattern>
          <pattern id="reset-dots" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1.2" fill="#10B981" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#reset-grid)" />
        <rect width="100%" height="100%" fill="url(#reset-dots)" />
      </svg>

      {/* Pagination dots — top right */}
      <div className="absolute top-8 right-8 flex gap-2">
        {[false, true, false].map((active, i) => (
          <span
            key={i}
            className="block rounded-full"
            style={{
              width: active ? 20 : 8,
              height: 8,
              background: active ? '#10B981' : 'rgba(255,255,255,0.3)',
            }}
          />
        ))}
      </div>

      {/* Main card */}
      <div
        className="relative z-10 rounded-2xl px-10 py-10 max-w-sm w-full mx-8"
        style={{ background: 'rgba(2,44,34,0.65)', backdropFilter: 'blur(6px)' }}
      >
        <p
          className="text-white font-bold leading-tight mb-2"
          style={{ fontFamily: '"Hanken Grotesk", Inter, sans-serif', fontSize: '2.4rem' }}
        >
          One platform.
        </p>
        <p
          className="font-bold leading-tight mb-6"
          style={{
            fontFamily: '"Hanken Grotesk", Inter, sans-serif',
            fontSize: '2.4rem',
            color: '#10B981',
          }}
        >
          Complete ESG.
        </p>

        {/* Short green separator */}
        <div
          className="mb-4"
          style={{ width: 48, height: 3, background: '#10B981', borderRadius: 2 }}
        />

        <p
          className="text-white/50 uppercase tracking-widest"
          style={{ fontSize: '0.65rem', letterSpacing: '0.2em' }}
        >
          TRACE.&nbsp;&nbsp;REPORT.&nbsp;&nbsp;IMPROVE.
        </p>
      </div>
    </div>
  )
}

// ─── Reset Password Page ───────────────────────────────────────────────────────
export default function ResetPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen w-full font-sans">
      {/* ── Left panel ────────────────────────────────────────────────────── */}
      <div className="flex flex-col w-full md:w-[40%] bg-white px-10 py-10 justify-center min-h-screen">
        {/* Logo block */}
        <div className="mb-12">
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
          Reset Password
        </h1>
        <p className="text-sm text-slate-500 mb-8">
          Reset password to continue securely.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reset-email" className="text-sm font-medium text-slate-700">
              Email
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="reset-email"
                type="email"
                autoComplete="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/30 focus:border-[#064E3B] transition"
              />
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

        {/* Back to login */}
        <p className="text-sm text-center text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#10B981] font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>

      {/* ── Right panel ───────────────────────────────────────────────────── */}
      <AuthRightPanel />
    </div>
  )
}
