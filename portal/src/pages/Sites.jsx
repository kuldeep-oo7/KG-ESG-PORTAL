import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2, Calculator, Plus, X } from 'lucide-react'
import { useGHG } from '../store/useGHG'

const SITE_TYPES = ['Corporate Office', 'Branch Office', 'Factory', 'Sales Office', 'Warehouse']
const COUNTRIES  = ['India', 'UAE', 'Botswana', 'UK', 'USA', 'Other']
const EMPTY_FORM = { name: '', type: 'Corporate Office', city: '', country: 'India', address: '' }


function ScopeBar({ label, value, maxValue }) {
  const pct = maxValue > 0 ? Math.min(100, (value / maxValue) * 100) : 0
  return (
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-slate-400 mb-1 font-medium">{label}</p>
      <div className="h-[3px] bg-slate-100 rounded-full overflow-hidden mb-1">
        <div className="h-full bg-[#064E3B] rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] tabular-nums text-slate-500">
        {value > 0 ? value.toFixed(2) : '0'}
        <span className="text-slate-400"> TCO2Eq</span>
      </p>
    </div>
  )
}

export default function Sites() {
  const { sites, addSite, updateSite, deleteSite, getScopeTotal, getSiteTotal } = useGHG()
  const [showModal, setShowModal] = useState(false)
  const [editSite, setEditSite]   = useState(null)
  const [modalData, setModalData] = useState(EMPTY_FORM)
  const navigate = useNavigate()

  function openCreate() { setEditSite(null); setModalData(EMPTY_FORM); setShowModal(true) }
  function openEdit(site) {
    setEditSite(site)
    setModalData({ name: site.name, type: site.type, city: site.city || '', country: site.country || 'India', address: site.address || '' })
    setShowModal(true)
  }
  function closeModal() { setShowModal(false); setEditSite(null); setModalData(EMPTY_FORM) }
  
  async function handleSave() {
    if (!modalData.name.trim()) return
    try {
      if (editSite) {
        await updateSite({ code: editSite.code, ...modalData })
      } else {
        await addSite(modalData)
      }
      closeModal()
    } catch (err) {
      alert(err.message || 'Failed to save site')
    }
  }

  async function handleDelete(site) {
    if (window.confirm('Delete this site?')) {
      try {
        await deleteSite(site.code)
      } catch (err) {
        alert(err.message || 'Failed to delete site')
      }
    }
  }

  function field(key, value) { setModalData(prev => ({ ...prev, [key]: value })) }

  return (
    <div className="min-h-screen bg-white">

      {/* ── Breadcrumb + May 2026 ───────────────────────────────────────── */}
      <div className="px-8 pt-5 pb-0 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          K. Girdharlal International Pvt. Ltd. &nbsp;›&nbsp; <span className="text-[#064E3B] font-semibold">Sites</span>
        </p>
      </div>

      {/* ── Page heading + create button ───────────────────────────────── */}
      <div className="px-8 pt-3 pb-6 flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-slate-900" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
          List of Sites
        </h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Site
        </button>
      </div>

      {/* ── Site Cards ─────────────────────────────────────────────────── */}
      <div className="px-8 pb-10 flex flex-col gap-4">
        {sites.map(site => {
          const s1       = getScopeTotal(site.code, 1)
          const s2       = getScopeTotal(site.code, 2)
          const s3       = getScopeTotal(site.code, 3)
          const total    = getSiteTotal(site.code)
          const scopeMax = Math.max(s1, s2, s3, 1)
          const cleanName = site.name.replace(/\s*\([^)]*\)\s*$/, '').trim()

          return (
            <div
              key={site.code}
              className="bg-white border border-slate-200 rounded-xl shadow-sm px-6 py-5 flex items-center gap-6"
            >
              {/* Site info */}
              <div className="flex-shrink-0 w-[280px] min-w-0">
                <span className="inline-block text-[10px] font-semibold text-slate-500 bg-slate-100 rounded px-1.5 py-0.5 mb-2">
                  {site.code}
                </span>
                <button
                  onClick={() => navigate(`/sites/${site.code}/scope1/stationary`)}
                  className="block text-[14px] font-bold text-slate-800 leading-snug text-left hover:text-[#064E3B] hover:underline mb-1"
                  style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
                >
                  {cleanName}
                  {site.type && <span className="font-normal text-slate-600"> ({site.type})</span>}
                </button>
                <p className="text-[11px] text-slate-400 leading-relaxed">{site.address}</p>
              </div>

              {/* Scope bars */}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Summary of GHG Emissions
                </p>
                <div className="flex gap-6">
                  <ScopeBar label="Scope 1" value={s1} maxValue={scopeMax} />
                  <ScopeBar label="Scope 2" value={s2} maxValue={scopeMax} />
                  <ScopeBar label="Scope 3" value={s3} maxValue={scopeMax} />
                </div>
              </div>

              {/* Total */}
              <div className="flex-shrink-0 w-[110px] text-right">
                <p className={`text-2xl font-bold tabular-nums ${total > 0 ? 'text-slate-800' : 'text-slate-300'}`}
                  style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                  {total > 0 ? total.toFixed(2) : '0'}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Total TCO2Eq</p>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 flex items-center gap-1.5">
                <button onClick={() => openEdit(site)}
                  className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-400 transition-colors"
                  title="Edit">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
<button onClick={() => navigate(`/sites/${site.code}/scope1/stationary`)}
                  className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-400 transition-colors"
                  title="Analytics">
                  <Calculator className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(site)}
                  className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-300 transition-colors"
                  title="Delete">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}

        {sites.length === 0 && (
          <div className="text-center text-slate-400 text-sm py-16">No sites found.</div>
        )}
      </div>

      {/* ── Create / Edit Modal ────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-slate-800" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
                {editSite ? 'Edit Site' : 'Create New Site'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Site Name <span className="text-red-400">*</span>
                </label>
                <input type="text" value={modalData.name} onChange={e => field('name', e.target.value)}
                  placeholder="Enter site name"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Site Type</label>
                <select value={modalData.type} onChange={e => field('type', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 bg-white transition-all">
                  {SITE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">City</label>
                <input type="text" value={modalData.city} onChange={e => field('city', e.target.value)}
                  placeholder="Enter city"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Country</label>
                <select value={modalData.country} onChange={e => field('country', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 bg-white transition-all">
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Address</label>
                <textarea value={modalData.address} onChange={e => field('address', e.target.value)}
                  placeholder="Enter address" rows={3}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 resize-none transition-all" />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={closeModal}
                className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={!modalData.name.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-[#064E3B] hover:bg-[#065F46] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
