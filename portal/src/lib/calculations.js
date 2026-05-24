// GHG Calculation Engine — Defra 2025 Conversion Factors
// Formula: tCO2e = consumption × emissionFactor / 1000
// All EFs in kg CO2e per unit unless noted

// ── Scope 1: Stationary Combustion ────────────────────────────────────────────
// Key: `${fuel}/${unit}` → kg CO2e per unit
export const EF_STATIONARY = {
  // Gaseous fuels
  'Butane/litres': 1.74533, 'Butane/tonnes': 3033.38067,
  'Butane/kWh (Net CV)': 0.24107, 'Butane/kWh (Gross CV)': 0.22241,
  'CNG/tonnes': 2575.46441,
  'LNG/tonnes': 2603.30441,
  'LPG/tonnes': 2939.36095,
  'Natural gas/tonnes': 2575.46441,
  'Natural gas (100% mineral blend)/tonnes': 2603.30441,
  'Other petroleum gas/tonnes': 2578.24647,
  'Propane/litres': 1.54358, 'Propane/tonnes': 2997.63233,
  'Propane/kWh (Net CV)': 0.23258, 'Propane/kWh (Gross CV)': 0.2141,
  // Liquid fuels
  'Aviation spirit/tonnes': 3193.6948,
  'Aviation turbine fuel/tonnes': 3178.3652,
  'Burning oil/tonnes': 3165.04181,
  'Diesel (average biofuel blend)/tonnes': 3087.94462,
  'Diesel (100% mineral diesel)/tonnes': 3203.91143,
  'Fuel oil/tonnes': 3228.89019,
  'Gas oil/tonnes': 3226.57859,
  'Lubricants/litres': 2.74934, 'Lubricants/tonnes': 3180.99992,
  'Lubricants/kWh (Net CV)': 0.281, 'Lubricants/kWh (Gross CV)': 0.26414,
  'Marine fuel oil/tonnes': 3154.75334,
  'Marine gas oil/tonnes': 3245.30441,
  'Naphtha/litres': 2.11894, 'Naphtha/tonnes': 3142.3789,
  'Naphtha/kWh (Net CV)': 0.24891, 'Naphtha/kWh (Gross CV)': 0.23647,
  'Petrol (average biofuel blend)/tonnes': 2772.97935,
  'Petrol (100% mineral petrol)/tonnes': 3154.08213,
  'Processed fuel oils - distillate oil/tonnes': 3226.57859,
  'Processed fuel oils - residual oil/tonnes': 3228.89019,
  'Refinery miscellaneous/tonnes': 2944.32093,
  'Waste oils/litres': 2.74924, 'Waste oils/tonnes': 3219.37916,
  'Waste oils/kWh (Net CV)': 0.27459, 'Waste oils/kWh (Gross CV)': 0.25641,
  // Solid fuels
  'Coal (domestic)/tonnes': 2904.95234,
  'Coal (electricity generation)/tonnes': 2225.22448,
  'Coal (electricity generation - home produced coal only)/tonnes': 2221.7467,
  'Coal (industrial)/tonnes': 2395.28994,
  'Coking coal/tonnes': 3164.65002,
  'Petroleum coke/tonnes': 3386.57168,
  // Bioenergy (litres)
  'Bioethanol/litres': 0.00901,
  'Biodiesel ME/litres': 0.16751,
  'Biodiesel ME (from used cooking oil)/litres': 0.16751,
  'Biodiesel ME (from tallow)/litres': 0.16751,
  'Biodiesel HVO/litres': 0.03558,
  'Biopropane/litres': 0.00213,
  'Development diesel/litres': 0.03705,
  'Development petrol/litres': 0.01402,
  'Off road biodiesel/litres': 0.16751,
  'Methanol (bio)/litres': 0.00669,
  'Avtur (renewable)/litres': 0.02531,
  // Biomass (tonnes)
  'Wood logs/tonnes': 46.98508,
  'Wood chips/tonnes': 43.43964,
  'Wood pellets/tonnes': 55.19389,
  'Grass/straw/tonnes': 47.35709,
  // Biogas (tonnes)
  'Biogas/tonnes': 1.24314,
  'Landfill gas/tonnes': 0.69696,
  // Per-litre EFs (Defra 2025) — needed when user selects "litres" as unit
  'Diesel (average biofuel blend)/litres': 2.57082,
  'Diesel (100% mineral diesel)/litres': 2.67137,
  'Petrol (average biofuel blend)/litres': 2.27412,
  'Petrol (100% mineral petrol)/litres': 2.34232,
  'LPG/litres': 1.54835,
  'Gas oil/litres': 2.54697,
  'Fuel oil/litres': 2.60396,
  'Marine fuel oil/litres': 2.54428,
  'Marine gas oil/litres': 2.54697,
  'Burning oil/litres': 2.54054,
  'Aviation spirit/litres': 2.26404,
  'Aviation turbine fuel/litres': 2.52981,
  'Refinery miscellaneous/litres': 2.37093,
  'Processed fuel oils - distillate oil/litres': 2.54697,
  'Processed fuel oils - residual oil/litres': 2.60396,
  // Per-cubic-metre EFs (Defra 2025) — for gaseous fuels
  'Natural gas/cubic metres': 2.06672,
  'Natural gas (100% mineral blend)/cubic metres': 2.09016,
  'Butane/cubic metres': 2.82553,
  'Propane/cubic metres': 2.99601,
  'LPG/cubic metres': 2.94476,
  'Other petroleum gas/cubic metres': 2.08745,
}

