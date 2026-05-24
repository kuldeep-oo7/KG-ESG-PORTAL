import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentForm, { Select, Input, GHGPreview, FileUpload } from '../../components/AssessmentForm'
import { calcElectricity } from '../../lib/calculations'
import { COUNTRIES, ELEC_UNITS } from '../../lib/constants'

export default function Scope3TDLoss() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const [country, setCountry]         = useState('')
  const [unit, setUnit]               = useState('')
  const [consumption, setConsumption] = useState('')
  const [remarks, setRemarks]         = useState('')
  const [file, setFile]               = useState(null)

  const preview = country && unit && consumption
    ? calcElectricity(country, unit, parseFloat(consumption) || 0)
    : null

  function buildEntry() {
    if (!country || !unit || !consumption) return null
    const { ef, tco2e } = calcElectricity(country, unit, parseFloat(consumption))
    const e = {
      date: new Date().toISOString().slice(0, 10),
      'Name of Country': country,
      'Unit of Measurement': unit,
      Consumption: consumption,
      Source: 'IEA 2023',
      'Emission Factor': ef,
      remarks,
      ef,
      tco2e,
    }
    setCountry(''); setUnit(''); setConsumption(''); setRemarks(''); setFile(null)
    return e
  }

  return (
    <AssessmentForm
      title="Inventory of Transmission & Distribution Loss due to Imported Electricity"
      siteCode={siteId} module="tdLoss"
      emissionLabel="Emission From Transmission & Distribution Loss"
      columns={['date', 'Name of Country', 'Unit of Measurement', 'Consumption', 'Source', 'Emission Factor']}
      onPrev={() => navigate(`/sites/${siteId}/scope3/purchased-goods`)}
      onNext={() => navigate(`/sites/${siteId}/scope3/upstream`)}
      onBuildEntry={buildEntry}
      fields={({ onSubmit }) => (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Select label="Name of Country" value={country} onChange={setCountry} options={COUNTRIES} required />
            <Select label="Unit of Measurement" value={unit} onChange={setUnit} options={ELEC_UNITS} required />
            <Input label="Consumption" value={consumption} onChange={setConsumption} type="number" required />
          </div>
          <Input label="Remarks" value={remarks} onChange={setRemarks} placeholder="Additional notes" />
          <FileUpload file={file} onChange={setFile} />
          {preview && <GHGPreview tco2e={preview.tco2e} />}
          <div className="flex gap-3">
            <button onClick={() => onSubmit()} className="bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors">Submit</button>
            <button onClick={() => { onSubmit(); navigate(`/sites/${siteId}/scope3/upstream`) }} className="border border-slate-200 text-sm text-slate-600 px-4 py-2.5 rounded-xl hover:border-[#10B981] transition-colors">Save &amp; Continue</button>
          </div>
        </div>
      )}
    />
  )
}
