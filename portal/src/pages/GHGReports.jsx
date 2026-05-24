import { useState } from 'react'
import { ChevronDown, Search, ChevronRight, Download } from 'lucide-react'
import { REPORT_TOTALS } from '../data/ghgData'
import { useGHG } from '../store/useGHG'
import { SITES } from '../data/ghgData'

function ScopeCard({ label, value, dark }) {
  return (
    <div className={`rounded-xl p-4 ${dark ? 'bg-[#064E3B]' : 'bg-white/10 backdrop-blur border border-white/20'}`}>
      <p className={`text-xs font-medium mb-2 ${dark ? 'text-[#A7F3D0]' : 'text-white/70'}`}>{label}</p>
      <p className={`text-2xl font-bold leading-none ${dark ? 'text-white' : 'text-white'}`}>
        {typeof value === 'number' ? value.toLocaleString(undefined, { minimumFractionDigits: value % 1 ? 3 : 0 }) : value}
      </p>
      <p className={`text-xs mt-1 ${dark ? 'text-[#6EE7B7]' : 'text-white/50'}`}>TCO2Eq</p>
    </div>
  )
}

function TableSection({ title, total, entries, columns }) {
  const [search, setSearch] = useState('')
  const filtered = entries.filter(e =>
    Object.values(e).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  )
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-4">
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">Total GHG Emissions —</span>
          <span className="text-sm font-bold text-[#064E3B]">{total} TCO2Eq</span>
          <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1">
            <Search className="w-3 h-3 text-slate-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search in table..."
              className="text-xs outline-none w-32 text-slate-600 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Column headers */}
      <div className="grid px-5 py-2 border-b border-slate-100 text-[10px] font-semibold text-slate-400 uppercase tracking-wide"
        style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
        {columns.map(c => (
          <div key={c} className="flex items-center gap-1 cursor-pointer hover:text-slate-600">
            {c} <ChevronDown className="w-3 h-3" />
          </div>
        ))}
      </div>

      {/* Rows */}
      {filtered.length === 0 ? (
        <p className="text-center text-sm text-slate-400 py-6">No data matching filters</p>
      ) : filtered.map((row, i) => (
        <div key={i} className="grid px-5 py-2.5 border-b border-slate-50 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
          style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
          {Object.values(row).map((v, j) => (
            <span key={j} className={j === columns.length - 1 ? 'font-semibold text-[#064E3B]' : ''}>
              {typeof v === 'number' ? v.toFixed(6) : v}
            </span>
          ))}
        </div>
      ))}

      <p className="text-[10px] text-slate-400 px-5 py-2">Showing {filtered.length} records</p>
    </div>
  )
}