// ── Scope 1: Mobile Combustion ─────────────────────────────────────────────────
// Key: `${vehicleType}/${unit}` → kg CO2e per km (diesel as primary EF)
export const EF_MOBILE = {
  // Cars by market segment (km)
  'Mini/km': 0.10996, 'Mini/miles': 0.17696,
  'Supermini/km': 0.13452, 'Supermini/miles': 0.21649,
  'Lower medium/km': 0.14517, 'Lower medium/miles': 0.23364,
  'Upper medium/km': 0.16194, 'Upper medium/miles': 0.26067,
  'Executive/km': 0.17088, 'Executive/miles': 0.27505,
  'Luxury/km': 0.20632, 'Luxury/miles': 0.33209,
  'Sports/km': 0.17323, 'Sports/miles': 0.27883,
  'Dual purpose 4X4/km': 0.19973, 'Dual purpose 4X4/miles': 0.32148,
  'MPV/km': 0.18072, 'MPV/miles': 0.29096,
  // Cars by size (km)
  'Small car/km': 0.1434, 'Small car/miles': 0.23082,
  'Medium car/km': 0.17174, 'Medium car/miles': 0.27644,
  'Large car/km': 0.21007, 'Large car/miles': 0.33815,
  'Average car/km': 0.17304, 'Average car/miles': 0.27854,
  // Motorbikes (km)
  'Motorbike (Small)/km': 0.08319, 'Motorbike (Small)/miles': 0.13393,
  'Motorbike (Medium)/km': 0.10107, 'Motorbike (Medium)/miles': 0.16270,
  'Motorbike (Large)/km': 0.13252, 'Motorbike (Large)/miles': 0.21330,
  'Motorbike (Average)/km': 0.11367, 'Motorbike (Average)/miles': 0.18297,
  // Vans (km)
  'Van - Class I (up to 1.305 tonnes)/km': 0.15738,
  'Van - Class II (1.305 to 1.74 tonnes)/km': 0.1926,
  'Van - Class III (1.74 to 3.5 tonnes)/km': 0.27878,
  'Van - Average (up to 3.5 tonnes)/km': 0.25561,
  // HGVs (km)
  'HGV - Rigid (>3.5 - 7.5 tonnes)/km': 0.54937,
  'HGV - Rigid (>7.5 tonnes-17 tonnes)/km': 0.65559,
  'HGV - Rigid (>17 tonnes)/km': 0.92128,
  'HGV - All rigids/km': 0.80843,
  'HGV - Articulated (>3.5 - 33t)/km': 0.72566,
  'HGV - Articulated (>33t)/km': 0.748,
  'HGV - All artics/km': 0.74715,
  'HGV - All HGVs/km': 0.77175,
}

