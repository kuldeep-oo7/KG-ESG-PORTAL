// DEFRA 2026 'Freighting goods' factors for Upstream/Downstream bulk import.
// Key = normalized 'Vehicle|Fuel|Class|Type|Unit' (empty parts dropped).
export const FREIGHT_EF = {
// HGV (added from DEFRA 2026 "Freighting goods" — col "Average laden"). All-diesel.
"hgv|rigid (>3.5 - 7.5 tonnes)|tonne.km": 0.54001,
"hgv|rigid (>3.5 - 7.5 tonnes)|km": 0.49944,
"hgv|rigid (>3.5 - 7.5 tonnes)|miles": 0.80376,
"hgv|rigid (>7.5 tonnes-17 tonnes)|tonne.km": 0.43002,
"hgv|rigid (>7.5 tonnes-17 tonnes)|km": 0.60985,
"hgv|rigid (>7.5 tonnes-17 tonnes)|miles": 0.98147,
"hgv|rigid (>17 tonnes)|tonne.km": 0.17256,
"hgv|rigid (>17 tonnes)|km": 0.99773,
"hgv|rigid (>17 tonnes)|miles": 1.60568,
"hgv|all rigids|tonne.km": 0.19947,
"hgv|all rigids|km": 0.84606,
"hgv|all rigids|miles": 1.36159,
"hgv|articulated (>3.5 - 33t)|tonne.km": 0.12292,
"hgv|articulated (>3.5 - 33t)|km": 0.78909,
"hgv|articulated (>3.5 - 33t)|miles": 1.26989,
"hgv|articulated (>33t)|tonne.km": 0.07835,
"hgv|articulated (>33t)|km": 0.93939,
"hgv|articulated (>33t)|miles": 1.51179,
"hgv|all artics|tonne.km": 0.07926,
"hgv|all artics|km": 0.93374,
"hgv|all artics|miles": 1.50269,
"hgv|all hgvs|tonne.km": 0.10356,
"hgv|all hgvs|km": 0.89743,
"hgv|all hgvs|miles": 1.44427,
"hgv refrigerated|rigid (>3.5 - 7.5 tonnes)|tonne.km": 0.64319,
"hgv refrigerated|rigid (>3.5 - 7.5 tonnes)|km": 0.5948,
"hgv refrigerated|rigid (>3.5 - 7.5 tonnes)|miles": 0.95723,
"hgv refrigerated|rigid (>7.5 tonnes-17 tonnes)|tonne.km": 0.51229,
"hgv refrigerated|rigid (>7.5 tonnes-17 tonnes)|km": 0.7263,
"hgv refrigerated|rigid (>7.5 tonnes-17 tonnes)|miles": 1.16886,
"hgv refrigerated|rigid (>17 tonnes)|tonne.km": 0.20547,
"hgv refrigerated|rigid (>17 tonnes)|km": 1.18823,
"hgv refrigerated|rigid (>17 tonnes)|miles": 1.91227,
"hgv refrigerated|all rigids|tonne.km": 0.23753,
"hgv refrigerated|all rigids|km": 1.00762,
"hgv refrigerated|all rigids|miles": 1.6216,
"hgv refrigerated|articulated (>3.5 - 33t)|tonne.km": 0.14215,
"hgv refrigerated|articulated (>3.5 - 33t)|km": 0.91265,
"hgv refrigerated|articulated (>3.5 - 33t)|miles": 1.46874,
"hgv refrigerated|articulated (>33t)|tonne.km": 0.09061,
"hgv refrigerated|articulated (>33t)|km": 1.08648,
"hgv refrigerated|articulated (>33t)|miles": 1.74852,
"hgv refrigerated|all artics|tonne.km": 0.09166,
"hgv refrigerated|all artics|km": 1.07995,
"hgv refrigerated|all artics|miles": 1.73799,
"hgv refrigerated|all hgvs|tonne.km": 0.12122,
"hgv refrigerated|all hgvs|km": 1.05066,
"hgv refrigerated|all hgvs|miles": 1.69087,
"vans|diesel|class i (up to 1.305 tonnes)|tonne.km": 0.87948,
"vans|petrol|class i (up to 1.305 tonnes)|tonne.km": 1.4002,
"vans|battery electric vehicle|class i (up to 1.305 tonnes)|tonne.km": 0.09263,
"vans|diesel|class i (up to 1.305 tonnes)|km": 0.15833,
"vans|petrol|class i (up to 1.305 tonnes)|km": 0.19781,
"vans|battery electric vehicle|class i (up to 1.305 tonnes)|km": 0.02948,
"vans|diesel|class i (up to 1.305 tonnes)|miles": 0.25482,
"vans|petrol|class i (up to 1.305 tonnes)|miles": 0.31834,
"vans|battery electric vehicle|class i (up to 1.305 tonnes)|miles": 0.04744,
"vans|diesel|class ii (1.305 to 1.74 tonnes)|tonne.km": 0.62938,
"vans|petrol|class ii (1.305 to 1.74 tonnes)|tonne.km": 0.79889,
"vans|battery electric vehicle|class ii (1.305 to 1.74 tonnes)|tonne.km": 0.18027,
"vans|diesel|class ii (1.305 to 1.74 tonnes)|km": 0.19376,
"vans|petrol|class ii (1.305 to 1.74 tonnes)|km": 0.20453,
"vans|battery electric vehicle|class ii (1.305 to 1.74 tonnes)|km": 0.04075,
"vans|diesel|class ii (1.305 to 1.74 tonnes)|miles": 0.31183,
"vans|petrol|class ii (1.305 to 1.74 tonnes)|miles": 0.32916,
"vans|battery electric vehicle|class ii (1.305 to 1.74 tonnes)|miles": 0.0656,
"vans|diesel|class iii (1.74 to 3.5 tonnes)|tonne.km": 0.63229,
"vans|petrol|class iii (1.74 to 3.5 tonnes)|tonne.km": 0.81904,
"vans|plug-in hybrid electric vehicle|class iii (1.74 to 3.5 tonnes)|tonne.km": 0.39738,
"vans|battery electric vehicle|class iii (1.74 to 3.5 tonnes)|tonne.km": 0.13252,
"vans|diesel|class iii (1.74 to 3.5 tonnes)|km": 0.28046,
"vans|petrol|class iii (1.74 to 3.5 tonnes)|km": 0.33161,
"vans|plug-in hybrid electric vehicle|class iii (1.74 to 3.5 tonnes)|km": 0.16365,
"vans|battery electric vehicle|class iii (1.74 to 3.5 tonnes)|km": 0.04977,
"vans|diesel|class iii (1.74 to 3.5 tonnes)|miles": 0.45136,
"vans|petrol|class iii (1.74 to 3.5 tonnes)|miles": 0.53367,
"vans|plug-in hybrid electric vehicle|class iii (1.74 to 3.5 tonnes)|miles": 0.26339,
"vans|battery electric vehicle|class iii (1.74 to 3.5 tonnes)|miles": 0.0801,
"vans|diesel|average (up to 3.5 tonnes)|tonne.km": 0.63511,
"vans|petrol|average (up to 3.5 tonnes)|tonne.km": 0.8381,
"vans|cng|average (up to 3.5 tonnes)|tonne.km": 0.62503,
"vans|lpg|average (up to 3.5 tonnes)|tonne.km": 0.68715,
"vans|plug-in hybrid electric vehicle|average (up to 3.5 tonnes)|tonne.km": 0.39716,
"vans|battery electric vehicle|average (up to 3.5 tonnes)|tonne.km": 0.14699,
"vans|diesel|average (up to 3.5 tonnes)|km": 0.25716,
"vans|petrol|average (up to 3.5 tonnes)|km": 0.20905,
"vans|cng|average (up to 3.5 tonnes)|km": 0.25147,
"vans|lpg|average (up to 3.5 tonnes)|km": 0.27647,
"vans|plug-in hybrid electric vehicle|average (up to 3.5 tonnes)|km": 0.16356,
"vans|battery electric vehicle|average (up to 3.5 tonnes)|km": 0.0468,
"vans|diesel|average (up to 3.5 tonnes)|miles": 0.41386,
"vans|petrol|average (up to 3.5 tonnes)|miles": 0.33643,
"vans|cng|average (up to 3.5 tonnes)|miles": 0.4047,
"vans|lpg|average (up to 3.5 tonnes)|miles": 0.44494,
"vans|plug-in hybrid electric vehicle|average (up to 3.5 tonnes)|miles": 0.26324,
"vans|battery electric vehicle|average (up to 3.5 tonnes)|miles": 0.07534,
"freight flights|domestic, to/from uk|with rf|tonne.km": 4.60397,
"freight flights|domestic, to/from uk|without rf|tonne.km": 2.71931,
"freight flights|short-haul, to/from uk|with rf|tonne.km": 1.27835,
"freight flights|short-haul, to/from uk|without rf|tonne.km": 0.75539,
"freight flights|long-haul, to/from uk|with rf|tonne.km": 0.89939,
"freight flights|long-haul, to/from uk|without rf|tonne.km": 0.5313,
"freight flights|international, to/from non-uk|with rf|tonne.km": 0.89939,
"freight flights|international, to/from non-uk|without rf|tonne.km": 0.5313,
"rail|freight train|tonne.km": 0.02583,
"sea tanker|crude tanker - 200,000+ dwt|tonne.km": 0.00294,
"sea tanker|crude tanker - 120,000-199,999 dwt|tonne.km": 0.00445,
"sea tanker|crude tanker - 80,000-119,999 dwt|tonne.km": 0.00597,
"sea tanker|crude tanker - 60,000-79,999 dwt|tonne.km": 0.00759,
"sea tanker|crude tanker - 10,000-59,999 dwt|tonne.km": 0.00921,
"sea tanker|crude tanker - 0-9999 dwt|tonne.km": 0.03371,
"sea tanker|crude tanker - average|tonne.km": 0.00457,
"sea tanker|products tanker - 60,000+ dwt|tonne.km": 0.00577,
"sea tanker|products tanker - 20,000-59,999 dwt|tonne.km": 0.01043,
"sea tanker|products tanker - 10,000-19,999 dwt|tonne.km": 0.01893,
"sea tanker|products tanker - 5000-9999 dwt|tonne.km": 0.02956,
"sea tanker|products tanker - 0-4999 dwt|tonne.km": 0.04556,
"sea tanker|products tanker - average|tonne.km": 0.00902,
"sea tanker|chemical tanker - 20,000+ dwt|tonne.km": 0.0085,
"sea tanker|chemical tanker - 10,000-19,999 dwt|tonne.km": 0.01093,
"sea tanker|chemical tanker - 5000-9999 dwt|tonne.km": 0.01529,
"sea tanker|chemical tanker - 0-4999 dwt|tonne.km": 0.02248,
"sea tanker|chemical tanker - average|tonne.km": 0.01031,
"sea tanker|lng tanker - 200,000+ m3|tonne.km": 0.00942,
"sea tanker|lng tanker - 0-199,999 m3|tonne.km": 0.01468,
"sea tanker|lng tanker - average|tonne.km": 0.01153,
"sea tanker|lpg tanker - 50,000+ m3|tonne.km": 0.00911,
"sea tanker|lpg tanker - 0-49,999 m3|tonne.km": 0.04404,
"sea tanker|lpg tanker - average|tonne.km": 0.01037,
"cargo ship|bulk carrier - 200,000+ dwt|tonne.km": 0.00253,
"cargo ship|bulk carrier - 100,000-199,999 dwt|tonne.km": 0.00304,
"cargo ship|bulk carrier - 60,000-99,999 dwt|tonne.km": 0.00415,
"cargo ship|bulk carrier - 35,000-59,999 dwt|tonne.km": 0.00577,
"cargo ship|bulk carrier - 10,000-34,999 dwt|tonne.km": 0.008,
"cargo ship|bulk carrier - 0-9999 dwt|tonne.km": 0.02956,
"cargo ship|bulk carrier - average|tonne.km": 0.00353,
"cargo ship|general cargo - 10,000+ dwt|tonne.km": 0.01205,
"cargo ship|general cargo - 5000-9999 dwt|tonne.km": 0.016,
"cargo ship|general cargo - 0-4999 dwt|tonne.km": 0.01407,
"cargo ship|general cargo - 10,000+ dwt 100+ teu|tonne.km": 0.01114,
"cargo ship|general cargo - 5000-9999 dwt 100+ teu|tonne.km": 0.01772,
"cargo ship|general cargo - 0-4999 dwt 100+ teu|tonne.km": 0.02005,
"cargo ship|general cargo - average|tonne.km": 0.01321,
"cargo ship|container ship - 8000+ teu|tonne.km": 0.01266,
"cargo ship|container ship - 5000-7999 teu|tonne.km": 0.01681,
"cargo ship|container ship - 3000-4999 teu|tonne.km": 0.01681,
"cargo ship|container ship - 2000-2999 teu|tonne.km": 0.02025,
"cargo ship|container ship - 1000-1999 teu|tonne.km": 0.0325,
"cargo ship|container ship - 0-999 teu|tonne.km": 0.03675,
"cargo ship|container ship - average|tonne.km": 0.01612,
"cargo ship|vehicle transport - 4000+ ceu|tonne.km": 0.0324,
"cargo ship|vehicle transport - 0-3999 ceu|tonne.km": 0.05832,
"cargo ship|vehicle transport - average|tonne.km": 0.03852,
"cargo ship|roro-ferry - 2000+ lm|tonne.km": 0.05012,
"cargo ship|roro-ferry - 0-1999 lm|tonne.km": 0.06105,
"cargo ship|roro-ferry - average|tonne.km": 0.05158,
"cargo ship|large ropax ferry - average|tonne.km": 0.37612,
"cargo ship|refrigerated cargo - all dwt|tonne.km": 0.01306
}

