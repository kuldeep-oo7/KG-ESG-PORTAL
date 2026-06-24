import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentForm, { Select, Input, GHGPreview } from '../../components/AssessmentForm'
import { calcTravelSea } from '../../lib/calculations'
import { TRAVEL_MODES_SEA } from '../../lib/constants'

export default function Scope3BusinessTravelSea() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const [mode, setMode]             = useState('')
  const [passengers, setPassengers] = useState('')
  const [km, setKm]                 = useState('')
  const [remarks, setRemarks]       = useState('')

  const passengerKm = (parseFloat(passengers) || 1) * (parseFloat(km) || 0)
  const preview = mode && km ? calcTravelSea(mode, passengerKm) : null

  function buildEntry() {
    if (!mode || !km) return null
    const { ef, tco2e } = calcTravelSea(mode, passengerKm)
    const e = {
      date: new Date().toISOString().slice(0, 10),
      'Travel Mode': mode,
      Type: mode,
      'No. of Passengers': passengers,
      'Number of Passenger': passengers,
      'Distance (km)': km,
      'Kilometers Travelled': km,
      Consumption: passengerKm,
      consumption: passengerKm,
      Unit: 'passenger.km',
      'Unit of Measurement': 'passenger.km',
      Source: 'Defra v 1.0',
      'Emission Factor': ef,
      ef,
      tco2e,
      ghg: tco2e,
      remarks,
    }
    setMode(''); setPassengers(''); setKm(''); setRemarks('')
    return e
  }

  return (
    <AssessmentForm
      title="GHG Inventory – Business Travel (Sea)"
      siteCode={siteId} module="businessTravelSea" hideDocument
      emissionLabel="Emission From Sea Travel"
      columns={['date', 'Travel Mode', 'No. of Passengers', 'Distance (km)', 'Source', 'Emission Factor']}
      onPrev={() => navigate(`/sites/${siteId}/scope3/business-travel-air`)}
      onNext={() => navigate(`/sites/${siteId}/scope3/business-travel-land`)}
      onBuildEntry={buildEntry}
      fields={({ onSubmit }) => (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Select label="Type (Ferry)" value={mode} onChange={setMode} options={TRAVEL_MODES_SEA} required />
            <Input label="Number of Passenger" value={passengers} onChange={setPassengers} type="number" required />
            <Input label="Kilometers Travelled" value={km} onChange={setKm} type="number" required />
          </div>
          <Input label="Remarks" value={remarks} onChange={setRemarks} placeholder="Route or notes" />
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