// ── Scope 1: Fugitive Emissions ────────────────────────────────────────────────
// GWP values (kg CO2e per kg of refrigerant) — Defra 2025
export const EF_FUGITIVE = {
  'Carbon dioxide': 1, 'Methane': 28, 'Nitrous oxide': 265,
  'HFC-23': 12400, 'HFC-32': 677, 'HFC-41': 116,
  'HFC-125': 3170, 'HFC-134': 1120, 'HFC-134a': 1300,
  'HFC-143': 328, 'HFC-143a': 4800, 'HFC-152a': 138,
  'HFC-227ea': 3350, 'HFC-236fa': 8060, 'HFC-245fa': 858,
  'HFC-43-I0mee': 1650, 'HFC-152': 16, 'HFC-161': 4,
  'HFC-236cb': 1210, 'HFC-236ea': 1330, 'HFC-245ca': 716, 'HFC-365mfc': 804,
  'Perfluoromethane (PFC-14)': 6630, 'Perfluoroethane (PFC-116)': 11100,
  'Perfluoropropane (PFC-218)': 8900, 'Perfluorocyclobutane (PFC-318)': 9540,
  'Perfluorocyclopropane': 9200, 'Perfluorobutane (PFC-3-1-10)': 9200,
  'Perfluoropentane (PFC-4-1-12)': 8550, 'Perfluorohexane (PFC-5-1-14)': 7910,
  'PFC-9-1-18': 7190, 'PFPMIE': 9710,
  'Sulphur hexafluoride (SF6)': 23500, 'Nitrogen trifluoride': 16100,
  'CFC-11/R11 = trichlorofluoromethane': 4660, 'CFC-12/R12 = dichlorodifluoromethane': 10200,
  'CFC-13': 13900, 'CFC-113': 5820, 'CFC-114': 8590, 'CFC-115': 7670,
  'Halon-1211': 1750, 'Halon-1301': 6290, 'Halon-2402': 1470,
  'Carbon tetrachloride': 1730, 'Methyl chloroform': 160, 'Methyl bromide': 2,
  'HCFC-21': 148, 'HCFC-22/R22 = chlorodifluoromethane': 1760,
  'HCFC-123': 79, 'HCFC-124': 527, 'HCFC-141b': 782, 'HCFC-142b': 1980,
  'HCFC-225ca': 127, 'HCFC-225cb': 525,
  'Methyl chloride': 12, 'Methylene chloride': 9, 'Dimethylether': 1,
  'HFE-125': 12400, 'HFE-134': 5560, 'HFE-143a': 523, 'HCFE-235da2': 491,
  'HFE-245cb2': 654, 'HFE-245fa2': 812, 'HFE-254cb2': 301,
  'HFE-347mcc3': 530, 'HFE-347pcf2': 889, 'HFE-356pcc3': 413,
  'HFE-449sl (HFE-7100)': 421, 'HFE-569sf2 (HFE-7200)': 57,
  'HFE-43-10pccc124 (H-Galden1040x)': 2820, 'HFE-236ca12 (HG-10)': 5350,
  'HFE-338pcc13 (HG-01)': 2910, 'Trifluoromethyl sulphur pentafluoride': 17400,
  'R290 = propane': 0.06, 'R600 = butane': 0.006, 'R600A = isobutane': 3,
  'R601 = n-pentane': 5, 'R601A = isopentane': 5,
  'R170 = ethane': 0.437, 'R1270 = propylene': 2,
  'R1234yf*': 1, 'R1234ze*': 1,
  'R401A': 1130, 'R401B': 1236, 'R401C': 876,
  'R402A': 2571, 'R402B': 2261,
  'R403A': 3100, 'R403B': 4457, 'R404A': 3943, 'R405A': 4821, 'R406A': 1780,
  'R407A': 1923, 'R407B': 2547, 'R407C': 1624, 'R407D': 1487,
  'R407E': 1425, 'R407F': 1674,
  'R408A': 3257, 'R409A': 1485, 'R409B': 1474,
  'R410A': 1924, 'R410B': 2048,
  'R411A': 1555, 'R411B': 1659, 'R412A': 2172, 'R413A': 1945,
  'R414A': 1375, 'R414B': 1274, 'R415A': 1468, 'R415B': 544, 'R416A': 975,
  'R417A': 2127, 'R417B': 2742, 'R417C': 1643, 'R418A': 1693,
  'R419A': 2688, 'R419B': 2161, 'R420A': 1382,
  'R421A': 2385, 'R421B': 2890,
  'R422A': 2847, 'R422B': 2290, 'R422C': 2794, 'R422D': 2473, 'R422E': 2350,
  'R423A': 2274, 'R424A': 2212, 'R425A': 1431, 'R426A': 1371,
  'R427A': 2024, 'R428A': 3417,
  'R429A': 15.3, 'R430A': 106, 'R431A': 40, 'R432A': 1.8,
  'R433A': 0.64, 'R433B': 0.16, 'R433C': 0.55, 'R434A': 3076, 'R435A': 28.4,
  'R436A': 1.35, 'R436B': 1.47, 'R437A': 1639, 'R438A': 2059, 'R439A': 1828,
  'R440A': 156, 'R441A': 0.23, 'R442A': 1754, 'R443A': 1, 'R444A': 89, 'R445A': 118,
  'R500': 7564, 'R501': 3870, 'R502': 4786, 'R503': 13299, 'R504': 4299,
  'R505': 7956, 'R506': 3857, 'R507A': 3985,
  'R508A': 11607, 'R508B': 11698, 'R509A': 5758,
  'R510A': 1.24, 'R511A': 7, 'R512A': 196,
}

