import { useState } from 'react'
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

import { DASHBOARD_TOTALS } from '../data/ghgData'
import { useGHG } from '../store/useGHG'

// ─── Constants ─────────────────────────────────────────────────────────────────
const YEAR_OPTIONS = ['CY 2026', 'CY 2025', 'CY 2024', 'CY 2023', 'FY 2026', 'FY 2025']
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const S3_MODULES = [
  'employeeCommute', 'foodConsumption', 'purchasedGoods', 'tdLoss',
  'upstream', 'downstream', 'wasteDisposal', 'waterSupply', 'waterTreatment',
  'businessTravelAir', 'businessTravelSea', 'businessTravelLand', 'hotelStay'
]
const SCOPE1_COLORS = ['#064E3B', '#10B981', '#6EE7B7']
const SCOPE2_COLORS = ['#10B981', '#064E3B', '#3B82F6']
const MONTH_MAP = {
  january: 'Jan', jan: 'Jan', february: 'Feb', feb: 'Feb', march: 'Mar', mar: 'Mar',
  april: 'Apr', apr: 'Apr', may: 'May', june: 'Jun', jun: 'Jun', july: 'Jul', jul: 'Jul',
  august: 'Aug', aug: 'Aug', september: 'Sep', sep: 'Sep', october: 'Oct', oct: 'Oct',
  november: 'Nov', nov: 'Nov', december: 'Dec', dec: 'Dec'
}

// ─── Year-filter helpers (module level so they can be reused) ────────────────────
function getEntryMonthAndYear(e) {
  const periodStr = e['Entry Period'] || e.period
  if (periodStr) {
    const parts = periodStr.split('-')
    if (parts.length > 1) {
      return { month: parts[0].trim().toLowerCase(), year: parts[1].trim() }
    }
  }
  if (e.date) {
    const parts = e.date.split('-')
    if (parts.length >= 2) {
      const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
      const mIdx = parseInt(parts[1], 10) - 1
      return { month: months[mIdx] || '', year: parts[0] }
    }
  }
  return null
}

function isEntryInSelectedYear(e, selectedYear) {
  const info = getEntryMonthAndYear(e)
  if (!info) return false
  const { month, year } = info
  if (selectedYear.startsWith('CY')) {
    return year === selectedYear.replace('CY', '').trim()
  } else if (selectedYear.startsWith('FY')) {
    const targetYear = parseInt(selectedYear.replace('FY', '').trim(), 10)
    const yearNum = parseInt(year, 10)
    const isFYMonths = ['april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'].includes(month)
    return isFYMonths ? yearNum === targetYear - 1 : yearNum === targetYear
  }
  return false
}

function getShortMonth(periodStr) {
  if (!periodStr) return null
  const clean = periodStr.toLowerCase().split('-')[0].trim()
  return MONTH_MAP[clean] || null
}

