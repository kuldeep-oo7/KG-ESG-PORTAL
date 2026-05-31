import { NavLink, useParams, useNavigate, useLocation } from 'react-router-dom'
import { ChevronRight, Zap, TrendingUp, ClipboardList, Home } from 'lucide-react'
import { useGHG } from '../store/useGHG'
import { SITES } from '../data/ghgData'
import { SCOPE3_MODULES } from '../lib/constants'

const LS_SITES_KEY = 'kg_sites_v1'

function loadSites() {
  try {
    const raw = localStorage.getItem(LS_SITES_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return SITES
}

const SCOPE1_ITEMS = [
  { key: 'stationary', label: 'Stationary Combustion', path: 'scope1/stationary' },
  { key: 'mobile',     label: 'Mobile Combustion',     path: 'scope1/mobile'     },
  { key: 'fugitive',   label: 'Fugitive Emissions',    path: 'scope1/fugitive'   },
]
const SCOPE2_ITEMS = [
  { key: 'electricity', label: 'Purchased Electricity',            path: 'scope2/electricity' },
  { key: 'heatSteam',   label: 'Purchased Heat & Steam',           path: 'scope2/heatsteam'   },
  { key: 'renewable',   label: 'Renewable Electricity Generation', path: 'scope2/renewable'   },
]
const SCOPE3_ITEMS = SCOPE3_MODULES.map(m => ({
  key: m.key,
  label: m.label,
  path: `scope3/${m.key.replace(/([A-Z])/g, '-$1').toLowerCase()}`,
}))

const SCOPE_COLORS = { '1': '#064E3B', '2': '#10B981', '3': '#3B82F6' }

function SidebarSection({ num, items, siteId, expanded, onToggle }) {
  const { getModuleTotal } = useGHG()
  const baseUrl = `/sites/${siteId}`
  const scopeTotal = +items.reduce((s, item) => s + getModuleTotal(siteId, item.key), 0).toFixed(3)
  const color = SCOPE_COLORS[num] ?? '#064E3B'

  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
          expanded
            ? 'bg-[#ECFDF5] text-[#064E3B]'
            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
        }`}
      >
        <span
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-colors`}
          style={expanded
            ? { borderColor: color, color }
            : { borderColor: '#CBD5E1', color: '#94A3B8' }
          }
        >
          {num}
        </span>
        <span className="flex-1 text-left">Scope {num}</span>
        {scopeTotal > 0 && (
          <span className="text-[10px] font-bold tabular-nums" style={{ color }}>
            {scopeTotal.toFixed(2)}
          </span>
        )}
      </button>

      {expanded && (
        <div className="ml-9 mt-1 space-y-0.5 pb-1">
          {items.map(item => {
            const total = getModuleTotal(siteId, item.key)
            return (
              <NavLink
                key={item.key}
                to={`${baseUrl}/${item.path}`}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                    isActive
                      ? 'bg-[#064E3B] text-white font-semibold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0 opacity-60" />
                  <span className="truncate">{item.label}</span>
                </div>
                {total > 0 && (
                  <span className="text-[9px] font-bold ml-1 shrink-0 tabular-nums text-[#10B981]">
                    {total.toFixed(3)}
                  </span>
                )}
              </NavLink>
            )
          })}
          <NavLink
            to={`${baseUrl}/${items[0]?.path?.split('/')[0]}/summary`}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                isActive ? 'bg-[#ECFDF5] text-[#064E3B] font-semibold' : 'text-slate-400 hover:bg-slate-50'
              }`
            }
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
            Scope {num} Summary
          </NavLink>
        </div>
      )}
    </div>
  )
}

function getScopeLabel(pathname) {
  if (pathname.includes('/scope1')) {
    if (pathname.includes('/stationary')) return 'Stationary Combustion'
    if (pathname.includes('/mobile')) return 'Mobile Combustion'
    if (pathname.includes('/fugitive')) return 'Fugitive Emissions'
    if (pathname.includes('/summary')) return 'Scope 1 Summary'
    return 'Scope 1'
  }
  if (pathname.includes('/scope2')) {
    if (pathname.includes('/electricity')) return 'Purchased Electricity'
    if (pathname.includes('/heatsteam')) return 'Purchased Heat & Steam'
    if (pathname.includes('/renewable')) return 'Renewable Electricity'
    if (pathname.includes('/summary')) return 'Scope 2 Summary'
    return 'Scope 2'
  }
  if (pathname.includes('/scope3')) {
    if (pathname.includes('/employee-commute')) return 'Employee Commute'
    if (pathname.includes('/food-consumption')) return 'Food Consumption'
    if (pathname.includes('/purchased-goods')) return 'Purchased Goods'
    if (pathname.includes('/t-d-loss')) return 'T&D Loss'
    if (pathname.includes('/upstream')) return 'Upstream Activities'
    if (pathname.includes('/downstream')) return 'Downstream Activities'
    if (pathname.includes('/waste-disposal')) return 'Waste Disposal'
    if (pathname.includes('/water-supply')) return 'Water Supply'
    if (pathname.includes('/water-treatment')) return 'Water Treatment'
    if (pathname.includes('/business-travel-air')) return 'Business Travel (Air)'
    if (pathname.includes('/business-travel-land')) return 'Business Travel (Land)'
    if (pathname.includes('/business-travel-sea')) return 'Business Travel (Sea)'
    if (pathname.includes('/hotel-stay')) return 'Hotel Stay'
    if (pathname.includes('/summary')) return 'Scope 3 Summary'
    return 'Scope 3'
  }
  if (pathname.includes('/intensity')) return 'Intensity Metrics'
  if (pathname.includes('/reports')) return 'Site Reports'
  if (pathname.includes('/energy')) return 'Energy Analytics'
  return 'Overview'
}

export default function SiteLayout({ children }) {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  const allSites = loadSites()
  const site = allSites.find(s => s.code === siteId) || SITES.find(s => s.code === siteId)

  const expandedScope = pathname.includes('/scope1') ? '1'
    : pathname.includes('/scope2') ? '2'
    : pathname.includes('/scope3') ? '3'
    : '1'

  const scopeLabel = getScopeLabel(pathname)

  const iconLinks = [
    { label: 'Scope 1', badge: '1', to: `scope1/stationary` },
    { label: 'Scope 2', badge: '2', to: `scope2/electricity` },
    { label: 'Scope 3', badge: '3', to: `scope3/employee-commute` },
    { label: 'Intensity', icon: <TrendingUp className="w-3.5 h-3.5" />, to: `intensity` },
    { label: 'Reports',   icon: <ClipboardList className="w-3.5 h-3.5" />, to: `reports` },
    { label: 'Energy',    icon: <Zap className="w-3.5 h-3.5" />, to: `energy` },
  ]

  return (
    <div className="flex min-h-[calc(100vh-56px)]">

      {/* Icon rail */}
      <div className="w-12 bg-white border-r border-slate-200 flex flex-col items-center py-4 gap-2 shrink-0">
        {iconLinks.map((l, i) => (
          <NavLink
            key={i}
            to={`/sites/${siteId}/${l.to}`}
            title={l.label}
            className={({ isActive }) =>
              `w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all text-xs font-bold ${
                isActive
                  ? 'border-[#064E3B] text-[#064E3B] bg-[#ECFDF5]'
                  : 'border-slate-200 text-slate-400 hover:border-[#064E3B] hover:text-[#064E3B] hover:bg-[#E6F4F1]/30'
              }`
            }
          >
            {l.badge ?? l.icon}
          </NavLink>
        ))}
      </div>

      {/* Expandable sidebar */}
      <div className="w-60 bg-white border-r border-slate-200 flex flex-col py-3 px-2 gap-0.5 shrink-0 overflow-y-auto">
        {/* Site chip */}
        <div className="px-3 py-2 mb-2">
          <div className="bg-[#E6F4F1] text-[#064E3B] text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1">
            {siteId}
          </div>
          <p className="text-xs font-semibold text-slate-700 leading-tight line-clamp-2">
            {site?.name || siteId}
          </p>
          {site?.type && (
            <p className="text-[10px] text-slate-400 mt-0.5">{site.type}</p>
          )}
        </div>

        <div className="border-t border-slate-100 pt-2">
          <SidebarSection
            num="1" label="Scope 1" items={SCOPE1_ITEMS} siteId={siteId}
            expanded={expandedScope === '1'}
            onToggle={() => navigate(`/sites/${siteId}/scope1/stationary`)}
          />
          <SidebarSection
            num="2" label="Scope 2" items={SCOPE2_ITEMS} siteId={siteId}
            expanded={expandedScope === '2'}
            onToggle={() => navigate(`/sites/${siteId}/scope2/electricity`)}
          />
          <SidebarSection
            num="3" label="Scope 3" items={SCOPE3_ITEMS} siteId={siteId}
            expanded={expandedScope === '3'}
            onToggle={() => navigate(`/sites/${siteId}/scope3/employee-commute`)}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-[#F8FAFC] min-w-0">

        {/* Top bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
            <NavLink to="/sites" className="flex items-center gap-1 hover:text-[#064E3B] transition-colors shrink-0">
              <Home className="w-3 h-3" />
              Sites
            </NavLink>
            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
            <span className="text-[#064E3B] font-semibold truncate max-w-[160px]">
              {site?.name || siteId}
            </span>
            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
            <span className="text-[#064E3B] font-semibold truncate">{scopeLabel}</span>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 min-h-0">{children}</div>

      </div>
    </div>
  )
}
