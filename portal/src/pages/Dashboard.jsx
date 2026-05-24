import { useState } from 'react'
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Label
} from 'recharts'
import { ChevronDown, TrendingDown, Zap, Globe2 } from 'lucide-react'
import {
  DASHBOARD_TOTALS, MONTHLY_SCOPE1, MONTHLY_SCOPE2, SCOPE3_BREAKDOWN, SCOPE3_TOTAL
} from '../data/ghgData'
import { useGHG } from '../store/useGHG'
import { SITES } from '../data/ghgData'

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-3 min-w-[160px]">
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 mb-1 last:mb-0">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-[11px] text-slate-500 flex-1 truncate max-w-[120px]">
            {p.name.replace(' (TCO2e)', '')}
          </span>
          <span className="text-[11px] font-bold text-slate-800 ml-1">
            {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Custom Legend ────────────────────────────────────────────────────────────
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

// ─── Donut center label ────────────────────────────────────────────────────────
const DonutCenterLabel = ({ viewBox, total }) => {
  const { cx, cy } = viewBox
  return (
    <g>
      <text x={cx} y={cy - 8} textAnchor="middle" dominantBaseline="central"
        fill="#1e293b" fontSize={22} fontWeight={800}>
        {total.toFixed(1)}
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" dominantBaseline="central"
        fill="#64748b" fontSize={11}>
        TCO2e
      </text>
    </g>
  )
}

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
    total:     liveTotal > 0 ? liveTotal : DASHBOARD_TOTALS.total,
    scope1:    liveTotal > 0 ? liveS1    : DASHBOARD_TOTALS.scope1,
    scope2:    liveTotal > 0 ? liveS2    : DASHBOARD_TOTALS.scope2,
    scope3:    liveTotal > 0 ? liveS3    : DASHBOARD_TOTALS.scope3,
    scope1_pct: liveS1pct,
    scope2_pct: liveS2pct,
    scope3_pct: liveS3pct,
  }

  const [s1View, setS1View] = useState('Detailed')
  const [s2View, setS2View] = useState('Detailed')
  const [activePeriod, setActivePeriod] = useState('CY')

  // Scope 1 chart data
  const s1Data = MONTHLY_SCOPE1.map(d => ({
    month: d.month,
    'Stationary Combustion': d.stationary,
    'Mobile Combustion': d.mobile,
    'Fugitive Emissions': d.fugitive,
  }))

  // Scope 2 chart data
  const s2Data = MONTHLY_SCOPE2.map(d => ({
    month: d.month,
    'Renewable Electricity Generation': +(d.renewable / 1000).toFixed(2),
    'Imported Energy': 0,
    'Imported Electricity': +(d.imported / 1000).toFixed(2),
  }))

  const SCOPE1_COLORS = ['#064E3B', '#10B981', '#6EE7B7']
  const SCOPE2_COLORS = ['#10B981', '#064E3B', '#3B82F6']

  return (
    <div className="min-h-screen bg-[#0B0F18]">
      <div className="max-w-[1320px] mx-auto px-6 pt-6 pb-14">

        {/* ── Top bar ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-7">
          <h1 className="font-heading text-2xl font-bold text-[#10B981]">
            GHG Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePeriod('CY')}
              className={`px-4 py-1.5 rounded-lg text-sm text-white bg-[#1A2035] border transition-all ${
                activePeriod === 'CY' ? 'border-[#10B981]' : 'border-transparent'
              }`}
            >
              CY 2026
            </button>
            <button
              onClick={() => setActivePeriod('FY')}
              className={`px-4 py-1.5 rounded-lg text-sm text-white bg-[#1A2035] border transition-all ${
                activePeriod === 'FY' ? 'border-[#10B981]' : 'border-transparent'
              }`}
            >
              FY 2026 (Default)
            </button>
          </div>
        </div>

        {/* ── KPI Cards row ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-4 mb-5">

          {/* Total GHG — wide green card */}
          <div className="col-span-2 rounded-2xl bg-[#064E3B] p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-12 translate-x-12 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full translate-y-8 -translate-x-8 pointer-events-none" />
            <p className="text-xs uppercase tracking-wider text-[#6EE7B7] mb-2 relative">
              TOTAL GHG EMISSIONS
            </p>
            <div className="flex items-end gap-2 relative">
              <span className="font-heading text-5xl font-bold text-white tabular-nums leading-none">
                {kpi.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-sm text-[#A7F3D0] mb-1">TCO2eq</span>
            </div>
            <p className="text-xs text-[#6EE7B7] mt-3 relative">
              Combined Scope 1 + 2 + 3
            </p>
          </div>

          {/* Scope 1 */}
          <div className="rounded-2xl bg-[#131B2E] p-5 flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#6EE7B7] mb-2">SCOPE 1</p>
              <div className="flex items-end gap-1.5">
                <span className="font-heading text-3xl font-bold text-white tabular-nums leading-none">
                  {kpi.scope1.toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 mb-0.5">TCO2eq</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <TrendingDown className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-xs text-gray-400">Direct emissions</span>
              <span className="ml-auto text-[#10B981] bg-[#064E3B]/50 text-xs px-2 py-0.5 rounded-full font-semibold">
                {kpi.scope1_pct}%
              </span>
            </div>
          </div>

          {/* Scope 2 */}
          <div className="rounded-2xl bg-[#131B2E] p-5 flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#6EE7B7] mb-2">SCOPE 2</p>
              <div className="flex items-end gap-1.5">
                <span className="font-heading text-3xl font-bold text-white tabular-nums leading-none">
                  {kpi.scope2.toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 mb-0.5">TCO2eq</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Zap className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-xs text-gray-400">Purchased energy</span>
              <span className="ml-auto text-[#10B981] bg-[#064E3B]/50 text-xs px-2 py-0.5 rounded-full font-semibold">
                {kpi.scope2_pct}%
              </span>
            </div>
          </div>

        </div>

        {/* Scope 3 KPI — separate row so it sits naturally after the 4-col grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="col-start-3 col-span-2 rounded-2xl bg-[#131B2E] p-5 flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#6EE7B7] mb-2">SCOPE 3</p>
              <div className="flex items-end gap-1.5">
                <span className="font-heading text-3xl font-bold text-white tabular-nums leading-none">
                  {kpi.scope3.toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 mb-0.5">TCO2eq</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Globe2 className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-xs text-gray-400">Value chain</span>
              <span className="ml-auto text-[#10B981] bg-[#064E3B]/50 text-xs px-2 py-0.5 rounded-full font-semibold">
                {kpi.scope3_pct}%
              </span>
            </div>
          </div>
        </div>

        {/* ── Two-column chart row: Scope 1 bar + Scope 3 donut ─────────────── */}
        <div className="grid grid-cols-5 gap-5 mb-5">

          {/* Scope 1 Bar Chart — 3/5 width */}
          <div className="col-span-3 bg-white rounded-2xl p-6 shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-slate-800 text-[15px]">Scope 1</h2>
              <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs">
                {['Detailed', 'Overall'].map(v => (
                  <button
                    key={v}
                    onClick={() => setS1View(v)}
                    className={`px-3.5 py-1.5 font-medium transition-all ${
                      s1View === v ? 'bg-[#10B981] text-white' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={s1Data} barSize={14} margin={{ left: 20, right: 8, bottom: 20, top: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#94A3B8' }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: 'GHG Emission (TCO2e)',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fontSize: 11, fill: '#94A3B8' },
                  }}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#F8FAFC' }} />
                <Legend content={<CustomLegend />} />
                <Bar dataKey="Stationary Combustion" fill={SCOPE1_COLORS[0]} stackId="s" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Mobile Combustion" fill={SCOPE1_COLORS[1]} stackId="s" />
                <Bar dataKey="Fugitive Emissions" fill={SCOPE1_COLORS[2]} stackId="s" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Scope 3 Donut Chart — 2/5 width */}
          <div className="col-span-2 bg-white rounded-2xl p-6 shadow flex flex-col">
            <h2 className="font-heading font-semibold text-slate-800 text-[15px] mb-4">Scope 3</h2>
            <div className="flex-1 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={SCOPE3_BREAKDOWN}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    dataKey="pct"
                    strokeWidth={2}
                    stroke="#fff"
                    paddingAngle={2}
                  >
                    {SCOPE3_BREAKDOWN.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                    <Label
                      content={<DonutCenterLabel total={SCOPE3_TOTAL} />}
                      position="center"
                    />
                  </Pie>
                  <Tooltip
                    formatter={(v, name) => [`${v}%`, name]}
                    contentStyle={{
                      fontSize: 11,
                      borderRadius: 10,
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend list */}
            <div className="mt-2 space-y-1.5">
              {SCOPE3_BREAKDOWN.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                  <span className="text-[10px] text-slate-600 flex-1 truncate">{item.name}</span>
                  <span className="text-[11px] font-bold text-slate-800 tabular-nums">{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Scope 2 full-width Area Chart ─────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-slate-800 text-[15px]">Scope 2</h2>
            <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs">
              {['Detailed', 'Overall'].map(v => (
                <button
                  key={v}
                  onClick={() => setS2View(v)}
                  className={`px-3.5 py-1.5 font-medium transition-all ${
                    s2View === v ? 'bg-[#10B981] text-white' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={s2Data} margin={{ left: 20, right: 8, bottom: 20, top: 4 }}>
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
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#94A3B8' }}
                axisLine={false}
                tickLine={false}
                label={{
                  value: 'GHG Emission (TCO2e)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: 11, fill: '#94A3B8' },
                }}
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend content={<CustomLegend />} />
              <Area
                type="monotone"
                dataKey="Renewable Electricity Generation"
                stroke={SCOPE2_COLORS[0]}
                strokeWidth={2.5}
                fill="url(#gRenew)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="Imported Energy"
                stroke={SCOPE2_COLORS[1]}
                strokeWidth={1.5}
                fill="url(#gImported)"
                dot={false}
                activeDot={{ r: 3, strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="Imported Electricity"
                stroke={SCOPE2_COLORS[2]}
                strokeWidth={2.5}
                fill="url(#gImportElec)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  )
}
