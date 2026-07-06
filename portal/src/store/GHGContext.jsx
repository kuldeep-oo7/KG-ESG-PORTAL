import { useState, useEffect } from 'react'
import {
  sumEntries,
  calcStationary,
  calcMobile,
  calcFugitive,
  calcElectricity,
  calcHeatSteam,
  calcWaterSupply,
  calcWaterTreatment,
  calcTDLoss,
  calcCommute,
  calcTravelAir,
  calcTravelSea,
  calcTravelLand,
  calcHotel,
  calcGoods,
  calcWaste,
  calcFood,
  calcFreight
} from '../lib/calculations'
import { GHGContext } from './GHGContextValue'
import { SEED } from './SEED'
import { SITES } from '../data/ghgData'
import { FOOD_UNIT_BY_TYPE } from '../lib/constants'
import { apiUrl, API_ENABLED } from '../lib/api'

// LocalStorage Fallback Helpers
const LS_SITES_KEY = 'kg_sites_v3_fallback'
const LS_ENTRIES_KEY = 'kg_entries_v3_fallback'

function getLocalSites(email) {
  try {
    const raw = localStorage.getItem(`${LS_SITES_KEY}_${email}`)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
    // No (meaningful) saved data — fall back to the bundled demo sites for any user
    return SITES
  } catch {
    return SITES
  }
}
function saveLocalSites(email, data) {
  try { localStorage.setItem(`${LS_SITES_KEY}_${email}`, JSON.stringify(data)) } catch (e) { console.warn(e) }
}
function getLocalEntries(email) {
  try {
    const raw = localStorage.getItem(`${LS_ENTRIES_KEY}_${email}`)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && Object.keys(parsed).length > 0) return parsed
    }
    // No (meaningful) saved data — fall back to the bundled seed data for any user
    return SEED
  } catch {
    return SEED
  }
}
function saveLocalEntries(email, data) {
  try { localStorage.setItem(`${LS_ENTRIES_KEY}_${email}`, JSON.stringify(data)) } catch (e) { console.warn(e) }
}

// One-time restore of ORIGINAL (seed) data, matched by stable `id` (1..~2052);
// user-added entries use Date.now() ids so they are always preserved. Runs once
// per account per version.
//   • Scope 3 modules: rebuilt to the EXACT reported seed values (old calculations),
//     because earlier loads may have persisted new-factor recalcs over the old data.
//   • Other (Scope 1/2) modules: only re-add missing seed rows (they were correct).
const SEED_RESTORE_VERSION = 'v2'
const isSeedId = (e) => e && typeof e.id === 'number' && e.id < 1e11
function restoreDeletedSeed(email, stored) {
  try {
    const flagKey = `kg_seed_restore_${SEED_RESTORE_VERSION}_${email}`
    if (localStorage.getItem(flagKey)) return stored
    const merged = stored ? JSON.parse(JSON.stringify(stored)) : {}
    let changed = 0
    for (const site of Object.keys(SEED)) {
      merged[site] = merged[site] || {}
      for (const mod of Object.keys(SEED[site])) {
        const seedList = SEED[site][mod] || []
        const curList = Array.isArray(merged[site][mod]) ? merged[site][mod] : []
        if (SCOPE3_MODULES.has(mod)) {
          // exact old-calculation seed values + any new (user-added) entries
          const userAdded = curList.filter(e => !isSeedId(e))
          merged[site][mod] = [...seedList, ...userAdded]
          changed += seedList.length
        } else {
          const haveIds = new Set(curList.map(e => e && e.id))
          const restored = curList.slice()
          for (const se of seedList) if (!haveIds.has(se.id)) { restored.push(se); changed++ }
          merged[site][mod] = restored
        }
      }
    }
    localStorage.setItem(flagKey, String(changed))
    if (changed > 0) { saveLocalEntries(email, merged); console.info(`[KG] Restored original Scope 3 (old-calculation) data.`) }
    return changed > 0 ? merged : stored
  } catch (e) {
    console.warn('seed restore failed', e)
    return stored
  }
}

// Scope 3 modules — OLD (seed) rows in these keep their original reported values.
const SCOPE3_MODULES = new Set([
  'employeeCommute', 'foodConsumption', 'purchasedGoods', 'tdLoss', 'upstream',
  'downstream', 'wasteDisposal', 'waterSupply', 'waterTreatment',
  'businessTravelAir', 'businessTravelSea', 'businessTravelLand', 'hotelStay',
])