export function freightNorm(s) {
  return String(s == null ? '' : s).toLowerCase().replace(/[\u2013\u2014]/g, '-').replace(/\s+/g, ' ').trim()
}
export function freightKey(parts) {
  return parts.filter(p => p != null && freightNorm(p) !== '').map(freightNorm).join('|')
}
export function lookupFreightEF({ vehicle, fuel, cls, type, unit }) {
  // try with all parts, then without fuel, then without type — robust to which
  // descriptor columns a given vehicle uses
  const tries = [
    [vehicle, fuel, cls, type, unit],
    [vehicle, cls, type, unit],
    [vehicle, cls, unit],
    [vehicle, fuel, cls, unit],
  ]
  for (const t of tries) {
    const k = freightKey(t)
    if (FREIGHT_EF[k] != null) return FREIGHT_EF[k]
  }
  return 0
}

// Sea/cargo ship-type -> activity prefix in FREIGHT_EF.
const SEA_TANKERS = ['crude tanker', 'products tanker', 'chemical tanker', 'lng tanker', 'lpg tanker']
const FLIGHT_HAUL = {
  'domestic': 'domestic, to/from uk',
  'short-haul': 'short-haul, to/from uk',
  'long-haul': 'long-haul, to/from uk',
  'international': 'international, to/from non-uk',
}

