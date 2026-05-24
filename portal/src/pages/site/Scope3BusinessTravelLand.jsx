import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentForm, { Select, Input, GHGPreview } from '../../components/AssessmentForm'
import { calcTravelLand } from '../../lib/calculations'
import { LAND_VEHICLE_TYPES, DISTANCE_UNITS } from '../../lib/constants'

const FUEL_TYPES_LAND = ['Diesel', 'Petrol', 'Hybrid', 'CNG', 'LPG', 'Plug-in Hybrid Electric Vehicle', 'Battery Electric Vehicle', 'Average']

export default function Scope3BusinessTravelLand() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const [fuelType, setFuelType]     = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [unit, setUnit]             = useState('km')
  const [consumption, setConsumption] = useState('')
  const [passengers, setPassengers] = useState('')
  const [km, setKm]                 = useState('')
  const [remarks, setRemarks]       = useState('')

  const preview = vehicleType && km ? calcTravelLand(vehicleType, parseFloat(km) || 0) : null

  function buildEntry() {
    if (!vehicleType || !km) return null
    const { ef, tco2e } = calcTravelLand(vehicleType, parseFloat(km))
    const e = {
      date: new Date().toISOString().slice(0, 10),
      'Type of Fuel': fuelType,
      'Vehicle Type': vehicleType,
      'Unit of Measurement': unit,
      Consumption: consumption,
      'No. of Passengers': passengers,
      'km Travelled': km,
      Source: 'Defra v1.0',
      'Emission Factor': ef,
      remarks,
      ef,
      tco2e,
    }
    setFuelType(''); setVehicleType(''); setUnit('km')
    setConsumption(''); setPassengers(''); setKm(''); setRemarks('')
    return e
  }

  return (
    <AssessmentForm
      title="GHG Inventory – Business Travel (Land)"
      siteCode={siteId} module="businessTravelLand"
      emissionLabel="Emission From Land Travel"
      columns={['date', 'Type of Fuel', 'Vehicle Type', 'Unit of Measurement', 'No. of Passengers', 'km Travelled', 'Emission Factor']}
      onPrev={() => navigate(`/sites/${siteId}/scope3/business-travel-sea`)}
      onNext={() => navigate(`/sites/${siteId}/scope3/hotel-stay`)}
      onBuildEntry={buildEntry}
      fields={({ onSubmit }) => (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Select label="Type of Fuel" value={fuelType} onChange={setFuelType} options={FUEL_TYPES_LAND} required />
            <Select label="Vehicle Type" value={vehicleType} onChange={setVehicleType} options={LAND_VEHICLE_TYPES} required />
            <Select label="Unit of Measurement" value={unit} onChange={setUnit} options={DISTANCE_UNITS} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Consumption" value={consumption} onChange={setConsumption} type="number" placeholder="Fuel consumed" />
            <Input label="Number of Passengers" value={passengers} onChange={setPassengers} type="number" required />
            <Input label="Kilo meters Travelled" value={km} onChange={setKm} type="number" required />
          </div>
          <Input label="Remarks" value={remarks} onChange={setRemarks} placeholder="Route or additional notes" />
          {preview && <GHGPreview tco2e={preview.tco2e} />}
          <div className="flex gap-3">
            <button onClick={() => onSubmit()} className="bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors">Submit</button>
            <button onClick={() => { onSubmit(); navigate(`/sites/${siteId}/scope3/hotel-stay`) }} className="border border-slate-200 text-sm text-slate-600 px-4 py-2.5 rounded-xl hover:border-[#10B981] transition-colors">Save &amp; Continue</button>
          </div>
        </div>
      )}
    />
  )
}
