import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentForm, { Select, Input, GHGPreview } from '../../components/AssessmentForm'
import { calcHeatSteam } from '../../lib/calculations'
import { HEAT_TYPES, HEAT_UNITS } from '../../lib/constants'

export default function Scope2HeatSteam() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const [type, setType]               = useState('')
  const [unit, setUnit]               = useState('')
  const [consumption, setConsumption] = useState('')
  const [remarks, setRemarks]         = useState('')

  const preview = type && unit && consumption
    ? calcHeatSteam(type, unit, parseFloat(consumption) || 0)
    : null

  function buildEntry() {
    if (!type || !unit || !consumption) return null
    const { ef, tco2e } = calcHeatSteam(type, unit, parseFloat(consumption))
    const e = {
      date: new Date().toISOString().slice(0, 10),
      'Heat Source': type,
      Unit: unit,
      Consumption: consumption,
      Source: 'Defra 2025',
      'Emission Factor': ef,
      remarks,
      ef,
      tco2e,
    }
    setType(''); setUnit(''); setConsumption(''); setRemarks('')
    return e
  }

  return (
    <AssessmentForm
      title="GHG Inventory of Indirect Emissions from Purchased Heat and Steam"
      siteCode={siteId} module="heatSteam"
      emissionLabel="Emission From Purchased Heat & Steam"
      columns={['date', 'Heat Source', 'Unit', 'Consumption', 'Source', 'Emission Factor']}
      onPrev={() => navigate(`/sites/${siteId}/scope2/electricity`)}
      onNext={() => navigate(`/sites/${siteId}/scope2/renewable`)}
      onBuildEntry={buildEntry}
      fields={({ onSubmit }) => (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Select label="Heat Source" value={type} onChange={setType} options={HEAT_TYPES} required />
            <Select label="Unit of Measurement" value={unit} onChange={setUnit} options={HEAT_UNITS} required />
            <Input label="Consumption" value={consumption} onChange={setConsumption} type="number" required />
          </div>
          <Input label="Remarks" value={remarks} onChange={setRemarks} placeholder="Additional notes" />
          {preview && <GHGPreview tco2e={preview.tco2e} />}
          <div className="flex gap-3">
            <button onClick={() => onSubmit()} className="bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors">Submit</button>
            <button onClick={() => { onSubmit(); navigate(`/sites/${siteId}/scope2/renewable`) }} className="border border-slate-200 text-sm text-slate-600 px-4 py-2.5 rounded-xl hover:border-[#10B981] transition-colors">Save &amp; Continue</button>
          </div>
        </div>
      )}
    />
  )
}
