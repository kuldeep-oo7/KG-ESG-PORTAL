import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Mail, User } from 'lucide-react'
import logoImg from '../assets/logo-full.png'
import authPanelImg from '../assets/auth-panel.png'

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

export default function SignUp() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(data => { throw new Error(data.error || 'Signup failed') })
        }
        return res.json()
      })
      .then(user => {
        localStorage.setItem('kg_current_user_v1', JSON.stringify(user))
        navigate('/dashboard')
      })
      .catch(err => {
        setError(err.message)
      })
  }

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans">
      {/* Left panel */}
      <div className="flex h-screen flex-col w-full md:w-[40%] bg-white px-10 py-8 justify-center overflow-y-auto">
        <div className="mb-8 flex justify-center">
          <img src={logoImg} alt="K.GIRDHARLAL" className="w-56 h-auto object-contain" />
        </div>

        <h1 className="font-bold text-2xl text-slate-900 mb-1" style={{ fontFamily: '"Hanken Grotesk", Inter, sans-serif' }}>
          Create Account
        </h1>
        <p className="text-sm text-slate-500 mb-6">Get started with your ESG portal account.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/30 focus:border-[#064E3B] transition"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/30 focus:border-[#064E3B] transition"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                required
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/30 focus:border-[#064E3B] transition"
              />
              <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm" className="text-sm font-medium text-slate-700">Confirm Password</label>
            <div className="relative">
              <input
                id="confirm"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Re-enter password"
                value={confirm}
                onChange={e => { setConfirm(e.target.value); setError('') }}
                required
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#064E3B]/30 focus:border-[#064E3B] transition"
              />
              <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 transition hover:opacity-90 active:scale-[0.98]"
            style={{ background: '#064E3B' }}
          >
            Create Account <span aria-hidden="true">→</span>
          </button>
        </form>

        <p className="text-sm text-center text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#10B981] font-medium hover:underline">Sign In</Link>
        </p>
      </div>

      <AuthRightPanel />
    </div>
  )
}
