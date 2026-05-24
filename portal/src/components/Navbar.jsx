import { NavLink } from 'react-router-dom'
import { Settings, Search } from 'lucide-react'
import logoImg from '../assets/logo.jfif'

const NAV_ITEMS = [
  { label: 'Dashboard',   to: '/',           end: true },
  { label: 'Sites',       to: '/sites',      end: false },
  { label: 'GHG Reports', to: '/reports',    end: false },
  { label: 'CSR',         to: '/csr',        end: false },
  { label: 'Social',      to: '/social',     end: false },
  { label: 'Governance',  to: '/governance', end: false },
  { label: 'Help',        to: '/help',       end: false },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center gap-6 px-6 h-14">

        {/* Logo */}
        <NavLink to="/" className="flex items-center shrink-0">
          <img src={logoImg} alt="K.GIRDHARLAL" className="h-8 w-auto object-contain rounded" />
        </NavLink>

        {/* Nav links */}
        <nav className="flex items-center gap-0.5 flex-1 justify-center">
          {NAV_ITEMS.map(({ label, to, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  'relative px-3 py-4 text-sm font-medium transition-colors select-none',
                  isActive
                    ? 'text-slate-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#064E3B]'
                    : 'text-slate-500 hover:text-slate-900',
                ].join(' ')
              }
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right: search + settings + avatar */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Search pill */}
          <div className="flex items-center gap-2 rounded-full px-3 py-1.5 bg-slate-100 border border-slate-200">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search data..."
              className="bg-transparent border-none outline-none text-slate-600 text-xs w-28 placeholder-slate-400"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          {/* Settings icon */}
          <Settings className="w-4 h-4 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors" />

          {/* User avatar */}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold cursor-pointer"
            style={{ backgroundColor: '#064E3B', fontFamily: "'Inter', sans-serif" }}
          >
            G
          </div>
        </div>

      </div>
    </header>
  )
}
