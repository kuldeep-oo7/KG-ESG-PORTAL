import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentForm, { Select, Input, GHGPreview } from '../../components/AssessmentForm'
import { calcGeneric } from '../../lib/calculations'
import { HOTEL_STANDARDS } from '../../lib/constants'

const EF_HOTEL = { 'Budget': 20.8, 'Mid-Range': 31.2, 'Luxury': 52.0 }

export default function Scope3HotelStay() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const [standard, setStandard] = useState('')
  const [nights, setNights]     = useState('')
  const [rooms, setRooms]       = useState('')
  const [remarks, setRemarks]   = useState('')

  const ef = EF_HOTEL[standard] ?? 0
  const totalNights = (parseFloat(nights)||0) * (parseFloat(rooms)||1)
  const preview = standard && nights ? calcGeneric(ef, totalNights) : null

  function buildEntry() {
    if (!standard || !nights) return null
    const total = (parseFloat(nights)) * (parseFloat(rooms)||1)
    const { tco2e } = calcGeneric(ef, total)
    const e = {
      date: new Date().toISOString().slice(0, 10),
      Standard: standard,
      Nights: nights,
      Rooms: rooms || '1',
      Source: 'Defra v1.0',
      'Emission Factor': ef,
      remarks,
      ef,
      tco2e,
    }
    setStandard(''); setNights(''); setRooms(''); setRemarks('')
    return e
  }

  return (
    <AssessmentForm
      title="GHG Inventory – Hotel Stay"
      siteCode={siteId} module="hotelStay"
      emissionLabel="Emission From Hotel Stay"
      columns={['date', 'Standard', 'Nights', 'Rooms', 'Source', 'Emission Factor']}
      onPrev={() => navigate(`/sites/${siteId}/scope3/business-travel-land`)}
      onNext={() => navigate(`/sites/${siteId}/scope3/summary`)}
      onBuildEntry={buildEntry}
      fields={({ onSubmit }) => (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Select label="Hotel Standard" value={standard} onChange={setStandard} options={HOTEL_STANDARDS} required />
            <Input label="Number of Nights" value={nights} onChange={setNights} type="number" required />
            <Input label="Number of Rooms" value={rooms} onChange={setRooms} type="number" placeholder="1" />
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
