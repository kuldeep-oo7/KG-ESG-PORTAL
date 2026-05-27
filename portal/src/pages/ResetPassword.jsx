import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import logoImg from '../assets/logo.jfif'
import authPanelImg from '../assets/auth-panel.png'

// ─── Right panel ───────────────────────────────────────────────────────────────
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

// ─── Reset Password Page ───────────────────────────────────────────────────────
export default function ResetPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    navigate('/login')
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
          Reset Password
        </h1>
        <p className="text-sm text-slate-500 mb-6">
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
