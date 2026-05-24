import { useState } from 'react'
import { History, SkipForward, Trash2, Search, ChevronDown } from 'lucide-react'
import { useGHG } from '../store/useGHG'

// Reusable dropdown
export function Select({ label, value, onChange, options, required }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-600">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      <div className="relative">
        <select
          value={value} onChange={e => onChange(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#10B981] appearance-none bg-white pr-8"
        >
          <option value="">Select {label}</option>
          {options.map(o => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  )
}

// Reusable text/number input
export function Input({ label, value, onChange, placeholder, required, type = 'text' }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-600">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder || `Enter ${label}`}
        className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#10B981]"
      />
    </div>
  )
}

// File upload
export function FileUpload({ label = 'Supporting Document', file, onChange }) {
  return (
    <div className="flex flex-col gap-1 col-span-full">
      <label className="text-xs font-medium text-slate-600">{label}</label>
      <label className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-[#10B981] hover:bg-[#ECFDF5]/20 transition-all">
        <p className="text-sm text-slate-500">{file ? file.name : 'Drag file here or click to select'}</p>
        <p className="text-xs text-slate-400 mt-0.5">PDF, Excel, Word, Image – max 5MB</p>
        <input type="file" className="hidden" onChange={e => onChange(e.target.files?.[0])} />
      </label>
    </div>
  )
}

// Live GHG preview badge
export function GHGPreview({ tco2e }) {
  if (!tco2e && tco2e !== 0) return null
  return (
    <div className="col-span-full bg-[#ECFDF5] border border-[#10B981]/30 rounded-xl px-4 py-2.5 flex items-center justify-between">
      <span className="text-xs font-medium text-[#065F46]">Calculated GHG Emission</span>
      <span className="text-base font-bold text-[#064E3B]">{tco2e.toFixed(6)} <span className="text-xs font-normal text-[#065F46]">tCO2Eq</span></span>
    </div>
  )
}

// Records table
export function RecordsTable({ columns, entries, onDelete }) {
  const [search, setSearch] = useState('')
  const filtered = entries.filter(e =>
    Object.values(e).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  )
  return (
    <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
        <span className="text-xs text-slate-500">Showing {filtered.length} records</span>
        <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1.5">
          <Search className="w-3 h-3 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search in table..." className="text-xs outline-none w-28 text-slate-600" />
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-400">No Record Found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100">
                {columns.map(c => <th key={c} className="text-left px-3 py-2 font-semibold text-slate-500 uppercase tracking-wide text-[10px]">{c}</th>)}
                <th className="px-3 py-2 text-slate-500 uppercase tracking-wide text-[10px]">tCO2Eq</th>
                <th className="px-2 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={row.id || i} className="border-b border-slate-50 hover:bg-slate-50">
                  {columns.map(c => <td key={c} className="px-3 py-2 text-slate-600">{row[c] ?? '—'}</td>)}
                  <td className="px-3 py-2 font-semibold text-[#064E3B]">{(row.tco2e || 0).toFixed(6)}</td>
                  <td className="px-2 py-2">
                    <button onClick={() => onDelete(row.id)}
                      className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 hover:text-red-400 text-slate-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// Emission footer card
export function EmissionFooter({ label, total }) {
  return (
    <div className="mt-4 border-t border-slate-100 pt-4 flex items-center gap-3">
      <div className="w-6 h-6 rounded-full border-2 border-[#064E3B] flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-[#064E3B]" />
      </div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className="ml-auto text-base font-bold text-[#064E3B]">{total.toFixed(6)}</span>
      <span className="text-xs text-slate-400">TCO2Eq</span>
    </div>
  )
}

// Main assessment form wrapper
export default function AssessmentForm({
  title, description, siteCode, module, emissionLabel,
  fields, columns, onBuildEntry,
  onNext, onPrev,
}) {
  const { getEntries, getModuleTotal, addEntry, deleteEntry } = useGHG()
  const [showHistory, setShowHistory] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const entries = getEntries(siteCode, module)
  const total = getModuleTotal(siteCode, module)

  function handleSubmit(formData) {
    const entry = onBuildEntry(formData)
    if (!entry) return
    addEntry(siteCode, module, entry)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2000)
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Breadcrumb handled by parent */}
      <div className="p-6 max-w-4xl">
        {/* Progress bar */}
        <div className="h-1 bg-slate-100 rounded-full mb-6">
          <div className="h-1 bg-[#064E3B] rounded-full w-full" />
        </div>

        <h2 className="text-lg font-semibold text-slate-800 mb-1">{title}</h2>
        {description && <p className="text-sm text-slate-500 mb-5">{description}</p>}

        {/* History / Skip buttons */}
        <div className="flex gap-3 mb-5">
          <button onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-600 hover:border-[#10B981] hover:text-[#064E3B] transition-colors">
            <History className="w-4 h-4" /> View History
          </button>
          {onNext && (
            <button onClick={onNext}
              className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-600 hover:border-[#10B981] transition-colors">
              <SkipForward className="w-4 h-4" /> Skip & Next
            </button>
          )}
        </div>

        {submitted && (
          <div className="mb-4 bg-[#ECFDF5] border border-[#10B981] text-[#065F46] text-sm rounded-xl px-4 py-2.5">
            Entry saved successfully.
          </div>
        )}

        {/* The form — rendered by child via render prop */}
        {fields({ onSubmit: handleSubmit, entries })}

        {/* Records table */}
        <RecordsTable
          columns={columns}
          entries={entries}
          onDelete={id => deleteEntry(siteCode, module, id)}
        />

        {/* Emission total */}
        <EmissionFooter label={emissionLabel || `Emission From ${title}`} total={total} />

        {/* Nav arrows */}
        <div className="flex justify-end gap-3 mt-6">
          {onPrev && (
            <button onClick={onPrev}
              className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#064E3B] hover:text-[#064E3B] transition-colors text-lg">
              ←
            </button>
          )}
          {onNext && (
            <button onClick={onNext}
              className="w-9 h-9 rounded-full border-2 border-[#064E3B] flex items-center justify-center text-[#064E3B] hover:bg-[#064E3B] hover:text-white transition-colors text-lg">
              →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
