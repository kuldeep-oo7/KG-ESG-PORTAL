import { useReducer, useEffect } from 'react'
import { sumEntries } from '../lib/calculations'
import { GHGContext } from './GHGContextValue'

const STORAGE_KEY = 'kg_ghg_data_v1'

// Demo seed — loaded once when localStorage is empty so the app looks real from day 1
const SEED = {
  'KGIPL-03': {
    stationary: [
      { id: 1001, date: '2026-05-15', Type: 'Natural gas', Unit: 'cubic metres', Consumption: '1173', Source: 'Defra 2025', 'Emission Factor': 2.06672, ef: 2.06672, tco2e: 2.424263 },
    ],
    mobile: [
      { id: 1002, date: '2026-05-08', Type: 'Average car', Unit: 'km', Consumption: '996', Source: 'Defra 2025', 'Emission Factor': 0.17304, ef: 0.17304, tco2e: 0.172305 },
    ],
    employeeCommute: [
      { id: 1003, date: '2026-03-01', 'Vehicle Type': 'Motorbike (Average)', 'Num Passengers': 180, 'km/Day': 12, 'Working Days': 250, 'Two-way': 'Yes', ef: 0.11367, tco2e: 122.471 },
    ],
    wasteDisposal: [
      { id: 1004, date: '2026-04-01', 'Waste Type': 'Commercial and industrial waste', 'Disposal Method': 'Landfill', 'Weight (kg)': 2000, ef: 0.231, tco2e: 0.462 },
    ],
    waterSupply: [
      { id: 1005, date: '2026-04-01', 'Volume (m³)': 450, Source: 'Defra 2025', ef: 0.1913, tco2e: 0.086085 },
    ],
    purchasedGoods: [
      { id: 1006, date: '2026-04-01', 'Material Type': 'Metals', 'Weight (tonnes)': 1.8, ef: 3824.09, tco2e: 6.883362 },
    ],
  },
  'KGIPL-01': {
    mobile: [
      { id: 1007, date: '2026-05-15', Type: 'Average car', Unit: 'km', Consumption: '2929', Source: 'Defra 2025', 'Emission Factor': 0.17304, ef: 0.17304, tco2e: 0.506836 },
    ],
    employeeCommute: [
      { id: 1008, date: '2026-03-01', 'Vehicle Type': 'Average car', 'Num Passengers': 40, 'km/Day': 20, 'Working Days': 250, 'Two-way': 'Yes', ef: 0.17304, tco2e: 69.216 },
    ],
    businessTravelAir: [
      { id: 1009, date: '2026-04-10', Haul: 'Long-haul, to/from UK', 'Flight Class': 'Economy class', 'Distance (km)': 8400, ef: 0.11704, tco2e: 0.983136 },
    ],
    businessTravelLand: [
      { id: 1010, date: '2026-04-15', 'Vehicle Type': 'Average car', 'Distance (km)': 1093, ef: 0.17304, tco2e: 0.189119 },
    ],
  },
  'KGIPL-02': {
    electricity: [
      { id: 1011, date: '2026-01-01', Country: 'India', Unit: 'kWh', Consumption: '329480', Source: 'SLDC 2021', ef: 0.716, tco2e: 236.028 },
      { id: 1012, date: '2026-02-01', Country: 'India', Unit: 'kWh', Consumption: '278400', Source: 'SLDC 2021', ef: 0.716, tco2e: 199.334 },
      { id: 1013, date: '2026-03-01', Country: 'India', Unit: 'kWh', Consumption: '184800', Source: 'SLDC 2021', ef: 0.716, tco2e: 132.317 },
      { id: 1014, date: '2026-04-01', Country: 'India', Unit: 'kWh', Consumption: '184800', Source: 'SLDC 2021', ef: 0.716, tco2e: 132.317 },
      { id: 1015, date: '2026-05-01', Country: 'India', Unit: 'kWh', Consumption: '184800', Source: 'SLDC 2021', ef: 0.716, tco2e: 132.317 },
    ],
    renewable: [
      { id: 1016, date: '2026-01-01', Source: 'Wind (SLDC)', Unit: 'kWh', Consumption: '149640', ef: 0, tco2e: 0 },
      { id: 1017, date: '2026-02-01', Source: 'Wind (SLDC)', Unit: 'kWh', Consumption: '126120', ef: 0, tco2e: 0 },
      { id: 1018, date: '2026-03-01', Source: 'Wind (SLDC)', Unit: 'kWh', Consumption: '220649', ef: 0, tco2e: 0 },
    ],
    employeeCommute: [
      { id: 1019, date: '2026-03-01', 'Vehicle Type': 'Average car', 'Num Passengers': 120, 'km/Day': 15, 'Working Days': 250, 'Two-way': 'Yes', ef: 0.17304, tco2e: 155.736 },
    ],
    tdLoss: [
      { id: 1020, date: '2026-05-01', 'Electricity (kWh)': 184800, Source: 'Defra 2025', ef: 0.01853, tco2e: 3.424344 },
    ],
    foodConsumption: [
      { id: 1021, date: '2026-04-01', 'Food Type': 'Non-Vegetarian', Consumption: '2000', Unit: 'kg', ef: 5.5, tco2e: 11.0 },
    ],
  },
  'KGIPL-05': {
    stationary: [
      { id: 1022, date: '2026-05-19', Type: 'Diesel (average biofuel blend)', Unit: 'litres', Consumption: '300', Source: 'Defra 2025', 'Emission Factor': 2.57082, ef: 2.57082, tco2e: 0.771246 },
    ],
    mobile: [
      { id: 1023, date: '2026-05-08', Type: 'Average car', Unit: 'km', Consumption: '996', Source: 'Defra 2025', 'Emission Factor': 0.17304, ef: 0.17304, tco2e: 0.172305 },
    ],
  },
}

