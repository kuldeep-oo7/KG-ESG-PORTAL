import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Copy, Trash2, BarChart2, ChevronRight, Plus, Calendar, X } from 'lucide-react'
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

function Bar3({ s1, s2, s3 }) {
  const max = Math.max(s1 + s2 + s3, 0.01)
  return (
    <div className="flex flex-col gap-1.5">
      {[['Scope 1', s1, '#064E3B'], ['Scope 2', s2, '#10B981'], ['Scope 3', s3, '#34D399']].map(([label, val, color]) => (
        <div key={label} className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 w-12">{label}</span>
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${(val / max) * 100}%`, background: color }} />
          </div>
          <span className="text-[10px] text-slate-500 w-16 text-right">{val} TCO2e</span>
        </div>
      ))}
    </div>
  )
}

export default function Sites() {
  const [search, setSearch] = useState('')
  const [sites, setSites] = useState(loadSites)
  const [showModal, setShowModal] = useState(false)
  const [editSite, setEditSite] = useState(null)
  const [modalData, setModalData] = useState(EMPTY_FORM)
  const navigate = useNavigate()
  const { getScopeTotal, getSiteTotal } = useGHG()

  const filtered = sites.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  )

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
    setModalData({ name: site.name, type: site.type, city: site.city || '', country: site.country || 'India', address: site.address || '' })
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
      const updated = sites.map(s => s.code === editSite.code ? { ...s, ...modalData } : s)
      saveSites(updated)
    } else {
      const code = `KGIPL-0${sites.length + 1}`
      const newSite = { code, ...modalData }
      saveSites([...sites, newSite])
    }
    closeModal()
  }

  function handleDelete(site) {
    if (window.confirm('Delete this site?')) {
      saveSites(sites.filter(s => s.code !== site.code))
    }
  }

  function handleCopy(site) {
    const code = `${site.code}-COPY`
    const copied = { ...site, code }
    saveSites([...sites, copied])
  }

  function field(key, value) {
    setModalData(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Breadcrumb */}
      <div className="px-6 py-3 flex items-center gap-1.5 text-xs text-slate-500 border-b border-slate-200 bg-white">
        <span className="text-[#064E3B] font-medium">K. Girdharlal International Pvt. Ltd.</span>
        <ChevronRight className="w-3 h-3" />
        <span>Sites</span>
      </div>

      <div className="px-6 py-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-slate-800">List of Sites</h1>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search sites..."
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#10B981] w-52"
            />
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> Create New Site
          </button>
        </div>

        {/* Table header */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr_auto] gap-4 px-5 py-2.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            <span>Site</span>
            <span>Summary of GHG Emissions</span>
            <span>Total GHG Emissions (TCO2Eq)</span>
            <span>Expiry Date</span>
            <span>Actions</span>
          </div>

          {filtered.map((site, i) => {
            const d = {
              scope1: getScopeTotal(site.code, 1),
              scope2: getScopeTotal(site.code, 2),
              scope3: getScopeTotal(site.code, 3),
              total: getSiteTotal(site.code),
            }
            return (
              <div key={site.code} className={`grid grid-cols-[2fr_2fr_1.5fr_1fr_auto] gap-4 px-5 py-4 items-center ${i < filtered.length - 1 ? 'border-b border-slate-100' : ''} hover:bg-slate-50 transition-colors`}>
                {/* Site info */}
                <div>
                  <p className="text-xs font-semibold text-[#064E3B] mb-0.5">{site.code}</p>
                  <p className="text-sm font-medium text-slate-800 leading-tight">{site.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{site.type}</p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{site.address}</p>
                </div>

                {/* GHG bars */}
                <div>
                  <Bar3 s1={d.scope1} s2={d.scope2} s3={d.scope3} />
                </div>

                {/* Total */}
                <div>
                  <span className={`text-base font-bold ${d.total > 0 ? 'text-[#064E3B]' : 'text-slate-400'}`}>
                    {d.total.toFixed(d.total > 0 ? 3 : 0)}
                  </span>
                </div>

                {/* Expiry */}
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  31 - May - 2026
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEdit(site)}
                    className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:border-[#064E3B] hover:text-[#064E3B] text-slate-400 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleCopy(site)}
                    className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:border-[#10B981] hover:text-[#10B981] text-slate-400 transition-colors"
                    title="Copy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => navigate(`/sites/${site.code}/scope1/stationary`)}
                    className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:border-[#064E3B] hover:text-[#064E3B] text-slate-400 transition-colors"
                    title="Open Assessment"
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(site)}
                    className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:border-red-400 hover:text-red-400 text-slate-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-slate-400">No sites found.</div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-slate-800">
                {editSite ? 'Edit Site' : 'Create New Site'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Site Name */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Site Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={modalData.name}
                  onChange={e => field('name', e.target.value)}
                  placeholder="Enter site name"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#10B981]"
                />
              </div>

              {/* Site Type */}
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

              {/* City */}
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

              {/* Country */}
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

              {/* Address */}
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
