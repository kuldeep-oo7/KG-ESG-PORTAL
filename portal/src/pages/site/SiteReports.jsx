import { useParams, useNavigate } from 'react-router-dom'
import { useGHG } from '../../store/useGHG'
import { SITES } from '../../data/ghgData'
import { SCOPE3_MODULES } from '../../lib/constants'
import { Download } from 'lucide-react'

const SCOPE1_MODULES = [
  { key: 'stationary', label: 'Stationary Combustion' },
  { key: 'mobile',     label: 'Mobile Combustion' },
  { key: 'fugitive',   label: 'Fugitive Emissions' },
]
const SCOPE2_MODULES = [
  { key: 'electricity', label: 'Purchased Electricity' },
  { key: 'heatSteam',   label: 'Heat & Steam' },
  { key: 'renewable',   label: 'Renewable Generation' },
]

function ScopeSection({ scopeNum, scopeLabel, modules, siteId, getModuleTotal }) {
  const total = modules.reduce((s, m) => s + getModuleTotal(siteId, m.key), 0)
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-4">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#064E3B] text-white text-xs flex items-center justify-center font-bold">{scopeNum}</span>
          <span className="text-sm font-semibold text-slate-700">{scopeLabel}</span>
        </div>
        <span className="text-sm font-bold text-[#064E3B]">{total.toFixed(6)} tCO2Eq</span>
      </div>
      <div className="divide-y divide-slate-50">
        {modules.map(m => {
          const moduleTotal = getModuleTotal(siteId, m.key)
          return (
            <div key={m.key} className="flex items-center justify-between px-4 py-2.5 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span className="text-slate-600">{m.label}</span>
              </div>
              <span className={`font-semibold ${moduleTotal > 0 ? 'text-[#064E3B]' : 'text-slate-300'}`}>
                {moduleTotal.toFixed(6)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function SiteReports() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const { getModuleTotal, getScopeTotal, getSiteTotal } = useGHG()
  const site = SITES.find(s => s.code === siteId)

  const s1 = getScopeTotal(siteId, 1)
  const s2 = getScopeTotal(siteId, 2)
  const s3 = getScopeTotal(siteId, 3)
  const total = getSiteTotal(siteId)

  function handleExport() {
    const rows = [['Scope', 'Module', 'tCO2Eq']]
    SCOPE1_MODULES.forEach(m => rows.push(['Scope 1', m.label, getModuleTotal(siteId, m.key)]))
    SCOPE2_MODULES.forEach(m => rows.push(['Scope 2', m.label, getModuleTotal(siteId, m.key)]))
    SCOPE3_MODULES.forEach(m => rows.push(['Scope 3', m.label, getModuleTotal(siteId, m.key)]))
    rows.push(['', 'TOTAL', total])
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `${siteId}_ghg_report.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-4xl">
      <div className="h-1 bg-slate-100 rounded-full mb-6">
        <div className="h-1 bg-[#064E3B] rounded-full w-full" />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Site GHG Report</h2>
          <p className="text-sm text-slate-500">{site?.name || siteId} — Assessment Year 2025–26</p>
        </div>
        <button onClick={handleExport}
          className="flex items-center gap-2 bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Emissions', value: total, accent: true },
          { label: 'Scope 1', value: s1 },
          { label: 'Scope 2', value: s2 },
          { label: 'Scope 3', value: s3 },
        ].map(kpi => (
          <div key={kpi.label} className={`rounded-xl p-4 ${kpi.accent ? 'bg-[#064E3B] text-white' : 'bg-white border border-slate-200'}`}>
            <p className={`text-xs ${kpi.accent ? 'opacity-70' : 'text-slate-500'}`}>{kpi.label}</p>
            <p className={`text-xl font-bold mt-1 ${kpi.accent ? '' : 'text-[#064E3B]'}`}>{kpi.value.toFixed(4)}</p>
            <p className={`text-xs mt-0.5 ${kpi.accent ? 'opacity-50' : 'text-slate-400'}`}>tCO2Eq</p>
          </div>
        ))}
      </div>

      <ScopeSection scopeNum="1" scopeLabel="Scope 1 — Direct Emissions" modules={SCOPE1_MODULES} siteId={siteId} getModuleTotal={getModuleTotal} />
      <ScopeSection scopeNum="2" scopeLabel="Scope 2 — Indirect Energy Emissions" modules={SCOPE2_MODULES} siteId={siteId} getModuleTotal={getModuleTotal} />
      <ScopeSection scopeNum="3" scopeLabel="Scope 3 — Value Chain Emissions" modules={SCOPE3_MODULES} siteId={siteId} getModuleTotal={getModuleTotal} />

      <div className="flex justify-end gap-3 mt-6">
        <button onClick={() => navigate(`/sites/${siteId}/energy`)}
          className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#064E3B] hover:text-[#064E3B] transition-colors text-lg">←</button>
      </div>
    </div>
  )
}
