import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentForm, { Select, Input, GHGPreview } from '../../components/AssessmentForm'
import { calcStationary } from '../../lib/calculations'
import { STATIONARY_TYPES, STATIONARY_UNITS } from '../../lib/constants'

export default function Scope1Stationary() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const [type, setType]               = useState('')
  const [unit, setUnit]               = useState('')
  const [consumption, setConsumption] = useState('')
  const [remarks, setRemarks]         = useState('')

  const preview = type && unit && consumption
    ? calcStationary(type, unit, parseFloat(consumption) || 0)
    : null

  function buildEntry() {
    if (!type || !unit || !consumption) return null
    const { ef, tco2e } = calcStationary(type, unit, parseFloat(consumption))
    return { date: new Date().toISOString().slice(0, 10), Type: type, Unit: unit, Consumption: consumption, Source: 'Defra v1.0', 'Emission Factor': ef, remarks, ef, tco2e }
  }

  function reset() { setType(''); setUnit(''); setConsumption(''); setRemarks('') }

  const COLS = ['date', 'Type', 'Unit', 'Consumption', 'Source', 'Emission Factor']

  return (
    <AssessmentForm
      title="GHG Inventory of Direct Emissions from Stationary Combustion"
      siteCode={siteId} module="stationary"
      emissionLabel="Emission From Stationary Combustion"
      columns={COLS}
      onNext={() => navigate(`/sites/${siteId}/scope1/mobile`)}
      onBuildEntry={() => { const e = buildEntry(); if (e) reset(); return e }}
      fields={({ onSubmit }) => (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Select label="Type" value={type} onChange={setType} options={STATIONARY_TYPES} required />
            <Select label="Unit of Measurement" value={unit} onChange={setUnit} options={STATIONARY_UNITS} required />
            <Input label="Consumption" value={consumption} onChange={setConsumption} type="number" required />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Input label="Remarks" value={remarks} onChange={setRemarks} placeholder="Additional notes or comments" />
          </div>
          {preview && <GHGPreview tco2e={preview.tco2e} />}
          <div className="flex gap-3 pt-1">
            <button onClick={() => onSubmit()} className="bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors">Submit</button>
            <button onClick={() => { onSubmit(); navigate(`/sites/${siteId}/scope1/mobile`) }}
              className="border border-slate-200 text-sm text-slate-600 px-4 py-2.5 rounded-xl hover:border-[#10B981] transition-colors flex items-center gap-1.5">
              Save &amp; Continue <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-500 text-[10px] flex items-center justify-center">i</span>
            </button>
          </div>
        </div>
      )}
    />
  )
}
