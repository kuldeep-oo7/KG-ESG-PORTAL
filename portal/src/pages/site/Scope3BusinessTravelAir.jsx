import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentForm, { Select, Input, GHGPreview } from '../../components/AssessmentForm'
import { calcTravelAir } from '../../lib/calculations'
import { FLIGHT_HAULS, FLIGHT_CLASSES } from '../../lib/constants'

export default function Scope3BusinessTravelAir() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const [haul, setHaul]           = useState('')
  const [flightClass, setClass]   = useState('')
  const [passengers, setPassengers] = useState('')
  const [origin, setOrigin]       = useState('')
  const [destination, setDest]    = useState('')
  const [km, setKm]               = useState('')
  const [remarks, setRemarks]     = useState('')

  const passengerKm = (parseFloat(passengers) || 1) * (parseFloat(km) || 0)
  const preview = haul && flightClass && km
    ? calcTravelAir(haul, flightClass, passengerKm)
    : null

  function buildEntry() {
    if (!haul || !flightClass || !km || !passengers) return null
    const pkm = parseFloat(passengers) * parseFloat(km)
    const { ef, tco2e } = calcTravelAir(haul, flightClass, pkm)
    const e = {
      date: new Date().toISOString().slice(0, 10),
      'Mode of Travel': haul,
      Class: flightClass,
      'No. of Passengers': passengers,
      'Origin Airport': origin,
      'Destination Airport': destination,
      'Distance (km)': km,
      Source: 'Defra 2025',
      'Emission Factor': ef,
      remarks,
      ef,
      tco2e,
    }
    setHaul(''); setClass(''); setPassengers(''); setOrigin('')
    setDest(''); setKm(''); setRemarks('')
    return e
  }

  return (
    <AssessmentForm
      title="GHG Inventory – Business Travel (Air)"
      siteCode={siteId} module="businessTravelAir"
      emissionLabel="Emission From Air Travel"
      columns={['date', 'Mode of Travel', 'Class', 'No. of Passengers', 'Origin Airport', 'Destination Airport', 'Distance (km)']}
      onPrev={() => navigate(`/sites/${siteId}/scope3/water-treatment`)}
      onNext={() => navigate(`/sites/${siteId}/scope3/business-travel-sea`)}
      onBuildEntry={buildEntry}
      fields={({ onSubmit }) => (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select label="Mode of Travel" value={haul} onChange={setHaul} options={FLIGHT_HAULS} required />
            <Select label="Class" value={flightClass} onChange={setClass} options={FLIGHT_CLASSES} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Number of Passenger" value={passengers} onChange={setPassengers} type="number" required />
            <Input label="Origin Airport" value={origin} onChange={setOrigin} placeholder="e.g. BOM" />
            <Input label="Destination Airport" value={destination} onChange={setDest} placeholder="e.g. LHR" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Kilo meters Travelled" value={km} onChange={setKm} type="number" required />
            <Input label="Remarks" value={remarks} onChange={setRemarks} placeholder="Route or notes" />
          </div>
          {preview && <GHGPreview tco2e={preview.tco2e} />}
          <div className="flex gap-3">
            <button onClick={() => onSubmit()} className="bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors">Submit</button>
            <button onClick={() => { onSubmit(); navigate(`/sites/${siteId}/scope3/business-travel-sea`) }} className="border border-slate-200 text-sm text-slate-600 px-4 py-2.5 rounded-xl hover:border-[#10B981] transition-colors">Save &amp; Continue</button>
          </div>
        </div>
      )}
    />
  )
}
