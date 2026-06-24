import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentForm, { Select, Input, GHGPreview } from '../../components/AssessmentForm'
import { calcHotel } from '../../lib/calculations'
import { HOTEL_COUNTRIES } from '../../lib/constants'

export default function Scope3HotelStay() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const [country, setCountry] = useState('')
  const [nights, setNights]   = useState('')
  const [rooms, setRooms]     = useState('')
  const [remarks, setRemarks] = useState('')

  const roomNights = (parseFloat(rooms) || 1) * (parseFloat(nights) || 0)
  const preview = country && nights ? calcHotel(country, roomNights) : null

  function buildEntry() {
    if (!country || !nights) return null
    const { ef, tco2e } = calcHotel(country, roomNights)
    const e = {
      date: new Date().toISOString().slice(0, 10),
      'Name of Country': country,
      Country: country,
      Standard: country,
      Nights: nights,
      Rooms: rooms || '1',
      Consumption: roomNights,
      consumption: roomNights,
      Source: 'Defra v 1.0',
      'Emission Factor': ef,
      ef,
      tco2e,
      ghg: tco2e,
      remarks,
    }
    setCountry(''); setNights(''); setRooms(''); setRemarks('')
    return e
  }

  return (
    <AssessmentForm
      title="GHG Inventory – Hotel Stay"
      siteCode={siteId} module="hotelStay" hideDocument
      emissionLabel="Emission From Hotel Stay"
      columns={['date', 'Name of Country', 'Nights', 'Rooms', 'Source', 'Emission Factor']}
      onPrev={() => navigate(`/sites/${siteId}/scope3/business-travel-land`)}
      onNext={() => navigate(`/sites/${siteId}/scope3/summary`)}
      onBuildEntry={buildEntry}
      fields={({ onSubmit }) => (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Select label="Name of Country" value={country} onChange={setCountry} options={HOTEL_COUNTRIES} required />
            <Input label="Number of occupied Rooms" value={rooms} onChange={setRooms} type="number" placeholder="1" />
            <Input label="Number of Nights Per Room" value={nights} onChange={setNights} type="number" required />
          </div>
          <Input label="Remarks" value={remarks} onChange={setRemarks} placeholder="Location or notes" />
          {preview && <GHGPreview tco2e={preview.tco2e} />}
          <div className="flex gap-3">
            <button onClick={() => onSubmit()} className="bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors">Submit</button>
            <button onClick={() => { onSubmit(); navigate(`/sites/${siteId}/scope3/summary`) }} className="border border-slate-200 text-sm text-slate-600 px-4 py-2.5 rounded-xl hover:border-[#10B981] transition-colors">Save &amp; Continue</button>
          </div>
        </div>
      )}
    />
  )
}
