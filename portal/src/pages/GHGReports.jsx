import { useState } from 'react'
import { Download, ChevronUp, ChevronDown, Search, Calendar } from 'lucide-react'
import { SITES } from '../data/ghgData'
import { useGHG } from '../store/useGHG'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const ALL_CODES = SITES.map(s => s.code)

const TABLE_COLUMNS = ['DATE', 'ENTRY PERIOD', 'SITE NAME', 'TYPE', 'UNIT', 'CONSUMPTION', 'SOURCE', 'EMISSION FACTOR', 'GHG (TCO2EQ)', 'REMARKS']
const COL_KEY = {
  'DATE': 'date', 'ENTRY PERIOD': 'period', 'SITE NAME': 'site', 'TYPE': 'type',
  'UNIT': 'unit', 'CONSUMPTION': 'consumption', 'SOURCE': 'source',
  'EMISSION FACTOR': 'ef', 'GHG (TCO2EQ)': 'ghg', 'REMARKS': 'remarks',
}

/* ── Scope card ─────────────────────────────────────────────────────────────── */
function ScopeCard({ label, primary, secondary, dark, teal }) {
  const bg = dark
    ? 'bg-[#064E3B] text-white'
    : teal
    ? 'bg-[#0D9488] text-white'
    : 'bg-white text-slate-800 border border-slate-200'

  const labelColor = dark || teal ? 'text-white/70' : 'text-slate-400'
  const valueColor = dark || teal ? 'text-white' : 'text-[#064E3B]'
  const subColor   = dark || teal ? 'text-white/50' : 'text-slate-400'

  const accent = !dark && !teal ? 'border-l-4 border-l-[#064E3B]' : ''

  return (
    <div className={`rounded-2xl p-5 shadow-sm ${bg} ${accent}`}>
      <p className={`text-[10px] font-semibold uppercase tracking-widest mb-4 ${labelColor}`}>{label}</p>
      {primary && (
        <p className={`text-3xl font-bold leading-none ${valueColor}`}
          style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
          {primary}
        </p>
      )}
      {secondary && (
        <p className={`text-xs mt-2 ${subColor}`}>{secondary}</p>
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
      period:     e['Entry Period'] || e.period || (e.date ? e.date.slice(0, 7) : '—'),
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

  let rows = filtered.map(toRow)
  if (sortCol) {
    const key = COL_KEY[sortCol]
    const numeric = ['consumption', 'ef', 'ghg'].includes(key)
    rows = [...rows].sort((a, b) => {
      if (numeric) {
        const av = parseFloat(a[key]) || 0, bv = parseFloat(b[key]) || 0
        return sortDir === 'asc' ? av - bv : bv - av
      }
      const av = String(a[key]), bv = String(b[key])
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
  } else {
    // No explicit sort → show the most recently entered records first (top)
    rows = [...rows].reverse()
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-4 shadow-sm">
      {/* Section header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#ECEEF0] rounded-t-xl">
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
          <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white">
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
  const { allEntries } = useGHG()

  const [yearType, setYearType]   = useState('FY')
  const [fromMonth, setFromMonth] = useState('Apr')
  const [fromYear, setFromYear]   = useState('2025')
  const [toMonth, setToMonth]     = useState('Mar')
  const [toYear, setToYear]       = useState('2026')
  const [exportFormat, setExportFormat] = useState('Excel')
  const [siteSel, setSiteSel]     = useState('All Sites')

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const FULL_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

  function monthIdx(name) {
    const n = String(name || '').trim().toLowerCase()
    let i = FULL_MONTHS.findIndex(m => m.toLowerCase() === n)
    if (i < 0) i = MONTHS.findIndex(m => m.toLowerCase() === n)
    return i
  }
  // Convert an entry to a comparable year*12+month value (or null if unknown)
  function entryYM(e) {
    const p = e['Entry Period'] || e.period
    if (p && p.includes('-')) {
      const [mo, yr] = p.split('-').map(s => s.trim())
      const mi = monthIdx(mo)
      if (mi >= 0 && yr) return parseInt(yr, 10) * 12 + mi
    }
    if (e.date && e.date.includes('-')) {
      const [y, m] = e.date.split('-')
      return parseInt(y, 10) * 12 + (parseInt(m, 10) - 1)
    }
    return null
  }
  const fromVal = parseInt(fromYear, 10) * 12 + monthIdx(fromMonth)
  const toVal   = parseInt(toYear, 10) * 12 + monthIdx(toMonth)
  const lo = Math.min(fromVal, toVal)
  const hi = Math.max(fromVal, toVal)
  function inRange(e) {
    const v = entryYM(e)
    if (v == null) return false
    return v >= lo && v <= hi
  }

  // Site filter → list of site codes to include
  const selectedCodes = siteSel === 'All Sites'
    ? ALL_CODES
    : ALL_CODES.filter(c => (SITES.find(s => s.code === c)?.name) === siteSel)

  // Build flat entry lists per module, applying site + date-range filters
  const get = (mod) => selectedCodes.flatMap(c =>
    (allEntries[c]?.[mod] || []).filter(inRange).map(e => ({ ...e, siteCode: c }))
  )

  const scope1Stationary    = get('stationary')
  const scope1Mobile        = get('mobile')
  const scope1Fugitive      = get('fugitive')
  const scope2Electricity   = get('electricity')
  const scope2Renewable     = get('renewable')
  const scope2HeatSteam     = get('heatSteam')
  const scope3EmployeeCommute = get('employeeCommute')
  const scope3BusinessAir   = get('businessTravelAir')
  const scope3BusinessLand  = get('businessTravelLand')
  const scope3BusinessSea   = get('businessTravelSea')
  const scope3WasteDisposal = get('wasteDisposal')
  const scope3WaterSupply   = get('waterSupply')
  const scope3WaterTreatment = get('waterTreatment')
  const scope3PurchasedGoods = get('purchasedGoods')
  const scope3TdLoss        = get('tdLoss')
  const scope3HotelStay     = get('hotelStay')
  const scope3Food          = get('foodConsumption')
  const scope3Upstream      = get('upstream')
  const scope3Downstream    = get('downstream')

  // Totals derived from the filtered lists (so summary cards react to filters)
  const sum = arr => arr.reduce((s, e) => s + (e.tco2e || 0), 0)
  const liveS1 = sum(scope1Stationary) + sum(scope1Mobile) + sum(scope1Fugitive)
  const liveS2 = sum(scope2Electricity) + sum(scope2HeatSteam)
  const liveS3 = sum(scope3EmployeeCommute) + sum(scope3BusinessAir) + sum(scope3BusinessLand) +
    sum(scope3BusinessSea) + sum(scope3WasteDisposal) + sum(scope3WaterSupply) + sum(scope3WaterTreatment) +
    sum(scope3PurchasedGoods) + sum(scope3TdLoss) + sum(scope3HotelStay) + sum(scope3Food) +
    sum(scope3Upstream) + sum(scope3Downstream)
  const liveAvoided = sum(scope2Renewable)
  const liveTotal = liveS1 + liveS2 + liveS3

  const displayTotal   = liveTotal.toFixed(3)
  const displayS1      = liveS1.toFixed(6)
  const displayS2      = liveS2.toFixed(6)
  const displayS3      = liveS3.toFixed(6)
  const displayAvoided = liveAvoided.toFixed(3)

  function handleExport(format) {
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

    if (format === 'PDF') {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

      // Header bar
      doc.setFillColor(6, 78, 59) // #064E3B
      doc.rect(0, 0, 297, 18, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(13)
      doc.setFont('helvetica', 'bold')
      doc.text('KG SYNERGY — GHG Emissions Report', 14, 12)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text(`Period: ${fromMonth} ${fromYear} – ${toMonth} ${toYear}`, 220, 12)

      // Summary row
      doc.setTextColor(30, 30, 30)
      doc.setFontSize(9)
      doc.text(`Total Emissions: ${(liveTotal > 0 ? liveTotal : displayTotal)} tCO₂Eq`, 14, 26)

      autoTable(doc, {
        startY: 30,
        head: [allRows[0]],
        body: allRows.slice(1),
        styles: { fontSize: 7.5, cellPadding: 2.5, overflow: 'linebreak' },
        headStyles: { fillColor: [6, 78, 59], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
          0: { cellWidth: 18 },
          1: { cellWidth: 38 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 30 },
          5: { cellWidth: 20 },
          6: { cellWidth: 22 },
          7: { cellWidth: 26 },
        },
        didDrawPage: (data) => {
          const pageCount = doc.internal.getNumberOfPages()
          doc.setFontSize(7)
          doc.setTextColor(150)
          doc.text(`Page ${data.pageNumber} of ${pageCount}`, 280, 205)
        },
      })

      doc.save(`KG_GHG_Report_${fromMonth}${fromYear}-${toMonth}${toYear}.pdf`)
      return
    }

    if (format === 'Excel') {
      const headers = allRows[0];
      let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <!--[if gte mso 9]>
  <xml>
    <x:ExcelWorkbook>
      <x:ExcelWorksheets>
        <x:ExcelWorksheet>
          <x:Name>GHG Report</x:Name>
          <x:WorksheetOptions>
            <x:DisplayGridlines/>
          </x:WorksheetOptions>
        </x:ExcelWorksheet>
      </x:ExcelWorksheets>
    </x:ExcelWorkbook>
  </xml>
  <![endif]-->
  <style>
    table { border-collapse: collapse; }
    th { background-color: #064E3B; color: white; font-weight: bold; }
    th, td { border: 0.5pt solid #CBD5E1; padding: 8px 12px; font-family: Arial, sans-serif; font-size: 10pt; }
    .total-row { font-weight: bold; background-color: #F1F5F9; }
  </style>
</head>
<body>
  <table>
    <thead>
      <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
    </thead>
    <tbody>
`;
      allRows.slice(1).forEach((row, idx) => {
        const isTotal = idx === allRows.length - 2;
        const rowClass = isTotal ? ' class="total-row"' : '';
        html += `      <tr${rowClass}>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>\n`;
      });
      html += `    </tbody>
  </table>
</body>
</html>`;

      const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `KG_GHG_Report_${fromMonth}${fromYear}-${toMonth}${toYear}.xls`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    // Default CSV export with double-quotes wrapping to support commas
    const csv = allRows.map(r => r.map(cell => {
      const val = String(cell);
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    }).join(',')).join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KG_GHG_Report_${fromMonth}${fromYear}-${toMonth}${toYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top bar */}
      <div className="px-8 py-6 flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-400 mb-1">Dashboard &gt; <span className="text-[#064E3B] font-semibold">Reports</span></p>
          <h1
            className="text-3xl font-bold text-[#111827]"
            style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
          >
            Report for {siteSel}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {yearType === 'FY' ? 'Financial Year' : 'Calendar Year'} &nbsp;·&nbsp; Measurement period: {fromMonth} {fromYear} – {toMonth} {toYear}
          </p>
        </div>
      </div>

      {/* Scope summary cards — 5 in a row */}
      <div className="px-8 pb-4">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-3">Scope Emission</p>
        <div className="grid grid-cols-5 gap-4">
          <ScopeCard
            label="Total GHG Emissions"
            primary={displayTotal}
            secondary="TCO2e Combined"
            dark
          />
          <ScopeCard
            label="Avoided Emissions"
            primary={displayAvoided}
            secondary="TCO2e Offset"
            teal
          />
          <ScopeCard
            label="Scope 1 — Direct"
            primary={displayS1}
            secondary="TCO2e"
          />
          <ScopeCard
            label="Scope 2 — Indirect"
            primary={displayS2}
            secondary="TCO2e"
          />
          <ScopeCard
            label="Scope 3 — Value Chain"
            primary={displayS3}
            secondary="TCO2e"
          />
        </div>
      </div>

      {/* Filter row */}
      <div className="px-8 pb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex gap-3 items-center flex-wrap">
          {/* CY / FY toggle */}
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            {['CY', 'FY'].map(t => (
              <button
                key={t}
                onClick={() => {
                  setYearType(t)
                  if (t === 'CY') {
                    setFromMonth('Jan'); setToMonth('Dec'); setToYear(fromYear)
                  } else {
                    setFromMonth('Apr'); setToMonth('Mar'); setToYear(String(parseInt(fromYear, 10) + 1))
                  }
                }}
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
          <div className="relative">
            <select
              value={siteSel}
              onChange={e => setSiteSel(e.target.value)}
              className="border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-sm outline-none bg-white text-slate-700 focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all appearance-none cursor-pointer">
              <option>All Sites</option>
              {SITES.map(s => <option key={s.code}>{s.name}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Export format */}
          <div className="relative">
            <select
              value={exportFormat}
              onChange={e => setExportFormat(e.target.value)}
              className="border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-sm outline-none bg-white text-slate-700 focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all appearance-none cursor-pointer"
            >
              <option value="Excel">Excel</option>

              <option value="PDF">PDF</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Export button */}
          <button
            onClick={() => handleExport(exportFormat)}
            className="flex items-center gap-2 bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Export Report
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

