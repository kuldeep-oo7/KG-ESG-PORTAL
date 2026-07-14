import { useEffect, useState } from 'react'
import { Activity as ActivityIcon, Plus, Pencil, Trash2, RefreshCw, User } from 'lucide-react'
import { fetchActivity, SHARED_ENABLED } from '../lib/sharedStore'
import { SITES } from '../data/ghgData'

const SITE_NAME = Object.fromEntries(SITES.map(s => [s.code, s.name]))
const MODULE_LABELS = {
  stationary: 'Stationary Combustion', mobile: 'Mobile Combustion', fugitive: 'Fugitive Emissions',
  electricity: 'Purchased Electricity', heatSteam: 'Heat & Steam', renewable: 'Renewable Electricity',
  employeeCommute: 'Employee Commute', foodConsumption: 'Food Consumption', purchasedGoods: 'Purchased Goods',
  tdLoss: 'Transmission & Distribution Loss', upstream: 'Upstream Activities', downstream: 'Downstream Activities',
  wasteDisposal: 'Waste Disposal', waterSupply: 'Water Supply', waterTreatment: 'Water Treatment',
  businessTravelAir: 'Business Travel (Air)', businessTravelSea: 'Business Travel (Sea)',
  businessTravelLand: 'Business Travel (Land)', hotelStay: 'Hotel Stay',
}
const ACTION = {
  add:    { verb: 'added',   Icon: Plus,   fg: 'text-[#065F46]', bg: 'bg-[#ECFDF5]', ring: 'border-[#10B981]/30' },
  update: { verb: 'edited',  Icon: Pencil, fg: 'text-[#1D4ED8]', bg: 'bg-[#EFF6FF]', ring: 'border-[#3B82F6]/30' },
  delete: { verb: 'deleted', Icon: Trash2, fg: 'text-[#B91C1C]', bg: 'bg-[#FEF2F2]', ring: 'border-[#EF4444]/30' },
}

function fmtTime(ts) {
  if (!ts) return ''
  try {
    const d = new Date(ts)
    return d.toLocaleString(undefined, {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  } catch { return String(ts) }
}

export default function Activity() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    fetchActivity().then(a => { setItems(Array.isArray(a) ? a : []); setLoading(false) })
  }
  useEffect(() => { load() }, [])

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      <div className="p-6 max-w-4xl">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2" style={{ fontFamily: '"Hanken Grotesk", sans-serif' }}>
            <ActivityIcon className="w-5 h-5 text-[#064E3B]" /> Recent Activity
          </h1>
          <button onClick={load}
            className="inline-flex items-center gap-1.5 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600 hover:border-[#064E3B] hover:text-[#064E3B] transition-colors bg-white">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
        <p className="text-sm text-slate-500 mb-5">Every add, edit and delete across all sites and users — who did it and when.</p>

        {!SHARED_ENABLED && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 mb-4">
            Shared store is off in local development — activity appears only on the deployed site.
          </div>
        )}

        {loading ? (
          <div className="text-center text-sm text-slate-400 py-16">Loading activity…</div>
        ) : items.length === 0 ? (
          <div className="border border-slate-200 rounded-2xl py-16 text-center bg-white">
            <ActivityIcon className="w-8 h-8 text-slate-200 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No activity recorded yet.</p>
            <p className="text-xs text-slate-400 mt-1">When someone adds or edits data, it will appear here.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 shadow-sm overflow-hidden">
            {items.map((a, i) => {
              const cfg = ACTION[a.action] || ACTION.add
              const site = SITE_NAME[a.siteCode] || a.siteCode || '—'
              const mod = MODULE_LABELS[a.module] || a.module || 'entry'
              const tco2e = Number(a.tco2e) || 0
              return (
                <div key={i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                  <div className={`w-8 h-8 rounded-full border ${cfg.bg} ${cfg.ring} flex items-center justify-center shrink-0 mt-0.5`}>
                    <cfg.Icon className={`w-4 h-4 ${cfg.fg}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">
                      <span className="inline-flex items-center gap-1 font-medium text-slate-800">
                        <User className="w-3.5 h-3.5 text-slate-400" />{a.user || 'unknown'}
                      </span>
                      <span className={`ml-1.5 font-semibold ${cfg.fg}`}>{cfg.verb}</span>
                      <span className="text-slate-500"> a </span>
                      <span className="font-medium text-slate-800">{mod}</span>
                      <span className="text-slate-500"> entry for </span>
                      <span className="font-medium text-slate-800">{site}</span>
                      {a.label ? <span className="text-slate-400"> · {String(a.label)}</span> : null}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{fmtTime(a.ts)}</p>
                  </div>
                  {tco2e > 0 && (
                    <span className="text-xs font-bold text-[#064E3B] tabular-nums shrink-0 mt-1">{tco2e.toFixed(4)} tCO2e</span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
