import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGHG } from '../../store/useGHG'
import { calcIntensity } from '../../lib/calculations'
import { CURRENCIES } from '../../lib/constants'

function NumInput({ label, value, onChange, hint }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-600">{label}</label>
      <input type="number" value={value} onChange={e => onChange(e.target.value)}
        placeholder={hint || `Enter ${label}`}
        className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#10B981]" />
    </div>
  )
}

function IntensityRow({ label, value, unit }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <div className="text-right">
        {value !== null ? (
          <>
            <span className="text-base font-bold text-[#064E3B]">{value.toFixed(6)}</span>
            <span className="text-xs text-slate-400 ml-1.5">{unit}</span>
          </>
        ) : (
          <span className="text-sm text-slate-300">— not calculated</span>
        )}
      </div>
    </div>
  )
}

export default function IntensityMetrics() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const { getSiteTotal } = useGHG()
  const totalTco2e = getSiteTotal(siteId)

  const [revenue, setRevenue]       = useState('')
  const [turnover, setTurnover]     = useState('')
  const [ppp, setPpp]               = useState('')
  const [area, setArea]             = useState('')
  const [employees, setEmployees]   = useState('')
  const [currency, setCurrency]     = useState('USD')

  const hasAny = revenue || turnover || ppp || area || employees
  const intensities = totalTco2e > 0 && hasAny ? calcIntensity(totalTco2e, {
    revenue:      revenue    ? parseFloat(revenue)    : null,
    employees:    employees  ? parseFloat(employees)  : null,
    facilityArea: area       ? parseFloat(area)       : null,
  }) : null

  const perTurnover = turnover && totalTco2e ? +(totalTco2e / parseFloat(turnover)).toFixed(6) : null
  const perPPP      = ppp && totalTco2e      ? +(totalTco2e / parseFloat(ppp)).toFixed(6)      : null

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-4xl">
      <div className="h-1 bg-slate-100 rounded-full mb-6">
        <div className="h-1 bg-[#064E3B] rounded-full w-full" />
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Intensity Metrics Dashboard</h2>
          <p className="text-sm text-slate-500 mt-0.5">Enter period operational metrics and facility area for intensity calculations.</p>
        </div>
        <div className="flex gap-3 text-[10px] font-medium text-slate-500 items-center">
          <span className="px-2 py-1 border border-slate-200 rounded">ALIGNED WITH GLOBAL REPORTING FRAMEWORKS</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left: Operational Data */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Operational Data</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <NumInput label="Revenue" value={revenue} onChange={setRevenue} hint="1000000" />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600">Currency (in Mn.)</label>
                <select value={currency} onChange={e => setCurrency(e.target.value)}
                  className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#10B981] bg-white">
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <NumInput label="Turnover (revenue from operations)" value={turnover} onChange={setTurnover} hint="1000000" />
            <NumInput label="Purchasing Power Parity (PPP)-adjusted revenue" value={ppp} onChange={setPpp} hint="1000000" />
            <NumInput label="Facility Area (m²)" value={area} onChange={setArea} hint="10000" />
            <NumInput label="Number of employees" value={employees} onChange={setEmployees} hint="50" />
          </div>
        </div>

        {/* Right: Intensity Report */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-1">Intensity Report</h3>
          <p className="text-xs text-slate-400 mb-4">Calculated intensity metrics based on your data</p>

          {/* Total emissions */}
          <div className="bg-[#ECFDF5] border border-[#10B981]/30 rounded-xl px-4 py-3 mb-4">
            <p className="text-xs text-[#065F46]">Total Site Emissions</p>
            <p className="text-xl font-bold text-[#064E3B]">{totalTco2e.toFixed(6)} <span className="text-xs font-normal">tCO2Eq</span></p>
          </div>

          {!hasAny || totalTco2e === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-300 text-lg mb-3">!</div>
              <p className="text-sm text-slate-400">No metrics could be calculated. Please ensure you have entered emission and operational data for this period.</p>
            </div>
          ) : (
            <div>
              <IntensityRow label="tCO2Eq per Revenue" value={intensities?.perRevenue ?? null} unit={`tCO2Eq / Mn. ${currency}`} />
              <IntensityRow label="tCO2Eq per Turnover" value={perTurnover} unit={`tCO2Eq / Mn. ${currency}`} />
              <IntensityRow label="tCO2Eq per PPP Revenue" value={perPPP} unit={`tCO2Eq / Mn. ${currency}`} />
              <IntensityRow label="tCO2Eq per m²" value={intensities?.perArea ?? null} unit="tCO2Eq / m²" />
              <IntensityRow label="tCO2Eq per Employee" value={intensities?.perEmployee ?? null} unit="tCO2Eq / employee" />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button onClick={() => navigate(`/sites/${siteId}/scope3/summary`)}
          className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#064E3B] hover:text-[#064E3B] transition-colors text-lg">←</button>
        <button onClick={() => navigate(`/sites/${siteId}/energy`)}
          className="w-9 h-9 rounded-full border-2 border-[#064E3B] flex items-center justify-center text-[#064E3B] hover:bg-[#064E3B] hover:text-white transition-colors text-lg">→</button>
      </div>
    </div>
  )
}
