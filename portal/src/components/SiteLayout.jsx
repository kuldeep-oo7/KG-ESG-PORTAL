import { NavLink, useParams, useNavigate } from 'react-router-dom'
import { ChevronRight, Calendar, Zap, TrendingUp, ClipboardList } from 'lucide-react'
import { useGHG } from '../store/useGHG'
import { SITES } from '../data/ghgData'
import { SCOPE3_MODULES } from '../lib/constants'

const SCOPE1_ITEMS = [
  { key: 'stationary', label: 'Stationary Combustion', path: 'scope1/stationary' },
  { key: 'mobile',     label: 'Mobile Combustion',     path: 'scope1/mobile' },
  { key: 'fugitive',   label: 'Fugitive Emissions',    path: 'scope1/fugitive' },
]
const SCOPE2_ITEMS = [
  { key: 'electricity', label: 'Purchased Electricity',              path: 'scope2/electricity' },
  { key: 'heatSteam',   label: 'Purchased Heat and Steam',           path: 'scope2/heatsteam' },
  { key: 'renewable',   label: 'Renewable Electricity Generation',   path: 'scope2/renewable' },
]
const SCOPE3_ITEMS = SCOPE3_MODULES.map(m => ({
  key: m.key, label: m.label,
  path: `scope3/${m.key.replace(/([A-Z])/g, '-$1').toLowerCase()}`,
}))

function SidebarSection({ num, label, items, siteId, expanded, onToggle }) {
  const { getModuleTotal } = useGHG()
  const baseUrl = `/sites/${siteId}`
  return (
    <div>
      <button onClick={onToggle}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${expanded ? 'text-[#064E3B]' : 'text-slate-500 hover:text-slate-700'}`}>
        <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${expanded ? 'border-[#064E3B] text-[#064E3B]' : 'border-slate-300 text-slate-400'}`}>{num}</span>
        {label}
      </button>
      {expanded && (
        <div className="ml-9 mt-1 space-y-0.5">
          {items.map(item => {
            const total = getModuleTotal(siteId, item.key)
            return (
              <NavLink key={item.key} to={`${baseUrl}/${item.path}`}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${isActive ? 'bg-[#ECFDF5] text-[#064E3B] font-semibold' : 'text-slate-600 hover:bg-slate-50'}`
                }>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#064E3B] flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </span>
                  {item.label}
                </div>
                {total > 0 && <span className="text-[10px] font-bold text-[#10B981]">{total.toFixed(3)}</span>}
              </NavLink>
            )
          })}
          <NavLink to={`${baseUrl}/${items[0]?.path?.split('/')[0]}/summary`}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${isActive ? 'bg-[#ECFDF5] text-[#064E3B] font-semibold' : 'text-slate-400 hover:bg-slate-50'}`
            }>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            Summary
          </NavLink>
        </div>
      )}
    </div>
  )
}

export default function SiteLayout({ children }) {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const site = SITES.find(s => s.code === siteId)

  const pathname = window.location.pathname
  const expandedScope = pathname.includes('/scope1') ? '1' : pathname.includes('/scope2') ? '2' : pathname.includes('/scope3') ? '3' : '1'

  const iconLinks = [
    { icon: <span className="text-xs font-bold">1</span>,    to: `scope1/stationary`,  label: 'Scope 1' },
    { icon: <span className="text-xs font-bold">2</span>,    to: `scope2/electricity`, label: 'Scope 2' },
    { icon: <span className="text-xs font-bold">3</span>,    to: `scope3/employee-commute`, label: 'Scope 3' },
    { icon: <TrendingUp className="w-4 h-4" />,              to: `intensity`,          label: 'Intensity' },
    { icon: <ClipboardList className="w-4 h-4" />,           to: `reports`,            label: 'Reports' },
    { icon: <Zap className="w-4 h-4" />,                     to: `energy`,             label: 'Energy' },
  ]

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      {/* Icon rail */}
      <div className="w-12 bg-white border-r border-slate-200 flex flex-col items-center py-4 gap-3 shrink-0">
        {iconLinks.map((l, i) => (
          <NavLink key={i} to={`/sites/${siteId}/${l.to}`}
            title={l.label}
            className={({ isActive }) =>
              `w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${isActive ? 'border-[#064E3B] text-[#064E3B] bg-[#ECFDF5]' : 'border-slate-200 text-slate-400 hover:border-[#10B981] hover:text-[#10B981]'}`
            }>
            {l.icon}
          </NavLink>
        ))}
      </div>

      {/* Expandable sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col py-4 px-2 gap-1 shrink-0 overflow-y-auto">
        <SidebarSection num="1" label="Scope 1" items={SCOPE1_ITEMS} siteId={siteId} expanded={expandedScope === '1'} onToggle={() => navigate(`/sites/${siteId}/scope1/stationary`)} />
        <SidebarSection num="2" label="Scope 2" items={SCOPE2_ITEMS} siteId={siteId} expanded={expandedScope === '2'} onToggle={() => navigate(`/sites/${siteId}/scope2/electricity`)} />
        <SidebarSection num="3" label="Scope 3" items={SCOPE3_ITEMS} siteId={siteId} expanded={expandedScope === '3'} onToggle={() => navigate(`/sites/${siteId}/scope3/employee-commute`)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-[#F8FAFC]">
        {/* Top bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="text-[#064E3B] font-medium">{site?.name || siteId}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-600">
              {pathname.includes('scope1') ? 'Scope 1' : pathname.includes('scope2') ? 'Scope 2' : pathname.includes('scope3') ? 'Scope 3' : 'Overview'}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            May 2026
            <button className="w-5 h-5 rounded-full bg-[#064E3B] flex items-center justify-center text-white text-[10px] ml-1">✎</button>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
