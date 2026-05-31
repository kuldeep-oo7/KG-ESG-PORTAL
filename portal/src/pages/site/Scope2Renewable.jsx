import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentForm, { Select, Input, GHGPreview } from '../../components/AssessmentForm'

const RENEWABLE_TYPES = ['Solar PV', 'Wind', 'Hydro', 'Biomass', 'Geothermal', 'Tidal']
const RENEWABLE_UNITS = ['kWh', 'MWh']

export default function Scope2Renewable() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const [type, setType]               = useState('')
  const [unit, setUnit]               = useState('')
  const [generation, setGeneration]   = useState('')
  const [remarks, setRemarks]         = useState('')

  const SITE_COUNTRIES = {
    'KGIPL-01': 'India',
    'KGIPL-02': 'India',
    'KGIPL-03': 'India',
    'KGIPL-04': 'United Arab Emirates',
    'KGIPL-05': 'Botswana',
  }
  const country = SITE_COUNTRIES[siteId] || 'India'
  const EF_GRID = {
    'India': 0.716, 'United Arab Emirates': 0.450, 'Botswana': 1.050,
    'UK': 0.177, 'USA': 0.386, 'Australia': 0.620, 'Brazil': 0.074,
    'Canada': 0.130, 'China': 0.555, 'France': 0.066, 'Germany': 0.380,
    'Japan': 0.470, 'Saudi Arabia': 0.770, 'Singapore': 0.408,
    'South Africa': 0.930, 'default': 0.500,
  }
  const ef = EF_GRID[country] ?? 0.5
  const genVal = parseFloat(generation) || 0
  const kwh = unit === 'MWh' ? genVal * 1000 : genVal
  const previewTco2e = +(kwh * ef / 1000).toFixed(6)

  function buildEntry() {
    if (!type || !unit || !generation) return null
    const e = {
      date: new Date().toISOString().slice(0, 10),
      Type: type,
      Unit: unit,
      Generation: generation,
      Source: 'Self-reported',
      'Emission Factor': ef,
      remarks,
      ef,
      tco2e: previewTco2e,
    }
    setType(''); setUnit(''); setGeneration(''); setRemarks('')
    return e
  }

  return (
    <AssessmentForm
      title="GHG Inventory – Renewable Electricity Generation (Avoided Emissions)"
      siteCode={siteId} module="renewable"
      emissionLabel="Avoided Emissions from Renewable Generation"
      columns={['date', 'Type', 'Unit', 'Generation', 'Source', 'Emission Factor']}
      onPrev={() => navigate(`/sites/${siteId}/scope2/heatsteam`)}
      onNext={() => navigate(`/sites/${siteId}/scope2/summary`)}
      onBuildEntry={buildEntry}
      fields={({ onSubmit }) => (
        <div className="space-y-4">
          <div className="p-3 bg-[#ECFDF5] border border-[#10B981]/30 rounded-xl text-xs text-[#065F46]">
            Renewable electricity generation results in zero direct emissions. These records track avoided emissions.
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Select label="Type of Renewable" value={type} onChange={setType} options={RENEWABLE_TYPES} required />
            <Select label="Unit of Measurement" value={unit} onChange={setUnit} options={RENEWABLE_UNITS} required />
            <Input label="Generation" value={generation} onChange={setGeneration} type="number" required />
          </div>
          <Input label="Remarks" value={remarks} onChange={setRemarks} placeholder="Additional notes" />
          <GHGPreview tco2e={previewTco2e} />
          <div className="flex gap-3">
            <button onClick={() => onSubmit()} className="bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors">Submit</button>
            <button onClick={() => { onSubmit(); navigate(`/sites/${siteId}/scope2/summary`) }} className="border border-slate-200 text-sm text-slate-600 px-4 py-2.5 rounded-xl hover:border-[#10B981] transition-colors">Save &amp; Continue</button>
          </div>
        </div>
      )}
    />
  )
}
