import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentForm, { Select, Input, GHGPreview } from '../../components/AssessmentForm'
import { COMMUTE_TREE, COMMUTE_ACTIVITIES } from '../../lib/commuteFactors'

export default function Scope3BusinessTravelLand() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const [activity, setActivity] = useState('')   // Vehicle/Mode
  const [fuel, setFuel]         = useState('')    // only for Cars (by size)
  const [type, setType]         = useState('')    // Vehicle Type / Type
  const [unit, setUnit]         = useState('')
  const [distance, setDistance] = useState('')
  const [remarks, setRemarks]   = useState('')

  const node = COMMUTE_TREE[activity] || null
  const hasFuel = !!node?.hasFuel

  const efKey = node ? (hasFuel ? `${fuel}|${type}|${unit}` : `${type}|${unit}`) : null
  const ef = node && efKey ? node.ef[efKey] : undefined
  const dist = parseFloat(distance) || 0
  const tco2e = ef != null ? +(dist * ef / 1000).toFixed(6) : null
  const ready = !!(node && type && unit && distance && (!hasFuel || fuel) && ef != null)

  function onActivity(v) {
    setActivity(v); setFuel(''); setType('')
    const units = COMMUTE_TREE[v]?.units || []
    setUnit(units.length === 1 ? units[0] : '')
  }

  function buildEntry() {
    if (!ready) return null
    const e = {
      date: new Date().toISOString().slice(0, 10),
      'Mode of Travel': activity,
      'Type of Fuel': hasFuel ? fuel : '-',
      'Vehicle Type': type,
      Type: hasFuel ? `${activity} - ${fuel} - ${type}` : `${activity} - ${type}`,
      'Unit of Measurement': unit,
      Unit: unit,
      Consumption: distance,
      consumption: distance,
      'km Travelled': distance,
      Source: 'Defra v 1.0',
      'Emission Factor': ef,
      ef,
      tco2e,
      ghg: tco2e,
      remarks,
    }
    setActivity(''); setFuel(''); setType(''); setUnit(''); setDistance(''); setRemarks('')
    return e
  }

  return (
    <AssessmentForm
      title="GHG Inventory – Business Travel (Land)"
      siteCode={siteId} module="businessTravelLand" hideDocument
      emissionLabel="Emission From Land Travel"
      columns={['date', 'Mode of Travel', 'Type of Fuel', 'Vehicle Type', 'Unit of Measurement', 'Consumption', 'Source', 'Emission Factor']}
      onPrev={() => navigate(`/sites/${siteId}/scope3/business-travel-sea`)}
      onNext={() => navigate(`/sites/${siteId}/scope3/hotel-stay`)}
      onBuildEntry={buildEntry}
      fields={({ onSubmit }) => (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Select label="Mode of Travel" value={activity} onChange={onActivity} options={COMMUTE_ACTIVITIES} required />
            {hasFuel && (
              <Select label="Fuel Type" value={fuel} onChange={setFuel} options={node.fuels} required />
            )}
            {node && (
              <Select label={hasFuel ? 'Vehicle Type' : 'Type'} value={type} onChange={setType} options={node.types} required />
            )}
          </div>
          {node && (
            <div className="grid grid-cols-3 gap-4">
              <Select label="Unit of Measurement" value={unit} onChange={setUnit} options={node.units} required />
              <Input label="Consumption" value={distance} onChange={setDistance} type="number" required />
            </div>
          )}
          <Input label="Remarks" value={remarks} onChange={setRemarks} placeholder="Route or additional notes" />
          {tco2e != null && <GHGPreview tco2e={tco2e} />}
          <div className="flex gap-3">
            <button onClick={() => onSubmit()} className="bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors">Submit</button>
            <button onClick={() => { onSubmit(); navigate(`/sites/${siteId}/scope3/hotel-stay`) }} className="border border-slate-200 text-sm text-slate-600 px-4 py-2.5 rounded-xl hover:border-[#10B981] transition-colors">Save &amp; Continue</button>
          </div>
        </div>
      )}
    />
  )
}