// ── Scope 2: Electricity ───────────────────────────────────────────────────────
// kg CO2e per kWh — country-specific grid emission factors
export const EF_GRID = {
  'India': 0.716, 'United Arab Emirates': 0.450, 'Botswana': 1.050,
  'UK': 0.177, 'USA': 0.386, 'Australia': 0.620, 'Brazil': 0.074,
  'Canada': 0.130, 'China': 0.555, 'France': 0.066, 'Germany': 0.380,
  'Japan': 0.470, 'Saudi Arabia': 0.770, 'Singapore': 0.408,
  'South Africa': 0.930, 'default': 0.500,
}

// ── Scope 2: Heat & Steam ──────────────────────────────────────────────────────
export const EF_HEAT = {
  'Onsite': 0.17529,
  'District': 0.17529,
  'Onsite heat and steam': 0.17529,
  'District heat and steam': 0.17529,
}

// ── Scope 3: Water ────────────────────────────────────────────────────────────
export const EF_WATER_SUPPLY = 0.1913      // kg CO2e per cubic metre
export const EF_WATER_TREATMENT = 0.17088  // kg CO2e per cubic metre

// ── Scope 3: Business Travel (Air) ────────────────────────────────────────────
// Key: `${haul}/${class}` → kg CO2e per passenger.km (with radiative forcing)
export const EF_TRAVEL_AIR = {
  'Domestic, to/from UK/Average passenger': 0.22928,
  'Short-haul, to/from UK/Average passenger': 0.12786,
  'Short-haul, to/from UK/Economy class': 0.12576,
  'Short-haul, to/from UK/Business class': 0.18863,
  'Long-haul, to/from UK/Average passenger': 0.15282,
  'Long-haul, to/from UK/Economy class': 0.11704,
  'Long-haul, to/from UK/Premium economy class': 0.18726,
  'Long-haul, to/from UK/Business class': 0.33940,
  'Long-haul, to/from UK/First class': 0.46814,
  'International, to/from non-UK/Average passenger': 0.14253,
  'International, to/from non-UK/Economy class': 0.10916,
  'International, to/from non-UK/Premium economy class': 0.17465,
  'International, to/from non-UK/Business class': 0.31656,
  'International, to/from non-UK/First class': 0.43663,
}