function recalculateAllEntries(allEntries) {
  if (!allEntries) return allEntries
  let changed = false
  const updated = {}

  for (const siteCode of Object.keys(allEntries)) {
    const siteData = allEntries[siteCode] || {}
    const updatedSite = {}

    for (const module of Object.keys(siteData)) {
      const list = siteData[module] || []
      const updatedList = list.map(entry => {
        // Scope 3 OLD (seed) data keeps its original reported values — never re-run
        // new-factor calculations on it. Seed ids are small ints (1..~2052); new
        // entries use Date.now() ids and continue to use the new factors.
        const isSeedEntry = typeof entry.id === 'number' && entry.id < 1e11
        if (isSeedEntry && SCOPE3_MODULES.has(module)) return entry
        const currentEf = entry.ef ?? entry['Emission Factor'] ?? 0
        const isWalkCycle = (entry.Type || entry.type || '').toLowerCase().includes('walk') || (entry.Type || entry.type || '').toLowerCase().includes('cycle')
        const isRenewable = entry.isRenewable || entry.accounting === 'market' || (entry.category === 'Renewable Electricity Generation')
        const consumption = parseFloat(entry.Consumption ?? entry.consumption ?? entry.Volume ?? entry['Volume (m³)'] ?? entry['Weight (kg)'] ?? entry['Weight (tonnes)'] ?? entry.Generation ?? entry.Nights ?? entry.Rooms ?? entry.Tonnes ?? entry['Distance (km)'] ?? entry['Distance Travelled'] ?? entry['km Travelled'] ?? 0)

        // Some factor tables/labels were corrected after entries were saved (T&D ->
        // DEFRA 2026 0.01299; Food -> UNFCCC source + per-serving units). Refresh those
        // modules on load so old rows show the corrected factor/source/unit.
        // Recompute-on-read only — stored consumption is never overwritten.
        const forceRecalc = module === 'tdLoss' || module === 'foodConsumption'
        if (!forceRecalc && currentEf !== 0 && currentEf !== '0.00000' && currentEf !== null && currentEf !== undefined) {
          return entry
        }
        if (isWalkCycle || isRenewable || consumption === 0) {
          return entry
        }

        const type = entry.Type || entry.type || ''
        const unit = entry.Unit || entry.unit || ''
        let res = null

        const cleanType = type.replace(/^(Gaseous|Liquid|Solid) fuels - /i, '').replace(/^Bioenergy - /i, '').trim()

        switch (module) {
          case 'stationary':
            res = calcStationary(cleanType, unit, consumption)
            break
          case 'mobile':
            res = calcMobile(type, unit, consumption)
            break
          case 'fugitive': {
            const ref = type.replace(/^Refrigerants - /i, '').trim()
            res = calcFugitive(ref, consumption)
            break
          }
          case 'electricity': {
            let country = entry.Country || entry.country || entry['Name of Country'] || ''
            if (!country || country === 'kWh') {
              if (siteCode === 'KGIPL-01' || siteCode === 'KGIPL-02' || siteCode === 'KGIPL-03') {
                country = 'India'
              } else if (siteCode === 'KGIPL-04') {
                country = 'United Arab Emirates'
              } else if (siteCode === 'KGIPL-05') {
                country = 'Botswana'
              } else {
                country = 'India'
              }
            }
            res = calcElectricity(country, unit, consumption, false)
            break
          }
          case 'heatSteam':
            res = calcHeatSteam(type, unit, consumption)
            break
          case 'employeeCommute': {
            const km = parseFloat(entry['km Travelled'] || entry['km_per_day'] || entry.kmPerDay || 0)
            const mode = type.replace(/^Cars \(by size\) - /i, '').replace(/^Bus - /i, '').replace(/^Rail - /i, '').replace(/^Taxis - /i, '').trim()
            res = calcCommute(mode, 1, km, 1, false)
            break
          }
          case 'businessTravelAir': {
            const flightClass = entry.Class || entry.class || ''
            const rf = entry['RF Type'] || entry.rfType || 'With RF'
            res = calcTravelAir(type, flightClass, consumption, rf)
            break
          }
          case 'businessTravelLand':
            res = calcTravelLand(type, consumption)
            break
          case 'businessTravelSea':
            res = calcTravelSea(type, consumption)
            break
          case 'wasteDisposal': {
            const wasteType = entry['Type of Goods'] || entry.Type || entry.type || ''
            const method = entry.Loop || entry.loop || entry.Method || entry.method || ''
            let weightKg = consumption
            if (unit.toLowerCase() === 'tonnes') {
              weightKg = consumption * 1000
            }
            res = calcWaste(wasteType, method, weightKg)
            break
          }
          case 'waterSupply':
            res = calcWaterSupply(consumption)
            break
          case 'waterTreatment':
            res = calcWaterTreatment(consumption, unit)
            break
          case 'tdLoss': {
            let country = entry.Country || entry.country || entry['Name of Country'] || ''
            res = calcTDLoss(country, unit, consumption)
            break
          }
          case 'purchasedGoods': {
            const loop = entry.Loop || entry.loop || 'Primary material production'
            res = calcGoods(type, loop, consumption)
            break
          }
          case 'hotelStay':
            res = calcHotel(type, consumption)
            break
          case 'foodConsumption':
            res = calcFood(type, consumption)
            break
          case 'upstream':
          case 'downstream': {
            const vType = entry['Type of Vehicle'] || entry.vehicleType || ''
            const fType = entry['Type of Fuel'] || entry.fuelType || ''
            const cls = entry.Class || entry.class || ''
            const tonnes = parseFloat(entry.Tonnes || 0)
            const dist = parseFloat(entry['Distance Travelled'] || 0)
            res = calcFreight(vType, fType, cls, type, unit, tonnes, dist)
            break
          }
          default:
            break
        }

        if (res) {
          changed = true
          return {
            ...entry,
            ef: res.ef,
            tco2e: res.tco2e,
            'Emission Factor': res.ef,
            ghg: res.tco2e,
            ...(module === 'tdLoss' ? { Source: 'DEFRA 2026' } : {}),
            ...(module === 'foodConsumption' ? {
              Source: 'UNFCCC',
              'Unit of Measurement': FOOD_UNIT_BY_TYPE[type] || entry['Unit of Measurement'] || 'serving',
            } : {}),
          }
        }
        return entry
      })
      updatedSite[module] = updatedList
    }
    updated[siteCode] = updatedSite
  }

  return changed ? updated : allEntries
}

