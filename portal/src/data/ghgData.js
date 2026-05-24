// K. Girdharlal International — GHG data from ESGTech.ai portal (CY 2026)
// Calculations follow: GHG (tCO2e) = Consumption × EmissionFactor / 1000

export const SITES = [
  { code: 'KGIPL-01', name: 'K. Girdharlal International Pvt. Ltd.', type: 'Corporate Office', city: 'Mumbai', country: 'India', country_code: 'IN', address: 'EE-9012, Bharat Diamond Bourse, Bandra Kurla Complex, Bandra (E), Mumbai, Maharashtra, India - 400051' },
  { code: 'KGIPL-02', name: 'K. Girdharlal International Private Limited (Branch Office)', type: 'Branch Office', city: 'Surat', country: 'India', country_code: 'IN', address: '2nd Floor, X-03-05, Gujarat Hira Bourne Gem & Jewellery Park, Hazira Road, Ichchapore GIDC, Surat, Gujarat, India - 394510' },
  { code: 'KGIPL-03', name: 'Facets Gems Polishing Works Pvt. Ltd.', type: 'Factory', city: 'Surat', country: 'India', country_code: 'IN', address: 'X-03-05, Gujarat Hira Bourne Gem & Jewellery Park, Hazira Road, Ichchapore GIDC, Surat, Gujarat, India - 394510' },
  { code: 'KGIPL-04', name: 'K. Girdharlal DMCC', type: 'Sales Office', city: 'Dubai', country: 'United Arab Emirates', country_code: 'AE', address: 'Unit No: AG-03-C, AG Tower, Plot No: 01 JLT ITA, Jumeirah Lakes Towers, DUBAI, Dubai, United Arab Emirates - 44753' },
  { code: 'KGIPL-05', name: 'KG Mfg Botswana Proprietary Ltd.', type: 'Branch Office', city: 'Gaborone', country: 'Botswana', country_code: 'BW', address: 'Plot 64260, Unit B4, Phakathe Road, Block 3 Industrial, Gaborone, Botswana-2307AAD, Southern District, Botswana - 2307' },
]

// Emission Factors (kgCO2e per unit) — from calculation_engine.py
export const EF = {
  scope1_stationary: {
    'Diesel/Litres': 2.680, 'Petrol/Litres': 2.310,
    'LPG/Litres': 2.983, 'LPG/kg': 2.983,
    'CNG/m3': 1.960, 'CNG/kg': 2.790,
    'Natural Gas/m3': 2.020, 'Coal/kg': 2.420,
    'Furnace Oil/Litres': 3.150, 'Biomass/kg': 0.000,
  },
  scope1_mobile: {
    'Diesel/Litres': 2.680, 'Petrol/Litres': 2.310,
    'CNG/kg': 2.790, 'CNG/m3': 1.960,
    'LPG/Litres': 2.983,
    // per-km (average car)
    'Diesel/km': 0.17304, 'Petrol/km': 0.16272, 'Hybrid/km': 0.10500,
  },
  scope1_fugitive: {
    'R-410A': 2088, 'R-22': 1810, 'R-32': 675,
    'R-134a': 1430, 'R-407C': 1774, 'R-404A': 3943,
  },
  scope2_grid: { IN: 0.716, AE: 0.450, BW: 1.050, default: 0.500 },
  scope3_commute: {
    'Motorbike': 0.114, 'Car': 0.192, 'Car (Petrol)': 0.192,
    'Car (Diesel)': 0.171, 'Car (CNG)': 0.132, 'Bus': 0.089,
    'Auto Rickshaw': 0.132, 'Electric Vehicle': 0.050,
    'Train': 0.041, 'Metro': 0.041, 'Walk/Cycle': 0.000,
  },
  scope3_travel: {
    'Flight Economy': 0.255, 'Flight Business': 0.510, 'Flight First': 0.765,
    'Car (Petrol)': 0.192, 'Car (Diesel)': 0.171, 'Train': 0.041, 'Bus': 0.089,
  },
  scope3_waste: { 'Landfill': 0.467, 'Recycling': 0.021, 'Incineration': 0.021, 'Composting': 0.010 },
  scope3_water: { 'Municipal Supply': 0.344, 'Groundwater': 0.100, 'Rainwater': 0.000 },
}

// ── Actual portal data (CY 2026, FY Apr2026–Mar2027) ──────────────────────────

