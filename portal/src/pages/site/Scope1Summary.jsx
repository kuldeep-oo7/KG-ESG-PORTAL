import { useParams, useNavigate } from 'react-router-dom'
import { useGHG } from '../../store/useGHG'

const MODULES = [
  { key: 'stationary', label: 'Stationary Combustion', path: 'scope1/stationary' },
  { key: 'mobile',     label: 'Mobile Combustion',     path: 'scope1/mobile' },
  { key: 'fugitive',   label: 'Fugitive Emissions',    path: 'scope1/fugitive' },
]

export default function Scope1Summary() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const { getModuleTotal, getScopeTotal } = useGHG()
  const scope1Total = getScopeTotal(siteId, 1)

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-4xl">
      <div className="h-1 bg-slate-100 rounded-full mb-6">
        <div className="h-1 bg-[#064E3B] rounded-full w-full" />
      </div>
      <h2 className="text-lg font-semibold text-slate-800 mb-1">Scope 1 Summary</h2>
      <p className="text-sm text-slate-500 mb-6">Total direct greenhouse gas emissions from your site</p>

      <div className="space-y-3 mb-8">
        {MODULES.map(m => {
          const total = getModuleTotal(siteId, m.key)
          return (
            <div key={m.key}
              onClick={() => navigate(`/sites/${siteId}/${m.path}`)}
              className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-[#10B981] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#ECFDF5] border-2 border-[#064E3B] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#064E3B]" />
                </div>
                <span className="text-sm font-medium text-slate-700">{m.label}</span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-[#064E3B]">{total.toFixed(6)}</span>
                <span className="text-xs text-slate-400 ml-1.5">tCO2Eq</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-[#064E3B] rounded-xl p-5 flex items-center justify-between text-white mb-8">
        <div>
          <p className="text-sm opacity-70">Total Scope 1 Emissions</p>
          <p className="text-3xl font-bold mt-1">{scope1Total.toFixed(6)}</p>
          <p className="text-xs opacity-60 mt-0.5">tCO2Eq</p>
        </div>
        <div className="w-16 h-16 rounded-full border-4 border-white/20 flex items-center justify-center">
          <span className="text-2xl font-bold">1</span>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={() => navigate(`/sites/${siteId}/scope1/fugitive`)}
          className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#064E3B] hover:text-[#064E3B] transition-colors text-lg">←</button>
        <button onClick={() => navigate(`/sites/${siteId}/scope2/electricity`)}
          className="w-9 h-9 rounded-full border-2 border-[#064E3B] flex items-center justify-center text-[#064E3B] hover:bg-[#064E3B] hover:text-white transition-colors text-lg">→</button>
      </div>
    </div>
  )
}
