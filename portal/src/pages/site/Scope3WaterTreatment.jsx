import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentForm, { Select, Input, GHGPreview } from '../../components/AssessmentForm'
import { calcWaterTreatment } from '../../lib/calculations'

const TREATMENT_METHODS = ['Water treatment']
const WT_UNITS = ['cubic metres', 'million litres']

export default function Scope3WaterTreatment() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const [method, setMethod] = useState('Water treatment')
  const [unit, setUnit]     = useState('')
  const [volume, setVolume] = useState('')
  const [remarks, setRemarks] = useState('')

  const preview = unit && volume ? calcWaterTreatment(parseFloat(volume) || 0, unit) : null

  function buildEntry() {
    if (!method || !unit || !volume) return null
    const { ef, tco2e } = calcWaterTreatment(parseFloat(volume), unit)
    const e = {
      date: new Date().toISOString().slice(0, 10),
      Method: method,
      'Treatment Method': method,
      Type: method,
      Unit: unit,
      'Unit of Measurement': unit,
      Volume: volume,
      Consumption: volume,
      consumption: volume,
      Source: 'Defra v 1.0',
      'Emission Factor': ef,
      ef,
      tco2e,
      ghg: tco2e,
      remarks,
    }
    setMethod('Water treatment'); setUnit(''); setVolume(''); setRemarks('')
    return e
  }

  return (
    <AssessmentForm
      title="GHG Inventory – Water Treatment"
      siteCode={siteId} module="waterTreatment" hideDocument
      emissionLabel="Emission From Water Treatment"
      columns={['date', 'Method', 'Unit', 'Volume', 'Source', 'Emission Factor']}
      onPrev={() => navigate(`/sites/${siteId}/scope3/water-supply`)}
      onNext={() => navigate(`/sites/${siteId}/scope3/business-travel-air`)}
      onBuildEntry={buildEntry}
      fields={({ onSubmit }) => (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Select label="Treatment Method" value={method} onChange={setMethod} options={TREATMENT_METHODS} required />
            <Select label="Unit of Measurement" value={unit} onChange={setUnit} options={WT_UNITS} required />
            <Input label="Volume Treated" value={volume} onChange={setVolume} type="number" required />
          </div>
          <Input label="Remarks" value={remarks} onChange={setRemarks} placeholder="Additional notes" />
          {preview && <GHGPreview tco2e={preview.tco2e} />}
          <div className="flex gap-3">
            <button onClick={() => onSubmit()} className="bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors">Submit</button>
            <button onClick={() => { onSubmit(); navigate(`/sites/${siteId}/scope3/business-travel-air`) }} className="border border-slate-200 text-sm text-slate-600 px-4 py-2.5 rounded-xl hover:border-[#10B981] transition-colors">Save &amp; Continue</button>
          </div>
        </div>
      )}
    />
  )
}