export const SCOPE1_ENTRIES = [
  // Stationary Combustion
  { id: 1, date: '2026-05-15', site: 'KGIPL-03', category: 'Stationary Combustion', type: 'Gaseous Fuels – Natural gas', unit: 'm3', consumption: 1173, ef: 2.06672, ghg: 2.424263 },
  { id: 2, date: '2026-05-19', site: 'KGIPL-05', category: 'Stationary Combustion', type: 'Liquid fuels – Diesel', unit: 'litres', consumption: 300, ef: 2.57082, ghg: 0.771246 },
  // Mobile Combustion
  { id: 3, date: '2026-05-08', site: 'KGIPL-05', category: 'Mobile Combustion', type: 'Petrol – Average car', unit: 'km', consumption: 996, ef: 0.16272, ghg: 0.162069 },
  { id: 4, date: '2026-05-15', site: 'KGIPL-01', category: 'Mobile Combustion', type: 'Diesel – Average car', unit: 'km', consumption: 2929, ef: 0.17304, ghg: 0.506834 },
]

export const SCOPE2_ENTRIES = [
  // Renewable Electricity (avoided — market-based = 0 GHG)
  { id: 10, date: '2026-01-01', site: 'KGIPL-02', category: 'Renewable Electricity Generation', source: 'Wind (SLDC)', kwh: 149640, ef: 0, ghg: 0 },
  { id: 11, date: '2026-02-01', site: 'KGIPL-02', category: 'Renewable Electricity Generation', source: 'Wind (SLDC)', kwh: 126120, ef: 0, ghg: 0 },
  { id: 12, date: '2026-03-01', site: 'KGIPL-02', category: 'Renewable Electricity Generation', source: 'Wind (SLDC)', kwh: 220649, ef: 0, ghg: 0 },
  { id: 13, date: '2026-04-01', site: 'KGIPL-02', category: 'Renewable Electricity Generation', source: 'Wind (SLDC)', kwh: 168000, ef: 0, ghg: 0 },
  { id: 14, date: '2026-05-01', site: 'KGIPL-02', category: 'Renewable Electricity Generation', source: 'Wind (SLDC)', kwh: 154592, ef: 0, ghg: 0 },
  // Imported electricity (grid)
  { id: 20, date: '2026-01-01', site: 'KGIPL-02', category: 'Imported Electricity', source: 'Grid (IN)', kwh: 329480, ef: 0.716, ghg: 236.028 },
  { id: 21, date: '2026-02-01', site: 'KGIPL-02', category: 'Imported Electricity', source: 'Grid (IN)', kwh: 278400, ef: 0.716, ghg: 199.334 },
  { id: 22, date: '2026-03-01', site: 'KGIPL-02', category: 'Imported Electricity', source: 'Grid (IN)', kwh: 184800, ef: 0.716, ghg: 132.317 },
  { id: 23, date: '2026-04-01', site: 'KGIPL-02', category: 'Imported Electricity', source: 'Grid (IN)', kwh: 184800, ef: 0.716, ghg: 132.317 },
  { id: 24, date: '2026-05-01', site: 'KGIPL-02', category: 'Imported Electricity', source: 'Grid (IN)', kwh: 184800, ef: 0.716, ghg: 132.317 },
]

export const SCOPE3_ENTRIES = [
  // Employee Commute — 84.85%
  { id: 30, site: 'KGIPL-02', category: 'Employee Commute', mode: 'Car (bus lot)', num: 120, km: 15, days: 250, twoWay: true, ghg: 4.239 },
  { id: 31, site: 'KGIPL-03', category: 'Employee Commute', mode: 'Motorbike', num: 180, km: 12, days: 250, twoWay: true, ghg: 122.472 },
  { id: 32, site: 'KGIPL-01', category: 'Employee Commute', mode: 'Car (Petrol)', num: 40, km: 20, days: 250, twoWay: true, ghg: 76.800 },
  // Food Consumption — 4.43%
  { id: 35, site: 'KGIPL-03', category: 'Food Consumption', ghg: 10.623 },
  // Transmission & Distribution Loss — 4.87%
  { id: 60, site: 'KGIPL-02', category: 'Transmission & Distribution Loss', ghg: 11.680 },
  // Purchased Goods — 2.87%
  { id: 50, site: 'KGIPL-03', category: 'Purchased Goods', ghg: 6.884 },
  // Business Travel (Air) — 0.92%
  { id: 41, site: 'KGIPL-01', category: 'Business Travel (Air)', mode: 'Long-haul Economy', km: 8400, ghg: 2.207 },
  // Business Travel (Land) — 0.65%
  { id: 40, site: 'KGIPL-01', category: 'Business Travel (Land)', mode: 'Car (Petrol)', km: 1093, ghg: 1.559 },
  // Waste Disposal — 0.83%
  { id: 70, site: 'KGIPL-03', category: 'Waste Disposal', method: 'Landfill', kg: 2000, ghg: 1.663 },
  { id: 71, site: 'KGIPL-03', category: 'Waste Disposal', method: 'Recycling', kg: 1500, ghg: 0.327 },
]

