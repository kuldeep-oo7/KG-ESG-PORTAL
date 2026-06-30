import { useState } from 'react'
import { History, SkipForward, Trash2, Pencil, Search, ChevronDown, X, CheckCircle2, FileText, Download, Eye, Upload } from 'lucide-react'
import { useGHG } from '../store/useGHG'
import { putDoc, getDoc, newDocId } from '../lib/docStore'
import { recomputeEntry } from '../lib/calculations'
import BulkImportModal from './BulkImportModal'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const YEARS  = ['2023','2024','2025','2026','2027']
const MAX_EMBED = 5 * 1024 * 1024 // 5 MB — embed files as a data URL so they persist & can be opened

// ─── Reusable form fields ─────────────────────────────────────────────────────

export function Select({ label, value, onChange, options, required }) {
  // Supports flat options (['a','b']) OR grouped options ([{ label, options: [...] }]).
  // Grouped form renders non-selectable <optgroup> headings so category labels
  // (e.g. "Construction") can't be picked as if they were materials.
  const grouped = Array.isArray(options) && options.length > 0
    && typeof options[0] === 'object' && options[0] !== null && 'options' in options[0]
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
          {grouped
            ? options.map(g => (
                <optgroup key={g.label} label={g.label}>
                  {g.options.map(o => <option key={o} value={o}>{o}</option>)}
                </optgroup>
              ))
            : options.map(o => <option key={o} value={o}>{o}</option>)}
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

// Reads the chosen file and (for files <= 2MB) embeds it as a data URL so it is
// saved with the entry and can be downloaded later. Larger files keep name only.
export function FileUpload({ label = 'Supporting Document', file, onChange }) {
  function handleFile(f) {
    if (!f) { onChange(null); return }
    const meta = { name: f.name, size: f.size, type: f.type }
    if (f.size <= MAX_EMBED) {
      const reader = new FileReader()
      reader.onload = () => onChange({ ...meta, dataUrl: reader.result })
      reader.onerror = () => onChange({ ...meta, dataUrl: null })
      reader.readAsDataURL(f)
    } else {
      onChange({ ...meta, dataUrl: null })
    }
  }
  return (
    <div className="flex flex-col gap-1 col-span-full">
      {label && <label className="text-xs font-medium text-slate-600">{label}</label>}
      <label className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-[#064E3B]/40 hover:bg-[#E6F4F1]/20 transition-all">
        <p className="text-sm text-slate-500">{file ? file.name : 'Drag file here or click to select'}</p>
        <p className="text-xs text-slate-400 mt-0.5">
          {file
            ? (file.dataUrl ? 'Attached — will be saved with the entry' : 'Attached (over 2 MB: name saved, file not embedded)')
            : 'PDF, Excel, Word, Image – max 5 MB'}
        </p>
        <input type="file" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
      </label>
    </div>
  )
}

// ─── Live GHG preview ─────────────────────────────────────────────────────────

export function GHGPreview({ tco2e, avoided }) {
  if (tco2e == null) return null
  return (
    <div className="col-span-full bg-[#ECFDF5] border border-[#10B981]/30 rounded-xl px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-[#064E3B] flex items-center justify-center shrink-0">
          <span className="text-white text-[9px] font-bold">~</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-[#065F46]">{avoided ? 'Avoided Emissions' : 'Calculated GHG Emission'}</span>
          {avoided && <span className="text-[10px] text-[#065F46]/70">Reported separately — not netted against gross emissions</span>}
        </div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-base font-bold text-[#064E3B] tabular-nums">{tco2e.toFixed(6)}</span>
        <span className="text-xs text-[#065F46]">{avoided ? 'Avoided tCO2Eq' : 'tCO2Eq'}</span>
      </div>
    </div>
  )
}

// ─── Document cell (download link if embedded) ────────────────────────────────

function DocCell({ row, onOpen }) {
  const name = row['Supporting Document'] || row.fileName || row.documentName
  if (!name) return <span className="text-slate-300">—</span>
  const hasDoc = row.documentData || row.dataUrl || row.documentId
  return (
    <button onClick={() => onOpen(row)}
      title={hasDoc ? `Preview ${name}` : `${name} — file not stored yet, click to attach & view`}
      className={`inline-flex items-center gap-1 font-medium max-w-[160px] ${hasDoc ? 'text-[#064E3B] hover:underline' : 'text-slate-400 hover:text-[#064E3B]'}`}>
      <Eye className="w-3.5 h-3.5 shrink-0" />
      <span className="truncate">{name}</span>
    </button>
  )
}

// ─── Document preview modal (inline PDF / image viewer) ───────────────────────

function DocPreviewModal({ doc, onClose, onAttach }) {
  const [localUrl, setLocalUrl] = useState(null)
  const [localName, setLocalName] = useState(null)
  const url = doc.url || localUrl
  const name = localName || doc.name
  const mime = (((url || '').match(/^data:([^;]+)/)) || [])[1] || ''
  const isImage = mime.startsWith('image/')
  const isPdf = mime === 'application/pdf' || /\.pdf$/i.test(name || '')

  function handleAttach(f) {
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      setLocalUrl(reader.result)
      setLocalName(f.name)
      if (onAttach && doc.row) onAttach(doc.row, { name: f.name, type: f.type, dataUrl: reader.result })
    }
    reader.readAsDataURL(f)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="w-4 h-4 text-[#064E3B] shrink-0" />
            <span className="text-sm font-semibold text-slate-700 truncate" title={name}>{name}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {url && (
              <a href={url} download={name} title="Download"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-[#064E3B] hover:bg-[#E6F4F1] transition-colors">
                <Download className="w-4 h-4" />
              </a>
            )}
            <button onClick={onClose} title="Close"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-slate-50 flex items-center justify-center p-2">
          {doc.loading ? (
            <div className="text-center py-16 px-6"><p className="text-sm text-slate-500">Loading document…</p></div>
          ) : !url ? (
            <div className="text-center py-16 px-6">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500 mb-1">The file for <span className="font-medium text-slate-700">{name}</span> isn’t stored yet.</p>
              <p className="text-xs text-slate-400 mb-4">(It was added before file-saving worked.) Attach it now to view it — it’ll be saved to this entry.</p>
              <label className="inline-flex items-center gap-2 bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors cursor-pointer">
                <Download className="w-4 h-4 rotate-180" /> Attach file to view
                <input type="file" className="hidden" onChange={e => handleAttach(e.target.files?.[0])} />
              </label>
            </div>
          ) : isImage ? (
            <img src={url} alt={name} className="max-w-full max-h-[75vh] object-contain mx-auto" />
          ) : isPdf ? (
            <iframe src={url} title={name} className="w-full h-[75vh] bg-white rounded-lg border border-slate-200" />
          ) : (
            <div className="text-center py-16 px-6">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500 mb-4">Inline preview isn’t supported for this file type.</p>
              <a href={url} download={name}
                className="inline-flex items-center gap-2 bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                <Download className="w-4 h-4" /> Download {name}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Edit entry modal (recomputes tCO2e = consumption × EF ÷ 1000) ────────────

function EditEntryModal({ row, module, onClose, onSave }) {
  const [pm, py] = (row['Entry Period'] || row.period || ' - ').split(' - ')
  const [month, setMonth]   = useState(MONTHS.includes((pm || '').trim()) ? pm.trim() : MONTHS[0])
  const [year, setYear]     = useState((py || '').trim() || '2025')
  const [date, setDate]     = useState(row.date || new Date().toISOString().slice(0, 10))
  const [cons, setCons]     = useState(String(row.Consumption ?? row.consumption ?? row.Generation ?? row.Volume ?? row.Tonnes ?? ''))
  const [remarks, setRemarks] = useState(row.remarks || '')
  const [docFile, setDocFile] = useState(null)
  const currentDocName = row['Supporting Document'] || row.fileName || row.documentName
  const typeLabel = row.Type || row.type || row.Country || row['Name of Country'] || row['Type of Goods'] || ''

  // Emission Factor AND tCO2e are derived from the CURRENT factor tables via the
  // shared recomputeEntry engine — which applies the correct per-module unit math
  // (e.g. waste is per-tonne, freight is tonne.km). The old modal used a naive
  // consumption×ef÷1000 that produced wrong carbon for waste/freight on edit.
  const candidate = { ...row, Consumption: cons, consumption: cons, Volume: cons, Generation: cons }
  const recomputed = recomputeEntry(module, candidate)
  const fallbackEf = parseFloat(row.ef ?? row['Emission Factor']) || 0
  const ef = recomputed ? recomputed.ef : fallbackEf
  const derivedSource = recomputed?.source
  const tco2e = recomputed ? recomputed.tco2e : +((parseFloat(cons) || 0) * ef / 1000).toFixed(6)

  async function save() {
    const period = `${month} - ${year}`
    const c = parseFloat(cons) || 0
    const t = +tco2e
    const patch = {
      date,
      'Entry Period': period, period,
      Consumption: c, consumption: c, Volume: c,
      'Emission Factor': ef, ef,
      tco2e: t, ghg: t,
      remarks,
      ...(derivedSource ? { Source: derivedSource } : {}),
    }
    if (docFile?.name) {
      patch['Supporting Document'] = docFile.name
      if (docFile.dataUrl) {
        const id = newDocId()
        try {
          await putDoc(id, { name: docFile.name, type: docFile.type, dataUrl: docFile.dataUrl })
          patch.documentId = id
          patch.documentData = null
        } catch {
          patch.documentData = docFile.dataUrl
        }
      }
    }
    onSave(patch)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-800" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>Edit Entry</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        {typeLabel && <p className="text-xs text-slate-500 mb-4">Editing: <span className="font-medium text-slate-700">{typeLabel}</span></p>}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Entry Period</label>
              <div className="flex gap-2">
                <select value={month} onChange={e => setMonth(e.target.value)}
                  className="flex-1 border border-slate-200 rounded-xl px-2 py-2 text-sm bg-white outline-none focus:border-[#064E3B]">
                  {MONTHS.map(m => <option key={m}>{m}</option>)}
                </select>
                <select value={year} onChange={e => setYear(e.target.value)}
                  className="w-20 border border-slate-200 rounded-xl px-2 py-2 text-sm bg-white outline-none focus:border-[#064E3B]">
                  {YEARS.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Consumption</label>
              <input type="number" value={cons} onChange={e => setCons(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">
                Emission Factor <span className="text-slate-400 font-normal">(auto{derivedSource ? ` · ${derivedSource}` : ''})</span>
              </label>
              <input type="number" value={ef} readOnly disabled title="Auto-calculated from the current DEFRA/IEA factor tables — not editable"
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none bg-slate-100 text-slate-500 cursor-not-allowed" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">Remarks</label>
            <input value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Additional notes"
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">Supporting Document</label>
            {currentDocName && !docFile && (
              <p className="text-[11px] text-slate-500 mb-1">Current: <span className="font-medium text-slate-700">{currentDocName}</span> — choose a file below to replace it.</p>
            )}
            <FileUpload label="" file={docFile} onChange={setDocFile} />
          </div>
          <div className="bg-[#ECFDF5] border border-[#10B981]/30 rounded-xl px-4 py-2.5 flex items-center justify-between">
            <span className="text-xs font-medium text-[#065F46]">Recalculated tCO2Eq</span>
            <span className="text-sm font-bold text-[#064E3B] tabular-nums">{tco2e.toFixed(6)}</span>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={save} className="flex-1 bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium py-2.5 rounded-xl transition-colors">Save Changes</button>
          <button onClick={onClose} className="border border-slate-200 text-sm text-slate-600 px-4 py-2.5 rounded-xl hover:border-slate-300 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  )
}

// ─── Records table ────────────────────────────────────────────────────────────

export function RecordsTable({ columns, entries, onDelete, onEdit, onAttachDoc, avoided }) {
  const [search, setSearch] = useState('')
  const [preview, setPreview] = useState(null)

  async function openDoc(row) {
    const name = row['Supporting Document'] || row.fileName || row.documentName || 'document'
    // Legacy: data URL embedded directly on the entry
    if (row.documentData || row.dataUrl) {
      setPreview({ name, url: row.documentData || row.dataUrl, row })
      return
    }
    // Current: blob stored in IndexedDB, referenced by documentId
    if (row.documentId) {
      setPreview({ name, url: '', loading: true, row })
      try {
        const d = await getDoc(row.documentId)
        if (d && d.dataUrl) { setPreview({ name, url: d.dataUrl, row }); return }
      } catch { /* fall through to missing */ }
      setPreview({ name, url: '', missing: true, row })
      return
    }
    // No file stored at all — open modal so the user can attach one
    setPreview({ name, url: '', missing: true, row })
  }
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
              <th className="px-3 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px] text-right whitespace-nowrap">{avoided ? 'Avoided tCO2Eq' : 'tCO2Eq'}</th>
              <th className="text-left px-3 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px] whitespace-nowrap">Document</th>
              <th className="px-3 py-2.5 w-24 text-right font-semibold text-slate-400 uppercase tracking-wide text-[10px] sticky right-0 bg-slate-50 border-l border-slate-200">Actions</th>
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
                <td className="px-3 py-2.5 whitespace-nowrap"><DocCell row={row} onOpen={openDoc} /></td>
                <td className="px-3 py-2.5 sticky right-0 bg-white border-l border-slate-100">
                  <div className="flex items-center gap-1.5 justify-end">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        title="Edit entry"
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-[#064E3B] border border-slate-200 hover:border-[#064E3B] transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(row.id)}
                      title="Delete entry"
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-red-500 border border-slate-200 hover:border-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {preview && <DocPreviewModal doc={preview} onClose={() => setPreview(null)} onAttach={onAttachDoc} />}
    </div>
  )
}

// ─── Emission footer ──────────────────────────────────────────────────────────

export function EmissionFooter({ label, total, period }) {
  return (
    <div className="mt-4 bg-[#064E3B] rounded-2xl px-5 py-4 flex items-center gap-4 border-l-4 border-l-[#6EE7B7]">
      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
        <CheckCircle2 className="w-4.5 h-4.5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-[#A7F3D0] mb-0.5">{label}</p>
        <p className="text-xs text-[#6EE7B7]">{period ? `Total for ${period}` : 'Total for this module'}</p>
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
  onNext, onPrev, bulkImport, hideDocument, avoided,
}) {
  const { getEntries, getModuleTotal, addEntry, deleteEntry, updateEntry } = useGHG()
  const [showHistory, setShowHistory] = useState(false)
  const [showBulk, setShowBulk] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10))
  const [periodMonth, setPeriodMonth] = useState(MONTHS[new Date().getMonth()])
  const [periodYear,  setPeriodYear]  = useState(String(new Date().getFullYear()))
  const [doc, setDoc] = useState(null)
  const [editRow, setEditRow] = useState(null)
  const entryPeriod = `${periodMonth} - ${periodYear}`
  const entries = getEntries(siteCode, module)
  // Module footer shows ONLY the selected month/year's total (not every month combined),
  // so it matches the period being entered. Updates live as the period dropdowns change.
  const total = +entries
    .filter(e => (e['Entry Period'] || e.period || '') === entryPeriod)
    .reduce((s, e) => s + (parseFloat(e.tco2e ?? e.ghg) || 0), 0)
    .toFixed(4)
  const allColumns = ['date', 'Entry Period', ...columns.filter(c => c !== 'date')]

  async function handleSubmit(formData) {
    const entry = onBuildEntry(formData)
    if (!entry) return
    const docFields = {}
    if (doc?.name) {
      docFields['Supporting Document'] = doc.name
      if (doc.dataUrl) {
        // Store the file blob in IndexedDB; keep only a reference on the entry
        // so the (localStorage-backed) entries object stays small.
        const docId = newDocId()
        try {
          await putDoc(docId, { name: doc.name, type: doc.type, dataUrl: doc.dataUrl })
          docFields.documentId = docId
        } catch {
          docFields.documentData = doc.dataUrl // fallback if IndexedDB unavailable
        }
      }
    } else if (entry['Supporting Document'] || entry.fileName) {
      docFields['Supporting Document'] = entry['Supporting Document'] || entry.fileName
    }
    addEntry(siteCode, module, {
      ...entry,
      date: entryDate,
      'Entry Period': entryPeriod,
      ...docFields,
    })
    setDoc(null)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2500)
  }

  async function attachDoc(row, file) {
    if (!row?.id || !file?.dataUrl) return
    try {
      const id = newDocId()
      await putDoc(id, { name: file.name, type: file.type, dataUrl: file.dataUrl })
      updateEntry(siteCode, module, row.id, { 'Supporting Document': file.name, documentId: id, documentData: null })
    } catch {
      updateEntry(siteCode, module, row.id, { 'Supporting Document': file.name, documentData: file.dataUrl })
    }
  }

  const recordsTable = (
    <RecordsTable
      columns={allColumns}
      entries={entries}
      avoided={avoided}
      onDelete={id => deleteEntry(siteCode, module, id)}
      onEdit={row => setEditRow(row)}
      onAttachDoc={attachDoc}
    />
  )

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      <div className="p-6 max-w-6xl">

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
          {bulkImport && (
            <button
              onClick={() => setShowBulk(true)}
              className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-600 hover:border-[#064E3B] hover:text-[#064E3B] transition-colors"
            >
              <Upload className="w-4 h-4" /> Bulk Import
            </button>
          )}
        </div>

        {/* History panel (shown above form when toggled) */}
        {showHistory && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Recorded Entries
            </p>
            {recordsTable}
            {entries.length > 0 && (
              <EmissionFooter label={emissionLabel || title} total={total} period={entryPeriod} />
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

          {/* Centralized supporting-document upload (persists with the entry) — kept at the bottom of the form */}
          {!hideDocument && (
            <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-1">
              <FileUpload file={doc} onChange={setDoc} />
            </div>
          )}
        </div>

        {/* Records section (shown below form when history is hidden) */}
        {!showHistory && entries.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Recorded Entries ({entries.length})
            </p>
            {recordsTable}
            <EmissionFooter label={emissionLabel || title} total={total} period={entryPeriod} />
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

      {editRow && (
        <EditEntryModal
          row={editRow}
          module={module}
          onClose={() => setEditRow(null)}
          onSave={patch => { updateEntry(siteCode, module, editRow.id, patch); setEditRow(null) }}
        />
      )}

      {showBulk && bulkImport && (
        <BulkImportModal
          title={title}
          columns={bulkImport.columns}
          templateName={bulkImport.templateName || module}
          templateUrl={bulkImport.templateUrl}
          isValid={bulkImport.isValid}
          onClose={() => setShowBulk(false)}
          onSubmit={validRows => {
            let n = 0
            validRows.forEach(r => {
              const entry = bulkImport.buildRow(r)
              if (entry) {
                addEntry(siteCode, module, {
                  ...entry,
                  date: entry.date || entryDate,
                  'Entry Period': entry['Entry Period'] || entryPeriod,
                })
                n++
              }
            })
            setShowBulk(false)
            if (n > 0) { setSubmitted(true); setTimeout(() => setSubmitted(false), 2500) }
          }}
        />
      )}
    </div>
  )
}
