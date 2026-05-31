/* eslint-disable no-unused-vars */
import { useState } from 'react'
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

import { DASHBOARD_TOTALS } from '../data/ghgData'
import { useGHG } from '../store/useGHG'

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


// ─── Circular ring badge for KPI scope cards ──────────────────────────────────
function ScopeRingBadge({ pct, color = '#10B981' }) {
  const r = 16, c = 20, circ = 2 * Math.PI * r
  const dash = Math.min((pct / 100) * circ, circ)
  return (
    <svg width={40} height={40} className="shrink-0">
      <circle cx={c} cy={c} r={r} fill="none" stroke="#E2E8F0" strokeWidth={3} />
      <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth={3}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${c} ${c})`} />
      <text x={c} y={c + 0.5} textAnchor="middle" dominantBaseline="middle"
        fontSize={8} fontWeight={700} fill={color}>{Math.round(pct)}%</text>
    </svg>
  )
}

export default function Dashboard() {
  const { getScopeTotal, sites, allEntries } = useGHG()
  const userRaw = localStorage.getItem('kg_current_user_v1')
  const user = userRaw ? JSON.parse(userRaw) : null
  const isAdmin = user?.email === 'ketanbheda@kgirdharlal.com'

  const ALL_CODES = (sites || []).map(s => s.code)

  const liveS1 = +ALL_CODES.reduce((s, c) => s + getScopeTotal(c, 1), 0).toFixed(2)
  const liveS2 = +ALL_CODES.reduce((s, c) => s + getScopeTotal(c, 2), 0).toFixed(2)
  const liveS3 = +ALL_CODES.reduce((s, c) => s + getScopeTotal(c, 3), 0).toFixed(2)
  const liveTotal = +(liveS1 + liveS2 + liveS3).toFixed(2)

  const liveS1pct = liveTotal > 0 ? +((liveS1 / liveTotal) * 100).toFixed(2) : 0
  const liveS2pct = liveTotal > 0 ? +((liveS2 / liveTotal) * 100).toFixed(2) : 0
  const liveS3pct = liveTotal > 0 ? +((liveS3 / liveTotal) * 100).toFixed(2) : 0

  const kpi = {
    total:      liveTotal > 0 ? liveTotal : (isAdmin ? DASHBOARD_TOTALS.total : 0),
    scope1:     liveTotal > 0 ? liveS1    : (isAdmin ? DASHBOARD_TOTALS.scope1 : 0),
    scope2:     liveTotal > 0 ? liveS2    : (isAdmin ? DASHBOARD_TOTALS.scope2 : 0),
    scope3:     liveTotal > 0 ? liveS3    : (isAdmin ? DASHBOARD_TOTALS.scope3 : 0),
    scope1_pct: liveTotal > 0 ? liveS1pct : (isAdmin ? DASHBOARD_TOTALS.scope1_pct : 0),
    scope2_pct: liveTotal > 0 ? liveS2pct : (isAdmin ? DASHBOARD_TOTALS.scope2_pct : 0),
    scope3_pct: liveTotal > 0 ? liveS3pct : (isAdmin ? DASHBOARD_TOTALS.scope3_pct : 0),
  }

  // Calculate dynamic monthly scope arrays from allEntries
  const MONTH_MAP = {
    january: 'Jan', jan: 'Jan',
    february: 'Feb', feb: 'Feb',
    march: 'Mar', mar: 'Mar',
    april: 'Apr', apr: 'Apr',
    may: 'May',
    june: 'Jun', jun: 'Jun',
    july: 'Jul', jul: 'Jul',
    august: 'Aug', aug: 'Aug',
    september: 'Sep', sep: 'Sep',
    october: 'Oct', oct: 'Oct',
    november: 'Nov', nov: 'Nov',
    december: 'Dec', dec: 'Dec'
  }

  function getShortMonth(periodStr) {
    if (!periodStr) return null
    const clean = periodStr.toLowerCase().split('-')[0].trim()
    return MONTH_MAP[clean] || null
  }

  // Dynamic Scope 1 monthly data
  const s1Data = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => ({
    month: m,
    'Stationary Combustion': 0,
    'Mobile Combustion': 0,
    'Fugitive Emissions': 0
  }))

  if (allEntries) {
    Object.values(allEntries).forEach(siteData => {
      if (siteData.stationary) {
        siteData.stationary.forEach(e => {
          const m = getShortMonth(e['Entry Period'] || e.period)
          const val = parseFloat(e.tco2e || e.ghg || 0)
          const monthObj = s1Data.find(x => x.month === m)
          if (monthObj) monthObj['Stationary Combustion'] = +(monthObj['Stationary Combustion'] + val).toFixed(4)
        })
      }
      if (siteData.mobile) {
        siteData.mobile.forEach(e => {
          const m = getShortMonth(e['Entry Period'] || e.period)
          const val = parseFloat(e.tco2e || e.ghg || 0)
          const monthObj = s1Data.find(x => x.month === m)
          if (monthObj) monthObj['Mobile Combustion'] = +(monthObj['Mobile Combustion'] + val).toFixed(4)
        })
      }
      if (siteData.fugitive) {
        siteData.fugitive.forEach(e => {
          const m = getShortMonth(e['Entry Period'] || e.period)
          const val = parseFloat(e.tco2e || e.ghg || 0)
          const monthObj = s1Data.find(x => x.month === m)
          if (monthObj) monthObj['Fugitive Emissions'] = +(monthObj['Fugitive Emissions'] + val).toFixed(4)
        })
      }
    })
  }

  // Dynamic Scope 2 monthly data
  const s2Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => ({
    month: m,
    renewable: 0,
    imported: 0
  }))

  if (allEntries) {
    Object.values(allEntries).forEach(siteData => {
      if (siteData.electricity) {
        siteData.electricity.forEach(e => {
          const m = getShortMonth(e['Entry Period'] || e.period)
          const consumption = parseFloat(e.Consumption ?? e.consumption ?? e.Volume ?? 0)
          const monthObj = s2Months.find(x => x.month === m)
          if (monthObj) {
            const isRenewable = e.isRenewable || e.accounting === 'market' || (e.category === 'Renewable Electricity Generation')
            if (isRenewable) {
              monthObj.renewable += consumption
            } else {
              monthObj.imported += consumption
            }
          }
        })
      }
      if (siteData.renewable) {
        siteData.renewable.forEach(e => {
          const m = getShortMonth(e['Entry Period'] || e.period)
          const consumption = parseFloat(e.Consumption ?? e.consumption ?? e.Volume ?? e.Generation ?? 0)
          const monthObj = s2Months.find(x => x.month === m)
          if (monthObj) {
            monthObj.renewable += consumption
          }
        })
      }
    })
  }

  const s2Data = s2Months.map(d => ({
    month: d.month,
    'Renewable Electricity Generation': +(d.renewable / 1000).toFixed(2),
    'Imported Energy': 0,
    'Imported Electricity': +(d.imported / 1000).toFixed(2),
  }))

  // Dynamic Scope 3 breakdown data
  const scope3Groups = [
    { name: "Employee Commute", module: "employeeCommute", color: "#1D4ED8", value: 0 },
    { name: "Transmission & Distribution Loss", module: "tdLoss", color: "#F59E0B", value: 0 },
    { name: "Food Consumption", module: "foodConsumption", color: "#10B981", value: 0 },
    { name: "Purchased Goods", module: "purchasedGoods", color: "#EF4444", value: 0 },
    { name: "Waste Disposal", module: "wasteDisposal", color: "#EC4899", value: 0 },
    { name: "Business Travel (Air)", module: "businessTravelAir", color: "#8B5CF6", value: 0 },
    { name: "Business Travel (Land)", module: "businessTravelLand", color: "#06B6D4", value: 0 },
    { name: "Water Supply", module: "waterSupply", color: "#A7F3D0", value: 0 }
  ]

  if (allEntries) {
    Object.values(allEntries).forEach(siteData => {
      scope3Groups.forEach(grp => {
        if (grp.module === "businessTravelAir") {
          const air = siteData.businessTravelAir || []
          grp.value += air.reduce((s, e) => s + (e.tco2e || e.ghg || 0), 0)
        } else if (grp.module === "businessTravelLand") {
          const land = siteData.businessTravelLand || []
          const sea = siteData.businessTravelSea || []
          const hotel = siteData.hotelStay || []
          grp.value += land.reduce((s, e) => s + (e.tco2e || e.ghg || 0), 0)
          grp.value += sea.reduce((s, e) => s + (e.tco2e || e.ghg || 0), 0)
          grp.value += hotel.reduce((s, e) => s + (e.tco2e || e.ghg || 0), 0)
        } else if (grp.module === "waterSupply") {
          const water = siteData.waterSupply || []
          const treatment = siteData.waterTreatment || []
          grp.value += water.reduce((s, e) => s + (e.tco2e || e.ghg || 0), 0)
          grp.value += treatment.reduce((s, e) => s + (e.tco2e || e.ghg || 0), 0)
        } else {
          const list = siteData[grp.module] || []
          grp.value += list.reduce((s, e) => s + (e.tco2e || e.ghg || 0), 0)
        }
      })
    })
  }

  const totalS3 = scope3Groups.reduce((s, g) => s + g.value, 0)
  const s3Data = scope3Groups.map(grp => {
    const pct = totalS3 > 0 ? +((grp.value / totalS3) * 100).toFixed(2) : 0
    return {
      name: grp.name,
      value: +grp.value.toFixed(4),
      color: grp.color,
      pct: pct
    }
  })

  const [s1View, setS1View] = useState('Detailed')
  const [s2View, setS2View] = useState('Detailed')

  const SCOPE1_COLORS = ['#064E3B', '#10B981', '#6EE7B7']
  const SCOPE2_COLORS = ['#10B981', '#064E3B', '#3B82F6']

  const yAxisLabel = (
    <div style={{ width: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{
        writingMode: 'vertical-rl',
        transform: 'rotate(180deg)',
        fontSize: 10,
        color: '#374151',
        fontWeight: 700,
        whiteSpace: 'nowrap',
        letterSpacing: '0.03em',
      }}>
        GHG Emission (TCO2e)
      </span>
    </div>
  )

  return (
    <div className="bg-[#F8FAFC]">
      <div className="w-full px-8 pt-6 pb-10">

        {/* ── Top bar ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-3xl font-bold text-[#111827]"
              style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
            >
              GHG Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wide whitespace-nowrap">Current Year</span>
              <select className="bg-transparent text-slate-700 font-semibold text-xs outline-none cursor-pointer">
                <option>CY 2026</option>
                <option>FY 2026</option>
                <option>CY 2025</option>
              </select>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wide whitespace-nowrap">Baseline Year (Optional)</span>
              <select className="bg-transparent text-slate-700 font-semibold text-xs outline-none cursor-pointer">
                <option>CY 2026 (Default)</option>
                <option>CY 2025</option>
                <option>CY 2024</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── KPI Cards — single 5-col row, no blank space ─────────────────── */}
        <div className="grid grid-cols-5 gap-4 mb-5">

          {/* Total GHG */}
          <div className="col-span-2 rounded-2xl bg-[#064E3B] p-5 relative overflow-hidden shadow-sm border-l-4 border-l-[#064E3B]">
            <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full -translate-y-10 translate-x-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-6 -translate-x-6 pointer-events-none" />
            <p className="text-[10px] uppercase tracking-widest text-white mb-3 relative">TOTAL GHG EMISSIONS</p>
            <div className="flex items-end gap-2 relative">
              <span className="text-4xl font-bold text-white tabular-nums leading-none"
                style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                {kpi.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-sm text-white mb-1">TCO2eq</span>
            </div>
            <p className="text-[11px] text-white/70 mt-3 relative">Combined Scope 1 + 2 + 3</p>
          </div>

          {/* Scope 1 */}
          <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm border-l-4 border-l-[#064E3B]">
            <div className="flex items-start justify-between mb-2">
              <p className="text-[10px] uppercase tracking-widest text-slate-700 font-bold pt-0.5">SCOPE 1</p>
              <ScopeRingBadge pct={kpi.scope1_pct} color="#064E3B" />
            </div>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-2xl font-bold text-slate-900 tabular-nums leading-none"
                style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                {kpi.scope1.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 mb-0.5">TCO2eq</span>
            </div>
            <p className="text-[10px] text-slate-400">Direct emissions from owned sources</p>
          </div>

          {/* Scope 2 */}
          <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm border-l-4 border-l-[#064E3B]">
            <div className="flex items-start justify-between mb-2">
              <p className="text-[10px] uppercase tracking-widest text-slate-700 font-bold pt-0.5">SCOPE 2</p>
              <ScopeRingBadge pct={kpi.scope2_pct} color="#10B981" />
            </div>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-2xl font-bold text-slate-900 tabular-nums leading-none"
                style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                {kpi.scope2.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 mb-0.5">TCO2eq</span>
            </div>
            <p className="text-[10px] text-slate-400">Indirect emissions from purchased energy</p>
          </div>

          {/* Scope 3 */}
          <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm border-l-4 border-l-[#064E3B]">
            <div className="flex items-start justify-between mb-2">
              <p className="text-[10px] uppercase tracking-widest text-slate-700 font-bold pt-0.5">SCOPE 3</p>
              <ScopeRingBadge pct={kpi.scope3_pct} color="#3B82F6" />
            </div>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-2xl font-bold text-slate-900 tabular-nums leading-none"
                style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                {kpi.scope3.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 mb-0.5">TCO2eq</span>
            </div>
            <p className="text-[10px] text-slate-400">Value chain emissions (Travel, Waste, etc.)</p>
          </div>

        </div>

        {/* ── Charts: Scope 1 bar + Scope 3 donut ──────────────────────────── */}
        <div className="grid grid-cols-5 gap-4 mb-4">

          {/* Scope 1 Bar Chart */}
          <div className="col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-800 text-sm"
                style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                Scope 1
              </h2>
            </div>
            <div className="flex gap-1 items-stretch">
              {yAxisLabel}
              <div className="flex-1 min-w-0">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={s1Data} barSize={22} margin={{ left: 4, right: 8, bottom: 4, top: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 500 }}
                      axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={40} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: '#F8FAFC' }} />
                    <Legend content={<CustomLegend />} />
                    <Bar dataKey="Stationary Combustion" fill={SCOPE1_COLORS[0]} stackId="s" radius={[0,0,0,0]} />
                    <Bar dataKey="Mobile Combustion" fill={SCOPE1_COLORS[1]} stackId="s" />
                    <Bar dataKey="Fugitive Emissions" fill={SCOPE1_COLORS[2]} stackId="s" radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-center text-[10px] font-bold text-slate-700 mt-1">Month</p>
              </div>
            </div>
            {/* Stats summary to fill remaining space */}
            <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
              {[
                { label: 'Stationary Combustion', value: s1Data.reduce((s,d) => s + (d['Stationary Combustion']||0), 0).toFixed(2), color: '#064E3B' },
                { label: 'Mobile Combustion',     value: s1Data.reduce((s,d) => s + (d['Mobile Combustion']||0), 0).toFixed(2),     color: '#10B981' },
                { label: 'Fugitive Emissions',    value: s1Data.reduce((s,d) => s + (d['Fugitive Emissions']||0), 0).toFixed(2),    color: '#6EE7B7' },
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

          {/* Scope 3 Donut Chart */}
          <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
            <h2 className="font-semibold text-slate-800 text-[15px] mb-3"
              style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
              Scope 3
            </h2>

            {/* Donut with HTML overlay center — never clips */}
            <div className="relative mx-auto" style={{ width: 200, height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={s3Data}
                    cx="50%" cy="50%"
                    innerRadius={68}
                    outerRadius={88}
                    dataKey="pct"
                    strokeWidth={2}
                    stroke="#fff"
                    paddingAngle={2}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {s3Data.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, name) => [`${v}%`, name]}
                    contentStyle={{ fontSize: 11, borderRadius: 10, border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center label overlay — always fully visible */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-[#064E3B] leading-none">
                  {Math.round(kpi.scope3_pct)}%
                </span>
                <span className="text-[10px] text-slate-400 tracking-widest mt-1 uppercase">
                  of Total
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 space-y-2.5">
              {s3Data.map(item => (
                <div key={item.name} className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: item.color }} />
                  <span className="text-xs text-slate-600 flex-1 truncate">{item.name}</span>
                  <span className="text-xs font-bold text-slate-800 tabular-nums">{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Scope 2 full-width Area Chart ─────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-800 text-sm"
              style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
              Scope 2
            </h2>
          </div>
          <div className="flex gap-1 items-stretch">
            {yAxisLabel}
            <div className="flex-1 min-w-0">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={s2Data} margin={{ left: 4, right: 8, bottom: 4, top: 4 }}>
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
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 500 }}
                    axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend content={<CustomLegend />} />
                  <Area type="monotone" dataKey="Renewable Electricity Generation"
                    stroke={SCOPE2_COLORS[0]} strokeWidth={2.5} fill="url(#gRenew)"
                    dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                  <Area type="monotone" dataKey="Imported Energy"
                    stroke={SCOPE2_COLORS[1]} strokeWidth={1.5} fill="url(#gImported)"
                    dot={false} activeDot={{ r: 3, strokeWidth: 0 }} />
                  <Area type="monotone" dataKey="Imported Electricity"
                    stroke={SCOPE2_COLORS[2]} strokeWidth={2.5} fill="url(#gImportElec)"
                    dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
              <p className="text-center text-[10px] font-bold text-slate-700 mt-1">Month</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

