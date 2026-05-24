import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentForm, { Select, Input, GHGPreview } from '../../components/AssessmentForm'
import { calcCommute } from '../../lib/calculations'
import { VEHICLE_TYPES, COMMUTE_TYPES, FUEL_TYPES } from '../../lib/constants'

const DISTANCE_UNITS = ['km']

export default function Scope3EmployeeCommute() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const [commuteType, setCommuteType]     = useState('')
  const [fuelType, setFuelType]           = useState('')
  const [vehicleType, setVehicleType]     = useState('')
  const [unit, setUnit]                   = useState('')
  const [figureOfDistance, setFigureOfDistance] = useState('')
  const [passengers, setPassengers]       = useState('')
  const [kmTravelled, setKmTravelled]     = useState('')
  const [remarks, setRemarks]             = useState('')

  const preview = vehicleType && kmTravelled
    ? calcCommute(vehicleType, parseFloat(passengers) || 1, parseFloat(kmTravelled) || 0, 1, false)
    : null

  function buildEntry() {
    if (!vehicleType || !kmTravelled) return null
    const { ef, tco2e } = calcCommute(vehicleType, parseFloat(passengers) || 1, parseFloat(kmTravelled), 1, false)
    const e = {
      date: new Date().toISOString().slice(0, 10),
      'Commute Type': commuteType,
      'Fuel Type': fuelType,
      'Vehicle Type': vehicleType,
      'Unit of Measurement': unit || 'km',
      'Figure of Distance': figureOfDistance,
      'No. of Passengers': passengers,
      'km Travelled': kmTravelled,
      Source: 'Defra v1.0',
      'Emission Factor': ef,
      remarks,
      ef,
      tco2e,
    }
    setCommuteType(''); setFuelType(''); setVehicleType(''); setUnit('')
    setFigureOfDistance(''); setPassengers(''); setKmTravelled(''); setRemarks('')
    return e
  }

  return (
    <AssessmentForm
      title="Inventory of GHG Emissions due to Employee Commute from home to office and Vice Versa."
      siteCode={siteId} module="employeeCommute"
      emissionLabel="Emission From Employee Commute"
      columns={['date', 'Commute Type', 'Fuel Type', 'Vehicle Type', 'Unit of Measurement', 'Figure of Distance', 'No. of Passengers', 'km Travelled']}
      onPrev={() => navigate(`/sites/${siteId}/scope2/summary`)}
      onNext={() => navigate(`/sites/${siteId}/scope3/food-consumption`)}
      onBuildEntry={buildEntry}
      fields={({ onSubmit }) => (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Select label="Commute Type" value={commuteType} onChange={setCommuteType} options={COMMUTE_TYPES} required />
            <Select label="Fuel Type" value={fuelType} onChange={setFuelType} options={FUEL_TYPES} required />
            <Select label="Vehicle Type" value={vehicleType} onChange={setVehicleType} options={VEHICLE_TYPES} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Select label="Unit of Measurement" value={unit} onChange={setUnit} options={DISTANCE_UNITS} required />
            <Input label="Figure of Distance" value={figureOfDistance} onChange={setFigureOfDistance} type="number" required />
            <Input label="Number of Passengers" value={passengers} onChange={setPassengers} type="number" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Kilo meters Travelled" value={kmTravelled} onChange={setKmTravelled} type="number" required />
            <Input label="Remarks" value={remarks} onChange={setRemarks} placeholder="Additional notes or comments" />
          </div>
          {preview && <GHGPreview tco2e={preview.tco2e} />}
          <div className="flex gap-3">
            <button onClick={() => onSubmit()} className="bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors">Submit</button>
            <button onClick={() => { onSubmit(); navigate(`/sites/${siteId}/scope3/food-consumption`) }} className="border border-slate-200 text-sm text-slate-600 px-4 py-2.5 rounded-xl hover:border-[#10B981] transition-colors">Save &amp; Continue</button>
          </div>
        </div>
      )}
    />
  )
}
