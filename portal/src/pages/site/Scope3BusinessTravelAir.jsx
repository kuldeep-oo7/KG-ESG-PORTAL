import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, X } from 'lucide-react'
import AssessmentForm, { Select, Input, GHGPreview } from '../../components/AssessmentForm'
import { calcTravelAir } from '../../lib/calculations'
import { FLIGHT_HAULS, FLIGHT_CLASSES, TRAVEL_UNITS_AIR } from '../../lib/constants'
import { searchAirports, getAirport, haversineKm, haulForKm } from '../../lib/airports'

const RF_OPTIONS = ['With RF', 'Without RF']
const RETURN_OPTIONS = ['One-way', 'Return (round trip)']

// Searchable airport picker: type a city / IATA code, pick from the list.
function AirportSearch({ label, value, onChange, required }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const selected = getAirport(value)
  const results = searchAirports(query)
  const shown = value && selected ? `${selected.code} — ${selected.city}` : query
  return (
    <div className="flex flex-col gap-1 relative">
      <label className="text-xs font-medium text-slate-600">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          value={shown}
          onChange={e => { setQuery(e.target.value); setOpen(true); if (value) onChange('') }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search city or airport code"
          autoComplete="off"
          className="w-full border border-slate-200 rounded-xl pl-9 pr-9 py-2.5 text-sm text-slate-800 outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-colors"
        />
        {value && (
          <button type="button" onClick={() => { onChange(''); setQuery('') }}
            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {open && (query || '').trim() && (
        <div className="absolute z-30 top-full mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-56 overflow-auto">
          {results.length === 0 ? (
            <div className="px-3 py-3 text-xs text-slate-400 text-center">No airport found</div>
          ) : results.map(a => (
            <button key={a.code} type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={() => { onChange(a.code); setQuery(''); setOpen(false) }}
              className="w-full text-left px-3 py-2 hover:bg-[#ECFDF5] border-b border-slate-50 last:border-0">
              <div className="text-sm text-slate-800"><span className="font-semibold">{a.code}</span> – {a.name}</div>
              <div className="text-[11px] text-slate-400">{a.city}, {a.country}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Scope3BusinessTravelAir() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const [haul, setHaul]             = useState('')
  const [flightClass, setClass]     = useState('')
  const [rf, setRf]                 = useState('With RF')
  const [unit, setUnit]             = useState('passenger.km')
  const [passengers, setPassengers] = useState('')
  const [origin, setOrigin]         = useState('')
  const [destination, setDest]      = useState('')
  const [ret, setRet]               = useState('One-way')
  const [remarks, setRemarks]       = useState('')

  // Auto distance between the two airports (doubled for a return trip).
  const oneWayKm = origin && destination ? haversineKm(getAirport(origin), getAirport(destination)) : 0
  const isReturn = ret === 'Return (round trip)'
  const km = isReturn ? oneWayKm * 2 : oneWayKm
  const effectiveHaul = haul || haulForKm(km)
  const pax = parseFloat(passengers) || 1
  const passengerKm = pax * km
  const preview = effectiveHaul && flightClass && km
    ? calcTravelAir(effectiveHaul, flightClass, passengerKm, rf)
    : null

  function buildEntry() {
    if (!origin || !destination || !flightClass || !passengers) return null
    const oKm = haversineKm(getAirport(origin), getAirport(destination))
    const totalKm = (ret === 'Return (round trip)') ? oKm * 2 : oKm
    if (!totalKm) return null
    const hl = haul || haulForKm(totalKm)
    const pkm = parseFloat(passengers) * totalKm
    const { ef, tco2e } = calcTravelAir(hl, flightClass, pkm, rf)
    const o = getAirport(origin), d = getAirport(destination)
    const route = `${o?.code || origin} → ${d?.code || destination}${ret === 'Return (round trip)' ? ' (return)' : ''}`
    const e = {
      date: new Date().toISOString().slice(0, 10),
      'Mode of Travel': hl,
      Class: flightClass,
      'RF Type': rf,
      Type: `${hl} - ${flightClass} - ${rf}`,
      'No. of Passengers': passengers,
      'Number of Passenger': passengers,
      'Origin Airport': o ? `${o.code} - ${o.city}` : origin,
      'Destination Airport': d ? `${d.code} - ${d.city}` : destination,
      Route: route,
      'Return Flight': ret,
      'Distance (km)': totalKm,
      'Kilometers Travelled': totalKm,
      Consumption: pkm,
      consumption: pkm,
      Unit: unit,
      'Unit of Measurement': unit,
      Source: 'Defra v 1.0',
      'Emission Factor': ef,
      ef,
      tco2e,
      ghg: tco2e,
      remarks,
    }
    setHaul(''); setClass(''); setRf('With RF'); setUnit('passenger.km'); setPassengers('')
    setOrigin(''); setDest(''); setRet('One-way'); setRemarks('')
    return e
  }

  return (
    <AssessmentForm
      title="Inventory of GHG Emissions from transportation by Air"
      siteCode={siteId} module="businessTravelAir" hideDocument
      emissionLabel="Emission From Air Travel"
      columns={['date', 'Mode of Travel', 'Class', 'RF Type', 'No. of Passengers', 'Route', 'Distance (km)', 'Emission Factor']}
      onPrev={() => navigate(`/sites/${siteId}/scope3/water-treatment`)}
      onNext={() => navigate(`/sites/${siteId}/scope3/business-travel-sea`)}
      onBuildEntry={buildEntry}
      fields={({ onSubmit }) => (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <Select label="Mode of Travel (auto by distance if blank)" value={haul} onChange={setHaul} options={FLIGHT_HAULS} />
            <Select label="Class" value={flightClass} onChange={setClass} options={FLIGHT_CLASSES} required />
            <Select label="Type (Radiative Forcing)" value={rf} onChange={setRf} options={RF_OPTIONS} required />
            <Select label="Unit of Measurement" value={unit} onChange={setUnit} options={TRAVEL_UNITS_AIR} required />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Input label="Number of Passenger" value={passengers} onChange={setPassengers} type="number" required />
            <AirportSearch label="Origin Airport" value={origin} onChange={setOrigin} required />
            <AirportSearch label="Destination Airport" value={destination} onChange={setDest} required />
            <Select label="Return Flight" value={ret} onChange={setRet} options={RETURN_OPTIONS} />
          </div>

          {oneWayKm > 0 && (
            <div className="bg-[#F0F9FF] border border-[#0EA5E9]/30 rounded-xl px-4 py-3 flex items-center justify-between text-sm">
              <span className="text-slate-600">
                Distance {getAirport(origin)?.code} → {getAirport(destination)?.code}
                {isReturn ? ' (return, ×2)' : ''}: <span className="font-bold text-[#0369A1]">{km.toLocaleString()} km</span>
                <span className="text-slate-400"> · {pax} passenger(s) → {passengerKm.toLocaleString()} passenger.km</span>
              </span>
              {effectiveHaul && <span className="text-[11px] text-slate-400">{effectiveHaul}</span>}
            </div>
          )}

          <Input label="Remarks" value={remarks} onChange={setRemarks} placeholder="Route or notes" />
          {preview && <GHGPreview tco2e={preview.tco2e} />}
          <div className="flex gap-3">
            <button onClick={() => onSubmit()} className="bg-[#064E3B] hover:bg-[#065F46] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors">Submit</button>
            <button onClick={() => { onSubmit(); navigate(`/sites/${siteId}/scope3/business-travel-sea`) }} className="border border-slate-200 text-sm text-slate-600 px-4 py-2.5 rounded-xl hover:border-[#10B981] transition-colors">Save &amp; Continue</button>
          </div>
        </div>
      )}
    />
  )
}