// ─── Per-year aggregation: returns KPI totals + monthly/breakdown chart data ──────
function computeYear(allEntries, selectedYear) {
  const filtered = {}
  if (allEntries) {
    Object.entries(allEntries).forEach(([siteCode, siteData]) => {
      filtered[siteCode] = {}
      Object.entries(siteData).forEach(([modName, list]) => {
        filtered[siteCode][modName] = Array.isArray(list)
          ? list.filter(e => isEntryInSelectedYear(e, selectedYear))
          : list
      })
    })
  }

  let s1 = 0, s2 = 0, s3 = 0
  const s1Data = MONTHS_SHORT.map(m => ({ month: m, 'Stationary Combustion': 0, 'Mobile Combustion': 0, 'Fugitive Emissions': 0 }))
  const s2Months = MONTHS_SHORT.map(m => ({ month: m, renewable: 0, imported: 0, heat: 0 }))
  const scope3Groups = [
    { name: 'Employee Commute', module: 'employeeCommute', color: '#1D4ED8', value: 0 },
    { name: 'Transmission & Distribution Loss', module: 'tdLoss', color: '#F59E0B', value: 0 },
    { name: 'Food Consumption', module: 'foodConsumption', color: '#10B981', value: 0 },
    { name: 'Purchased Goods', module: 'purchasedGoods', color: '#EF4444', value: 0 },
    { name: 'Upstream Activities', module: 'upstream', color: '#14B8A6', value: 0 },
    { name: 'Downstream Activities', module: 'downstream', color: '#6366F1', value: 0 },
    { name: 'Waste Disposal', module: 'wasteDisposal', color: '#EC4899', value: 0 },
    { name: 'Business Travel (Air)', module: 'businessTravelAir', color: '#8B5CF6', value: 0 },
    { name: 'Business Travel (Sea)', module: 'businessTravelSea', color: '#F97316', value: 0 },
    { name: 'Business Travel (Land)', module: 'businessTravelLand', color: '#06B6D4', value: 0 },
    { name: 'Hotel Stay', module: 'hotelStay', color: '#84CC16', value: 0 },
    { name: 'Water Supply', module: 'waterSupply', color: '#A7F3D0', value: 0 },
    { name: 'Water Treatment', module: 'waterTreatment', color: '#0EA5E9', value: 0 },
  ]

  Object.values(filtered).forEach(siteData => {
    // Scope 1
    const s1map = { stationary: 'Stationary Combustion', mobile: 'Mobile Combustion', fugitive: 'Fugitive Emissions' }
    Object.entries(s1map).forEach(([mod, label]) => {
      (siteData[mod] || []).forEach(e => {
        const val = parseFloat(e.tco2e || e.ghg || 0)
        s1 += val
        const monthObj = s1Data.find(x => x.month === getShortMonth(e['Entry Period'] || e.period))
        if (monthObj) monthObj[label] = +(monthObj[label] + val).toFixed(4)
      })
    })

    // Scope 2 — chart plots GHG emissions (tCO2e), matching the axis label
    ;(siteData.electricity || []).forEach(e => {
      const isRenewable = e.isRenewable || e.accounting === 'market' || e.category === 'Renewable Electricity Generation'
      const val = parseFloat(e.tco2e || e.ghg || 0)
      if (!isRenewable) s2 += val
      const monthObj = s2Months.find(x => x.month === getShortMonth(e['Entry Period'] || e.period))
      if (monthObj) { if (isRenewable) monthObj.renewable += val; else monthObj.imported += val }
    })
    ;(siteData.heatSteam || []).forEach(e => {
      const val = parseFloat(e.tco2e || e.ghg || 0)
      s2 += val
      const monthObj = s2Months.find(x => x.month === getShortMonth(e['Entry Period'] || e.period))
      if (monthObj) monthObj.heat += val
    })
    ;(siteData.renewable || []).forEach(e => {
      const val = parseFloat(e.tco2e || e.ghg || 0)
      const monthObj = s2Months.find(x => x.month === getShortMonth(e['Entry Period'] || e.period))
      if (monthObj) monthObj.renewable += val
    })

    // Scope 3 total
    S3_MODULES.forEach(mod => {
      (siteData[mod] || []).forEach(e => { s3 += parseFloat(e.tco2e || e.ghg || 0) })
    })

    // Scope 3 breakdown — every category shown individually
    scope3Groups.forEach(grp => {
      grp.value += (siteData[grp.module] || []).reduce((s, e) => s + (e.tco2e || e.ghg || 0), 0)
    })
  })

  s1 = +s1.toFixed(2); s2 = +s2.toFixed(2); s3 = +s3.toFixed(2)
  const total = +(s1 + s2 + s3).toFixed(2)
  const pct = (v) => total > 0 ? +((v / total) * 100).toFixed(2) : 0

  const s2Data = s2Months.map(d => ({
    month: d.month,
    'Renewable Electricity Generation': +d.renewable.toFixed(2),
    'Imported Energy': +d.heat.toFixed(2),
    'Imported Electricity': +d.imported.toFixed(2),
  }))

  const totalS3 = scope3Groups.reduce((s, g) => s + g.value, 0)
  const s3Data = scope3Groups.map(grp => ({
    name: grp.name,
    value: +grp.value.toFixed(4),
    color: grp.color,
    pct: totalS3 > 0 ? +((grp.value / totalS3) * 100).toFixed(2) : 0
  }))

  return { s1, s2, s3, total, s1pct: pct(s1), s2pct: pct(s2), s3pct: pct(s3), s1Data, s2Data, s3Data }
}

// ─── Shared visual building blocks ───────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-3 min-w-[160px]">
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 mb-1 last:mb-0">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-[11px] text-slate-500 flex-1 truncate max-w-[120px]">{p.name.replace(' (TCO2e)', '')}</span>
          <span className="text-[11px] font-bold text-slate-800 ml-1">{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}</span>
        </div>
      ))}
    </div>
  )
}

