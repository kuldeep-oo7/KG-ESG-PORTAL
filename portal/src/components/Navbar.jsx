import { NavLink } from 'react-router-dom'
import { Settings } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard',   to: '/' },
  { label: 'Sites',       to: '/sites' },
  { label: 'GHG Reports', to: '/reports' },
  { label: 'Help',        to: '/help' },
]

export default function Navbar() {
  return (
    <header className="bg-white sticky top-0 z-50 border-b border-[#E2E8F0]">
      <div className="flex items-center gap-6 px-6 h-14">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-8 h-8">
              <polygon points="16,2 30,16 16,30 2,16" fill="#10B981" opacity="0.9"/>
              <polygon points="16,7 25,16 16,25 7,16" fill="#064E3B"/>
              <circle cx="16" cy="16" r="3" fill="#6EE7B7"/>
            </svg>
          </div>
          <span className="text-[#064E3B] font-semibold text-sm leading-tight hidden xl:block">
            K. Girdharlal International
          </span>
        </NavLink>

        {/* Nav links */}
        <nav className="flex items-center gap-1 flex-1">
          {NAV_ITEMS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded text-sm transition-colors ${
                  isActive
                    ? 'text-[#064E3B] font-semibold'
                    : 'text-[#64748B] hover:text-[#064E3B]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Period badge */}
        <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F0FDF4] px-3 py-1 text-[11px] font-medium text-[#064E3B]">
          Reporting Period: May 2026
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <Settings className="w-4 h-4 text-[#64748B] hover:text-[#064E3B] cursor-pointer" />
          <div className="w-7 h-7 rounded-full bg-[#064E3B] flex items-center justify-center text-white text-xs font-semibold">
            G
          </div>
        </div>
      </div>
    </header>
  )
}