// Resolve an emission factor from a FREIGHT_VEHICLE_TYPES dropdown label.
// label examples: "Van - Class I (up to 1.305 tonnes)", "HGV - Rigid (>17 tonnes)",
// "Freight train", "Container ship", "Freight flight - Long-haul".
// Returns { ef, source } so the form can label the entry.
export function lookupFreightByLabel(label, fuel, unit, rf = 'With RF') {
  const L = freightNorm(label)
  const u = freightNorm(unit) || 'tonne.km'
  const get = (key) => FREIGHT_EF[key]
  let ef

  // Map UI fuel labels to the table's fuel names.
  const FUEL_MAP = { 'battery ev': 'battery electric vehicle', 'plug-in hybrid': 'plug-in hybrid electric vehicle' }
  const fuelNorm = FUEL_MAP[freightNorm(fuel)] || fuel

  if (L.startsWith('van - ') || L.startsWith('van -') || L.startsWith('vans')) {
    const cls = L.replace(/^van\s*-\s*/, '')
    ef = lookupFreightEF({ vehicle: 'vans', fuel: fuelNorm, cls, unit: u })
  } else if (L.startsWith('hgv')) {
    const cls = L.replace(/^hgv\s*-\s*/, '')
    ef = lookupFreightEF({ vehicle: 'hgv', cls, unit: u })
  } else if (L === 'freight train') {
    ef = get(`rail|freight train|${u}`)
  } else if (L.startsWith('freight flight')) {
    const haulKey = Object.keys(FLIGHT_HAUL).find(h => L.includes(h))
    const haul = haulKey ? FLIGHT_HAUL[haulKey] : 'domestic, to/from uk'
    ef = get(`freight flights|${haul}|${freightNorm(rf)}|${u}`)
  } else {
    // Sea — tanker vs cargo ship; default to the type's "average" size
    const prefix = SEA_TANKERS.includes(L) ? 'sea tanker' : 'cargo ship'
    ef = get(`${prefix}|${L} - average|${u}`) ?? get(`${prefix}|${L} - all dwt|${u}`)
  }

  return { ef: ef ?? 0, source: 'DEFRA 2026' }
}