const CustomLegend = ({ payload }) => (
  <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 mt-3 px-2">
    {payload?.map((entry, i) => (
      <div key={i} className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: entry.color }} />
        <span className="text-[10px] text-slate-500">{entry.value}</span>
      </div>
    ))}
  </div>
)

function ScopeRingBadge({ pct, color = '#10B981' }) {
  const r = 16, c = 20, circ = 2 * Math.PI * r
  const dash = Math.min((pct / 100) * circ, circ)
  return (
    <svg width={40} height={40} className="shrink-0">
      <circle cx={c} cy={c} r={r} fill="none" stroke="#E2E8F0" strokeWidth={3} />
      <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth={3}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform={`rotate(-90 ${c} ${c})`} />
      <text x={c} y={c + 0.5} textAnchor="middle" dominantBaseline="middle" fontSize={7} fontWeight={700} fill={color}>{(+pct).toFixed(2)}%</text>
    </svg>
  )
}

const YAxisTitle = () => (
  <div style={{ width: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 10, color: '#374151', fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: '0.03em' }}>
      GHG Emission (TCO2e)
    </span>
  </div>
)

function TotalCard({ total, big = false }) {
  return (
    <div className="rounded-2xl bg-[#064E3B] p-5 relative overflow-hidden shadow-sm border-l-4 border-l-[#064E3B]">
      <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full -translate-y-10 translate-x-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-6 -translate-x-6 pointer-events-none" />
      <p className="text-[10px] uppercase tracking-widest text-white mb-3 relative">TOTAL GHG EMISSIONS</p>
      <div className="flex items-end gap-2 relative">
        <span className={`${big ? 'text-4xl' : 'text-3xl'} font-bold text-white tabular-nums leading-none`} style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
          {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className="text-sm text-white mb-1">TCO2eq</span>
      </div>
      <p className="text-[11px] text-white/70 mt-3 relative">Combined Scope 1 + 2 + 3</p>
    </div>
  )
}

function ScopeCard({ label, value, pct, color, subtitle }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm border-l-4 border-l-[#064E3B]">
      <div className="flex items-start justify-between mb-2">
        <p className="text-[10px] uppercase tracking-widest text-slate-700 font-bold pt-0.5">{label}</p>
        <ScopeRingBadge pct={pct} color={color} />
      </div>
      <div className="flex items-end gap-1 mb-1">
        <span className="text-2xl font-bold text-slate-900 tabular-nums leading-none" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
          {value.toLocaleString()}
        </span>
        <span className="text-xs text-slate-400 mb-0.5">TCO2eq</span>
      </div>
      <p className="text-[10px] text-slate-400">{subtitle}</p>
    </div>
  )
}

function KpiPanel({ data, yearLabel }) {
  return (
    <div>
      <p className="text-center text-sm font-bold text-slate-600 mb-3" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>{yearLabel}</p>
      <div className="grid grid-cols-2 gap-3">
        <TotalCard total={data.total} />
        <ScopeCard label="Scope 1" value={data.s1} pct={data.s1pct} color="#064E3B" subtitle="Direct emissions from owned sources" />
        <ScopeCard label="Scope 2" value={data.s2} pct={data.s2pct} color="#10B981" subtitle="Indirect emissions from purchased energy" />
        <ScopeCard label="Scope 3" value={data.s3} pct={data.s3pct} color="#3B82F6" subtitle="Value chain emissions (Travel, Waste, etc.)" />
      </div>
    </div>
  )
}

function Scope1Bars({ data, title, height = 300 }) {
  return (
    <div className="flex-1 min-w-0">
      {title && <p className="text-center text-xs font-semibold text-slate-500 mb-2">{title}</p>}
      <div className="flex gap-1 items-stretch">
        <YAxisTitle />
        <div className="flex-1 min-w-0">
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} barSize={18} margin={{ left: 4, right: 8, bottom: 4, top: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: '#F8FAFC' }} />
              <Legend content={<CustomLegend />} />
              <Bar dataKey="Stationary Combustion" fill={SCOPE1_COLORS[0]} stackId="s" />
              <Bar dataKey="Mobile Combustion" fill={SCOPE1_COLORS[1]} stackId="s" />
              <Bar dataKey="Fugitive Emissions" fill={SCOPE1_COLORS[2]} stackId="s" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-center text-[10px] font-bold text-slate-700 mt-1">Month</p>
        </div>
      </div>
    </div>
  )
}

