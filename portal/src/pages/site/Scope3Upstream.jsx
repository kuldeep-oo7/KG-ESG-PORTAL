import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentForm, { Select, Input, GHGPreview } from '../../components/AssessmentForm'
import { calcGeneric } from '../../lib/calculations'

const VEHICLE_TYPES = ['Truck', 'Van', 'Rail', 'Ship', 'Aircraft', 'Other']
const FUEL_TYPES    = ['Diesel', 'Petrol', 'CNG', 'Electric', 'HFO', 'N/A']
const CLASSES       = ['Heavy Duty', 'Medium Duty', 'Light Duty', 'N/A']
const TRANSPORT_TYPES = ['Road', 'Rail', 'Sea', 'Air', 'Inland Waterway']
const UNITS         = ['tonne-km', 'km', 'kg']

const EF_UPSTREAM = { 'Road': 0.107, 'Rail': 0.028, 'Sea': 0.016, 'Air': 0.600, 'Inland Waterway': 0.031 }

export default function Scope3Upstream() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const [vehicleType, setVehicleType]   = useState('')
  const [fuelType, setFuelType]         = useState('')
  const [cls, setCls]                   = useState('')
  const [type, setType]                 = useState('')
  const [unit, setUnit]                 = useState('')
  const [tonnes, setTonnes]             = useState('')
  const [distance, setDistance]         = useState('')
  const [remarks, setRemarks]           = useState('')

  const ef = EF_UPSTREAM[type] ?? 0
  const tonne_km = (parseFloat(tonnes) || 0) * (parseFloat(distance) || 0)
  const preview = type && tonnes && distance ? calcGeneric(ef, tonne_km) : null

  function buildEntry() {
    if (!type || !tonnes || !distance) return null
    const tkm = parseFloat(tonnes) * parseFloat(distance)
    const { tco2e } = calcGeneric(ef, tkm)
    const e = {
      date: new Date().toISOString().slice(0, 10),
      'Type of Vehicle': vehicleType,
      'Type of Fuel': fuelType,
      Class: cls,
      Type: type,
      'Unit of Measurement': unit || 'tonne-km',
      Tonnes: tonnes,
      'Distance Travelled': distance,
      Source: 'Defra v1.0',
      'Emission Factor': ef,
      remarks,
      ef,
      tco2e,
    }
    setVehicleType(''); setFuelType(''); setCls(''); setType('')
    setUnit(''); setTonnes(''); setDistance(''); setRemarks('')
    return e
  }

  return (
    <AssessmentForm
      title="Inventory of GHG Emissions from Upstream transportation of goods"
      siteCode={siteId} module="upstream"
      emissionLabel="Emission From Upstream Activities"
      columns={['date', 'Type of Vehicle', 'Type of Fuel', 'Class', 'Type', 'Unit of Measurement', 'Tonnes', 'Distance Travelled']}
      onPrev={() => navigate(`/sites/${siteId}/scope3/td-loss`)}
      onNext={() => navigate(`/sites/${siteId}/scope3/downstream`)}
      onBuildEntry={buildEntry}
      fields={({ onSubmit }) => (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Select label="Type of Vehicle" value={vehicleType} onChange={setVehicleType} options={VEHICLE_TYPES} required />
            <Select label="Type of Fuel" value={fuelType} onChange={setFuelType} options={FUEL_TYPES} required />
            <Select label="Class" value={cls} onChange={setCls} options={CLASSES} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Select label="Type" value={type} onChange={setType} options={TRANSPORT_TYPES} required />
            <Select label="Unit of Measurement" value={unit} onChange={setUnit} options={UNITS} required />
            <Input label="Tonnes" value={tonnes} onChange={setTonnes} type="number" placeholder="Weight of goods transported" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Distance Travelled (km)" value={distance} onChange={setDistance} type="number" required />
            <Input label="Remarks" value={remarks} onChange={setRemarks} placeholder="Enter Remarks" />
          </div>
          {preview && <GHGPreview tco2e={preview.tco2e} />}
          <div className="flex gap-3">
            <button onClick={() => onSubmit()} className="bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors">Submit</button>
            <button onClick={() => { onSubmit(); navigate(`/sites/${siteId}/scope3/downstream`) }} className="border border-slate-200 text-sm text-slate-600 px-4 py-2.5 rounded-xl hover:border-[#10B981] transition-colors">Save &amp; Continue</button>
          </div>
        </div>
      )}
    />
  )
}