export function GHGProvider({ children }) {
  const [currentUserEmail, setCurrentUserEmail] = useState(() => {
    const raw = localStorage.getItem('kg_current_user_v1')
    return raw ? JSON.parse(raw)?.email : null
  })
  
  const [sites, setSites] = useState([])
  const [entries, setEntries] = useState({})
  const [loading, setLoading] = useState(true)

  // Listen to changes in the active user in localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      const raw = localStorage.getItem('kg_current_user_v1')
      const email = raw ? JSON.parse(raw)?.email : null
      if (email !== currentUserEmail) {
        setCurrentUserEmail(email)
      }
    }, 500)
    return () => clearInterval(interval)
  }, [currentUserEmail])

  // Fetch user-scoped sites and entries on user email changes
  useEffect(() => {
    if (!currentUserEmail) {
      Promise.resolve().then(() => {
        setSites([])
        setEntries({})
        setLoading(false)
      })
      return
    }

    Promise.resolve().then(() => {
      setLoading(true)
    })

    if (!API_ENABLED) {
      const localSites = getLocalSites(currentUserEmail)
      const localEntries = restoreDeletedSeed(currentUserEmail, getLocalEntries(currentUserEmail))
      Promise.resolve().then(() => {
        setSites(localSites)
        setEntries(recalculateAllEntries(localEntries))
        setLoading(false)
      })
      return
    }

    // Load sites
    fetch(apiUrl(`/api/sites?email=${encodeURIComponent(currentUserEmail)}`))
      .then(res => {
        if (!res.ok) throw new Error('API Error')
        return res.json()
      })
      .then(sitesData => {
        setSites(sitesData)
      })
      .catch(() => {
        // Fallback to local storage
        const local = getLocalSites(currentUserEmail)
        setSites(local)
      })

    // Load GHG entries
    fetch(apiUrl(`/api/ghg-entries?email=${encodeURIComponent(currentUserEmail)}`))
      .then(res => {
        if (!res.ok) throw new Error('API Error')
        return res.json()
      })
      .then(entriesData => {
        const recalculated = recalculateAllEntries(entriesData)
        setEntries(recalculated)
        setLoading(false)
      })
      .catch(() => {
        // Fallback to local storage
        const local = getLocalEntries(currentUserEmail)
        const recalculated = recalculateAllEntries(local)
        setEntries(recalculated)
        setLoading(false)
      })
  }, [currentUserEmail])

  function getEntries(siteCode, module) {
    return entries[siteCode]?.[module] || []
  }

  function getModuleTotal(siteCode, module) {
    return sumEntries(getEntries(siteCode, module))
  }

  // Helper for safety checks on calculations when site has no entries
  function getSiteTotal(siteCode) {
    const site = entries[siteCode] || {}
    return +Object.values(site).flat().reduce((s, e) => s + (e.tco2e || 0), 0).toFixed(4)
  }

  function getScopeTotal(siteCode, scope) {
    const modules = {
      1: ['stationary', 'mobile', 'fugitive'],
      2: ['electricity', 'heatSteam'],
      3: ['employeeCommute', 'foodConsumption', 'purchasedGoods', 'tdLoss',
          'upstream', 'downstream', 'wasteDisposal', 'waterSupply', 'waterTreatment',
          'businessTravelAir', 'businessTravelSea', 'businessTravelLand', 'hotelStay'],
    }[scope] || []
    return +modules.reduce((s, m) => s + getModuleTotal(siteCode, m), 0).toFixed(4)
  }

  function getAvoidedTotal(siteCode) {
    return getModuleTotal(siteCode, 'renewable')
  }

  function getAllSiteCodes() {
    return Object.keys(entries)
  }

  async function addEntry(siteCode, module, entry) {
    if (!currentUserEmail) return
    if (API_ENABLED) {
      try {
        const response = await fetch(apiUrl('/api/ghg-entries'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: currentUserEmail,
            siteCode,
            module,
            entry
          })
        })
        if (response.ok) {
          const savedEntry = await response.json()
          setEntries(prev => {
            const prevList = prev[siteCode]?.[module] || []
            return {
              ...prev,
              [siteCode]: {
                ...(prev[siteCode] || {}),
                [module]: [...prevList, savedEntry]
              }
            }
          })
          return
        }
      } catch { /* ignore and use fallback */ }
    }

    // Fallback path (also used when no backend API is configured)
    const savedEntry = { ...entry, id: Date.now() }
    setEntries(prev => {
      const prevList = prev[siteCode]?.[module] || []
      const next = {
        ...prev,
        [siteCode]: {
          ...(prev[siteCode] || {}),
          [module]: [...prevList, savedEntry]
        }
      }
      saveLocalEntries(currentUserEmail, next)
      return next
    })
  }

  async function deleteEntry(siteCode, module, id) {
    if (!currentUserEmail) return
    if (API_ENABLED) {
      try {
        const response = await fetch(apiUrl(`/api/ghg-entries/${id}?email=${encodeURIComponent(currentUserEmail)}`), {
          method: 'DELETE'
        })
        if (response.ok) {
          setEntries(prev => {
            const prevList = prev[siteCode]?.[module] || []
            return {
              ...prev,
              [siteCode]: {
                ...(prev[siteCode] || {}),
                [module]: prevList.filter(e => e.id !== id)
              }
            }
          })
          return
        }
      } catch { /* ignore and use fallback */ }
    }

    // Fallback path (also used when no backend API is configured)
    setEntries(prev => {
      const prevList = prev[siteCode]?.[module] || []
      const next = {
        ...prev,
        [siteCode]: {
          ...(prev[siteCode] || {}),
          [module]: prevList.filter(e => e.id !== id)
        }
      }
      saveLocalEntries(currentUserEmail, next)
      return next
    })
  }

  async function updateEntry(siteCode, module, id, patch) {
    if (!currentUserEmail) return
    const applyPatch = (prev) => {
      const prevList = prev[siteCode]?.[module] || []
      return {
        ...prev,
        [siteCode]: {
          ...(prev[siteCode] || {}),
          [module]: prevList.map(e => (e.id === id ? { ...e, ...patch } : e))
        }
      }
    }

    if (API_ENABLED) {
      try {
        const response = await fetch(apiUrl(`/api/ghg-entries/${id}`), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: currentUserEmail, siteCode, module, patch })
        })
        if (response.ok) {
          setEntries(prev => applyPatch(prev))
          return
        }
      } catch { /* ignore and use fallback */ }
    }

    // Fallback path (also used when no backend API is configured)
    setEntries(prev => {
      const next = applyPatch(prev)
      saveLocalEntries(currentUserEmail, next)
      return next
    })
  }

  async function addSite(siteData) {
    if (!currentUserEmail) return
    try {
      const nextNum = sites.length + 1
      const code = `KGIPL-0${nextNum}`

      const response = await fetch(apiUrl('/api/sites'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUserEmail,
          code,
          name: siteData.name,
          type: siteData.type,
          city: siteData.city,
          country: siteData.country,
          address: siteData.address,
          country_code: siteData.country === 'India' ? 'IN'
                      : siteData.country === 'UAE' ? 'AE'
                      : siteData.country === 'Botswana' ? 'BW'
                      : 'IN'
        })
      })
      if (response.ok) {
        const savedSite = await response.json()
        setSites(prev => [...prev, savedSite])
        return savedSite
      }
    } catch { /* ignore and fallback */ }

    // Fallback path
    const nextNum = sites.length + 1
    const code = `KGIPL-0${nextNum}`
    const savedSite = {
      code,
      name: siteData.name,
      type: siteData.type,
      city: siteData.city,
      country: siteData.country,
      address: siteData.address,
      country_code: siteData.country === 'India' ? 'IN'
                  : siteData.country === 'UAE' ? 'AE'
                  : siteData.country === 'Botswana' ? 'BW'
                  : 'IN'
    }
    const nextSites = [...sites, savedSite]
    setSites(nextSites)
    saveLocalSites(currentUserEmail, nextSites)
    return savedSite
  }

  async function updateSite(siteData) {
    if (!currentUserEmail) return
    try {
      const response = await fetch(apiUrl('/api/sites'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUserEmail,
          code: siteData.code,
          name: siteData.name,
          type: siteData.type,
          city: siteData.city,
          country: siteData.country,
          address: siteData.address,
          country_code: siteData.country === 'India' ? 'IN'
                      : siteData.country === 'UAE' ? 'AE'
                      : siteData.country === 'Botswana' ? 'BW'
                      : 'IN'
        })
      })
      if (response.ok) {
        const savedSite = await response.json()
        setSites(prev => prev.map(s => s.code === siteData.code ? savedSite : s))
        return savedSite
      }
    } catch { /* ignore and fallback */ }

    // Fallback path
    const savedSite = {
      code: siteData.code,
      name: siteData.name,
      type: siteData.type,
      city: siteData.city,
      country: siteData.country,
      address: siteData.address,
      country_code: siteData.country === 'India' ? 'IN'
                  : siteData.country === 'UAE' ? 'AE'
                  : siteData.country === 'Botswana' ? 'BW'
                  : 'IN'
    }
    const nextSites = sites.map(s => s.code === siteData.code ? savedSite : s)
    setSites(nextSites)
    saveLocalSites(currentUserEmail, nextSites)
    return savedSite
  }

  async function deleteSite(code) {
    if (!currentUserEmail) return
    try {
      const response = await fetch(apiUrl(`/api/sites?email=${encodeURIComponent(currentUserEmail)}&code=${encodeURIComponent(code)}`), {
        method: 'DELETE'
      })
      if (response.ok) {
        setSites(prev => prev.filter(s => s.code !== code))
        setEntries(prev => {
          const next = { ...prev }
          delete next[code]
          return next
        })
        return
      }
    } catch { /* ignore and fallback */ }

    // Fallback path
    const nextSites = sites.filter(s => s.code !== code)
    setSites(nextSites)
    saveLocalSites(currentUserEmail, nextSites)
    setEntries(prev => {
      const next = { ...prev }
      delete next[code]
      saveLocalEntries(currentUserEmail, next)
      return next
    })
  }

  return (
    <GHGContext.Provider value={{
      sites,
      loading,
      getEntries,
      getModuleTotal,
      getSiteTotal,
      getScopeTotal,
      getAvoidedTotal,
      getAllSiteCodes,
      addEntry,
      deleteEntry,
      updateEntry,
      addSite,
      updateSite,
      deleteSite,
      allEntries: entries
    }}>
      {children}
    </GHGContext.Provider>
  )
}
