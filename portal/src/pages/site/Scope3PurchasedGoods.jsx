import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AssessmentForm, { Select, Input, GHGPreview } from '../../components/AssessmentForm'
import { calcGoods } from '../../lib/calculations'
import { GOODS_TYPES, LOOP_TYPES, GOODS_UNITS } from '../../lib/constants'

export default function Scope3PurchasedGoods() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const [goodsType, setGoodsType]     = useState('')
  const [loop, setLoop]               = useState('')
  const [unit, setUnit]               = useState('')
  const [consumption, setConsumption] = useState('')
  const [remarks, setRemarks]         = useState('')

  const weightTonnes = unit === 'kg' ? (parseFloat(consumption) || 0) / 1000 : (parseFloat(consumption) || 0)
  const preview = goodsType && consumption ? calcGoods(goodsType, weightTonnes) : null

  function buildEntry() {
    if (!goodsType || !unit || !consumption) return null
    const tonnes = unit === 'kg' ? parseFloat(consumption) / 1000 : parseFloat(consumption)
    const { ef, tco2e } = calcGoods(goodsType, tonnes)
    const e = {
      date: new Date().toISOString().slice(0, 10),
      'Goods Type': goodsType,
      Loop: loop,
      Unit: unit,
      Consumption: consumption,
      Source: 'Defra v1.0',
      'Emission Factor': ef,
      remarks,
      ef,
      tco2e,
    }
    setGoodsType(''); setLoop(''); setUnit(''); setConsumption(''); setRemarks('')
    return e
  }

  return (
    <AssessmentForm
      title="GHG Inventory – Purchased Goods & Services"
      siteCode={siteId} module="purchasedGoods"
      emissionLabel="Emission From Purchased Goods"
      columns={['date', 'Goods Type', 'Loop', 'Unit', 'Consumption', 'Emission Factor']}
      onPrev={() => navigate(`/sites/${siteId}/scope3/food-consumption`)}
      onNext={() => navigate(`/sites/${siteId}/scope3/td-loss`)}
      onBuildEntry={buildEntry}
      fields={({ onSubmit }) => (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Select label="Type of Goods" value={goodsType} onChange={setGoodsType} options={GOODS_TYPES} required />
            <Select label="Loop" value={loop} onChange={setLoop} options={LOOP_TYPES} required />
            <Select label="Unit of Measurement" value={unit} onChange={setUnit} options={GOODS_UNITS} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Consumption" value={consumption} onChange={setConsumption} type="number" required />
            <Input label="Remarks" value={remarks} onChange={setRemarks} placeholder="Additional notes" />
          </div>
          {preview && <GHGPreview tco2e={preview.tco2e} />}
          <div className="flex gap-3">
            <button onClick={() => onSubmit()} className="bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors">Submit</button>
            <button onClick={() => { onSubmit(); navigate(`/sites/${siteId}/scope3/td-loss`) }} className="border border-slate-200 text-sm text-slate-600 px-4 py-2.5 rounded-xl hover:border-[#10B981] transition-colors">Save &amp; Continue</button>
          </div>
        </div>
      )}
    />
  )
}
