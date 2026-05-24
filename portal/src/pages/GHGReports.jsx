import { useState } from 'react'
import { Download, ChevronUp, ChevronDown, Search, Calendar } from 'lucide-react'
import { REPORT_TOTALS, SITES } from '../data/ghgData'
import { useGHG } from '../store/useGHG'

const ALL_CODES = SITES.map(s => s.code)

const TABLE_COLUMNS = ['DATE', 'ENTRY PERIOD', 'SITE NAME', 'TYPE', 'UNIT', 'CONSUMPTION', 'SOURCE', 'EMISSION FACTOR', 'GHG (TCO2EQ)', 'REMARKS']

/* ── Scope card ─────────────────────────────────────────────────────────────── */
function ScopeCard({ label, primary, secondary, dark, teal }) {
  const bg = dark
    ? 'bg-[#064E3B] text-white'
    : teal
    ? 'bg-[#0D9488] text-white'
    : 'bg-white text-slate-800 border border-slate-200'

  const labelColor = dark || teal ? 'text-white/70' : 'text-slate-500'
  const valueColor = dark || teal ? 'text-white' : 'text-[#064E3B]'
  const subColor   = dark || teal ? 'text-white/60' : 'text-slate-400'

  return (
    <div className={`rounded-2xl p-5 shadow-sm ${bg}`}>
      <p className={`text-xs font-medium uppercase tracking-wide mb-3 ${labelColor}`}>{label}</p>
      {primary && (
        <p className={`text-2xl font-bold leading-none mb-0.5 ${valueColor}`}
          style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
          {primary}
        </p>
      )}
      {secondary && (
        <p className={`text-sm font-semibold mt-1 ${subColor}`}>{secondary}</p>
      )}
    </div>
  )
}

/* ── Sort header cell ───────────────────────────────────────────────────────── */
function SortTh({ col, sortCol, sortDir, onSort }) {
  const active = sortCol === col
  return (
    <div
      className="flex items-center gap-1 cursor-pointer hover:text-slate-600 select-none"
      onClick={() => onSort(col)}
    >
      <span>{col}</span>
      {active
        ? sortDir === 'asc'
          ? <ChevronUp className="w-3 h-3" />
          : <ChevronDown className="w-3 h-3" />
        : <ChevronDown className="w-3 h-3 opacity-30" />
      }
    </div>
  )
}

