import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentForm, { Select, Input, GHGPreview } from '../../components/AssessmentForm'
import { calcWater } from '../../lib/calculations'
import { WATER_SOURCES, WATER_UNITS } from '../../lib/constants'

export default function Scope3WaterSupply() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const [source, setSource]     = useState('')
  const [unit, setUnit]         = useState('')
  const [volume, setVolume]     = useState('')
  const [remarks, setRemarks]   = useState('')

  const toM3 = (val, u) => u === 'litres' ? val / 1000 : u === 'KL' ? val : val
  const preview = source && volume
    ? calcWater(source, toM3(parseFloat(volume)||0, unit))
    : null

  function buildEntry() {
    if (!source || !unit || !volume) return null
    const m3 = toM3(parseFloat(volume), unit)
    const { ef, tco2e } = calcWater(source, m3)
    const e = {
      date: new Date().toISOString().slice(0, 10),
      Source: source,
      Unit: unit,
      Volume: volume,
      'Source Ref': 'Defra v1.0',
      'Emission Factor': ef,
      remarks,
      ef,
      tco2e,
    }
    setSource(''); setUnit(''); setVolume(''); setRemarks('')
    return e
  }

  return (
    <AssessmentForm
      title="GHG Inventory – Water Supply"
      siteCode={siteId} module="waterSupply"
      emissionLabel="Emission From Water Supply"
      columns={['date', 'Source', 'Unit', 'Volume', 'Source Ref', 'Emission Factor']}
      onPrev={() => navigate(`/sites/${siteId}/scope3/waste-disposal`)}
      onNext={() => navigate(`/sites/${siteId}/scope3/water-treatment`)}
      onBuildEntry={buildEntry}
      fields={({ onSubmit }) => (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Select label="Water Source" value={source} onChange={setSource} options={WATER_SOURCES} required />
            <Select label="Unit of Measurement" value={unit} onChange={setUnit} options={WATER_UNITS} required />
            <Input label="Volume" value={volume} onChange={setVolume} type="number" required />
          </div>
          <Input label="Remarks" value={remarks} onChange={setRemarks} placeholder="Additional notes" />
          {preview && <GHGPreview tco2e={preview.tco2e} />}
          <div className="flex gap-3">
            <button onClick={() => onSubmit()} className="bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors">Submit</button>
            <button onClick={() => { onSubmit(); navigate(`/sites/${siteId}/scope3/water-treatment`) }} className="border border-slate-200 text-sm text-slate-600 px-4 py-2.5 rounded-xl hover:border-[#10B981] transition-colors">Save &amp; Continue</button>
          </div>
        </div>
      )}
    />
  )
}
