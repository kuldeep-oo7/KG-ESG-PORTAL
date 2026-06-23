import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentForm, { Select, Input, GHGPreview } from '../../components/AssessmentForm'
import { calcMobile } from '../../lib/calculations'
import { MOBILE_TYPES, MOBILE_UNITS } from '../../lib/constants'

export default function Scope1Mobile() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const [fuelType, setFuelType]       = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [unit, setUnit]               = useState('')
  const [consumption, setConsumption] = useState('')
  const [remarks, setRemarks]         = useState('')

  const combinedType = fuelType && vehicleType ? `${fuelType} - ${vehicleType}` : ''
  const preview = combinedType && unit && consumption ? calcMobile(combinedType, unit, parseFloat(consumption) || 0) : null

  function buildEntry() {
    if (!fuelType || !vehicleType || !unit || !consumption) return null
    const { ef, tco2e } = calcMobile(combinedType, unit, parseFloat(consumption))
    const e = {
      date: new Date().toISOString().slice(0, 10),
      Type: combinedType,
      'Fuel Type': fuelType,
      'Vehicle Type': vehicleType,
      Unit: unit,
      Consumption: consumption,
      Source: 'Defra v1.0',
      'Emission Factor': ef,
      remarks,
      ef,
      tco2e
    }
    setFuelType(''); setVehicleType(''); setUnit(''); setConsumption(''); setRemarks('')
    return e
  }

  const FUEL_OPTIONS = ['Diesel', 'Petrol', 'Hybrid', 'CNG', 'LPG', 'Plug-in Hybrid', 'Battery EV']

  const VEHICLE_OPTIONS_BY_FUEL = {
    'Diesel': [
      'Small car', 'Medium car', 'Large car', 'Average car',
      'Mini', 'Supermini', 'Lower medium', 'Upper medium', 'Executive', 'Luxury', 'Sports', 'Dual purpose 4X4', 'MPV',
      'Class I (up to 1.305 tonnes)', 'Class II (1.305 to 1.74 tonnes)', 'Class III (1.74 to 3.5 tonnes)', 'Average (up to 3.5 tonnes)',
      'Rigid (>3.5 - 7.5 tonnes)', 'Rigid (>7.5 tonnes-17 tonnes)', 'Rigid (>17 tonnes)', 'All rigids',
      'Articulated (>3.5 - 33t)', 'Articulated (>33t)', 'All artics', 'All HGVs'
    ],
    'Petrol': [
      'Small car', 'Medium car', 'Large car', 'Average car',
      'Mini', 'Supermini', 'Lower medium', 'Upper medium', 'Executive', 'Luxury', 'Sports', 'Dual purpose 4X4', 'MPV',
      'Class I (up to 1.305 tonnes)', 'Class II (1.305 to 1.74 tonnes)', 'Class III (1.74 to 3.5 tonnes)', 'Average (up to 3.5 tonnes)',
      'All rigids', 'All artics'
    ],
    'Hybrid': [
      'Small car', 'Medium car', 'Large car', 'Average car'
    ],
    'CNG': [
      'Medium car', 'Large car', 'Average car',
      'Average (up to 3.5 tonnes)', 'All rigids', 'All artics'
    ],
    'LPG': [
      'Medium car', 'Large car', 'Average car',
      'Average (up to 3.5 tonnes)', 'All rigids', 'All artics'
    ],
    'Plug-in Hybrid': [
      'Small car', 'Medium car', 'Large car', 'Average car',
      'Mini', 'Supermini', 'Lower medium', 'Upper medium', 'Executive', 'Luxury', 'Sports', 'Dual purpose 4X4', 'MPV'
    ],
    'Battery EV': [
      'Small car', 'Medium car', 'Large car', 'Average car',
      'Mini', 'Supermini', 'Lower medium', 'Upper medium', 'Executive', 'Luxury', 'Sports', 'Dual purpose 4X4', 'MPV',
      'Class III (1.74 to 3.5 tonnes)', 'Average (up to 3.5 tonnes)'
    ]
  }

  const vehicleOptions = fuelType ? (VEHICLE_OPTIONS_BY_FUEL[fuelType] || []) : []

  return (
    <AssessmentForm
      title="GHG Inventory of Direct Emissions from Mobile Combustion"
      siteCode={siteId} module="mobile"
      emissionLabel="Emission From Mobile Combustion"
      columns={['date','Type','Unit','Consumption','Source','Emission Factor']}
      onPrev={() => navigate(`/sites/${siteId}/scope1/stationary`)}
      onNext={() => navigate(`/sites/${siteId}/scope1/fugitive`)}
      onBuildEntry={buildEntry}
      fields={({ onSubmit }) => (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <Select label="Fuel Type" value={fuelType} onChange={(val) => { setFuelType(val); setVehicleType(''); }} options={FUEL_OPTIONS} required />
            <Select label="Vehicle Type" value={vehicleType} onChange={setVehicleType} options={vehicleOptions} required disabled={!fuelType} />
            <Select label="Unit of Measurement" value={unit} onChange={setUnit} options={['km', 'miles']} required />
            <Input label="Consumption" value={consumption} onChange={setConsumption} type="number" required />
          </div>
          <Input label="Remarks" value={remarks} onChange={setRemarks} placeholder="Additional notes" />
          {preview && <GHGPreview tco2e={preview.tco2e} />}
          <div className="flex gap-3">
            <button onClick={() => onSubmit()} className="bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors">Submit</button>
            <button onClick={() => { onSubmit(); navigate(`/sites/${siteId}/scope1/fugitive`) }} className="border border-slate-200 text-sm text-slate-600 px-4 py-2.5 rounded-xl hover:border-[#10B981] transition-colors">Save &amp; Continue</button>
          </div>
        </div>
      )}
    />
  )
}