function buildInitialState() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      if (Object.keys(parsed).length > 0) return { entries: parsed }
    } catch {}
  }
  // Seed with demo data on first launch
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED))
  return { entries: SEED }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ENTRY': {
      const { siteCode, module, entry } = action
      const prev = state.entries[siteCode]?.[module] || []
      const updated = {
        ...state.entries,
        [siteCode]: {
          ...(state.entries[siteCode] || {}),
          [module]: [...prev, { ...entry, id: Date.now() }],
        },
      }
      return { entries: updated }
    }
    case 'DELETE_ENTRY': {
      const { siteCode, module, id } = action
      const updated = {
        ...state.entries,
        [siteCode]: {
          ...(state.entries[siteCode] || {}),
          [module]: (state.entries[siteCode]?.[module] || []).filter(e => e.id !== id),
        },
      }
      return { entries: updated }
    }
    case 'CLEAR_MODULE': {
      const { siteCode, module } = action
      const updated = {
        ...state.entries,
        [siteCode]: { ...(state.entries[siteCode] || {}), [module]: [] },
      }
      return { entries: updated }
    }
    default:
      return state
  }
}

export function GHGProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, buildInitialState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.entries))
  }, [state.entries])

  function getEntries(siteCode, module) {
    return state.entries[siteCode]?.[module] || []
  }

  function getModuleTotal(siteCode, module) {
    return sumEntries(getEntries(siteCode, module))
  }

  function getSiteTotal(siteCode) {
    const site = state.entries[siteCode] || {}
    return +Object.values(site).flat().reduce((s, e) => s + (e.tco2e || 0), 0).toFixed(4)
  }

  function getScopeTotal(siteCode, scope) {
    const modules = {
      1: ['stationary', 'mobile', 'fugitive'],
      2: ['electricity', 'heatSteam', 'renewable'],
      3: ['employeeCommute', 'foodConsumption', 'purchasedGoods', 'tdLoss',
          'upstream', 'downstream', 'wasteDisposal', 'waterSupply', 'waterTreatment',
          'businessTravelAir', 'businessTravelSea', 'businessTravelLand', 'hotelStay'],
    }[scope] || []
    return +modules.reduce((s, m) => s + getModuleTotal(siteCode, m), 0).toFixed(4)
  }

  function getAllSiteCodes() {
    return Object.keys(state.entries)
  }

  function addEntry(siteCode, module, entry) {
    dispatch({ type: 'ADD_ENTRY', siteCode, module, entry })
  }

  function deleteEntry(siteCode, module, id) {
    dispatch({ type: 'DELETE_ENTRY', siteCode, module, id })
  }

  return (
    <GHGContext.Provider value={{ getEntries, getModuleTotal, getSiteTotal, getScopeTotal, getAllSiteCodes, addEntry, deleteEntry, allEntries: state.entries }}>
      {children}
    </GHGContext.Provider>
  )
}
