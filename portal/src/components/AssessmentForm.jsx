import { useState } from 'react'
import { History, SkipForward, Trash2, Search, ChevronDown, X, CheckCircle2, FileText } from 'lucide-react'
import { useGHG } from '../store/useGHG'

// ─── Reusable form fields ─────────────────────────────────────────────────────

export function Select({ label, value, onChange, options, required }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-600">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 appearance-none bg-white pr-8 transition-colors"
        >
          <option value="">Select {label}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-2.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  )
}

export function Input({ label, value, onChange, placeholder, required, type = 'text' }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-600">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || `Enter ${label}`}
        className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-colors"
      />
    </div>
  )
}

export function FileUpload({ label = 'Supporting Document', file, onChange }) {
  return (
    <div className="flex flex-col gap-1 col-span-full">
      <label className="text-xs font-medium text-slate-600">{label}</label>
      <label className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-[#064E3B]/40 hover:bg-[#E6F4F1]/20 transition-all">
        <p className="text-sm text-slate-500">{file ? file.name : 'Drag file here or click to select'}</p>
        <p className="text-xs text-slate-400 mt-0.5">PDF, Excel, Word, Image – max 5 MB</p>
        <input type="file" className="hidden" onChange={e => onChange(e.target.files?.[0])} />
      </label>
    </div>
  )
}

// ─── Live GHG preview ─────────────────────────────────────────────────────────

export function GHGPreview({ tco2e }) {
  if (tco2e == null) return null
  return (
    <div className="col-span-full bg-[#ECFDF5] border border-[#10B981]/30 rounded-xl px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-[#064E3B] flex items-center justify-center shrink-0">
          <span className="text-white text-[9px] font-bold">~</span>
        </div>
        <span className="text-xs font-medium text-[#065F46]">Calculated GHG Emission</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-base font-bold text-[#064E3B] tabular-nums">{tco2e.toFixed(6)}</span>
        <span className="text-xs text-[#065F46]">tCO2Eq</span>
      </div>
    </div>
  )
}

// ─── Records table ────────────────────────────────────────────────────────────

export function RecordsTable({ columns, entries, onDelete }) {
  const [search, setSearch] = useState('')
  const filtered = entries.filter(e =>
    Object.values(e).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  )

  if (entries.length === 0) {
    return (
      <div className="border border-slate-200 rounded-xl py-10 text-center bg-white">
        <FileText className="w-8 h-8 text-slate-200 mx-auto mb-2" />
        <p className="text-sm text-slate-400">No records yet. Add your first entry above.</p>
      </div>
    )
  }

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
        <span className="text-xs font-medium text-slate-500">
          {filtered.length} of {entries.length} {entries.length === 1 ? 'record' : 'records'}
        </span>
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5">
          <Search className="w-3 h-3 text-slate-400 shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            className="text-xs outline-none w-24 text-slate-600 bg-transparent"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-slate-300 hover:text-slate-500 transition-colors">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              {columns.map(c => (
                <th key={c} className="text-left px-3 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[9px] whitespace-nowrap">
                  {c}
                </th>
              ))}
              <th className="px-3 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[9px] text-right whitespace-nowrap">
                tCO2Eq
              </th>
              <th className="px-2 py-2.5 w-8" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={row.id || i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                {columns.map(c => (
                  <td key={c} className="px-3 py-2.5 text-slate-600 max-w-[140px] truncate whitespace-nowrap">
                    {row[c] ?? '—'}
                  </td>
                ))}
                <td className="px-3 py-2.5 font-bold text-[#064E3B] text-right whitespace-nowrap tabular-nums">
                  {(row.tco2e || 0).toFixed(6)}
                </td>
                <td className="px-2 py-2.5">
                  <button
                    onClick={() => onDelete(row.id)}
                    className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Emission footer ──────────────────────────────────────────────────────────

export function EmissionFooter({ label, total }) {
  return (
    <div className="mt-4 bg-[#064E3B] rounded-2xl px-5 py-4 flex items-center gap-4 border-l-4 border-l-[#6EE7B7]">
      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
        <CheckCircle2 className="w-4.5 h-4.5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-[#A7F3D0] mb-0.5">{label}</p>
        <p className="text-xs text-[#6EE7B7]">Combined total for this module</p>
      </div>
      <div className="text-right shrink-0">
        <p
          className="text-2xl font-bold text-white tabular-nums leading-none"
          style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
        >
          {total.toFixed(4)}
        </p>
        <p className="text-[10px] text-[#A7F3D0] mt-0.5">TCO2Eq</p>
      </div>
    </div>
  )
}

// ─── Main assessment form wrapper ─────────────────────────────────────────────

export default function AssessmentForm({
  title, description, siteCode, module, emissionLabel,
  fields, columns, onBuildEntry,
  onNext, onPrev,
}) {
  const { getEntries, getModuleTotal, addEntry, deleteEntry } = useGHG()
  const [showHistory, setShowHistory] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10))
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const YEARS  = ['2023','2024','2025','2026','2027']
  const [periodMonth, setPeriodMonth] = useState(MONTHS[new Date().getMonth()])
  const [periodYear,  setPeriodYear]  = useState(String(new Date().getFullYear()))
  const entryPeriod = `${periodMonth} - ${periodYear}`
  const entries = getEntries(siteCode, module)
  const total = getModuleTotal(siteCode, module)
  const allColumns = ['date', 'Entry Period', ...columns.filter(c => c !== 'date')]

  function handleSubmit(formData) {
    const entry = onBuildEntry(formData)
    if (!entry) return
    addEntry(siteCode, module, { ...entry, date: entryDate, 'Entry Period': entryPeriod })
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2500)
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      <div className="p-6 max-w-4xl">

        {/* Title */}
        <div className="mb-5">
          <h2
            className="text-lg font-bold text-slate-800 leading-snug"
            style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
          >
            {title}
          </h2>
          {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
        </div>

        {/* Toolbar: history toggle + skip */}
        <div className="flex items-center gap-2.5 mb-5">
          <button
            onClick={() => setShowHistory(v => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              showHistory
                ? 'bg-[#064E3B] text-white border-[#064E3B]'
                : 'border-slate-200 text-slate-600 hover:border-[#064E3B] hover:text-[#064E3B]'
            }`}
          >
            <History className="w-4 h-4" />
            {showHistory ? 'Hide History' : 'View History'}
            {entries.length > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                showHistory ? 'bg-white/20 text-white' : 'bg-[#064E3B] text-white'
              }`}>
                {entries.length}
              </span>
            )}
          </button>
          {onNext && (
            <button
              onClick={onNext}
              className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-600 hover:border-[#064E3B] hover:text-[#064E3B] transition-colors"
            >
              <SkipForward className="w-4 h-4" /> Skip &amp; Next
            </button>
          )}
        </div>

        {/* History panel (shown above form when toggled) */}
        {showHistory && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Recorded Entries
            </p>
            <RecordsTable
              columns={allColumns}
              entries={entries}
              onDelete={id => deleteEntry(siteCode, module, id)}
            />
            {entries.length > 0 && (
              <EmissionFooter label={emissionLabel || title} total={total} />
            )}
          </div>
        )}

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 border-l-4 border-l-[#064E3B]">
          {submitted && (
            <div className="mb-5 bg-[#ECFDF5] border border-[#10B981]/40 text-[#065F46] text-sm rounded-xl px-4 py-3 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              Entry saved successfully.
            </div>
          )}

          {/* Standard date + entry period row */}
          <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-slate-100">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Date <span className="text-red-400">*</span></label>
              <input
                type="date"
                value={entryDate}
                onChange={e => setEntryDate(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Entry Period</label>
              <div className="flex gap-2">
                <select
                  value={periodMonth}
                  onChange={e => setPeriodMonth(e.target.value)}
                  className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-white outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-colors"
                >
                  {MONTHS.map(m => <option key={m}>{m}</option>)}
                </select>
                <select
                  value={periodYear}
                  onChange={e => setPeriodYear(e.target.value)}
                  className="w-24 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-white outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-colors"
                >
                  {YEARS.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </div>

          {fields({ onSubmit: handleSubmit, entries })}
        </div>

        {/* Records section (shown below form when history is hidden) */}
        {!showHistory && entries.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Recorded Entries ({entries.length})
            </p>
            <RecordsTable
              columns={allColumns}
              entries={entries}
              onDelete={id => deleteEntry(siteCode, module, id)}
            />
            <EmissionFooter label={emissionLabel || title} total={total} />
          </div>
        )}

        {/* Page navigation */}
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
          <div>
            {onPrev && (
              <button
                onClick={onPrev}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#064E3B] transition-colors font-medium"
              >
                ← Previous
              </button>
            )}
          </div>
          <div>
            {onNext && (
              <button
                onClick={onNext}
                className="flex items-center gap-2 bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors shadow-sm"
              >
                Next →
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

