import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Settings, Search, Bell, LogOut, User, HelpCircle, X, Camera, Mail, Building2, ShieldCheck, Save } from 'lucide-react'
import logoImg from '../assets/kg-synergy-logo.jpg'

const NAV_ITEMS = [
  { label: 'Dashboard',   to: '/dashboard',  end: true },
  { label: 'Sites',       to: '/sites',      end: false },
  { label: 'GHG Reports', to: '/reports',    end: false },
  { label: 'Activity',    to: '/activity',   end: false },
  { label: 'CSR',         to: '/csr',        end: false },
  { label: 'Social',      to: '/social',     end: false },
  { label: 'Governance',  to: '/governance', end: false },
  { label: 'Help',        to: '/help',       end: false },
]

function useOutsideClick(ref, handler) {
  useEffect(() => {
    function onDown(e) { if (ref.current && !ref.current.contains(e.target)) handler() }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [ref, handler])
}

/* ── Profile Modal ─────────────────────────────────────────────── */
function ProfileModal({ user, onClose, onSave }) {
  const [name, setName]   = useState(user?.name  || 'K. Girdharlal')
  const [email]           = useState(user?.email || 'csr@kgirdharlal.com')
  const [saved, setSaved] = useState(false)

  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  function handleSave() {
    onSave({ ...user, name })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#064E3B] px-6 pt-8 pb-16 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-white font-semibold text-lg">My Profile</h2>
          <p className="text-white/60 text-sm mt-0.5">Manage your account details</p>
        </div>

        {/* Avatar overlapping header */}
        <div className="relative flex justify-center" style={{ marginTop: '-40px' }}>
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-[#064E3B] text-2xl font-bold">
              {initials}
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#064E3B] rounded-full flex items-center justify-center border-2 border-white">
              <Camera className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="px-6 pt-4 pb-6 space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
              <User className="w-3.5 h-3.5" /> Full Name
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all"
              placeholder="Your name"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
              <Mail className="w-3.5 h-3.5" /> Email Address
            </label>
            <div className="w-full border border-slate-100 rounded-xl px-4 py-2.5 text-sm text-slate-500 bg-slate-50 select-all">
              {email}
            </div>
          </div>

          {/* Organisation (read-only) */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
              <Building2 className="w-3.5 h-3.5" /> Organisation
            </label>
            <div className="w-full border border-slate-100 rounded-xl px-4 py-2.5 text-sm text-slate-500 bg-slate-50">
              K. Girdharlal Group
            </div>
          </div>

          {/* Role (read-only) */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Role
            </label>
            <div className="w-full border border-slate-100 rounded-xl px-4 py-2.5 text-sm bg-slate-50 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#064E3B]/10 text-[#064E3B] text-xs font-semibold">
                <ShieldCheck className="w-3 h-3" /> Admin
              </span>
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              saved
                ? 'bg-emerald-500 text-white'
                : 'bg-[#064E3B] hover:bg-[#065F46] text-white'
            }`}
          >
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Settings Dropdown ─────────────────────────────────────────── */
function SettingsDropdown({ onClose }) {
  return (
    <div className="absolute right-0 top-10 w-52 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1">
      <div className="px-4 py-2.5 border-b border-slate-100">
        <p className="text-xs font-semibold text-slate-700">Settings</p>
      </div>
      {[
        { label: 'Account Settings',    icon: User },
        { label: 'Notifications',       icon: Bell },
        { label: 'Help & Support',      icon: HelpCircle },
      ].map(({ label, icon: Icon }) => (
        <button
          key={label}
          onClick={onClose}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors text-left"
        >
          <Icon className="w-4 h-4 text-slate-400" />
          {label}
        </button>
      ))}
    </div>
  )
}

/* ── Profile Dropdown ──────────────────────────────────────────── */
function ProfileDropdown({ user, onClose, navigate, onOpenProfile }) {
  return (
    <div className="absolute right-0 top-10 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1">
      <div className="px-4 py-3 border-b border-slate-100">
        <p className="text-sm font-semibold text-slate-800 truncate">{user?.name || 'K. Girdharlal'}</p>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{user?.email || 'csr@kgirdharlal.com'}</p>
      </div>
      <button
        onClick={() => { onClose(); onOpenProfile() }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors text-left"
      >
        <User className="w-4 h-4 text-slate-400" />
        My Profile
      </button>
      <button
        onClick={() => { onClose(); navigate('/help') }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors text-left"
      >
        <HelpCircle className="w-4 h-4 text-slate-400" />
        Help
      </button>
      <div className="border-t border-slate-100 mt-1" />
      <button
        onClick={() => { localStorage.removeItem('kg_current_user_v1'); onClose(); navigate('/') }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  )
}

/* ── Navbar ────────────────────────────────────────────────────── */
export default function Navbar() {
  const navigate = useNavigate()
  const [showSettings,  setShowSettings]  = useState(false)
  const [showProfile,   setShowProfile]   = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const settingsRef = useRef(null)
  const profileRef  = useRef(null)

  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('kg_current_user_v1')
    if (raw) { try { return JSON.parse(raw) } catch { /* ignore */ } }
    return { name: 'K. Girdharlal', email: 'csr@kgirdharlal.com' }
  })

  useOutsideClick(settingsRef, () => setShowSettings(false))
  useOutsideClick(profileRef,  () => setShowProfile(false))

  function handleSaveProfile(updated) {
    setUser(updated)
    localStorage.setItem('kg_current_user_v1', JSON.stringify(updated))
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'K'

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-6 px-6 h-24 max-w-[1440px] mx-auto w-full">

          {/* Logo */}
          <NavLink to="/dashboard" className="flex items-center shrink-0 no-underline">
            <img src={logoImg} alt="KG SYNERGY" className="w-auto object-contain" style={{ height: 80 }} />
          </NavLink>

          {/* Nav links */}
          <nav className="flex items-center gap-0 flex-1 justify-center">
            {NAV_ITEMS.map(({ label, to, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    'relative px-3.5 py-5 text-sm font-medium transition-colors select-none whitespace-nowrap',
                    isActive
                      ? 'text-slate-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#064E3B]'
                      : 'text-slate-500 hover:text-slate-900',
                  ].join(' ')
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right: search + settings + avatar */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search */}
            <div className="flex items-center gap-2 rounded-full px-3.5 py-1.5 bg-slate-100 border border-slate-200 min-w-[160px]">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search data..."
                className="bg-transparent border-none outline-none text-slate-600 text-xs w-full placeholder-slate-400"
              />
            </div>

            {/* Settings */}
            <div ref={settingsRef} className="relative">
              <button
                onClick={() => { setShowSettings(v => !v); setShowProfile(false) }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                title="Settings"
              >
                <Settings className="w-4.5 h-4.5 text-slate-500" />
              </button>
              {showSettings && <SettingsDropdown onClose={() => setShowSettings(false)} />}
            </div>

            {/* Profile avatar */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => { setShowProfile(v => !v); setShowSettings(false) }}
                className="flex items-center gap-1.5 cursor-pointer group"
                title="Profile"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold bg-[#064E3B] ring-2 ring-[#064E3B]/20 group-hover:ring-[#064E3B]/40 transition-all">
                  {initials}
                </div>
              </button>
              {showProfile && (
                <ProfileDropdown
                  user={user}
                  onClose={() => setShowProfile(false)}
                  navigate={navigate}
                  onOpenProfile={() => setShowProfileModal(true)}
                />
              )}
            </div>
          </div>

        </div>
      </header>

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfileModal(false)}
          onSave={handleSaveProfile}
        />
      )}
    </>
  )
}