// ── Aggregated Totals (from portal report page) ──────────────────────────────

export const REPORT_TOTALS = {
  total:           390.262226,
  avoided:         228.675707,
  scope1:          3.864412,
  scope2:          370.841601,
  scope3:          15.556213,
}

// ── Dashboard totals (CY 2026 full year) ────────────────────────────────────
export const DASHBOARD_TOTALS = {
  total:   1059.98,
  scope1:  14.44,
  scope2:  798.32,
  scope3:  247.23,
  scope1_pct: 1.36,
  scope2_pct: 75.31,
  scope3_pct: 23.32,
}

// ── Monthly Scope 1 data (tCO2e) ─────────────────────────────────────────────
export const MONTHLY_SCOPE1 = [
  { month: 'Jan', stationary: 0.8,  mobile: 0.3,  fugitive: 0 },
  { month: 'Feb', stationary: 0.9,  mobile: 0.4,  fugitive: 0 },
  { month: 'Mar', stationary: 1.1,  mobile: 0.5,  fugitive: 0 },
  { month: 'Apr', stationary: 1.2,  mobile: 0.6,  fugitive: 0.1 },
  { month: 'May', stationary: 3.20, mobile: 0.67, fugitive: 0 },
  { month: 'Jun', stationary: 0,    mobile: 0,    fugitive: 0 },
  { month: 'Jul', stationary: 0,    mobile: 0,    fugitive: 0 },
  { month: 'Aug', stationary: 0,    mobile: 0,    fugitive: 0 },
  { month: 'Sep', stationary: 0,    mobile: 0,    fugitive: 0 },
  { month: 'Oct', stationary: 0,    mobile: 0,    fugitive: 0 },
  { month: 'Nov', stationary: 0,    mobile: 0,    fugitive: 0 },
  { month: 'Dec', stationary: 0,    mobile: 0,    fugitive: 0 },
]

// ── Monthly Scope 2 data (kWh) ────────────────────────────────────────────────
export const MONTHLY_SCOPE2 = [
  { month: 'Jan', renewable: 149640, imported: 329480, total: 236.028 },
  { month: 'Feb', renewable: 126120, imported: 278400, total: 199.334 },
  { month: 'Mar', renewable: 220649, imported: 184800, total: 132.317 },
  { month: 'Apr', renewable: 168000, imported: 184800, total: 132.317 },
  { month: 'May', renewable: 154592, imported: 184800, total: 132.317 },
  { month: 'Jun', renewable: 0,      imported: 0,      total: 0 },
  { month: 'Jul', renewable: 0,      imported: 0,      total: 0 },
  { month: 'Aug', renewable: 0,      imported: 0,      total: 0 },
  { month: 'Sep', renewable: 0,      imported: 0,      total: 0 },
  { month: 'Oct', renewable: 0,      imported: 0,      total: 0 },
  { month: 'Nov', renewable: 0,      imported: 0,      total: 0 },
  { month: 'Dec', renewable: 0,      imported: 0,      total: 0 },
]

// ── Scope 3 breakdown (%) ──────────────────────────────────────────────────
const SCOPE3_COLORS = {
  'Employee Commute': '#1D4ED8',
  'Food Consumption': '#10B981',
  'Transmission & Distribution Loss': '#F59E0B',
  'Purchased Goods': '#EF4444',
  'Business Travel (Air)': '#8B5CF6',
  'Business Travel (Land)': '#06B6D4',
  'Waste Disposal': '#EC4899',
  'Water Supply': '#A7F3D0',
}

const SCOPE3_CATEGORY_TOTALS = Object.values(
  SCOPE3_ENTRIES.reduce((acc, entry) => {
    const current = acc[entry.category] || {
      name: entry.category,
      value: 0,
      color: SCOPE3_COLORS[entry.category] || '#D1FAE5',
    }
    acc[entry.category] = {
      ...current,
      value: +(current.value + entry.ghg).toFixed(6),
    }
    return acc
  }, {})
)

export const SCOPE3_TOTAL = +SCOPE3_CATEGORY_TOTALS
  .reduce((sum, item) => sum + item.value, 0)
  .toFixed(6)

export const SCOPE3_BREAKDOWN = SCOPE3_CATEGORY_TOTALS
  .map(item => ({
    ...item,
    pct: +((item.value / SCOPE3_TOTAL) * 100).toFixed(2),
  }))
  .sort((a, b) => b.value - a.value)