/* ── Table section card ─────────────────────────────────────────────────────── */
function TableSection({ title, entries }) {
  const [search, setSearch] = useState('')
  const [sortCol, setSortCol] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  function handleSort(col) {
    if (sortCol === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  const sectionTotal = entries.reduce((s, e) => s + (e.tco2e || 0), 0)

  const filtered = entries.filter(e =>
    Object.values(e).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  )

  // Map each entry to the 10-column row
  function toRow(e) {
    return {
      date:       e.date || '—',
      period:     e.date ? e.date.slice(0, 7) : '—',
      site:       e.siteCode || e.site || '—',
      type:       e.Type || e['Vehicle Type'] || e['Food Type'] || e.Source || e.category || '—',
      unit:       e.Unit || e.unit || '—',
      consumption:e.Consumption || e.consumption || e['Volume (m³)'] || e['Weight (kg)'] || e['Weight (tonnes)'] || '—',
      source:     e.Source || e.source || '—',
      ef:         e['Emission Factor'] ?? e.ef ?? '—',
      ghg:        typeof e.tco2e === 'number' ? e.tco2e.toFixed(6) : '—',
      remarks:    e.remarks || '',
    }
  }

  const rows = filtered.map(toRow)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-4 shadow-sm">
      {/* Section header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h3
          className="font-semibold text-slate-800"
          style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
        >
          {title}
        </h3>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500">
            Total GHG Emissions:{' '}
            <span className="text-sm font-bold text-[#064E3B]">
              {sectionTotal.toFixed(6)} TCO2Eq
            </span>
          </span>
          <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="text-xs outline-none w-28 text-slate-600 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Column headers */}
      <div
        className="grid px-6 py-2.5 border-b border-slate-100 text-[10px] font-semibold text-slate-400 uppercase tracking-wide"
        style={{ gridTemplateColumns: 'repeat(10, 1fr)' }}
      >
        {TABLE_COLUMNS.map(col => (
          <SortTh key={col} col={col} sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
        ))}
      </div>

      {/* Rows */}
      {rows.length === 0 ? (
        <p className="text-center text-sm text-slate-400 py-8">No entries yet</p>
      ) : (
        rows.map((row, i) => (
          <div
            key={i}
            className={`grid px-6 py-2.5 text-xs text-slate-700 border-b border-slate-50 ${i % 2 === 1 ? 'bg-[#F8FAFC]' : ''}`}
            style={{ gridTemplateColumns: 'repeat(10, 1fr)' }}
          >
            <span>{row.date}</span>
            <span>{row.period}</span>
            <span>{row.site}</span>
            <span className="truncate pr-1">{row.type}</span>
            <span>{row.unit}</span>
            <span>{row.consumption}</span>
            <span className="truncate pr-1">{row.source}</span>
            <span>{typeof row.ef === 'number' ? row.ef.toFixed(5) : row.ef}</span>
            <span className="font-semibold text-[#064E3B]">{row.ghg}</span>
            <span className="text-slate-400">{row.remarks}</span>
          </div>
        ))
      )}

      <p className="text-[10px] text-slate-400 px-6 py-2">
        Showing {rows.length} of {entries.length} records
      </p>
    </div>
  )
}

/* ── Main page ──────────────────────────────────────────────────────────────── */
export default function GHGReports() {
  const { allEntries, getScopeTotal } = useGHG()

  const [yearType, setYearType]   = useState('FY')
  const [fromMonth, setFromMonth] = useState('Apr')
  const [fromYear, setFromYear]   = useState('2026')
  const [toMonth, setToMonth]     = useState('Mar')
  const [toYear, setToYear]       = useState('2027')

  // Live totals
  const liveS1 = ALL_CODES.reduce((s, c) => s + getScopeTotal(c, 1), 0)
  const liveS2 = ALL_CODES.reduce((s, c) => s + getScopeTotal(c, 2), 0)
  const liveS3 = ALL_CODES.reduce((s, c) => s + getScopeTotal(c, 3), 0)
  const liveTotal = liveS1 + liveS2 + liveS3

  const displayTotal  = liveTotal  > 0 ? liveTotal.toFixed(3)  : REPORT_TOTALS.total.toFixed(3)
  const displayS1     = liveS1     > 0 ? liveS1.toFixed(6)     : REPORT_TOTALS.scope1.toFixed(6)
  const displayS2     = liveS2     > 0 ? liveS2.toFixed(6)     : REPORT_TOTALS.scope2.toFixed(6)
  const displayS3     = liveS3     > 0 ? liveS3.toFixed(6)     : REPORT_TOTALS.scope3.toFixed(6)

  // Build flat entry lists per scope / module
  const scope1Stationary = ALL_CODES.flatMap(c =>
    (allEntries[c]?.stationary || []).map(e => ({ ...e, siteCode: c }))
  )
  const scope1Mobile = ALL_CODES.flatMap(c =>
    (allEntries[c]?.mobile || []).map(e => ({ ...e, siteCode: c }))
  )
  const scope1Fugitive = ALL_CODES.flatMap(c =>
    (allEntries[c]?.fugitive || []).map(e => ({ ...e, siteCode: c }))
  )

  const scope2Electricity = ALL_CODES.flatMap(c =>
    (allEntries[c]?.electricity || []).map(e => ({ ...e, siteCode: c }))
  )
  const scope2Renewable = ALL_CODES.flatMap(c =>
    (allEntries[c]?.renewable || []).map(e => ({ ...e, siteCode: c }))
  )
  const scope2HeatSteam = ALL_CODES.flatMap(c =>
    (allEntries[c]?.heatSteam || []).map(e => ({ ...e, siteCode: c }))
  )

  const scope3EmployeeCommute = ALL_CODES.flatMap(c =>
    (allEntries[c]?.employeeCommute || []).map(e => ({ ...e, siteCode: c }))
  )
  const scope3BusinessAir = ALL_CODES.flatMap(c =>
    (allEntries[c]?.businessTravelAir || []).map(e => ({ ...e, siteCode: c }))
  )
  const scope3BusinessLand = ALL_CODES.flatMap(c =>
    (allEntries[c]?.businessTravelLand || []).map(e => ({ ...e, siteCode: c }))
  )
  const scope3BusinessSea = ALL_CODES.flatMap(c =>
    (allEntries[c]?.businessTravelSea || []).map(e => ({ ...e, siteCode: c }))
  )
  const scope3WasteDisposal = ALL_CODES.flatMap(c =>
    (allEntries[c]?.wasteDisposal || []).map(e => ({ ...e, siteCode: c }))
  )
  const scope3WaterSupply = ALL_CODES.flatMap(c =>
    (allEntries[c]?.waterSupply || []).map(e => ({ ...e, siteCode: c }))
  )
  const scope3WaterTreatment = ALL_CODES.flatMap(c =>
    (allEntries[c]?.waterTreatment || []).map(e => ({ ...e, siteCode: c }))
  )
  const scope3PurchasedGoods = ALL_CODES.flatMap(c =>
    (allEntries[c]?.purchasedGoods || []).map(e => ({ ...e, siteCode: c }))
  )
  const scope3TdLoss = ALL_CODES.flatMap(c =>
    (allEntries[c]?.tdLoss || []).map(e => ({ ...e, siteCode: c }))
  )
  const scope3HotelStay = ALL_CODES.flatMap(c =>
    (allEntries[c]?.hotelStay || []).map(e => ({ ...e, siteCode: c }))
  )
  const scope3Food = ALL_CODES.flatMap(c =>
    (allEntries[c]?.foodConsumption || []).map(e => ({ ...e, siteCode: c }))
  )
  const scope3Upstream = ALL_CODES.flatMap(c =>
    (allEntries[c]?.upstream || []).map(e => ({ ...e, siteCode: c }))
  )
  const scope3Downstream = ALL_CODES.flatMap(c =>
    (allEntries[c]?.downstream || []).map(e => ({ ...e, siteCode: c }))
  )

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  function handleExport() {
    const allRows = [
      ['Scope', 'Module', 'Date', 'Site', 'Type', 'Unit', 'Consumption', 'GHG (tCO2Eq)'],
      ...scope1Stationary.map(e => ['Scope 1', 'Stationary Combustion', e.date || '', e.siteCode || '', e.Type || '', e.Unit || '', e.Consumption || '', e.tco2e?.toFixed(6) || '']),
      ...scope1Mobile.map(e => ['Scope 1', 'Mobile Combustion', e.date || '', e.siteCode || '', e.Type || '', e.Unit || '', e.Consumption || '', e.tco2e?.toFixed(6) || '']),
      ...scope1Fugitive.map(e => ['Scope 1', 'Fugitive Emissions', e.date || '', e.siteCode || '', e.Type || '', e.Unit || '', e.Consumption || '', e.tco2e?.toFixed(6) || '']),
      ...scope2Electricity.map(e => ['Scope 2', 'Imported Electricity', e.date || '', e.siteCode || '', '', e.Unit || '', e.Consumption || '', e.tco2e?.toFixed(6) || '']),
      ...scope2Renewable.map(e => ['Scope 2', 'Renewable Electricity', e.date || '', e.siteCode || '', '', e.Unit || '', e.Consumption || '', e.tco2e?.toFixed(6) || '']),
      ...scope2HeatSteam.map(e => ['Scope 2', 'Heat / Steam', e.date || '', e.siteCode || '', '', e.Unit || '', e.Consumption || '', e.tco2e?.toFixed(6) || '']),
      ...[...scope3EmployeeCommute, ...scope3BusinessAir, ...scope3BusinessLand, ...scope3BusinessSea,
          ...scope3WasteDisposal, ...scope3WaterSupply, ...scope3PurchasedGoods, ...scope3HotelStay,
          ...scope3Food, ...scope3Upstream, ...scope3Downstream, ...scope3TdLoss].map(e => ['Scope 3', e.category || e.module || '', e.date || '', e.siteCode || '', '', '', '', e.tco2e?.toFixed(6) || '']),
      ['', '', '', '', '', 'TOTAL', '', liveTotal > 0 ? liveTotal.toFixed(6) : displayTotal],
    ]
    const csv = allRows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `KG_GHG_Report_${fromMonth}${fromYear}-${toMonth}${toYear}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Title section */}
      <div className="px-8 pt-8 pb-4 text-center">
        <h1
          className="text-2xl font-bold text-[#111827]"
          style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
        >
          Report for All Sites - Financial Year 2026
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Measurement period: Apr 2026 - Mar 2027
        </p>
      </div>

      {/* Scope summary cards — 5 in a row */}
      <div className="px-8 pb-4">
        <div className="grid grid-cols-5 gap-3">
          <ScopeCard
            label="Total GHG Emissions"
            primary={displayTotal}
            secondary="226 TCO2e"
            dark
          />
          <ScopeCard
            label="Avoided Emissions"
            primary={REPORT_TOTALS.avoided.toFixed(3)}
            secondary="707 TCO2e"
            teal
          />
          <ScopeCard
            label="Scope 1"
            primary={displayS1}
            secondary="TCO2e"
          />
          <ScopeCard
            label="Scope 2"
            primary={displayS2}
            secondary="TCO2e"
          />
          <ScopeCard
            label="Scope 3"
            primary={displayS3}
            secondary="TCO2e"
          />
        </div>
      </div>

      {/* Filter row */}
      <div className="px-8 pb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex gap-4 items-center flex-wrap">
          {/* CY / FY toggle */}
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            {['CY', 'FY'].map(t => (
              <button
                key={t}
                onClick={() => setYearType(t)}
                className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                  yearType === t
                    ? 'bg-[#064E3B] text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* From */}
          <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={fromMonth}
              onChange={e => setFromMonth(e.target.value)}
              className="outline-none bg-transparent text-slate-700 text-sm"
            >
              {MONTHS.map(m => <option key={m}>{m}</option>)}
            </select>
            <input
              value={fromYear}
              onChange={e => setFromYear(e.target.value)}
              className="w-12 outline-none bg-transparent text-slate-700 text-sm"
            />
          </div>

          <span className="text-slate-400 text-sm">—</span>

          {/* To */}
          <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={toMonth}
              onChange={e => setToMonth(e.target.value)}
              className="outline-none bg-transparent text-slate-700 text-sm"
            >
              {MONTHS.map(m => <option key={m}>{m}</option>)}
            </select>
            <input
              value={toYear}
              onChange={e => setToYear(e.target.value)}
              className="w-12 outline-none bg-transparent text-slate-700 text-sm"
            />
          </div>

          {/* Sites dropdown */}
          <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none bg-white text-slate-700">
            <option>All Sites</option>
            {SITES.map(s => <option key={s.code}>{s.name}</option>)}
          </select>

          {/* Export type */}
          <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none bg-white text-slate-500">
            <option value="">Select Export Type</option>
            <option>PDF</option>
            <option>Excel</option>
            <option>CSV</option>
          </select>

          {/* Export button */}
          <button
            onClick={handleExport}
            className="ml-auto flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* ── Table Sections ────────────────────────────────────────────────────── */}
      <div className="px-8 pb-12">

        {/* SCOPE 1 */}
        <div className="flex items-center gap-3 mb-4">
          <h2
            className="text-base font-bold text-[#064E3B] uppercase tracking-wide"
            style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
          >
            Scope 1
          </h2>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {scope1Stationary.length > 0 && (
          <TableSection title="Stationary Combustion" entries={scope1Stationary} />
        )}
        {scope1Mobile.length > 0 && (
          <TableSection title="Mobile Combustion" entries={scope1Mobile} />
        )}
        {scope1Fugitive.length > 0 && (
          <TableSection title="Fugitive Emissions" entries={scope1Fugitive} />
        )}
        {scope1Stationary.length === 0 && scope1Mobile.length === 0 && scope1Fugitive.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-4 text-center text-sm text-slate-400">
            No Scope 1 entries yet
          </div>
        )}

        {/* SCOPE 2 */}
        <div className="flex items-center gap-3 mb-4 mt-8">
          <h2
            className="text-base font-bold text-[#064E3B] uppercase tracking-wide"
            style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
          >
            Scope 2
          </h2>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {scope2Electricity.length > 0 && (
          <TableSection title="Imported Electricity" entries={scope2Electricity} />
        )}
        {scope2Renewable.length > 0 && (
          <TableSection title="Renewable Electricity" entries={scope2Renewable} />
        )}
        {scope2HeatSteam.length > 0 && (
          <TableSection title="Heat / Steam" entries={scope2HeatSteam} />
        )}
        {scope2Electricity.length === 0 && scope2Renewable.length === 0 && scope2HeatSteam.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-4 text-center text-sm text-slate-400">
            No Scope 2 entries yet
          </div>
        )}

        {/* SCOPE 3 */}
        <div className="flex items-center gap-3 mb-4 mt-8">
          <h2
            className="text-base font-bold text-[#064E3B] uppercase tracking-wide"
            style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
          >
            Scope 3
          </h2>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {scope3EmployeeCommute.length > 0 && (
          <TableSection title="Employee Commute" entries={scope3EmployeeCommute} />
        )}
        {scope3BusinessAir.length > 0 && (
          <TableSection title="Business Travel (Air)" entries={scope3BusinessAir} />
        )}
        {scope3BusinessLand.length > 0 && (
          <TableSection title="Business Travel (Land)" entries={scope3BusinessLand} />
        )}
        {scope3BusinessSea.length > 0 && (
          <TableSection title="Business Travel (Sea)" entries={scope3BusinessSea} />
        )}
        {scope3WasteDisposal.length > 0 && (
          <TableSection title="Waste Disposal" entries={scope3WasteDisposal} />
        )}
        {scope3WaterSupply.length > 0 && (
          <TableSection title="Water Supply" entries={scope3WaterSupply} />
        )}
        {scope3WaterTreatment.length > 0 && (
          <TableSection title="Water Treatment" entries={scope3WaterTreatment} />
        )}
        {scope3PurchasedGoods.length > 0 && (
          <TableSection title="Purchased Goods" entries={scope3PurchasedGoods} />
        )}
        {scope3TdLoss.length > 0 && (
          <TableSection title="Transmission & Distribution Loss" entries={scope3TdLoss} />
        )}
        {scope3HotelStay.length > 0 && (
          <TableSection title="Hotel Stay" entries={scope3HotelStay} />
        )}
        {scope3Food.length > 0 && (
          <TableSection title="Food Consumption" entries={scope3Food} />
        )}
        {scope3Upstream.length > 0 && (
          <TableSection title="Upstream Activities" entries={scope3Upstream} />
        )}
        {scope3Downstream.length > 0 && (
          <TableSection title="Downstream Activities" entries={scope3Downstream} />
        )}
        {[
          scope3EmployeeCommute, scope3BusinessAir, scope3BusinessLand, scope3BusinessSea,
          scope3WasteDisposal, scope3WaterSupply, scope3WaterTreatment, scope3PurchasedGoods,
          scope3TdLoss, scope3HotelStay, scope3Food, scope3Upstream, scope3Downstream,
        ].every(arr => arr.length === 0) && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-4 text-center text-sm text-slate-400">
            No Scope 3 entries yet
          </div>
        )}
      </div>
    </div>
  )
}
