import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentForm, { Select, Input, GHGPreview } from '../../components/AssessmentForm'
import { calcFood } from '../../lib/calculations'
import { FOOD_TYPES } from '../../lib/constants'

export default function Scope3FoodConsumption() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const [foodType, setFoodType]       = useState('')
  const [consumption, setConsumption] = useState('')
  const [remarks, setRemarks]         = useState('')

  const preview = foodType && consumption
    ? calcFood(foodType, parseFloat(consumption) || 0)
    : null

  function buildEntry() {
    if (!foodType || !consumption) return null
    const { ef, tco2e } = calcFood(foodType, parseFloat(consumption))
    const e = {
      date: new Date().toISOString().slice(0, 10),
      'Food Type': foodType,
      'Unit of Measurement': 'number of meals',
      Consumption: consumption,
      Source: 'Defra v1.0',
      'Emission Factor': ef,
      remarks,
      ef,
      tco2e,
    }
    setFoodType(''); setConsumption(''); setRemarks('')
    return e
  }

  return (
    <AssessmentForm
      title="GHG Inventory – Food Consumption"
      siteCode={siteId} module="foodConsumption"
      emissionLabel="Emission From Food Consumption"
      columns={['date', 'Food Type', 'Unit of Measurement', 'Consumption', 'Emission Factor']}
      onPrev={() => navigate(`/sites/${siteId}/scope3/employee-commute`)}
      onNext={() => navigate(`/sites/${siteId}/scope3/purchased-goods`)}
      onBuildEntry={buildEntry}
      fields={({ onSubmit }) => (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Select label="Food Type" value={foodType} onChange={setFoodType} options={FOOD_TYPES} required />
            <Input label="Consumption" value={consumption} onChange={setConsumption} type="number" placeholder="Number of meals / servings" required />
            <Input label="Remarks" value={remarks} onChange={setRemarks} placeholder="Additional notes" />
          </div>
          {preview && <GHGPreview tco2e={preview.tco2e} />}
          <div className="flex gap-3">
            <button onClick={() => onSubmit()} className="bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors">Submit</button>
            <button onClick={() => { onSubmit(); navigate(`/sites/${siteId}/scope3/purchased-goods`) }} className="border border-slate-200 text-sm text-slate-600 px-4 py-2.5 rounded-xl hover:border-[#10B981] transition-colors">Save &amp; Continue</button>
          </div>
        </div>
      )}
    />
  )
}
