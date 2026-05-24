import { useState } from 'react'
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { ChevronDown, TrendingDown, Zap, Globe2, Wind } from 'lucide-react'
import {
  DASHBOARD_TOTALS, MONTHLY_SCOPE1, MONTHLY_SCOPE2, SCOPE3_BREAKDOWN, SCOPE3_TOTAL
} from '../data/ghgData'
import { useGHG } from '../store/useGHG'
import { SITES } from '../data/ghgData'

// ─── SVG ring progress ────────────────────────────────────────────────────────
function Ring({ pct, color, size = 64, stroke = 6 }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const fill = (pct / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
        strokeWidth={stroke} strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.8s ease' }} />
    </svg>
  )
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-3 min-w-[160px]">
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 mb-1 last:mb-0">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-[11px] text-slate-500 flex-1 truncate max-w-[110px]">{p.name.replace(' (T CO2e)', '')}</span>
          <span className="text-[11px] font-bold text-slate-800 ml-1">
            {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Pie label ────────────────────────────────────────────────────────────────
const PieOuterLabel = ({ cx, cy, midAngle, outerRadius, pct, name }) => {
  if (pct < 0.6) return null
  const RAD = Math.PI / 180
  const r = outerRadius + 30
  const x = cx + r * Math.cos(-midAngle * RAD)
  const y = cy + r * Math.sin(-midAngle * RAD)
  const anchor = x > cx ? 'start' : 'end'
  const short = name
    .replace('Transmission & Distribution Loss', 'T&D Loss')
    .replace('Business Travel (Air)', 'Biz Travel Air')
    .replace('Business Travel (Land)', 'Biz Travel Land')
    .replace('Employee Commute', 'Employee Commute')
  return (
    <text x={x} y={y} fill="#475569" fontSize={10} fontWeight={600} textAnchor={anchor} dominantBaseline="central">
      {short} {pct}%
    </text>
  )
}

// ─── Legend dot ──────────────────────────────────────────────────────────────
const CustomLegend = ({ payload }) => (
  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 px-2">
    {payload?.map((entry, i) => (
      <div key={i} className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: entry.color }} />
        <span className="text-[10px] text-slate-500">{entry.value}</span>
      </div>
    ))}
  </div>
)

