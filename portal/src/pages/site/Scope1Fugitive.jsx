import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentForm, { Select, Input, GHGPreview } from '../../components/AssessmentForm'
import { calcFugitive } from '../../lib/calculations'
import { REFRIGERANTS } from '../../lib/constants'

const FUGITIVE_UNITS = ['kg']

export default function Scope1Fugitive() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const [refrigerant, setRefrigerant] = useState('')
  const [unit, setUnit]               = useState('')
  const [consumption, setConsumption] = useState('')
  const [remarks, setRemarks]         = useState('')

  const preview = refrigerant && consumption
    ? calcFugitive(refrigerant, parseFloat(consumption) || 0)
    : null

  function buildEntry() {
    if (!refrigerant || !consumption) return null
    const { ef, tco2e } = calcFugitive(refrigerant, parseFloat(consumption))
    const e = {
      date: new Date().toISOString().slice(0, 10),
      'Type of Refrigerant': refrigerant,
      'Unit of Measurement': unit || 'kg',
      Consumption: consumption,
      Source: 'IPCC AR5',
      GWP: ef,
      remarks,
      ef,
      tco2e,
    }
    setRefrigerant(''); setUnit(''); setConsumption(''); setRemarks('')
    return e
  }

  return (
    <AssessmentForm
      title="GHG Inventory of Direct Fugitive Emissions"
      siteCode={siteId} module="fugitive"
      emissionLabel="Emission From Fugitive Emissions"
      columns={['date', 'Type of Refrigerant', 'Unit of Measurement', 'Consumption', 'Source', 'GWP']}
      onPrev={() => navigate(`/sites/${siteId}/scope1/mobile`)}
      onNext={() => navigate(`/sites/${siteId}/scope1/summary`)}
      onBuildEntry={buildEntry}
      fields={({ onSubmit }) => (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Select label="Type of Refrigerant" value={refrigerant} onChange={setRefrigerant} options={REFRIGERANTS} required />
            <Select label="Unit of Measurement" value={unit} onChange={setUnit} options={FUGITIVE_UNITS} required />
            <Input label="Consumption" value={consumption} onChange={setConsumption} type="number" required />
          </div>
          <Input label="Remarks" value={remarks} onChange={setRemarks} placeholder="Additional notes" />
          {preview && <GHGPreview tco2e={preview.tco2e} />}
          <div className="flex gap-3">
            <button onClick={() => onSubmit()} className="bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors">Submit</button>
            <button onClick={() => { onSubmit(); navigate(`/sites/${siteId}/scope1/summary`) }} className="border border-slate-200 text-sm text-slate-600 px-4 py-2.5 rounded-xl hover:border-[#10B981] transition-colors">Save &amp; Continue</button>
          </div>
        </div>
      )}
    />
  )
}
