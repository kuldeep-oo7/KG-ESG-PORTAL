import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentForm, { Select, Input, GHGPreview } from '../../components/AssessmentForm'
import { lookupFreightEF, lookupFreightByLabel } from '../../lib/freightFactors'
import { FREIGHT_VEHICLE_TYPES, FREIGHT_UNITS, FUEL_TYPES } from '../../lib/constants'

// Columns match the official DEFRA Q14 bulk template
const BULK_COLUMNS = [
  { key: 'Type of Vehicle', label: 'Type of Vehicle' },
  { key: 'Type of Fuel', label: 'Type of Fuel' },
  { key: 'Class', label: 'Class' },
  { key: 'Type', label: 'Type' },
  { key: 'Unit of Measurement', label: 'Unit of Measurement' },
  { key: 'Tonnes', label: 'Tonnes' },
  { key: 'Distance Travelled', label: 'Distance Travelled' },
  { key: 'Remarks', label: 'Remarks' },
]
const bulkValid = r => !!((r['Type of Vehicle'] || '').trim()) && parseFloat(r['Distance Travelled']) > 0
function bulkBuildRow(r) {
  const vehicle = (r['Type of Vehicle'] || '').trim()
  const fuel = (r['Type of Fuel'] || '').trim()
  const cls = (r['Class'] || '').trim()
  const type = (r['Type'] || '').trim()
  const unit = (r['Unit of Measurement'] || 'tonne.km').trim()
  const tn = parseFloat(r['Tonnes']) || 0
  const di = parseFloat(r['Distance Travelled']) || 0
  const efv = lookupFreightEF({ vehicle, fuel, cls, type, unit })
  const qty = /tonne/i.test(unit) ? tn * di : di
  const tc = +(efv * qty / 1000).toFixed(6)
  return {
    date: new Date().toISOString().slice(0, 10),
    'Type of Vehicle': vehicle,
    'Type of Fuel': fuel || '-',
    Class: cls,
    Type: type || [vehicle, fuel, cls].filter(Boolean).join(' - '),
    'Unit of Measurement': unit,
    Unit: unit,
    Tonnes: tn,
    'Distance Travelled': di,
    Consumption: qty,
    consumption: qty,
    Source: 'Defra v 1.0',
    'Emission Factor': efv,
    ef: efv,
    tco2e: tc,
    ghg: tc,
    remarks: r['Remarks'] || '',
  }
}

export default function Scope3Downstream() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const [vehicleType, setVehicleType] = useState('')
  const [fuelType, setFuelType]       = useState('')
  const [unit, setUnit]               = useState('')
  const [tonnes, setTonnes]           = useState('')
  const [distance, setDistance]       = useState('')
  const [remarks, setRemarks]         = useState('')

  const u = unit || 'tonne.km'
  const isVan = vehicleType.startsWith('Van')
  const { ef } = vehicleType ? lookupFreightByLabel(vehicleType, fuelType, u) : { ef: 0 }
  const qty = /tonne/i.test(u) ? (parseFloat(tonnes) || 0) * (parseFloat(distance) || 0) : (parseFloat(distance) || 0)
  const preview = vehicleType && distance ? { tco2e: +(qty * ef / 1000).toFixed(6) } : null

  function buildEntry() {
    if (!vehicleType || !distance) return null
    if (/tonne/i.test(u) && !tonnes) return null
    const q = /tonne/i.test(u) ? (parseFloat(tonnes) || 0) * parseFloat(distance) : parseFloat(distance)
    const tco2e = +(q * ef / 1000).toFixed(6)
    const e = {
      date: new Date().toISOString().slice(0, 10),
      'Type of Vehicle': vehicleType,
      'Type of Fuel': isVan ? (fuelType || '-') : '-',
      Class: '',
      Type: vehicleType,
      'Unit of Measurement': u,
      Tonnes: tonnes,
      'Distance Travelled': distance,
      Consumption: q, consumption: q,
      Source: 'DEFRA 2026',
      'Emission Factor': ef,
      remarks,
      ef,
      tco2e,
    }
    setVehicleType(''); setFuelType(''); setUnit(''); setTonnes(''); setDistance(''); setRemarks('')
    return e
  }

  return (
    <AssessmentForm
      title="Inventory of GHG Emissions from Downstream transportation of goods"
      siteCode={siteId} module="downstream"
      emissionLabel="Emission From Downstream Activities"
      columns={['date', 'Type of Vehicle', 'Type of Fuel', 'Class', 'Type', 'Unit of Measurement', 'Tonnes', 'Distance Travelled']}
      onPrev={() => navigate(`/sites/${siteId}/scope3/upstream`)}
      onNext={() => navigate(`/sites/${siteId}/scope3/waste-disposal`)}
      onBuildEntry={buildEntry}
      hideDocument
      bulkImport={{ columns: BULK_COLUMNS, isValid: bulkValid, buildRow: bulkBuildRow, templateName: 'downstream_template', templateUrl: '/templates/freight_transport_template.xlsx' }}
      fields={({ onSubmit }) => (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Select label="Type of Vehicle" value={vehicleType} onChange={setVehicleType} options={FREIGHT_VEHICLE_TYPES} required />
            <Select label="Type of Fuel" value={fuelType} onChange={setFuelType} options={FUEL_TYPES} required={isVan} />
            <Select label="Unit of Measurement" value={unit} onChange={setUnit} options={FREIGHT_UNITS} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Tonnes" value={tonnes} onChange={setTonnes} type="number" placeholder="Weight of goods (tonne.km only)" required={/tonne/i.test(u)} />
            <Input label="Distance Travelled (km)" value={distance} onChange={setDistance} type="number" required />
            <Input label="Remarks" value={remarks} onChange={setRemarks} placeholder="Enter Remarks" />
          </div>
          {preview && <GHGPreview tco2e={preview.tco2e} />}
          <div className="flex gap-3">
            <button onClick={() => onSubmit()} className="bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors">Submit</button>
            <button onClick={() => { onSubmit(); navigate(`/sites/${siteId}/scope3/waste-disposal`) }} className="border border-slate-200 text-sm text-slate-600 px-4 py-2.5 rounded-xl hover:border-[#10B981] transition-colors">Save &amp; Continue</button>
          </div>
        </div>
      )}
    />
  )
}
