import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentForm, { Select, Input, GHGPreview } from '../../components/AssessmentForm'
import { calcWaste } from '../../lib/calculations'
import { WASTE_TYPES, WASTE_METHODS, WASTE_UNITS } from '../../lib/constants'

export default function Scope3WasteDisposal() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const [goodsType, setGoodsType]   = useState('')
  const [loop, setLoop]             = useState('')
  const [unit, setUnit]             = useState('')
  const [generation, setGeneration] = useState('')
  const [remarks, setRemarks]       = useState('')

  const weightKg = unit === 'tonnes' ? (parseFloat(generation) || 0) * 1000 : (parseFloat(generation) || 0)
  const preview = loop && generation ? calcWaste(loop, weightKg) : null

  function buildEntry() {
    if (!goodsType || !unit || !generation) return null
    const kg = unit === 'tonnes' ? parseFloat(generation) * 1000 : parseFloat(generation)
    const { ef, tco2e } = calcWaste(loop || 'Landfill', kg)
    const e = {
      date: new Date().toISOString().slice(0, 10),
      'Type of Goods': goodsType,
      Loop: loop,
      'Unit of Measurement': unit,
      Generation: generation,
      Source: 'Defra v1.0',
      'Emission Factor': ef,
      remarks,
      ef,
      tco2e,
    }
    setGoodsType(''); setLoop(''); setUnit(''); setGeneration(''); setRemarks('')
    return e
  }

  return (
    <AssessmentForm
      title="Inventory of GHG Emissions from waste generated in Operations"
      siteCode={siteId} module="wasteDisposal"
      emissionLabel="Emission From Waste Disposal"
      columns={['date', 'Type of Goods', 'Loop', 'Unit of Measurement', 'Generation', 'Emission Factor']}
      onPrev={() => navigate(`/sites/${siteId}/scope3/downstream`)}
      onNext={() => navigate(`/sites/${siteId}/scope3/water-supply`)}
      onBuildEntry={buildEntry}
      fields={({ onSubmit }) => (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Select label="Type of Goods" value={goodsType} onChange={setGoodsType} options={WASTE_TYPES} required />
            <Select label="Loop" value={loop} onChange={setLoop} options={WASTE_METHODS} required />
            <Select label="Unit of Measurement" value={unit} onChange={setUnit} options={WASTE_UNITS} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Generation" value={generation} onChange={setGeneration} type="number" required />
            <Input label="Remarks" value={remarks} onChange={setRemarks} placeholder="Enter Remarks" />
          </div>
          {preview && <GHGPreview tco2e={preview.tco2e} />}
          <div className="flex gap-3">
            <button onClick={() => onSubmit()} className="bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors">Submit</button>
            <button onClick={() => { onSubmit(); navigate(`/sites/${siteId}/scope3/water-supply`) }} className="border border-slate-200 text-sm text-slate-600 px-4 py-2.5 rounded-xl hover:border-[#10B981] transition-colors">Save &amp; Continue</button>
          </div>
        </div>
      )}
    />
  )
}
