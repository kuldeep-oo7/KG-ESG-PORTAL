import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentForm, { Select, Input, GHGPreview } from '../../components/AssessmentForm'
import { calcTravel } from '../../lib/calculations'
import { TRAVEL_MODES_SEA } from '../../lib/constants'

export default function Scope3BusinessTravelSea() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const [mode, setMode]       = useState('')
  const [km, setKm]           = useState('')
  const [remarks, setRemarks] = useState('')

  const preview = mode && km ? calcTravel(mode, parseFloat(km)||0) : null

  function buildEntry() {
    if (!mode || !km) return null
    const { ef, tco2e } = calcTravel(mode, parseFloat(km))
    const e = {
      date: new Date().toISOString().slice(0, 10),
      'Travel Mode': mode,
      'Distance (km)': km,
      Source: 'Defra v1.0',
      'Emission Factor': ef,
      remarks,
      ef,
      tco2e,
    }
    setMode(''); setKm(''); setRemarks('')
    return e
  }

  return (
    <AssessmentForm
      title="GHG Inventory – Business Travel (Sea)"
      siteCode={siteId} module="businessTravelSea"
      emissionLabel="Emission From Sea Travel"
      columns={['date', 'Travel Mode', 'Distance (km)', 'Source', 'Emission Factor']}
      onPrev={() => navigate(`/sites/${siteId}/scope3/business-travel-air`)}
      onNext={() => navigate(`/sites/${siteId}/scope3/business-travel-land`)}
      onBuildEntry={buildEntry}
      fields={({ onSubmit }) => (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Select label="Mode of Transport" value={mode} onChange={setMode} options={TRAVEL_MODES_SEA} required />
            <Input label="Distance (km)" value={km} onChange={setKm} type="number" required />
            <Input label="Remarks" value={remarks} onChange={setRemarks} placeholder="Route or notes" />
          </div>
          {preview && <GHGPreview tco2e={preview.tco2e} />}
          <div className="flex gap-3">
            <button onClick={() => onSubmit()} className="bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors">Submit</button>
            <button onClick={() => { onSubmit(); navigate(`/sites/${siteId}/scope3/business-travel-land`) }} className="border border-slate-200 text-sm text-slate-600 px-4 py-2.5 rounded-xl hover:border-[#10B981] transition-colors">Save &amp; Continue</button>
          </div>
        </div>
      )}
    />
  )
}