// ── Scope 3: Business Travel (Sea) ────────────────────────────────────────────
export const EF_TRAVEL_SEA = {
  'Foot passenger': 0.01871,
  'Car passenger': 0.12933,
  'Average (all passenger)': 0.11270,
}

// ── Scope 3: Business Travel (Land) + Employee Commute ───────────────────────
// kg CO2e per km
export const EF_TRAVEL_LAND = {
  'Small car': 0.14340, 'Medium car': 0.17174, 'Large car': 0.21007, 'Average car': 0.17304,
  'Mini': 0.10996, 'Supermini': 0.13452, 'Lower medium': 0.14517,
  'Upper medium': 0.16194, 'Executive': 0.17088, 'Luxury': 0.20632,
  'Sports': 0.17323, 'Dual purpose 4X4': 0.19973, 'MPV': 0.18072,
  'Motorbike (Small)': 0.08319, 'Motorbike (Medium)': 0.10107,
  'Motorbike (Large)': 0.13252, 'Motorbike (Average)': 0.11367,
  'Average local bus': 0.07956, 'Local London bus': 0.05977,
  'Local bus (not London)': 0.08426, 'Coach': 0.02747,
  'National rail': 0.03549, 'International rail': 0.00413,
  'Light rail and tram': 0.02887, 'London Underground': 0.02765,
  'Regular taxi': 0.20806, 'Black cab': 0.30604, 'Average taxi': 0.23320,
}

// Employee commute alias (same EF table, same unit)
export const EF_COMMUTE = EF_TRAVEL_LAND

// ── Scope 3: Hotel Stay ───────────────────────────────────────────────────────
// kg CO2e per room per night
export const EF_HOTEL = {
  'UK': 10.4, 'UK (London)': 11.5, 'Australia': 35.0, 'Belgium': 12.2,
  'Brazil': 8.7, 'Canada': 7.4, 'Chile': 27.6, 'China': 53.5,
  'Colombia': 14.7, 'Costa Rica': 4.7, 'Egypt': 44.2, 'France': 6.7,
  'Germany': 13.2, 'Hong Kong, China': 51.5, 'India': 58.9, 'Indonesia': 62.7,
  'Italy': 14.3, 'Japan': 39.0, 'Jordan': 68.9, 'Korea': 55.8,
  'Malaysia': 61.5, 'Maldives': 152.2, 'Mexico': 19.3, 'Netherlands': 14.8,
  'Oman': 90.3, 'Philippines': 54.3, 'Portugal': 19.0, 'Qatar': 86.2,
  'Russian Federation': 24.2, 'Saudi Arabia': 106.4, 'Singapore': 24.5,
  'South Africa': 51.4, 'Spain': 7.0, 'Switzerland': 6.6, 'Thailand': 43.4,
  'Turkey': 32.1, 'United Arab Emirates': 63.8, 'United States': 16.1, 'Vietnam': 38.5,
}

