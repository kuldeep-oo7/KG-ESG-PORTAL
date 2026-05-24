import { NavLink } from 'react-router-dom'
import { Settings, Search } from 'lucide-react'
import logoImg from '../assets/logo.jfif'

const NAV_ITEMS = [
  { label: 'Dashboard',   to: '/',            end: true },
  { label: 'Sites',       to: '/sites',       end: false },
  { label: 'GHG Reports', to: '/reports',     end: false },
  { label: 'CSR',         to: '/csr',         end: false },
  { label: 'Social',      to: '/social',      end: false },
  { label: 'Governance',  to: '/governance',  end: false },
  { label: 'Help',        to: '/help',        end: false },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: '#0B0F18' }}>
      <div className="flex items-center gap-6 px-6 h-14">

        {/* Logo + brand text */}
        <NavLink to="/" className="flex items-center gap-2.5 shrink-0 no-underline">
          <img src={logoImg} alt="K.GIRDHARLAL" className="h-8 w-auto object-contain shrink-0 rounded" />
          <div className="flex flex-col leading-none">
            <span
              className="font-bold text-white text-sm tracking-wide"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
            >
              K.GIRDHARLAL
            </span>
            <span
              className="text-[10px] uppercase tracking-widest mt-0.5"
              style={{ color: '#6EE7B7', fontFamily: "'Inter', sans-serif", opacity: 0.75 }}
            >
              THERE&apos;S MORE TO MAKING DIAMONDS
            </span>
          </div>
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
                  'relative px-3 py-4 text-sm transition-colors select-none',
                  'font-medium',
                  isActive
                    ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#10B981]'
                    : 'text-[#9CA3AF] hover:text-white',
                ].join(' ')
              }
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right side: search + settings + avatar */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Search pill */}
          <div
            className="flex items-center gap-2 rounded-full px-3 py-1.5"
            style={{ backgroundColor: '#1A2035' }}
          >
            <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search data..."
              className="bg-transparent border-none outline-none text-gray-400 text-xs w-32 placeholder-gray-500"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          {/* Settings icon */}
          <Settings
            className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer transition-colors"
          />

          {/* User avatar */}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0 cursor-pointer"
            style={{ backgroundColor: '#064E3B', fontFamily: "'Inter', sans-serif" }}
          >
            G
          </div>
        </div>
      </div>
    </header>
  )
}