export default function Dashboard() {
  const { getScopeTotal } = useGHG()
  const ALL_CODES = SITES.map(s => s.code)
  const liveS1 = +ALL_CODES.reduce((s, c) => s + getScopeTotal(c, 1), 0).toFixed(2)
  const liveS2 = +ALL_CODES.reduce((s, c) => s + getScopeTotal(c, 2), 0).toFixed(2)
  const liveS3 = +ALL_CODES.reduce((s, c) => s + getScopeTotal(c, 3), 0).toFixed(2)
  const liveTotal = +(liveS1 + liveS2 + liveS3).toFixed(2)
  const liveS1pct = liveTotal > 0 ? +((liveS1 / liveTotal) * 100).toFixed(2) : DASHBOARD_TOTALS.scope1_pct
  const liveS2pct = liveTotal > 0 ? +((liveS2 / liveTotal) * 100).toFixed(2) : DASHBOARD_TOTALS.scope2_pct
  const liveS3pct = liveTotal > 0 ? +((liveS3 / liveTotal) * 100).toFixed(2) : DASHBOARD_TOTALS.scope3_pct
  const kpi = {
    total: liveTotal > 0 ? liveTotal : DASHBOARD_TOTALS.total,
    scope1: liveTotal > 0 ? liveS1 : DASHBOARD_TOTALS.scope1,
    scope2: liveTotal > 0 ? liveS2 : DASHBOARD_TOTALS.scope2,
    scope3: liveTotal > 0 ? liveS3 : DASHBOARD_TOTALS.scope3,
    scope1_pct: liveS1pct,
    scope2_pct: liveS2pct,
    scope3_pct: liveS3pct,
  }
  const [s1View, setS1View] = useState('Detailed')
  const [s2View, setS2View] = useState('Detailed')

  const s1Data = MONTHLY_SCOPE1.map(d => ({
    month: d.month,
    'Stationary Combustion (T CO2e)': d.stationary,
    'Mobile Combustion (T CO2e)': d.mobile,
    'Fugitive Emissions (T CO2e)': d.fugitive,
  }))

  const s2Data = MONTHLY_SCOPE2.map(d => ({
    month: d.month,
    'Renewable Electricity Generated (T CO2e)': +(d.renewable / 1000).toFixed(2),
    'Imported Energy (T CO2e)': 0,
    'Imported Electricity (T CO2e)': +(d.imported / 1000).toFixed(2),
  }))

  const SCOPE1_COLORS = ['#064E3B', '#10B981', '#6EE7B7']
  const SCOPE2_COLORS = ['#064E3B', '#2D6A4F', '#3B82F6']

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 pt-6 pb-12">

        {/* ── Top bar ────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <p className="text-[11px] text-slate-400 mb-0.5">K. Girdharlal International Private Limited</p>
            <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">GHG Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-medium px-3.5 py-2 rounded-xl shadow-sm hover:border-emerald-400 hover:text-emerald-700 transition-all">
              CY 2026 <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-500 text-xs px-3.5 py-2 rounded-xl shadow-sm hover:border-emerald-400 transition-all">
              Baseline: CY 2026 <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* ── KPI row — matches live site layout ───────────────────────── */}
        <div className="grid grid-cols-3 gap-4 mb-4">

          {/* Total GHG — big green card */}
          <div className="col-span-2 rounded-2xl bg-gradient-to-br from-[#064E3B] via-[#065F46] to-[#047857] p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-10 -translate-x-10" />
            <p className="text-[11px] text-emerald-300 font-semibold uppercase tracking-widest mb-2 relative">Total GHG Emissions</p>
            <div className="flex items-end gap-2 relative">
              <span className="text-5xl font-black text-white tabular-nums leading-none">
                {kpi.total.toLocaleString()}
              </span>
              <span className="text-base text-emerald-300 font-medium mb-1">tCO2e</span>
            </div>
            <p className="text-[11px] text-emerald-400 mt-3 relative">Scope 1 + Scope 2 + Scope 3 combined</p>
          </div>

          {/* Scope 1 */}
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest mb-1">Scope 1</p>
              <div className="flex items-end gap-1.5">
                <span className="text-3xl font-black text-slate-800 tabular-nums leading-none">{kpi.scope1}</span>
                <span className="text-xs text-slate-400 mb-0.5">tCO2e</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingDown className="w-3 h-3 text-emerald-500" />
                <span className="text-[11px] text-slate-400">Direct emissions</span>
              </div>
            </div>
            <div className="relative shrink-0">
              <Ring pct={kpi.scope1_pct} color="#10B981" size={68} stroke={7} />
              <span className="absolute inset-0 flex items-center justify-center text-[13px] font-black text-emerald-600">
                {kpi.scope1_pct}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-7">
          {/* Scope 2 */}
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest mb-1">Scope 2</p>
              <div className="flex items-end gap-1.5">
                <span className="text-3xl font-black text-slate-800 tabular-nums leading-none">{kpi.scope2.toLocaleString()}</span>
                <span className="text-xs text-slate-400 mb-0.5">tCO2e</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Zap className="w-3 h-3 text-blue-500" />
                <span className="text-[11px] text-slate-400">Purchased energy</span>
              </div>
            </div>
            <div className="relative shrink-0">
              <Ring pct={kpi.scope2_pct} color="#2563EB" size={84} stroke={8} />
              <span className="absolute inset-0 flex items-center justify-center text-[15px] font-black text-blue-600">
                {kpi.scope2_pct}%
              </span>
            </div>
          </div>

          {/* Scope 3 */}
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest mb-1">Scope 3</p>
              <div className="flex items-end gap-1.5">
                <span className="text-3xl font-black text-slate-800 tabular-nums leading-none">{kpi.scope3.toLocaleString()}</span>
                <span className="text-xs text-slate-400 mb-0.5">tCO2e</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Globe2 className="w-3 h-3 text-amber-500" />
                <span className="text-[11px] text-slate-400">Value chain</span>
              </div>
            </div>
            <div className="relative shrink-0">
              <Ring pct={kpi.scope3_pct} color="#F59E0B" size={68} stroke={7} />
              <span className="absolute inset-0 flex items-center justify-center text-[13px] font-black text-amber-600">
                {kpi.scope3_pct}%
              </span>
            </div>
          </div>
        </div>

        {/* ── Scope 1 Chart ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-[15px] font-bold text-slate-800">Scope 1 Emissions</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Direct emissions by source — monthly breakdown</p>
            </div>
            <div className="flex rounded-xl border border-slate-200 overflow-hidden text-xs">
              {['Detailed', 'Overall'].map(v => (
                <button key={v} onClick={() => setS1View(v)}
                  className={`px-3.5 py-1.5 font-medium transition-all ${s1View === v ? 'bg-emerald-700 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={s1Data} barSize={16} margin={{ left: 14, right: 8, bottom: 16, top: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 9.5, fill: '#94A3B8', fontWeight: 500 }}
                axisLine={false} tickLine={false}
                label={{ value: 'Month', position: 'insideBottom', offset: -8, fontSize: 10, fill: '#94A3B8' }}
              />
              <YAxis
                tick={{ fontSize: 9.5, fill: '#94A3B8' }}
                axisLine={false} tickLine={false}
                label={{ value: 'GHG Emissions (T CO2e)', angle: -90, position: 'insideLeft', offset: 4, fontSize: 9.5, fill: '#94A3B8' }}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: '#F8FAFC' }} />
              <Legend content={<CustomLegend />} />
              <Bar dataKey="Stationary Combustion (T CO2e)" fill={SCOPE1_COLORS[0]} stackId="s" radius={[0,0,0,0]} />
              <Bar dataKey="Mobile Combustion (T CO2e)" fill={SCOPE1_COLORS[1]} stackId="s" />
              <Bar dataKey="Fugitive Emissions (T CO2e)" fill={SCOPE1_COLORS[2]} stackId="s" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Scope 2 Chart ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-[15px] font-bold text-slate-800">Scope 2 Emissions</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Indirect energy — renewable vs. imported electricity</p>
            </div>
            <div className="flex rounded-xl border border-slate-200 overflow-hidden text-xs">
              {['Detailed', 'Overall'].map(v => (
                <button key={v} onClick={() => setS2View(v)}
                  className={`px-3.5 py-1.5 font-medium transition-all ${s2View === v ? 'bg-emerald-700 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={s2Data} margin={{ left: 14, right: 8, bottom: 16, top: 4 }}>
              <defs>
                <linearGradient id="gRenew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#064E3B" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#064E3B" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gImport" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 9.5, fill: '#94A3B8', fontWeight: 500 }}
                axisLine={false} tickLine={false}
                label={{ value: 'Month', position: 'insideBottom', offset: -8, fontSize: 10, fill: '#94A3B8' }}
              />
              <YAxis
                tick={{ fontSize: 9.5, fill: '#94A3B8' }}
                axisLine={false} tickLine={false}
                label={{ value: 'GHG Emissions (T CO2e)', angle: -90, position: 'insideLeft', offset: 4, fontSize: 9.5, fill: '#94A3B8' }}
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend content={<CustomLegend />} />
              <Area type="monotone" dataKey="Renewable Electricity Generated (T CO2e)" stroke={SCOPE2_COLORS[0]} strokeWidth={2.5} fill="url(#gRenew)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="Imported Energy (T CO2e)" stroke={SCOPE2_COLORS[1]} strokeWidth={1.5} fill="none" dot={false} activeDot={{ r: 3, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="Imported Electricity (T CO2e)" stroke={SCOPE2_COLORS[2]} strokeWidth={2.5} fill="url(#gImport)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── Scope 3 Pie ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="mb-5">
            <h2 className="text-[15px] font-bold text-slate-800">Scope 3 Emissions</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Value chain category breakdown</p>
          </div>
          <div className="flex gap-8 items-center">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={SCOPE3_BREAKDOWN}
                    cx="50%" cy="50%"
                    outerRadius={115}
                    dataKey="pct"
                    label={<PieOuterLabel />}
                    labelLine={{ stroke: '#CBD5E1', strokeWidth: 1 }}
                    strokeWidth={2}
                    stroke="#fff"
                  >
                    {SCOPE3_BREAKDOWN.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, name) => [`${v}%`, name]}
                    contentStyle={{ fontSize: 11, borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend panel */}
            <div className="shrink-0 w-52 space-y-2">
              {SCOPE3_BREAKDOWN.map((item) => (
                <div key={item.name} className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: item.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-slate-600 font-medium truncate">{item.name}</p>
                  </div>
                  <span className="text-[12px] font-bold text-slate-800 tabular-nums shrink-0">{item.pct}%</span>
                </div>
              ))}
              <div className="border-t border-slate-100 pt-2 mt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Total</span>
                <span className="text-[13px] font-black text-slate-800">{SCOPE3_TOTAL.toFixed(1)} <span className="text-[10px] font-normal text-slate-400">tCO2e</span></span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