// ── Scope 3: Purchased Goods ──────────────────────────────────────────────────
// kg CO2e per tonne (primary production / open-loop)
export const EF_GOODS = {
  'Aggregates': 7.7931, 'Average construction': 75.0067, 'Asbestos': 27.0,
  'Asphalt': 39.2125, 'Bricks': 241.7931, 'Concrete': 118.7931,
  'Insulation': 1861.7931, 'Plasterboard': 120.05,
  'Metals': 3824.0934, 'Metal: aluminium cans and foil': 7498.5931,
  'Metal: mixed cans': 4382.7931, 'Metal: scrap metal': 3824.0934,
  'Metal: steel cans': 2953.5931,
  'Plastics: average plastics': 3116.0934, 'Plastics: average plastic film': 2666.5931,
  'Plastics: average plastic rigid': 3357.5931, 'Plastics: HDPE': 2890.5931,
  'Plastics: LDPE and LLDPE': 2666.5931, 'Plastics: PET': 4002.5931,
  'Plastics: PP': 2977.5931, 'Plastics: PS': 4140.5931, 'Plastics: PVC': 3276.5931,
  'Paper and board: paper': 1286.5934, 'Paper and board: board': 1032.5931,
  'Paper and board: mixed': 1207.5931, 'Books': 1286.5934,
  'Electrical items - IT': 30640.5931, 'Electrical items - large': 26588.5931,
  'Electrical items - small': 52760.5931, 'Electrical items - fridges and freezers': 11750.5931,
  'Food and drink': 3817.7931, 'Compost derived from food and garden waste': 606.5931,
  'Compost derived from garden waste': 526.5931,
  'Clothing': 28384.5931, 'Glass': 1385.5931, 'Mineral oil': 1401.0,
  'Soils': 0, 'Tyres': 3832.5931, 'Wood': 1503.5931,
  'Batteries - Alkaline': 8765.5931, 'Batteries - Li ion': 12000,
  'Batteries - NiMh': 9500,
}

// ── Scope 3: Waste Disposal ───────────────────────────────────────────────────
// EF[wasteType][disposalMethod] → kg CO2e per tonne
export const EF_WASTE = {
  'Landfill': 0.467, 'Open-loop': 0.300, 'Closed-loop': 0.100,
  'Incineration with energy recovery': 0.021, 'Composting': 0.010,
  'Anaerobic digestion': 0.200,
}
// Per-waste-type landfill EFs (sample of common ones)
export const EF_WASTE_LANDFILL = {
  'Organic: food and drink waste': 0.686, 'Organic: garden waste': 0.536,
  'Organic: mixed food and garden waste': 0.611,
  'Paper and board: paper': 0.742, 'Paper and board: board': 0.509,
  'Plastics: average plastics': 0.013, 'Metals': 0.013,
  'Glass': 0.013, 'Wood': 0.544, 'Tyres': 0.013,
  'Household residual waste': 0.343, 'Commercial and industrial waste': 0.231,
}

// ── Scope 3: T&D Loss ────────────────────────────────────────────────────────
export const EF_TD_LOSS = 0.01853  // kg CO2e per kWh (UK grid T&D 2025)

// ── Core calculators ──────────────────────────────────────────────────────────

export function calcStationary(type, unit, consumption) {
  const key = `${type}/${unit}`
  const ef = EF_STATIONARY[key] ?? 0
  return { ef, tco2e: +(consumption * ef / 1000).toFixed(6) }
}

export function calcMobile(type, unit, consumption) {
  const key = `${type}/${unit}`
  const ef = EF_MOBILE[key] ?? 0
  return { ef, tco2e: +(consumption * ef / 1000).toFixed(6) }
}

export function calcFugitive(refrigerant, kgLeaked) {
  const gwp = EF_FUGITIVE[refrigerant] ?? 0
  return { ef: gwp, tco2e: +(kgLeaked * gwp / 1000).toFixed(6) }
}

export function calcElectricity(country, unit, consumption, isRenewable = false) {
  if (isRenewable) return { ef: 0, tco2e: 0 }
  const ef = EF_GRID[country] ?? EF_GRID['default']
  const kwh = unit === 'MWh' ? consumption * 1000 : consumption
  return { ef, tco2e: +(kwh * ef / 1000).toFixed(6) }
}

export function calcHeatSteam(type, unit, consumption) {
  const ef = EF_HEAT[type] ?? 0.17529
  const kwh = unit === 'MWh' ? consumption * 1000 : consumption
  return { ef, tco2e: +(kwh * ef / 1000).toFixed(6) }
}

export function calcWaterSupply(volumeM3) {
  return { ef: EF_WATER_SUPPLY, tco2e: +(volumeM3 * EF_WATER_SUPPLY / 1000).toFixed(6) }
}

export function calcWaterTreatment(volumeM3) {
  return { ef: EF_WATER_TREATMENT, tco2e: +(volumeM3 * EF_WATER_TREATMENT / 1000).toFixed(6) }
}

