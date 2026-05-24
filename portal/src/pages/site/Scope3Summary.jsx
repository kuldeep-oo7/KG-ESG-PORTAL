import { useParams, useNavigate } from 'react-router-dom'
import { useGHG } from '../../store/useGHG'
import { SCOPE3_MODULES } from '../../lib/constants'

export default function Scope3Summary() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const { getModuleTotal, getScopeTotal } = useGHG()
  const scope3Total = getScopeTotal(siteId, 3)

  const toPath = key => key.replace(/([A-Z])/g, '-$1').toLowerCase()

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-4xl">
      <div className="h-1 bg-slate-100 rounded-full mb-6">
        <div className="h-1 bg-[#064E3B] rounded-full w-full" />
      </div>
      <h2 className="text-lg font-semibold text-slate-800 mb-1">Scope 3 Summary</h2>
      <p className="text-sm text-slate-500 mb-6">Total value-chain indirect greenhouse gas emissions</p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {SCOPE3_MODULES.map(m => {
          const total = getModuleTotal(siteId, m.key)
          return (
            <div key={m.key}
              onClick={() => navigate(`/sites/${siteId}/scope3/${toPath(m.key)}`)}
              className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:border-[#10B981] transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#ECFDF5] border border-[#064E3B] flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#064E3B]" />
                </div>
                <span className="text-xs font-medium text-slate-700">{m.label}</span>
              </div>
              <div className="text-right shrink-0 ml-2">
                <span className="text-sm font-bold text-[#064E3B]">{total.toFixed(4)}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-[#064E3B] rounded-xl p-5 flex items-center justify-between text-white mb-8">
        <div>
          <p className="text-sm opacity-70">Total Scope 3 Emissions</p>
          <p className="text-3xl font-bold mt-1">{scope3Total.toFixed(6)}</p>
          <p className="text-xs opacity-60 mt-0.5">tCO2Eq</p>
        </div>
        <div className="w-16 h-16 rounded-full border-4 border-white/20 flex items-center justify-center">
          <span className="text-2xl font-bold">3</span>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={() => navigate(`/sites/${siteId}/scope3/hotel-stay`)}
          className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#064E3B] hover:text-[#064E3B] transition-colors text-lg">←</button>
        <button onClick={() => navigate(`/sites/${siteId}/intensity`)}
          className="w-9 h-9 rounded-full border-2 border-[#064E3B] flex items-center justify-center text-[#064E3B] hover:bg-[#064E3B] hover:text-white transition-colors text-lg">→</button>
      </div>
    </div>
  )
}
