import { useParams, useNavigate } from 'react-router-dom'
import { useGHG } from '../../store/useGHG'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const ENERGY_MODULES = [
  { key: 'stationary', label: 'Stationary Combustion', color: '#064E3B', efPerUnit: 3.6 },
  { key: 'mobile',     label: 'Mobile Combustion',     color: '#10B981', efPerUnit: 3.6 },
  { key: 'electricity',label: 'Purchased Electricity', color: '#6EE7B7', efPerUnit: 3.6 },
  { key: 'heatSteam',  label: 'Heat & Steam',          color: '#34D399', efPerUnit: 3.6 },
  { key: 'renewable',  label: 'Renewable Generation',  color: '#A7F3D0', efPerUnit: 3.6 },
]

function KpiCard({ label, value, unit, color }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-full" style={{ background: color }} />
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <p className="text-xl font-bold" style={{ color }}>{value.toFixed(2)}</p>
      <p className="text-xs text-slate-400 mt-0.5">{unit}</p>
    </div>
  )
}

export default function EnergyAnalytics() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const { getEntries, getScopeTotal } = useGHG()

  const moduleData = ENERGY_MODULES.map(m => {
    const entries = getEntries(siteId, m.key)
    const tco2e = entries.reduce((s, e) => s + (e.tco2e || 0), 0)
    const gjEstimate = tco2e * 3.6
    return { ...m, tco2e, gjEstimate }
  })

  const totalGJ = moduleData.reduce((s, m) => s + m.gjEstimate, 0)
  const pieData = moduleData.filter(m => m.gjEstimate > 0).map(m => ({ name: m.label, value: +m.gjEstimate.toFixed(2), color: m.color }))

  const s1Total = getScopeTotal(siteId, 1)
  const s2Total = getScopeTotal(siteId, 2)

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-4xl">
      <div className="h-1 bg-slate-100 rounded-full mb-6">
        <div className="h-1 bg-[#064E3B] rounded-full w-full" />
      </div>
      <h2 className="text-lg font-semibold text-slate-800 mb-1">Energy Analytics</h2>
      <p className="text-sm text-slate-500 mb-6">Estimated energy consumption and mix across all sources</p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <KpiCard label="Total Energy (est.)" value={totalGJ} unit="GJ" color="#064E3B" />
        <KpiCard label="Scope 1 tCO2Eq" value={s1Total} unit="tCO2Eq" color="#10B981" />
        <KpiCard label="Scope 2 tCO2Eq" value={s2Total} unit="tCO2Eq" color="#6EE7B7" />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Pie chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Energy Mix</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v.toFixed(2)} GJ`, '']} />
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-sm text-slate-400">
              No energy data recorded yet
            </div>
          )}
        </div>

        {/* Module breakdown table */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Breakdown by Source</h3>
          <div className="space-y-2">
            {moduleData.map(m => (
              <div key={m.key} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: m.color }} />
                  <span className="text-slate-600">{m.label}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-slate-700">{m.gjEstimate.toFixed(2)} GJ</span>
                  <span className="text-slate-400 ml-2">{totalGJ > 0 ? ((m.gjEstimate / totalGJ) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 mt-3 pt-3 flex justify-between text-xs font-semibold">
            <span className="text-slate-700">Total</span>
            <span className="text-[#064E3B]">{totalGJ.toFixed(2)} GJ</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={() => navigate(`/sites/${siteId}/intensity`)}
          className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#064E3B] hover:text-[#064E3B] transition-colors text-lg">←</button>
        <button onClick={() => navigate(`/sites/${siteId}/reports`)}
          className="w-9 h-9 rounded-full border-2 border-[#064E3B] flex items-center justify-center text-[#064E3B] hover:bg-[#064E3B] hover:text-white transition-colors text-lg">→</button>
      </div>
    </div>
  )
}
