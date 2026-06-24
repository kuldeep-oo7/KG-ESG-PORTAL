import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentForm, { Select, Input, GHGPreview } from '../../components/AssessmentForm'
import { COMMUTE_TREE, COMMUTE_ACTIVITIES } from '../../lib/commuteFactors'

export default function Scope3EmployeeCommute() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const [activity, setActivity]   = useState('')   // Commute Type
  const [fuel, setFuel]           = useState('')   // only for Cars (by size)
  const [type, setType]           = useState('')   // Vehicle Type / Type
  const [unit, setUnit]           = useState('')
  const [distance, setDistance]   = useState('')   // Consumption (in selected unit)
  const [remarks, setRemarks]     = useState('')

  const node = COMMUTE_TREE[activity] || null
  const hasFuel = !!node?.hasFuel

  const efKey = node ? (hasFuel ? `${fuel}|${type}|${unit}` : `${type}|${unit}`) : null
  const ef = node && efKey ? node.ef[efKey] : undefined
  const dist = parseFloat(distance) || 0
  const tco2e = ef != null ? +(dist * ef / 1000).toFixed(6) : null
  const ready = !!(node && type && unit && distance && (!hasFuel || fuel) && ef != null)

  // Selecting a commute type resets the dependent fields (and auto-picks the
  // unit when there is only one option, e.g. Bus / Rail = passenger.km)
  function onActivity(v) {
    setActivity(v); setFuel(''); setType('')
    const units = COMMUTE_TREE[v]?.units || []
    setUnit(units.length === 1 ? units[0] : '')
  }

  function buildEntry() {
    if (!ready) return null
    const e = {
      date: new Date().toISOString().slice(0, 10),
      'Commute Type': activity,
      'Fuel Type': hasFuel ? fuel : '-',
      'Vehicle Type': type,
      Type: hasFuel ? `${activity} - ${fuel} - ${type}` : `${activity} - ${type}`,
      'Unit of Measurement': unit,
      Unit: unit,
      Consumption: distance,
      consumption: distance,
      'km Travelled': distance,
      Source: 'Defra v 1.0',
      category: 'Employee Commute',
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
      title="Inventory of GHG Emissions due to Employee Commute (home ↔ office)"
      siteCode={siteId} module="employeeCommute"
      emissionLabel="Emission From Employee Commute"
      columns={['date', 'Commute Type', 'Fuel Type', 'Vehicle Type', 'Unit of Measurement', 'Consumption', 'Source', 'Emission Factor']}
      onPrev={() => navigate(`/sites/${siteId}/scope2/summary`)}
      onNext={() => navigate(`/sites/${siteId}/scope3/food-consumption`)}
      onBuildEntry={buildEntry}
      fields={({ onSubmit }) => (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Select label="Commute Type" value={activity} onChange={onActivity} options={COMMUTE_ACTIVITIES} required />
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
          <Input label="Remarks" value={remarks} onChange={setRemarks} placeholder="Additional notes or comments" />
          {tco2e != null && <GHGPreview tco2e={tco2e} />}
          <div className="flex gap-3">
            <button onClick={() => onSubmit()} className="bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors">Submit</button>
            <button onClick={() => { onSubmit(); navigate(`/sites/${siteId}/scope3/food-consumption`) }} className="border border-slate-200 text-sm text-slate-600 px-4 py-2.5 rounded-xl hover:border-[#10B981] transition-colors">Save &amp; Continue</button>
          </div>
        </div>
      )}
    />
  )
}