export function calcTDLoss(kwh) {
  return { ef: EF_TD_LOSS, tco2e: +(kwh * EF_TD_LOSS / 1000).toFixed(6) }
}

export function calcCommute(vehicleType, numPassengers, kmPerDay, workingDays, twoWay = true) {
  const ef = EF_COMMUTE[vehicleType] ?? 0
  const multiplier = twoWay ? 2 : 1
  const totalKm = numPassengers * kmPerDay * workingDays * multiplier
  return { ef, totalKm: +totalKm.toFixed(2), tco2e: +(totalKm * ef / 1000).toFixed(6) }
}

export function calcTravelAir(haul, flightClass, passengerKm) {
  const key = `${haul}/${flightClass}`
  const ef = EF_TRAVEL_AIR[key] ?? EF_TRAVEL_AIR['Long-haul, to/from UK/Economy class'] ?? 0
  return { ef, tco2e: +(passengerKm * ef / 1000).toFixed(6) }
}

export function calcTravelSea(ferryType, passengerKm) {
  const ef = EF_TRAVEL_SEA[ferryType] ?? 0
  return { ef, tco2e: +(passengerKm * ef / 1000).toFixed(6) }
}

export function calcTravelLand(vehicleType, km) {
  const ef = EF_TRAVEL_LAND[vehicleType] ?? 0
  return { ef, tco2e: +(km * ef / 1000).toFixed(6) }
}

export function calcHotel(country, roomNights) {
  const ef = EF_HOTEL[country] ?? 20
  return { ef, tco2e: +(roomNights * ef / 1000).toFixed(6) }
}

export function calcGoods(material, weightTonnes) {
  const ef = EF_GOODS[material] ?? 0
  return { ef, tco2e: +(weightTonnes * ef / 1000).toFixed(6) }
}

export function calcWaste(method, weightKg) {
  const ef = EF_WASTE[method] ?? 0.300
  return { ef, tco2e: +(weightKg * ef / 1000).toFixed(6) }
}

export function calcFood(foodType, count) {
  const EF_FOOD = {
    '1 standard breakfast': 2.5,
    '1 gourmet breakfast': 3.5,
    '1 cold or hot snack': 1.0,
    '1 average meal': 3.7,
    'Non-alcoholic beverage': 0.3,
    'Alcoholic beverage': 0.8,
    '1 hot snack (burger + frites)': 4.2,
    '1 sandwich': 1.5,
    'Meal, vegan': 1.8,
    'Meal, vegetarian': 2.7,
    'Meal, with beef': 6.0,
    'Meal, with chicken': 3.5,
  }
  const ef = EF_FOOD[foodType] ?? 3.5
  return { ef, tco2e: +(count * ef / 1000).toFixed(6) }
}

export function calcGeneric(ef, consumption) {
  return { ef, tco2e: +(consumption * ef / 1000).toFixed(6) }
}

// ── Backward-compatible aliases ───────────────────────────────────────────────
export function calcWater(source, volumeM3) {
  // Legacy: source was Municipal Supply / Groundwater etc — now just EF_WATER_SUPPLY
  return calcWaterSupply(volumeM3)
}

export function calcTravel(mode, km) {
  // Legacy generic travel — routes to appropriate calc by key lookup
  const ef = EF_TRAVEL_AIR[mode] ?? EF_TRAVEL_SEA[mode] ?? EF_TRAVEL_LAND[mode] ?? 0
  return { ef, tco2e: +(km * ef / 1000).toFixed(6) }
}

export function sumEntries(entries) {
  return +entries.reduce((s, e) => s + (e.tco2e || 0), 0).toFixed(6)
}

export function calcIntensity(totalTco2e, { revenue, employees, facilityArea }) {
  return {
    perRevenue:  revenue      ? +(totalTco2e / revenue).toFixed(6)      : null,
    perEmployee: employees    ? +(totalTco2e / employees).toFixed(6)    : null,
    perArea:     facilityArea ? +(totalTco2e / facilityArea).toFixed(6) : null,
  }
}
