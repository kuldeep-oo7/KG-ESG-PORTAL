import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentForm, { Select, Input, GHGPreview } from '../../components/AssessmentForm'
import { calcGeneric } from '../../lib/calculations'
import { WATER_UNITS } from '../../lib/constants'

const TREATMENT_METHODS = ['Aerobic Treatment', 'Anaerobic Treatment', 'Sludge Digestion', 'Chemical Treatment', 'UV Disinfection']
const EF_TREATMENT = { 'Aerobic Treatment': 0.272, 'Anaerobic Treatment': 0.700, 'Sludge Digestion': 0.500, 'Chemical Treatment': 0.300, 'UV Disinfection': 0.100 }

export default function Scope3WaterTreatment() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const [method, setMethod]     = useState('')
  const [unit, setUnit]         = useState('')
  const [volume, setVolume]     = useState('')
  const [remarks, setRemarks]   = useState('')

  const ef = EF_TREATMENT[method] ?? 0
  const preview = method && volume ? calcGeneric(ef, parseFloat(volume)||0) : null

  function buildEntry() {
    if (!method || !unit || !volume) return null
    const { tco2e } = calcGeneric(ef, parseFloat(volume))
    const e = {
      date: new Date().toISOString().slice(0, 10),
      Method: method,
      Unit: unit,
      Volume: volume,
      Source: 'IPCC 2006',
      'Emission Factor': ef,
      remarks,
      ef,
      tco2e,
    }
    setMethod(''); setUnit(''); setVolume(''); setRemarks('')
    return e
  }

  return (
    <AssessmentForm
      title="GHG Inventory – Water Treatment"
      siteCode={siteId} module="waterTreatment"
      emissionLabel="Emission From Water Treatment"
      columns={['date', 'Method', 'Unit', 'Volume', 'Source', 'Emission Factor']}
      onPrev={() => navigate(`/sites/${siteId}/scope3/water-supply`)}
      onNext={() => navigate(`/sites/${siteId}/scope3/business-travel-air`)}
      onBuildEntry={buildEntry}
      fields={({ onSubmit }) => (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Select label="Treatment Method" value={method} onChange={setMethod} options={TREATMENT_METHODS} required />
            <Select label="Unit of Measurement" value={unit} onChange={setUnit} options={WATER_UNITS} required />
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
