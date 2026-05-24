import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Copy, Trash2, BarChart2, Plus, Calendar, X } from 'lucide-react'
import { SITES } from '../data/ghgData'
import { useGHG } from '../store/useGHG'

const LS_KEY = 'kg_sites_v1'

const SITE_TYPES = ['Corporate Office', 'Branch Office', 'Factory', 'Sales Office', 'Warehouse']
const COUNTRIES = ['India', 'UAE', 'Botswana', 'UK', 'USA', 'Other']

const EMPTY_FORM = { name: '', type: 'Corporate Office', city: '', country: 'India', address: '' }

function loadSites() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return SITES
}

function ScopeBar({ label, value, max, color }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-slate-400 w-12 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-[10px] text-slate-500 w-16 text-right shrink-0">
        {value.toFixed(2)} t
      </span>
    </div>
  )
}

export default function Sites() {
  const [sites, setSites] = useState(loadSites)
  const [showModal, setShowModal] = useState(false)
  const [editSite, setEditSite] = useState(null)
  const [modalData, setModalData] = useState(EMPTY_FORM)
  const navigate = useNavigate()
  const { getScopeTotal, getSiteTotal } = useGHG()

  function saveSites(updated) {
    setSites(updated)
    try { localStorage.setItem(LS_KEY, JSON.stringify(updated)) } catch { /* ignore */ }
  }

  function openCreate() {
    setEditSite(null)
    setModalData(EMPTY_FORM)
    setShowModal(true)
  }

  function openEdit(site) {
    setEditSite(site)
    setModalData({
      name: site.name,
      type: site.type,
      city: site.city || '',
      country: site.country || 'India',
      address: site.address || '',
    })
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditSite(null)
    setModalData(EMPTY_FORM)
  }

  function handleSave() {
    if (!modalData.name.trim()) return
    if (editSite) {
      saveSites(sites.map(s => s.code === editSite.code ? { ...s, ...modalData } : s))
    } else {
      const code = `KGIPL-0${sites.length + 1}`
      saveSites([...sites, { code, ...modalData }])
    }
    closeModal()
  }

  function handleDelete(site) {
    if (window.confirm('Delete this site?')) {
      saveSites(sites.filter(s => s.code !== site.code))
    }
  }

  function handleCopy(site) {
    saveSites([...sites, { ...site, code: `${site.code}-COPY` }])
  }

  function field(key, value) {
    setModalData(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top bar */}
      <div className="px-8 py-6 flex justify-between items-start">
        {/* Left: breadcrumb + title */}
        <div>
          <p className="text-xs text-gray-400 mb-1">
            K. Girdharlal International Pvt. Ltd. &gt; Sites
          </p>
          <h1
            className="text-3xl font-bold text-[#111827]"
            style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
          >
            List of Sites
          </h1>
        </div>

        {/* Right: date badge + create button */}
        <div className="flex items-center gap-3 mt-1">
          <div className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-600 flex items-center gap-1.5 shadow-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            May 2026
            <Pencil className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create New Site
          </button>
        </div>
      </div>

      {/* Site cards */}
      <div className="px-8 pb-8">
        {sites.map(site => {
          const s1 = getScopeTotal(site.code, 1)
          const s2 = getScopeTotal(site.code, 2)
          const s3 = getScopeTotal(site.code, 3)
          const total = getSiteTotal(site.code)
          const maxScope = Math.max(s1 + s2 + s3, 0.01)

          return (
            <div
              key={site.code}
              className="bg-white rounded-2xl border border-slate-200 p-6 mb-4 flex items-start gap-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Left: site info */}
              <div className="flex-1 min-w-0">
                <span className="inline-block bg-[#E6F4F1] text-[#064E3B] text-xs font-semibold px-3 py-1 rounded-full mb-2">
                  {site.code}
                </span>
                <p
                  className="text-lg font-bold text-slate-900 leading-tight"
                  style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
                >
                  {site.name}{' '}
                  <span className="text-slate-500 text-sm font-normal">({site.type})</span>
                </p>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">{site.address}</p>
              </div>

              {/* Middle: GHG summary */}
              <div className="w-64 shrink-0">
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-3">
                  Summary of GHG Emissions
                </p>
                <div className="flex flex-col gap-2">
                  <ScopeBar label="Scope 1" value={s1} max={maxScope} color="#064E3B" />
                  <ScopeBar label="Scope 2" value={s2} max={maxScope} color="#10B981" />
                  <ScopeBar label="Scope 3" value={s3} max={maxScope} color="#34D399" />
                </div>
              </div>

              {/* Right: total */}
              <div className="text-right shrink-0 w-36">
                <p
                  className={`text-2xl font-bold leading-none ${total > 0 ? 'text-[#064E3B]' : 'text-slate-300'}`}
                  style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
                >
                  {total > 0 ? total.toFixed(3) : '—'}
                </p>
                <p className="text-xs text-slate-400 mt-1">Total TCO2Eq</p>
              </div>

              {/* Expiry date */}
              <div className="shrink-0 flex flex-col items-center justify-center">
                <div className="bg-[#F1F5F9] border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-500 text-center">
                  <Calendar className="w-3 h-3 inline mr-1 text-slate-400" />
                  31 - May - 2026
                </div>
              </div>

              {/* Action icons */}
              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  onClick={() => openEdit(site)}
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-400 transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleCopy(site)}
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-400 transition-colors"
                  title="Duplicate"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => navigate(`/sites/${site.code}/scope1/stationary`)}
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-400 transition-colors"
                  title="Reports"
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(site)}
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-300 transition-colors"
                  title="Delete"
                >
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

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2
                className="text-base font-semibold text-slate-800"
                style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}
              >
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
                <input
                  type="text"
                  value={modalData.name}
                  onChange={e => field('name', e.target.value)}
                  placeholder="Enter site name"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Site Type</label>
                <select
                  value={modalData.type}
                  onChange={e => field('type', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#10B981] bg-white"
                >
                  {SITE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">City</label>
                <input
                  type="text"
                  value={modalData.city}
                  onChange={e => field('city', e.target.value)}
                  placeholder="Enter city"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Country</label>
                <select
                  value={modalData.country}
                  onChange={e => field('country', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#10B981] bg-white"
                >
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Address</label>
                <textarea
                  value={modalData.address}
                  onChange={e => field('address', e.target.value)}
                  placeholder="Enter address"
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#10B981] resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!modalData.name.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-[#064E3B] hover:bg-[#065F46] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