function Scope2AreaChart({ data, title, height = 300 }) {
  return (
    <div className="flex-1 min-w-0">
      {title && <p className="text-center text-xs font-semibold text-slate-500 mb-2">{title}</p>}
      <div className="flex gap-1 items-stretch">
        <YAxisTitle />
        <div className="flex-1 min-w-0">
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ left: 4, right: 8, bottom: 4, top: 4 }}>
              <defs>
                <linearGradient id="gRenew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gImported" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#064E3B" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#064E3B" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gImportElec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<ChartTooltip />} />
              <Legend content={<CustomLegend />} />
              <Area type="monotone" dataKey="Renewable Electricity Generation" stroke={SCOPE2_COLORS[0]} strokeWidth={2.5} fill="url(#gRenew)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="Imported Energy" stroke={SCOPE2_COLORS[1]} strokeWidth={1.5} fill="url(#gImported)" dot={false} activeDot={{ r: 3, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="Imported Electricity" stroke={SCOPE2_COLORS[2]} strokeWidth={2.5} fill="url(#gImportElec)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-center text-[10px] font-bold text-slate-700 mt-1">Month</p>
        </div>
      </div>
    </div>
  )
}

function Scope3Donut({ s3Data, scope3pct, title, size = 200, inner = 68, outer = 88 }) {
  return (
    <div className="flex-1 min-w-0">
      {title && <p className="text-center text-xs font-semibold text-slate-500 mb-2">{title}</p>}
      <div className="relative mx-auto" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={s3Data} cx="50%" cy="50%" innerRadius={inner} outerRadius={outer} dataKey="pct"
              strokeWidth={2} stroke="#fff" paddingAngle={2} startAngle={90} endAngle={-270}>
              {s3Data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip formatter={(v, name) => [`${v}%`, name]}
              contentStyle={{ fontSize: 11, borderRadius: 10, border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-[#064E3B] leading-none">{Math.round(scope3pct)}%</span>
          <span className="text-[10px] text-slate-400 tracking-widest mt-1 uppercase">of Total</span>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {s3Data.map(item => (
          <div key={item.name} className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: item.color }} />
            <span className="text-xs text-slate-600 flex-1 truncate">{item.name}</span>
            <span className="text-xs font-bold text-slate-800 tabular-nums">{item.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const ScopeSectionCard = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-4">
    <h2 className="font-semibold text-slate-800 text-sm mb-4" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>{title}</h2>
    {children}
  </div>
)

// ─── Dashboard ───────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { allEntries, loading } = useGHG()
  const userRaw = localStorage.getItem('kg_current_user_v1')
  const user = userRaw ? JSON.parse(userRaw) : null
  const isAdmin = user?.email === 'csr@kgirdharlal.com'

  const [currentYear, setCurrentYear] = useState('CY 2025')
  const [baselineEnabled, setBaselineEnabled] = useState(false)
  const [baselineYear, setBaselineYear] = useState('CY 2026')

  const cur = computeYear(allEntries, currentYear)
  const base = computeYear(allEntries, baselineYear)

  // KPI values for the single (non-compare) view, with admin placeholder while loading
  const kpi = {
    total: loading ? (isAdmin ? DASHBOARD_TOTALS.total : 0) : cur.total,
    scope1: loading ? (isAdmin ? DASHBOARD_TOTALS.scope1 : 0) : cur.s1,
    scope2: loading ? (isAdmin ? DASHBOARD_TOTALS.scope2 : 0) : cur.s2,
    scope3: loading ? (isAdmin ? DASHBOARD_TOTALS.scope3 : 0) : cur.s3,
    scope1_pct: loading ? (isAdmin ? DASHBOARD_TOTALS.scope1_pct : 0) : cur.s1pct,
    scope2_pct: loading ? (isAdmin ? DASHBOARD_TOTALS.scope2_pct : 0) : cur.s2pct,
    scope3_pct: loading ? (isAdmin ? DASHBOARD_TOTALS.scope3_pct : 0) : cur.s3pct,
  }

  return (
    <div className="bg-[#F8FAFC]">
      <div className="w-full px-8 pt-6 pb-10">

        {/* ── Top bar ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#111827]" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
            GHG Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wide whitespace-nowrap">Current Year</span>
              <select value={currentYear} onChange={(e) => setCurrentYear(e.target.value)}
                className="bg-transparent text-slate-700 font-semibold text-xs outline-none cursor-pointer">
                {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm flex flex-col gap-0.5">
              <label className="text-[10px] text-slate-400 uppercase tracking-wide whitespace-nowrap flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={baselineEnabled} onChange={(e) => setBaselineEnabled(e.target.checked)}
                  className="accent-[#064E3B] cursor-pointer" />
                Baseline Year (Optional)
              </label>
              <select value={baselineYear} onChange={(e) => setBaselineYear(e.target.value)} disabled={!baselineEnabled}
                className="bg-transparent text-slate-700 font-semibold text-xs outline-none cursor-pointer disabled:text-slate-300 disabled:cursor-not-allowed">
                {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>

        {baselineEnabled ? (
          /* ══════════ COMPARISON VIEW (current vs baseline) ══════════ */
          <>
            <div className="grid grid-cols-2 gap-6 mb-5">
              <KpiPanel data={cur} yearLabel={currentYear} />
              <KpiPanel data={base} yearLabel={baselineYear} />
            </div>

            <ScopeSectionCard title="Scope 1">
              <div className="grid grid-cols-2 gap-6">
                <Scope1Bars data={cur.s1Data} title={currentYear} height={280} />
                <Scope1Bars data={base.s1Data} title={baselineYear} height={280} />
              </div>
            </ScopeSectionCard>

            <ScopeSectionCard title="Scope 2">
              <div className="grid grid-cols-2 gap-6">
                <Scope2AreaChart data={cur.s2Data} title={currentYear} height={280} />
                <Scope2AreaChart data={base.s2Data} title={baselineYear} height={280} />
              </div>
            </ScopeSectionCard>

            <ScopeSectionCard title="Scope 3">
              <div className="grid grid-cols-2 gap-6">
                <Scope3Donut s3Data={cur.s3Data} scope3pct={cur.s3pct} title={currentYear} size={190} inner={62} outer={82} />
                <Scope3Donut s3Data={base.s3Data} scope3pct={base.s3pct} title={baselineYear} size={190} inner={62} outer={82} />
              </div>
            </ScopeSectionCard>
          </>
        ) : (
          /* ══════════ SINGLE-YEAR VIEW ══════════ */
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-5 gap-4 mb-5">
              <div className="col-span-2">
                <TotalCard total={kpi.total} big />
              </div>
              <ScopeCard label="Scope 1" value={kpi.scope1} pct={kpi.scope1_pct} color="#064E3B" subtitle="Direct emissions from owned sources" />
              <ScopeCard label="Scope 2" value={kpi.scope2} pct={kpi.scope2_pct} color="#10B981" subtitle="Indirect emissions from purchased energy" />
              <ScopeCard label="Scope 3" value={kpi.scope3} pct={kpi.scope3_pct} color="#3B82F6" subtitle="Value chain emissions (Travel, Waste, etc.)" />
            </div>

            {/* Scope 1 bar + Scope 3 donut */}
            <div className="grid grid-cols-5 gap-4 mb-4">
              <div className="col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
                <h2 className="font-semibold text-slate-800 text-sm mb-3" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>Scope 1</h2>
                <Scope1Bars data={cur.s1Data} />
                <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                  {[
                    { label: 'Stationary Combustion', value: cur.s1Data.reduce((s, d) => s + (d['Stationary Combustion'] || 0), 0).toFixed(2), color: '#064E3B' },
                    { label: 'Mobile Combustion', value: cur.s1Data.reduce((s, d) => s + (d['Mobile Combustion'] || 0), 0).toFixed(2), color: '#10B981' },
                    { label: 'Fugitive Emissions', value: cur.s1Data.reduce((s, d) => s + (d['Fugitive Emissions'] || 0), 0).toFixed(2), color: '#6EE7B7' },
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-4 py-3">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: stat.color }} />
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-400 truncate">{stat.label}</p>
                        <p className="text-sm font-bold text-slate-800 tabular-nums">{stat.value} <span className="text-[10px] font-normal text-slate-400">tCO2e</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
                <h2 className="font-semibold text-slate-800 text-[15px] mb-3" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>Scope 3</h2>
                <Scope3Donut s3Data={cur.s3Data} scope3pct={cur.s3pct} />
              </div>
            </div>

            {/* Scope 2 area */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h2 className="font-semibold text-slate-800 text-sm mb-3" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>Scope 2</h2>
              <Scope2AreaChart data={cur.s2Data} />
            </div>
          </>
        )}

      </div>
    </div>
  )
}
