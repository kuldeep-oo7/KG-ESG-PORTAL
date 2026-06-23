import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentForm, { Select, Input, GHGPreview, FileUpload } from '../../components/AssessmentForm'
import { COUNTRIES } from '../../lib/constants'

const RENEWABLE_TYPES = ['Solar PV', 'Wind', 'Hydro', 'Biomass', 'Geothermal', 'Tidal']
const RENEWABLE_UNITS = ['kWh', 'MWh']

export default function Scope2Renewable() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const [country, setCountry]         = useState('')
  const [type, setType]               = useState('')
  const [unit, setUnit]               = useState('')
  const [generation, setGeneration]   = useState('')
  const [remarks, setRemarks]         = useState('')
  const [file, setFile]               = useState(null)

  const EF_GRID_CADI = {
    'India': 0.95182,
    'United Arab Emirates': 0.3652,
    'UAE': 0.3652,
    'Botswana': 0.97662,
  }

  const ef = EF_GRID_CADI[country] ?? 0.95182
  const genVal = parseFloat(generation) || 0
  const kwh = unit === 'MWh' ? genVal * 1000 : genVal
  const previewTco2e = +(kwh * ef / 1000).toFixed(6)

  function buildEntry() {
    if (!country || !type || !unit || !generation) return null
    const e = {
      date: new Date().toISOString().slice(0, 10),
      'Name of Country': country,
      Country: country,
      Type: type,
      Unit: unit,
      Generation: generation,
      Source: 'CaDI 2025',
      'Emission Factor': ef,
      remarks,
      ef,
      tco2e: previewTco2e,
      fileName: file ? file.name : null
    }
    setCountry(''); setType(''); setUnit(''); setGeneration(''); setRemarks(''); setFile(null)
    return e
  }

  return (
    <AssessmentForm
      title="GHG Inventory – Renewable Electricity Generation (Avoided Emissions)"
      siteCode={siteId} module="renewable"
      emissionLabel="Avoided Emissions from Renewable Generation"
      columns={['date', 'Name of Country', 'Type', 'Unit', 'Generation', 'Source', 'Emission Factor']}
      onPrev={() => navigate(`/sites/${siteId}/scope2/heatsteam`)}
      onNext={() => navigate(`/sites/${siteId}/scope2/summary`)}
      onBuildEntry={buildEntry}
      fields={({ onSubmit }) => (
        <div className="space-y-4">
          <div className="p-3 bg-[#ECFDF5] border border-[#10B981]/30 rounded-xl text-xs text-[#065F46]">
            Renewable electricity generation results in zero direct emissions. These records track avoided emissions.
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Select label="Name of Country" value={country} onChange={setCountry} options={COUNTRIES} required />
            <Select label="Type of Renewable" value={type} onChange={setType} options={RENEWABLE_TYPES} required />
            <Select label="Unit of Measurement" value={unit} onChange={setUnit} options={RENEWABLE_UNITS} required />
            <Input label="Generation" value={generation} onChange={setGeneration} type="number" required />
          </div>
          <Input label="Remarks" value={remarks} onChange={setRemarks} placeholder="Additional notes" />
          <FileUpload file={file} onChange={setFile} />
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
