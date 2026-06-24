import { useState } from 'react'
import { X, Plus, Trash2, Download, Upload, CheckCircle2 } from 'lucide-react'
import * as XLSX from 'xlsx'

// Generic bulk-import modal: download a template, upload a filled spreadsheet,
// edit rows inline, then submit them all at once.
// Props:
//   title       - heading
//   columns     - [{ key, label }]
//   templateName- file name for the template (no extension)
//   isValid(row)- returns true if a row should be imported
//   onSubmit(validRows) - called with the valid rows on Submit
//   onClose()
export default function BulkImportModal({ title, columns, templateName = 'template', templateUrl, isValid, onSubmit, onClose }) {
  const emptyRow = () => Object.fromEntries(columns.map(c => [c.key, '']))
  const [rows, setRows] = useState([emptyRow()])

  const valid = rows.filter(r => (isValid ? isValid(r) : true))

  function setCell(i, key, val) {
    setRows(rs => rs.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)))
  }
  function addRow() { setRows(rs => [...rs, emptyRow()]) }
  function removeRow(i) { setRows(rs => rs.filter((_, idx) => idx !== i)) }
  function clearAll() { setRows([emptyRow()]) }

  function downloadTemplate() {
    // Prefer the official template file (keeps cascading dropdowns intact)
    if (templateUrl) {
      const a = document.createElement('a')
      a.href = templateUrl
      a.download = `${templateName}.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      return
    }
    const ws = XLSX.utils.aoa_to_sheet([columns.map(c => c.label)])
    ws['!cols'] = columns.map(() => ({ wch: 22 }))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Template')
    XLSX.writeFile(wb, `${templateName}.xlsx`)
  }

  function handleUpload(file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json(ws, { defval: '' })
        const norm = s => String(s).replace(/\*/g, '').replace(/\s+/g, ' ').trim().toLowerCase()
        const mapped = json.map(r => {
          // normalized lookup of this row's headers (handles "Type of Vehicle *" etc.)
          const byNorm = {}
          Object.keys(r).forEach(k => { byNorm[norm(k)] = r[k] })
          const o = emptyRow()
          columns.forEach(c => {
            const v = byNorm[norm(c.label)] ?? byNorm[norm(c.key)]
            if (v !== undefined && v !== '') o[c.key] = String(v).trim()
          })
          return o
        }).filter(o => Object.values(o).some(v => v !== ''))
        setRows(mapped.length ? mapped : [emptyRow()])
      } catch {
        alert('Could not read that file. Please use the downloaded template (.xlsx).')
      }
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 pr-8" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>Bulk Data Import</h3>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Sub-header with counts */}
          <div className="bg-gradient-to-r from-[#ECFDF5] to-[#E6F4F1] rounded-lg p-4 border border-[#10B981]/20 flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-sm font-bold text-slate-700">{title}</h2>
            <div className="flex gap-3 text-sm">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                <span className="text-slate-500">Total:</span><span className="font-bold text-[#064E3B]">{rows.length}</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" /><span className="font-bold text-[#10B981]">{valid.length}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <button onClick={addRow} className="flex items-center justify-center gap-2 bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium py-2 px-4 rounded-xl transition-colors"><Plus className="w-4 h-4" /> Add Row</button>
            <button onClick={clearAll} className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-4 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /> Clear All</button>
            <button onClick={downloadTemplate} className="flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-600 hover:border-[#064E3B] text-sm font-medium py-2 px-4 rounded-xl transition-colors"><Download className="w-4 h-4" /> Download Template</button>
            <label className="flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-600 hover:border-[#064E3B] text-sm font-medium py-2 px-4 rounded-xl transition-colors cursor-pointer">
              <Upload className="w-4 h-4" /> Upload Spreadsheet
              <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={e => handleUpload(e.target.files?.[0])} />
            </label>
          </div>

          {/* Editable grid */}
          <div className="border border-slate-200 rounded-xl overflow-auto" style={{ maxHeight: '46vh' }}>
            <table className="w-full text-xs">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-2 py-2 text-left font-semibold text-slate-400 uppercase tracking-wide text-[9px] w-8">#</th>
                  {columns.map(c => (
                    <th key={c.key} className="px-2 py-2 text-left font-semibold text-slate-400 uppercase tracking-wide text-[9px] whitespace-nowrap min-w-[120px]">{c.label}</th>
                  ))}
                  <th className="px-2 py-2 w-8" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className={`border-t border-slate-100 ${isValid && isValid(row) ? '' : 'bg-amber-50/40'}`}>
                    <td className="px-2 py-1 text-slate-400">{i + 1}</td>
                    {columns.map(c => (
                      <td key={c.key} className="px-1 py-1">
                        <input
                          value={row[c.key] ?? ''}
                          onChange={e => setCell(i, c.key, e.target.value)}
                          className="w-full border border-slate-200 rounded-md px-2 py-1.5 text-xs outline-none focus:border-[#064E3B]"
                        />
                      </td>
                    ))}
                    <td className="px-1 py-1">
                      <button onClick={() => removeRow(i)} className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => valid.length && onSubmit(valid)}
            disabled={!valid.length}
            className="bg-[#064E3B] hover:bg-[#065F46] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors"
          >
            Submit ({valid.length})
          </button>
        </div>
      </div>
    </div>
  )
}