export default function GHGReports() {
  const { allEntries, getScopeTotal } = useGHG()
  const ALL_CODES = SITES.map(s => s.code)

  // Aggregate all entries across all sites/modules into flat lists by scope
  const scope1Entries = ALL_CODES.flatMap(code => [
    ...(allEntries[code]?.stationary || []).map(e => ({ ...e, site: code, category: 'Stationary Combustion' })),
    ...(allEntries[code]?.mobile || []).map(e => ({ ...e, site: code, category: 'Mobile Combustion' })),
    ...(allEntries[code]?.fugitive || []).map(e => ({ ...e, site: code, category: 'Fugitive Emissions' })),
  ])
  const scope2Entries = ALL_CODES.flatMap(code => [
    ...(allEntries[code]?.electricity || []).map(e => ({ ...e, site: code, category: 'Imported Electricity' })),
    ...(allEntries[code]?.renewable || []).map(e => ({ ...e, site: code, category: 'Renewable Electricity' })),
    ...(allEntries[code]?.heatSteam || []).map(e => ({ ...e, site: code, category: 'Heat / Steam' })),
  ])
  const scope3Entries = ALL_CODES.flatMap(code => [
    ...(allEntries[code]?.employeeCommute || []).map(e => ({ ...e, site: code, category: 'Employee Commute' })),
    ...(allEntries[code]?.businessTravelAir || []).map(e => ({ ...e, site: code, category: 'Business Travel (Air)' })),
    ...(allEntries[code]?.businessTravelLand || []).map(e => ({ ...e, site: code, category: 'Business Travel (Land)' })),
    ...(allEntries[code]?.businessTravelSea || []).map(e => ({ ...e, site: code, category: 'Business Travel (Sea)' })),
    ...(allEntries[code]?.wasteDisposal || []).map(e => ({ ...e, site: code, category: 'Waste Disposal' })),
    ...(allEntries[code]?.waterSupply || []).map(e => ({ ...e, site: code, category: 'Water Supply' })),
    ...(allEntries[code]?.waterTreatment || []).map(e => ({ ...e, site: code, category: 'Water Treatment' })),
    ...(allEntries[code]?.purchasedGoods || []).map(e => ({ ...e, site: code, category: 'Purchased Goods' })),
    ...(allEntries[code]?.tdLoss || []).map(e => ({ ...e, site: code, category: 'T&D Loss' })),
    ...(allEntries[code]?.hotelStay || []).map(e => ({ ...e, site: code, category: 'Hotel Stay' })),
    ...(allEntries[code]?.foodConsumption || []).map(e => ({ ...e, site: code, category: 'Food Consumption' })),
    ...(allEntries[code]?.upstream || []).map(e => ({ ...e, site: code, category: 'Upstream Activities' })),
    ...(allEntries[code]?.downstream || []).map(e => ({ ...e, site: code, category: 'Downstream Activities' })),
  ])

  const liveS1Total = ALL_CODES.reduce((s, c) => s + getScopeTotal(c, 1), 0)
  const liveS2Total = ALL_CODES.reduce((s, c) => s + getScopeTotal(c, 2), 0)
  const liveS3Total = ALL_CODES.reduce((s, c) => s + getScopeTotal(c, 3), 0)
  const liveTotalAll = liveS1Total + liveS2Total + liveS3Total

  const [yearType, setYearType] = useState('FY')
  const [fromMonth, setFromMonth] = useState('Apr')
  const [fromYear, setFromYear] = useState('2026')
  const [toMonth, setToMonth] = useState('Mar')
  const [toYear, setToYear] = useState('2027')

  return (
    <div>
      {/* Dark green hero */}
      <div className="bg-gradient-to-br from-[#022C22] via-[#064E3B] to-[#065F46] px-8 pt-8 pb-6">
        <div className="flex items-center gap-1.5 text-xs text-[#6EE7B7] mb-4">
          <span className="hover:text-white cursor-pointer">Dashboard</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white">Reports</span>
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-1">
          Report for All Sites – Financial Year 2026
        </h1>
        <p className="text-center text-[#A7F3D0] text-sm mb-6">
          Measurement period: Apr 2026 → Mar 2027
        </p>

        {/* Scope summary cards */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-[#6EE7B7] uppercase tracking-wider mb-3">Scope Emission</p>
          <div className="grid grid-cols-5 gap-3">
            <ScopeCard label="Total GHG Emissions" value={liveTotalAll > 0 ? liveTotalAll.toFixed(3) : REPORT_TOTALS.total} dark />
            <ScopeCard label="Avoided Emissions" value={REPORT_TOTALS.avoided} />
            <ScopeCard label="Scope 1" value={liveS1Total > 0 ? liveS1Total.toFixed(3) : REPORT_TOTALS.scope1} />
            <ScopeCard label="Scope 2" value={liveS2Total > 0 ? liveS2Total.toFixed(3) : REPORT_TOTALS.scope2} />
            <ScopeCard label="Scope 3" value={liveS3Total > 0 ? liveS3Total.toFixed(3) : REPORT_TOTALS.scope3} />
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl px-5 py-3 flex items-center gap-4 flex-wrap">
          <div>
            <p className="text-[10px] text-[#6EE7B7] mb-1 uppercase tracking-wider">Reporting Year</p>
            <div className="flex rounded-lg border border-white/30 overflow-hidden">
              {['CY', 'FY'].map(t => (
                <button key={t} onClick={() => setYearType(t)}
                  className={`px-3 py-1 text-xs font-medium transition-colors ${yearType === t ? 'bg-white text-[#064E3B]' : 'text-white hover:bg-white/10'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] text-[#6EE7B7] mb-1 uppercase tracking-wider">From</p>
            <div className="flex items-center gap-1.5 bg-white rounded-lg px-2.5 py-1.5 text-xs text-slate-700 min-w-32">
              <select value={fromMonth} onChange={e => setFromMonth(e.target.value)} className="outline-none bg-transparent">
                {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => <option key={m}>{m}</option>)}
              </select>
              <input value={fromYear} onChange={e => setFromYear(e.target.value)} className="w-12 outline-none bg-transparent" />
            </div>
          </div>
          <div>
            <p className="text-[10px] text-[#6EE7B7] mb-1 uppercase tracking-wider">To</p>
            <div className="flex items-center gap-1.5 bg-white rounded-lg px-2.5 py-1.5 text-xs text-slate-700 min-w-32">
              <select value={toMonth} onChange={e => setToMonth(e.target.value)} className="outline-none bg-transparent">
                {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => <option key={m}>{m}</option>)}
              </select>
              <input value={toYear} onChange={e => setToYear(e.target.value)} className="w-12 outline-none bg-transparent" />
            </div>
          </div>
          <div>
            <p className="text-[10px] text-[#6EE7B7] mb-1 uppercase tracking-wider">Sites</p>
            <div className="flex items-center gap-1.5 bg-white rounded-lg px-2.5 py-1.5 text-xs text-slate-700 cursor-pointer min-w-28">
              All Sites <ChevronDown className="w-3 h-3 ml-auto text-slate-400" />
            </div>
          </div>
          <div>
            <p className="text-[10px] text-[#6EE7B7] mb-1 uppercase tracking-wider">Export Type</p>
            <div className="flex items-center gap-1.5 bg-white rounded-lg px-2.5 py-1.5 text-xs text-slate-500 cursor-pointer min-w-36">
              Select Export Type <ChevronDown className="w-3 h-3 ml-auto" />
            </div>
          </div>
          <button className="ml-auto flex items-center gap-1.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors mt-4">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* Tables */}
      <div className="px-8 py-6 bg-[#F8FAFC]">
        {/* Scope 1 heading */}
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-base font-bold text-slate-800">Scope 1</h2>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <TableSection
          title="Scope 1 — All Entries"
          total={liveS1Total.toFixed(6)}
          entries={scope1Entries}
          columns={['date', 'site', 'category', 'Type', 'Unit', 'Consumption', 'ef', 'tco2e']}
        />

        {/* Scope 2 heading */}
        <div className="flex items-center gap-3 mb-4 mt-6">
          <h2 className="text-base font-bold text-slate-800">Scope 2</h2>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <TableSection
          title="Scope 2 — All Entries"
          total={liveS2Total.toFixed(6)}
          entries={scope2Entries}
          columns={['date', 'site', 'category', 'Country', 'Unit', 'Consumption', 'ef', 'tco2e']}
        />

        {/* Scope 3 heading */}
        <div className="flex items-center gap-3 mb-4 mt-6">
          <h2 className="text-base font-bold text-slate-800">Scope 3</h2>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <TableSection
          title="Scope 3 — All Entries"
          total={liveS3Total.toFixed(6)}
          entries={scope3Entries}
          columns={['date', 'site', 'category', 'tco2e']}
        />
      </div>
    </div>
  )
}
