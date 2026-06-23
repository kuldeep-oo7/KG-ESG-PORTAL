// GHG Calculation Engine — DEFRA 2026 Conversion Factors (full set, v1)
// Formula: tCO2e = consumption × emissionFactor / 1000
// All EFs in kg CO2e per unit unless noted

// ── Scope 1: Stationary Combustion ────────────────────────────────────────────
// Key: `${fuel}/${unit}` → kg CO2e per unit
export const EF_STATIONARY = {
  "Aviation spirit/kWh (Gross CV)": 0.24382,
  "Aviation spirit/kWh (Net CV)": 0.25666,
  "Aviation spirit/litres": 2.33116,
  "Aviation spirit/tonnes": 3193.6948,
  "Aviation turbine fuel/kWh (Gross CV)": 0.24758,
  "Aviation turbine fuel/kWh (Net CV)": 0.26061,
  "Aviation turbine fuel/litres": 2.54269,
  "Aviation turbine fuel/tonnes": 3178.3652,
  "Avtur (renewable)/GJ": 0.7234,
  "Avtur (renewable)/kg": 0.03179,
  "Avtur (renewable)/litres": 0.02533,
  "Biodiesel HVO/GJ": 1.03677,
  "Biodiesel HVO/kg": 0.04562,
  "Biodiesel HVO/litres": 0.03558,
  "Biodiesel ME (from tallow)/GJ": 5.05961,
  "Biodiesel ME (from tallow)/kg": 0.18822,
  "Biodiesel ME (from tallow)/litres": 0.16751,
  "Biodiesel ME (from used cooking oil)/GJ": 5.05961,
  "Biodiesel ME (from used cooking oil)/kg": 0.18822,
  "Biodiesel ME (from used cooking oil)/litres": 0.16751,
  "Biodiesel ME/GJ": 5.05961,
  "Biodiesel ME/kg": 0.18822,
  "Biodiesel ME/litres": 0.16751,
  "Bioethanol/GJ": 0.42339,
  "Bioethanol/kg": 0.01135,
  "Bioethanol/litres": 0.00901,
  "Biogas/kWh": 0.00022,
  "Biogas/tonnes": 1.22851,
  "Biomethane (compressed)/GJ": 0.10625,
  "Biomethane (compressed)/kg": 0.00521,
  "Biomethane (liquified)/GJ": 0.10625,
  "Biomethane (liquified)/kg": 0.00521,
  "Biopropane/GJ": 0.08952,
  "Biopropane/kg": 0.00415,
  "Biopropane/litres": 0.00214,
  "Burning oil/kWh (Gross CV)": 0.24677,
  "Burning oil/kWh (Net CV)": 0.25975,
  "Burning oil/litres": 2.54016,
  "Burning oil/tonnes": 3165.04181,
  "Butane/kWh (Gross CV)": 0.22241,
  "Butane/kWh (Net CV)": 0.24107,
  "Butane/litres": 1.74533,
  "Butane/tonnes": 3033.38067,
  "CNG/kWh (Gross CV)": 0.18231,
  "CNG/kWh (Net CV)": 0.20199,
  "CNG/litres": 0.43885,
  "CNG/tonnes": 2507.72441,
  "Coal (domestic)/kWh (Gross CV)": 0.34721,
  "Coal (domestic)/kWh (Net CV)": 0.36549,
  "Coal (domestic)/tonnes": 2904.95234,
  "Coal (electricity generation - home produced coal only)/kWh (Gross CV)": 0.32247,
  "Coal (electricity generation - home produced coal only)/kWh (Net CV)": 0.33944,
  "Coal (electricity generation - home produced coal only)/tonnes": 2226.7367,
  "Coal (electricity generation)/kWh (Gross CV)": 0.32247,
  "Coal (electricity generation)/kWh (Net CV)": 0.33944,
  "Coal (electricity generation)/tonnes": 2230.22448,
  "Coal (industrial)/kWh (Gross CV)": 0.32512,
  "Coal (industrial)/kWh (Net CV)": 0.34223,
  "Coal (industrial)/tonnes": 2415.03994,
  "Coking coal/kWh (Gross CV)": 0.3579,
  "Coking coal/kWh (Net CV)": 0.37675,
  "Coking coal/tonnes": 3164.65002,
  "Development diesel/GJ": 1.03677,
  "Development diesel/kg": 0.04461,
  "Development diesel/litres": 0.03705,
  "Development petrol/GJ": 0.42339,
  "Development petrol/kg": 0.01888,
  "Development petrol/litres": 0.01409,
  "Diesel (100% mineral diesel)/kWh (Gross CV)": 0.25197,
  "Diesel (100% mineral diesel)/kWh (Net CV)": 0.26806,
  "Diesel (100% mineral diesel)/litres": 2.66155,
  "Diesel (100% mineral diesel)/tonnes": 3203.91143,
  "Diesel (average biofuel blend)/kWh (Gross CV)": 0.2452,
  "Diesel (average biofuel blend)/kWh (Net CV)": 0.26071,
  "Diesel (average biofuel blend)/litres": 2.58354,
  "Diesel (average biofuel blend)/tonnes": 3104.16462,
  "Fuel oil/kWh (Gross CV)": 0.26813,
  "Fuel oil/kWh (Net CV)": 0.28523,
  "Fuel oil/litres": 3.17492,
  "Fuel oil/tonnes": 3228.89019,
  "Gas oil/kWh (Gross CV)": 0.2565,
  "Gas oil/kWh (Net CV)": 0.27288,
  "Gas oil/litres": 2.75541,
  "Gas oil/tonnes": 3226.57859,
  "Grass/straw/kWh": 0.0126,
  "Grass/straw/tonnes": 46.89059,
  "LNG/kWh (Gross CV)": 0.18442,
  "LNG/kWh (Net CV)": 0.20434,
  "LNG/litres": 1.14791,
  "LNG/tonnes": 2536.85441,
  "LPG/kWh (Gross CV)": 0.2145,
  "LPG/kWh (Net CV)": 0.23032,
  "LPG/litres": 1.55713,
  "LPG/tonnes": 2939.36095,
  "Landfill gas/kWh": 0.0002,
  "Landfill gas/tonnes": 0.6977,
  "Lubricants/kWh (Gross CV)": 0.26414,
  "Lubricants/kWh (Net CV)": 0.281,
  "Lubricants/litres": 2.74934,
  "Lubricants/tonnes": 3180.99992,
  "Marine fuel oil/kWh (Gross CV)": 0.26197,
  "Marine fuel oil/kWh (Net CV)": 0.27869,
  "Marine fuel oil/litres": 3.10202,
  "Marine fuel oil/tonnes": 3154.75334,
  "Marine gas oil/kWh (Gross CV)": 0.25798,
  "Marine gas oil/kWh (Net CV)": 0.27445,
  "Marine gas oil/litres": 2.77139,
  "Marine gas oil/tonnes": 3245.30441,
  "Methanol (bio)/GJ": 0.42339,
  "Methanol (bio)/kg": 0.00844,
  "Methanol (bio)/litres": 0.00669,
  "Naphtha/kWh (Gross CV)": 0.23647,
  "Naphtha/kWh (Net CV)": 0.24891,
  "Naphtha/litres": 2.11894,
  "Naphtha/tonnes": 3142.3789,
  "Natural gas (100% mineral blend)/cubic metres": 2.04987,
  "Natural gas (100% mineral blend)/kWh (Gross CV)": 0.18442,
  "Natural gas (100% mineral blend)/kWh (Net CV)": 0.20434,
  "Natural gas (100% mineral blend)/tonnes": 2536.85441,
  "Natural gas/cubic metres": 2.02633,
  "Natural gas/kWh (Gross CV)": 0.18231,
  "Natural gas/kWh (Net CV)": 0.20199,
  "Natural gas/tonnes": 2507.72441,
  "Off road biodiesel/GJ": 5.05961,
  "Off road biodiesel/kg": 0.18822,
  "Off road biodiesel/litres": 0.16751,
  "Other petroleum gas/kWh (Gross CV)": 0.18323,
  "Other petroleum gas/kWh (Net CV)": 0.19917,
  "Other petroleum gas/litres": 0.94442,
  "Other petroleum gas/tonnes": 2578.24647,
  "Petrol (100% mineral petrol)/kWh (Gross CV)": 0.24189,
  "Petrol (100% mineral petrol)/kWh (Net CV)": 0.25464,
  "Petrol (100% mineral petrol)/litres": 2.35372,
  "Petrol (100% mineral petrol)/tonnes": 3154.08213,
  "Petrol (average biofuel blend)/kWh (Gross CV)": 0.21938,
  "Petrol (average biofuel blend)/kWh (Net CV)": 0.23164,
  "Petrol (average biofuel blend)/litres": 2.075,
  "Petrol (average biofuel blend)/tonnes": 2765.46935,
  "Petroleum coke/kWh (Gross CV)": 0.34092,
  "Petroleum coke/kWh (Net CV)": 0.35887,
  "Petroleum coke/tonnes": 3386.57168,
  "Processed fuel oils - distillate oil/kWh (Gross CV)": 0.2565,
  "Processed fuel oils - distillate oil/kWh (Net CV)": 0.27288,
  "Processed fuel oils - distillate oil/litres": 2.75541,
  "Processed fuel oils - distillate oil/tonnes": 3226.57859,
  "Processed fuel oils - residual oil/kWh (Gross CV)": 0.26813,
  "Processed fuel oils - residual oil/kWh (Net CV)": 0.28523,
  "Processed fuel oils - residual oil/litres": 3.17492,
  "Processed fuel oils - residual oil/tonnes": 3228.89019,
  "Propane/kWh (Gross CV)": 0.2141,
  "Propane/kWh (Net CV)": 0.23258,
  "Propane/litres": 1.54358,
  "Propane/tonnes": 2997.63233,
  "Refinery miscellaneous/kWh (Gross CV)": 0.24663,
  "Refinery miscellaneous/kWh (Net CV)": 0.25961,
  "Refinery miscellaneous/tonnes": 2944.32093,
  "Waste oils/kWh (Gross CV)": 0.25641,
  "Waste oils/kWh (Net CV)": 0.27459,
  "Waste oils/litres": 2.74924,
  "Waste oils/tonnes": 3219.37916,
  "Wood chips/kWh": 0.01193,
  "Wood chips/tonnes": 45.05983,
  "Wood logs/kWh": 0.01193,
  "Wood logs/tonnes": 48.73751,
  "Wood pellets/kWh": 0.01193,
  "Wood pellets/tonnes": 57.25249,
}

// ── Scope 1: Mobile Combustion ─────────────────────────────────────────────────
// Key: `${vehicleType}/${unit}` → kg CO2e per km (diesel as primary EF)
export const EF_MOBILE = {
  // Cars by market segment (km)
  'Mini/km': 0.10998, 'Mini/miles': 0.17696,
  'Supermini/km': 0.13461, 'Supermini/miles': 0.21649,
  'Lower medium/km': 0.14457, 'Lower medium/miles': 0.23364,
  'Upper medium/km': 0.1611, 'Upper medium/miles': 0.26067,
  'Executive/km': 0.1689, 'Executive/miles': 0.27505,
  'Luxury/km': 0.20205, 'Luxury/miles': 0.33209,
  'Sports/km': 0.17388, 'Sports/miles': 0.27883,
  'Dual purpose 4X4/km': 0.19794, 'Dual purpose 4X4/miles': 0.32148,
  'MPV/km': 0.17982, 'MPV/miles': 0.29096,
  // Cars by size (km)
  'Small car/km': 0.14327, 'Small car/miles': 0.23082,
  'Medium car/km': 0.17209, 'Medium car/miles': 0.27644,
  'Large car/km': 0.20905, 'Large car/miles': 0.33815,
  'Average car/km': 0.17265, 'Average car/miles': 0.27854,
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

  // Aliases for user/seed data compatibility
  'Diesel - Average car/km': 0.17304,
  'Diesel - Average car/miles': 0.27854,
  'Hybrid - Small car/km': 0.11413,
  'Hybrid - Small car/miles': 0.18367,
  'Petrol - Average car/km': 0.16272,
  'Petrol - Average car/miles': 0.26187,
  'Petrol - Large car/km': 0.27156,
  'Petrol - Large car/miles': 0.43702,
  'Petrol - Small car/km': 0.14308,
  'Petrol - Small car/miles': 0.23027,
}

// ── Scope 1: Fugitive Emissions ────────────────────────────────────────────────
// GWP values (kg CO2e per kg of refrigerant) — Defra 2025
export const EF_FUGITIVE = {
  'Carbon dioxide': 1.0, 'Methane': 28.0, 'Nitrous oxide': 265.0,
  'HFC-23': 12400.0, 'HFC-32': 677.0, 'HFC-41': 116.0,
  'HFC-125': 3170.0, 'HFC-134': 1120.0, 'HFC-134a': 1300.0,
  'HFC-143': 328.0, 'HFC-143a': 4800.0, 'HFC-152a': 138.0,
  'HFC-227ea': 3350.0, 'HFC-236fa': 8060.0, 'HFC-245fa': 858.0,
  'HFC-43-I0mee': 1650.0, 'HFC-152': 16.0, 'HFC-161': 4.0,
  'HFC-236cb': 1210.0, 'HFC-236ea': 1330.0, 'HFC-245ca': 716.0, 'HFC-365mfc': 804.0,
  'Perfluoromethane (PFC-14)': 6630.0, 'Perfluoroethane (PFC-116)': 11100.0,
  'Perfluoropropane (PFC-218)': 8900.0, 'Perfluorocyclobutane (PFC-318)': 9540.0,
  'Perfluorocyclopropane': 9200.0, 'Perfluorobutane (PFC-3-1-10)': 9200.0,
  'Perfluoropentane (PFC-4-1-12)': 8550.0, 'Perfluorohexane (PFC-5-1-14)': 7910.0,
  'PFC-9-1-18': 7190.0, 'PFPMIE': 9710,
  'Sulphur hexafluoride (SF6)': 23500.0, 'Nitrogen trifluoride': 16100.0,
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
  'R601 = n-pentane': 5, 'R601 = pentane': 5, 'R601A = isopentane': 5,
  'R170 = ethane': 0.437, 'R1270 = propylene': 2, 'R1270 = propene': 2,
  'R1234yf*': 1, 'R1234ze*': 1,
  'R401A': 18.0, 'R401B': 15.0, 'R401C': 21.0,
  'R402A': 1902.0, 'R402B': 1205.0,
  'R403A': 1780.0, 'R403B': 3471.0, 'R404A': 3943.0, 'R405A': 3920.0, 'R406A': 1780,
  'R407A': 1923.0, 'R407B': 2547.0, 'R407C': 1624.0, 'R407D': 1487.0,
  'R407E': 1425.0, 'R407F': 1674.0,
  'R408A': 2430.0, 'R409A': 1485, 'R409B': 1474,
  'R410A': 1924.0, 'R410B': 2048.0,
  'R411A': 15.0, 'R411B': 4.0, 'R412A': 445.0, 'R413A': 1945.0,
  'R414A': 1375, 'R414B': 1274, 'R415A': 25.0, 'R415B': 104.0, 'R416A': 767.0,
  'R417A': 2127.0, 'R417B': 2742.0, 'R417C': 1643.0, 'R418A': 3.0,
  'R419A': 2688.0, 'R419B': 2161.0, 'R420A': 1144.0,
  'R421A': 2385.0, 'R421B': 2890.0,
  'R422A': 2847.0, 'R422B': 2290.0, 'R422C': 2794.0, 'R422D': 2473.0, 'R422E': 2350.0,
  'R423A': 2274.0, 'R424A': 2212.0, 'R425A': 1431.0, 'R426A': 1371.0,
  'R427A': 2024.0, 'R428A': 3417.0,
  'R429A': 13.8, 'R430A': 105.0, 'R431A': 40.0, 'R432A': 1.8,
  'R433A': 0.64, 'R433B': 0.16, 'R433C': 0.55, 'R434A': 3075.0, 'R435A': 27.6,
  'R436A': 1.35, 'R436B': 1.47, 'R437A': 1639.0, 'R438A': 2059.0, 'R439A': 1828.0,
  'R440A': 156.0, 'R441A': 0.23, 'R442A': 1754.0, 'R443A': 1, 'R444A': 88.0, 'R445A': 117.0,
  'R500': 36.0, 'R501': 3870, 'R502': 4786, 'R503': 4972.0, 'R504': 326.0,
  'R505': 7956, 'R506': 3857, 'R507A': 3985.0,
  'R508A': 11607.0, 'R508B': 11698.0, 'R509A': 4984.0,
  'R510A': 1.24, 'R511A': 0.0, 'R512A': 196.0,
}

// ── Scope 2: Electricity ───────────────────────────────────────────────────────
// kg CO2e per kWh — country-specific grid emission factors
export const EF_GRID = {
  'India': 0.95182,
  'United Arab Emirates': 0.3652,
  'UAE': 0.3652,
  'Botswana': 0.97662,
  'UK': 0.177,
  'USA': 0.386,
  'Australia': 0.620,
  'Brazil': 0.074,
  'Canada': 0.130,
  'China': 0.555,
  'France': 0.066,
  'Germany': 0.380,
  'Japan': 0.470,
  'Saudi Arabia': 0.770,
  'Singapore': 0.408,
  'South Africa': 0.930,
  'default': 0.500,
}

// ── Scope 2: Heat & Steam ──────────────────────────────────────────────────────
export const EF_HEAT = {
  'Onsite': 0.179647,
  'District': 0.179647,
  'Onsite heat and steam': 0.179647,
  'District heat and steam': 0.179647,
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
  'Long-haul, to/from UK/Business class': 0.3394,
  'Long-haul, to/from UK/First class': 0.46814,
  'International, to/from non-UK/Average passenger': 0.14253,
  'International, to/from non-UK/Economy class': 0.10916,
  'International, to/from non-UK/Premium economy class': 0.17465,
  'International, to/from non-UK/Business class': 0.31656,
  'International, to/from non-UK/First class': 0.43663,
}

export const EF_TRAVEL_AIR_WITH_RF = {
  "Domestic, to/from UK/Average passenger": 0.22928,
  "Short-haul, to/from UK/Average passenger": 0.12786,
  "Short-haul, to/from UK/Economy class": 0.12576,
  "Short-haul, to/from UK/Business class": 0.18863,
  "Long-haul, to/from UK/Average passenger": 0.15282,
  "Long-haul, to/from UK/Economy class": 0.11704,
  "Long-haul, to/from UK/Premium economy class": 0.18726,
  "Long-haul, to/from UK/Business class": 0.3394,
  "Long-haul, to/from UK/First class": 0.46814,
  "International, to/from non-UK/Average passenger": 0.14253,
  "International, to/from non-UK/Economy class": 0.10916,
  "International, to/from non-UK/Premium economy class": 0.17465,
  "International, to/from non-UK/Business class": 0.31656,
  "International, to/from non-UK/First class": 0.43663
};

export const EF_TRAVEL_AIR_WITHOUT_RF = {
  "Domestic, to/from UK/Average passenger": 0.13552,
  "Short-haul, to/from UK/Average passenger": 0.07559,
  "Short-haul, to/from UK/Economy class": 0.07435,
  "Short-haul, to/from UK/Business class": 0.11152,
  "Long-haul, to/from UK/Average passenger": 0.09043,
  "Long-haul, to/from UK/Economy class": 0.06926,
  "Long-haul, to/from UK/Premium economy class": 0.11081,
  "Long-haul, to/from UK/Business class": 0.20083,
  "Long-haul, to/from UK/First class": 0.27701,
  "International, to/from non-UK/Average passenger": 0.0842,
  "International, to/from non-UK/Economy class": 0.06449,
  "International, to/from non-UK/Premium economy class": 0.10318,
  "International, to/from non-UK/Business class": 0.18701,
  "International, to/from non-UK/First class": 0.25794
};

// ── Scope 3: Business Travel (Sea) ────────────────────────────────────────────
export const EF_TRAVEL_SEA = {
  'Foot passenger': 0.01871,
  'Car passenger': 0.12933,
  'Average (all passenger)': 0.1127,
}

// ── Scope 3: Business Travel (Land) + Employee Commute ───────────────────────
// kg CO2e per km
export const EF_TRAVEL_LAND = {
  'Small car': 0.14327, 'Medium car': 0.17209, 'Large car': 0.20905, 'Average car': 0.17265,
  'Mini': 0.10998, 'Supermini': 0.13461, 'Lower medium': 0.14457,
  'Upper medium': 0.1611, 'Executive': 0.1689, 'Luxury': 0.20205,
  'Sports': 0.17388, 'Dual purpose 4X4': 0.19794, 'MPV': 0.17982,
  'Motorbike (Small)': 0.08319, 'Motorbike (Medium)': 0.10107,
  'Motorbike (Large)': 0.13252, 'Motorbike (Average)': 0.11367,
  'Average local bus': 0.10151, 'Local London bus': 0.0636,
  'Local bus (not London)': 0.12552, 'Coach': 0.03948,
  'National rail': 0.03092, 'International rail': 0.01135,
  'Light rail and tram': 0.02121, 'London Underground': 0.01549,
  'Regular taxi': 0.14861, 'Black cab': 0.20402, 'Average taxi': 0.23320,
}

// Employee commute alias (same EF table, same unit)
export const EF_COMMUTE = EF_TRAVEL_LAND;

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

// ── Scope 3: Purchased Goods & Services ───────────────────────────────────────
export const EF_GOODS = {
  'Average construction': 74.9958,
  'Asbestos': 27.0,
  'Asphalt': 39.21249,
  'Bricks': 241.80307,
  'Concrete': 118.80307,
  'Insulation': 1861.80307,
  'Metals': 3821.94858,
  'Soils': 1.00835,
  'Mineral oil': 1401.0,
  'Plasterboard': 120.05,
  'Tyres': 3335.5719,
  'Wood': 269.50416,
  'Paper and board: average paper': 918.57143,
  'Plastics: average plastics': 3170.5068,
  'Plastics: average plastic film': 2914.94602,
  'Plastics: average plastic rigid': 3351.96455,
  'Plastics: HDPE (incl. forming)': 3092.8927,
  'Plastics: LDPE and LLDPE (incl. forming)': 2963.59114,
  'Plastics: PET (incl. forming)': 3861.58251,
  'Plastics: PP (incl. forming)': 2575.25292,
  'Plastics: PS (incl. forming)': 4374.38685,
  'Plastics: PVC (incl. forming)': 2942.43735,
}

export const EF_GOODS_LOOPS = {
  "Average construction": {
    "Primary material production": 75.00675,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": null
  },
  "Asbestos": {
    "Primary material production": 27.0,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": null
  },
  "Asphalt": {
    "Primary material production": 39.21249,
    "Re-used": 1.73826,
    "Open-loop": null,
    "Closed-loop": 28.67835
  },
  "Bricks": {
    "Primary material production": 241.79306,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": null
  },
  "Concrete": {
    "Primary material production": 118.79306,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": 3.21835
  },
  "Insulation": {
    "Primary material production": 1861.79306,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": 1852.12293
  },
  "Metals": {
    "Primary material production": 3824.09335,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": 1638.74406
  },
  "Soils": {
    "Primary material production": null,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": 1.00835
  },
  "Mineral oil": {
    "Primary material production": 1401.0,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": 676.0
  },
  "Plasterboard": {
    "Primary material production": 120.05,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": 32.17
  },
  "Tyres": {
    "Primary material production": 3335.5719,
    "Re-used": 731.21789,
    "Open-loop": null,
    "Closed-loop": null
  },
  "Wood": {
    "Primary material production": 269.50416,
    "Re-used": 38.54288,
    "Open-loop": null,
    "Closed-loop": null
  },
  "Books": {
    "Primary material production": null,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": null
  },
  "Glass": {
    "Primary material production": 1402.76667,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": 823.18954
  },
  "Clothing": {
    "Primary material production": 22310.0,
    "Re-used": 152.25,
    "Open-loop": null,
    "Closed-loop": null
  },
  "Food and drink": {
    "Primary material production": 3701.40359,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": null
  },
  "Compost derived from garden waste": {
    "Primary material production": 112.08811,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": null
  },
  "Compost derived from food and garden waste": {
    "Primary material production": 114.90473,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": null
  },
  "Electrical items - fridges and freezers": {
    "Primary material production": 4363.33333,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": null
  },
  "Electrical items - large": {
    "Primary material production": 3267.0,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": null
  },
  "Electrical items - IT": {
    "Primary material production": 24865.47556,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": null
  },
  "Electrical items - small": {
    "Primary material production": 5647.94563,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": null
  },
  "Batteries - Alkaline": {
    "Primary material production": 4633.47826,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": null
  },
  "Batteries - Li ion": {
    "Primary material production": 6308.0,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": null
  },
  "Batteries - NiMh": {
    "Primary material production": 28380.0,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": null
  },
  "Metal: aluminium cans and foil (excl. forming)": {
    "Primary material production": 9115.90131,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": 995.0779
  },
  "Metal: mixed cans": {
    "Primary material production": 5114.62131,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": 1525.52488
  },
  "Metal: scrap metal": {
    "Primary material production": 3473.11953,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": 1706.42359
  },
  "Metal: steel cans": {
    "Primary material production": 2863.90131,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": 1823.90131
  },
  "Plastics: average plastics": {
    "Primary material production": 3172.49932,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": 1575.39106
  },
  "Plastics: average plastic film": {
    "Primary material production": 2916.50513,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": 1103.56537
  },
  "Plastics: average plastic rigid": {
    "Primary material production": 3354.28062,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": 1915.72549
  },
  "Plastics: HDPE (incl. forming)": {
    "Primary material production": 3095.15524,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": 1770.79099
  },
  "Plastics: LDPE and LLDPE (incl. forming)": {
    "Primary material production": 2965.0779,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": 1097.90131
  },
  "Plastics: PET (incl. forming)": {
    "Primary material production": 3863.90131,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": 2213.90131
  },
  "Plastics: PP (incl. forming)": {
    "Primary material production": 2577.57172,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": 1312.57172
  },
  "Plastics: PS (incl. forming)": {
    "Primary material production": 4376.80391,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": 2669.76255
  },
  "Plastics: PVC (incl. forming)": {
    "Primary material production": 2944.75615,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": 1847.82267
  },
  "Paper and board: board": {
    "Primary material production": 1199.72542,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": 1098.11442
  },
  "Paper and board: mixed": {
    "Primary material production": 1288.50358,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": 1068.77475
  },
  "Paper and board: paper": {
    "Primary material production": 1345.0779,
    "Re-used": null,
    "Open-loop": null,
    "Closed-loop": 1050.0779
  }
};

export const EF_MOBILE_CASCADED = {
  "Diesel/Mini/km": 0.10996,
  "Petrol/Mini/km": 0.13063,
  "Unknown/Mini/km": 0.13051,
  "Battery EV/Mini/km": 0,
  "Diesel/Mini/miles": 0.17696,
  "Petrol/Mini/miles": 0.21022,
  "Unknown/Mini/miles": 0.21002,
  "Battery EV/Mini/miles": 0,
  "Diesel/Supermini/km": 0.13452,
  "Petrol/Supermini/km": 0.14276,
  "Unknown/Supermini/km": 0.14194,
  "Plug-in Hybrid/Supermini/km": 0.03008,
  "Battery EV/Supermini/km": 0,
  "Diesel/Supermini/miles": 0.21649,
  "Petrol/Supermini/miles": 0.22974,
  "Unknown/Supermini/miles": 0.22843,
  "Plug-in Hybrid/Supermini/miles": 0.04841,
  "Battery EV/Supermini/miles": 0,
  "Diesel/Lower medium/km": 0.14517,
  "Petrol/Lower medium/km": 0.16123,
  "Unknown/Lower medium/km": 0.15473,
  "Plug-in Hybrid/Lower medium/km": 0.07482,
  "Battery EV/Lower medium/km": 0,
  "Diesel/Lower medium/miles": 0.23363,
  "Petrol/Lower medium/miles": 0.25948,
  "Unknown/Lower medium/miles": 0.249,
  "Plug-in Hybrid/Lower medium/miles": 0.12044,
  "Battery EV/Lower medium/miles": 0,
  "Diesel/Upper medium/km": 0.16194,
  "Petrol/Upper medium/km": 0.18535,
  "Unknown/Upper medium/km": 0.16752,
  "Plug-in Hybrid/Upper medium/km": 0.08106,
  "Battery EV/Upper medium/km": 0,
  "Diesel/Upper medium/miles": 0.26063,
  "Petrol/Upper medium/miles": 0.29828,
  "Unknown/Upper medium/miles": 0.26959,
  "Plug-in Hybrid/Upper medium/miles": 0.13047,
  "Battery EV/Upper medium/miles": 0,
  "Diesel/Executive/km": 0.17088,
  "Petrol/Executive/km": 0.20073,
  "Unknown/Executive/km": 0.17846,
  "Plug-in Hybrid/Executive/km": 0.08258,
  "Battery EV/Executive/km": 0,
  "Diesel/Executive/miles": 0.27501,
  "Petrol/Executive/miles": 0.32304,
  "Unknown/Executive/miles": 0.2872,
  "Plug-in Hybrid/Executive/miles": 0.13291,
  "Battery EV/Executive/miles": 0,
  "Diesel/Luxury/km": 0.20632,
  "Petrol/Luxury/km": 0.30752,
  "Unknown/Luxury/km": 0.25196,
  "Plug-in Hybrid/Luxury/km": 0.11489,
  "Battery EV/Luxury/km": 0,
  "Diesel/Luxury/miles": 0.33205,
  "Petrol/Luxury/miles": 0.4949,
  "Unknown/Luxury/miles": 0.4055,
  "Plug-in Hybrid/Luxury/miles": 0.18488,
  "Battery EV/Luxury/miles": 0,
  "Diesel/Sports/km": 0.17323,
  "Petrol/Sports/km": 0.23396,
  "Unknown/Sports/km": 0.224,
  "Plug-in Hybrid/Sports/km": 0.14157,
  "Battery EV/Sports/km": 0,
  "Diesel/Sports/miles": 0.27879,
  "Petrol/Sports/miles": 0.37652,
  "Unknown/Sports/miles": 0.36048,
  "Plug-in Hybrid/Sports/miles": 0.22785,
  "Battery EV/Sports/miles": 0,
  "Diesel/Dual purpose 4X4/km": 0.19973,
  "Petrol/Dual purpose 4X4/km": 0.19219,
  "Unknown/Dual purpose 4X4/km": 0.1969,
  "Plug-in Hybrid/Dual purpose 4X4/km": 0.10205,
  "Battery EV/Dual purpose 4X4/km": 0,
  "Diesel/Dual purpose 4X4/miles": 0.32145,
  "Petrol/Dual purpose 4X4/miles": 0.3093,
  "Unknown/Dual purpose 4X4/miles": 0.31687,
  "Plug-in Hybrid/Dual purpose 4X4/miles": 0.16424,
  "Battery EV/Dual purpose 4X4/miles": 0,
  "Diesel/MPV/km": 0.18072,
  "Petrol/MPV/km": 0.17903,
  "Unknown/MPV/km": 0.1803,
  "Plug-in Hybrid/MPV/km": 0.08344,
  "Battery EV/MPV/km": 0,
  "Diesel/MPV/miles": 0.29085,
  "Petrol/MPV/miles": 0.28812,
  "Unknown/MPV/miles": 0.29016,
  "Plug-in Hybrid/MPV/miles": 0.13429,
  "Battery EV/MPV/miles": 0,
  "Diesel/Small car/km": 0.1434,
  "Petrol/Small car/km": 0.14308,
  "Hybrid/Small car/km": 0.11413,
  "Unknown/Small car/km": 0.14322,
  "Plug-in Hybrid/Small car/km": 0.03008,
  "Battery EV/Small car/km": 0,
  "Diesel/Small car/miles": 0.23078,
  "Petrol/Small car/miles": 0.23027,
  "Hybrid/Small car/miles": 0.18368,
  "Unknown/Small car/miles": 0.23049,
  "Plug-in Hybrid/Small car/miles": 0.04841,
  "Battery EV/Small car/miles": 0,
  "Diesel/Medium car/km": 0.17174,
  "Petrol/Medium car/km": 0.17474,
  "Hybrid/Medium car/km": 0.11724,
  "CNG/Medium car/km": 0.15504,
  "LPG/Medium car/km": 0.17427,
  "Unknown/Medium car/km": 0.17322,
  "Plug-in Hybrid/Medium car/km": 0.07789,
  "Battery EV/Medium car/km": 0,
  "Diesel/Medium car/miles": 0.27639,
  "Petrol/Medium car/miles": 0.28121,
  "Hybrid/Medium car/miles": 0.18869,
  "CNG/Medium car/miles": 0.24952,
  "LPG/Medium car/miles": 0.28046,
  "Unknown/Medium car/miles": 0.27877,
  "Plug-in Hybrid/Medium car/miles": 0.12536,
  "Battery EV/Medium car/miles": 0,
  "Diesel/Large car/km": 0.21007,
  "Petrol/Large car/km": 0.26828,
  "Hybrid/Large car/km": 0.1565,
  "CNG/Large car/km": 0.23722,
  "LPG/Large car/km": 0.26771,
  "Unknown/Large car/km": 0.22678,
  "Plug-in Hybrid/Large car/km": 0.10033,
  "Battery EV/Large car/km": 0,
  "Diesel/Large car/miles": 0.33808,
  "Petrol/Large car/miles": 0.43175,
  "Hybrid/Large car/miles": 0.25184,
  "CNG/Large car/miles": 0.38177,
  "LPG/Large car/miles": 0.43082,
  "Unknown/Large car/miles": 0.36495,
  "Plug-in Hybrid/Large car/miles": 0.16146,
  "Battery EV/Large car/miles": 0,
  "Diesel/Average car/km": 0.17304,
  "Petrol/Average car/km": 0.16272,
  "Hybrid/Average car/km": 0.12825,
  "CNG/Average car/km": 0.17414,
  "LPG/Average car/km": 0.19599,
  "Unknown/Average car/km": 0.16725,
  "Plug-in Hybrid/Average car/km": 0.09167,
  "Battery EV/Average car/km": 0,
  "Diesel/Average car/miles": 0.27849,
  "Petrol/Average car/miles": 0.26187,
  "Hybrid/Average car/miles": 0.20639,
  "CNG/Average car/miles": 0.28025,
  "LPG/Average car/miles": 0.31541,
  "Unknown/Average car/miles": 0.26915,
  "Plug-in Hybrid/Average car/miles": 0.14751,
  "Battery EV/Average car/miles": 0,
  "Diesel/Small/km": 0.08319,
  "Diesel/Small/miles": 0.13389,
  "Diesel/Medium/km": 0.10107,
  "Diesel/Medium/miles": 0.16265,
  "Diesel/Large/km": 0.13252,
  "Diesel/Large/miles": 0.21326,
  "Diesel/Average/km": 0.11367,
  "Diesel/Average/miles": 0.18293,
  "Diesel/Class I (up to 1.305 tonnes)/km": 0.15738,
  "Diesel/Vans - Class I (up to 1.305 tonnes)/km": 0.15738,
  "Petrol/Class I (up to 1.305 tonnes)/km": 0.20188,
  "Petrol/Vans - Class I (up to 1.305 tonnes)/km": 0.20188,
  "Diesel/Class I (up to 1.305 tonnes)/miles": 0.25329,
  "Diesel/Vans - Class I (up to 1.305 tonnes)/miles": 0.25329,
  "Petrol/Class I (up to 1.305 tonnes)/miles": 0.3249,
  "Petrol/Vans - Class I (up to 1.305 tonnes)/miles": 0.3249,
  "Diesel/Class II (1.305 to 1.74 tonnes)/km": 0.1926,
  "Diesel/Vans - Class II (1.305 to 1.74 tonnes)/km": 0.1926,
  "Petrol/Class II (1.305 to 1.74 tonnes)/km": 0.20874,
  "Petrol/Vans - Class II (1.305 to 1.74 tonnes)/km": 0.20874,
  "Diesel/Class II (1.305 to 1.74 tonnes)/miles": 0.30996,
  "Diesel/Vans - Class II (1.305 to 1.74 tonnes)/miles": 0.30996,
  "Petrol/Class II (1.305 to 1.74 tonnes)/miles": 0.33594,
  "Petrol/Vans - Class II (1.305 to 1.74 tonnes)/miles": 0.33594,
  "Diesel/Class III (1.74 to 3.5 tonnes)/km": 0.27878,
  "Diesel/Vans - Class III (1.74 to 3.5 tonnes)/km": 0.27878,
  "Petrol/Class III (1.74 to 3.5 tonnes)/km": 0.33845,
  "Petrol/Vans - Class III (1.74 to 3.5 tonnes)/km": 0.33845,
  "Battery EV/Class III (1.74 to 3.5 tonnes)/km": 0.13055,
  "Battery EV/Vans - Class III (1.74 to 3.5 tonnes)/km": 0.13055,
  "Diesel/Class III (1.74 to 3.5 tonnes)/miles": 0.44866,
  "Diesel/Vans - Class III (1.74 to 3.5 tonnes)/miles": 0.44866,
  "Petrol/Class III (1.74 to 3.5 tonnes)/miles": 0.54468,
  "Petrol/Vans - Class III (1.74 to 3.5 tonnes)/miles": 0.54468,
  "Battery EV/Class III (1.74 to 3.5 tonnes)/miles": 0.2101,
  "Battery EV/Vans - Class III (1.74 to 3.5 tonnes)/miles": 0.2101,
  "Diesel/Average (up to 3.5 tonnes)/km": 0.25561,
  "Diesel/Vans - Average (up to 3.5 tonnes)/km": 0.25561,
  "Petrol/Average (up to 3.5 tonnes)/km": 0.21335,
  "Petrol/Vans - Average (up to 3.5 tonnes)/km": 0.21335,
  "LPG/Average (up to 3.5 tonnes)/km": 0.25113,
  "LPG/Vans - Average (up to 3.5 tonnes)/km": 0.25113,
  "CNG/Average (up to 3.5 tonnes)/km": 0.2761,
  "CNG/Vans - Average (up to 3.5 tonnes)/km": 0.2761,
  "Battery EV/Average (up to 3.5 tonnes)/km": 0.13055,
  "Battery EV/Vans - Average (up to 3.5 tonnes)/km": 0.13055,
  "Diesel/Average (up to 3.5 tonnes)/miles": 0.41138,
  "Diesel/Vans - Average (up to 3.5 tonnes)/miles": 0.41138,
  "Petrol/Average (up to 3.5 tonnes)/miles": 0.34336,
  "Petrol/Vans - Average (up to 3.5 tonnes)/miles": 0.34336,
  "LPG/Average (up to 3.5 tonnes)/miles": 0.40415,
  "LPG/Vans - Average (up to 3.5 tonnes)/miles": 0.40415,
  "CNG/Average (up to 3.5 tonnes)/miles": 0.44433,
  "CNG/Vans - Average (up to 3.5 tonnes)/miles": 0.44433,
  "Battery EV/Average (up to 3.5 tonnes)/miles": 0.2101,
  "Battery EV/Vans - Average (up to 3.5 tonnes)/miles": 0.2101,
  "Diesel/Rigid (>3.5 - 7.5 tonnes)/km": 0.59005,
  "Diesel/HGV (all diesel) - Rigid (>3.5 - 7.5 tonnes)/km": 0.49548,
  "Diesel/Rigid (>3.5 - 7.5 tonnes)/miles": 0.94959,
  "Diesel/Rigid (>7.5 tonnes-17 tonnes)/km": 0.72049,
  "Diesel/Rigid (>7.5 tonnes-17 tonnes)/miles": 1.15952,
  "Diesel/Rigid (>17 tonnes)/km": 1.18083,
  "Diesel/Rigid (>17 tonnes)/miles": 1.90036,
  "Diesel/All rigids/km": 0.80843,
  "Diesel/Vans - All rigids/km": 0.80843,
  "Petrol/All rigids/km": 0.96223,
  "Petrol/Vans - All rigids/km": 0.96223,
  "LPG/All rigids/km": 1.11603,
  "LPG/Vans - All rigids/km": 1.11603,
  "CNG/All rigids/km": 0.99739,
  "CNG/Vans - All rigids/km": 0.99739,
  "Diesel/All rigids/miles": 1.30103,
  "Diesel/Vans - All rigids/miles": 1.30103,
  "Petrol/All rigids/miles": 1.54855,
  "Petrol/Vans - All rigids/miles": 1.54855,
  "LPG/All rigids/miles": 1.79606,
  "LPG/Vans - All rigids/miles": 1.79606,
  "CNG/All rigids/miles": 1.60513,
  "CNG/Vans - All rigids/miles": 1.60513,
  "Diesel/Articulated (>3.5 - 33t)/km": 0.90759,
  "Diesel/Articulated (>3.5 - 33t)/miles": 1.46061,
  "Diesel/Articulated (>33t)/km": 1.08051,
  "Diesel/Articulated (>33t)/miles": 1.7389,
  "Diesel/All artics/km": 0.74715,
  "Diesel/Vans - All artics/km": 0.74715,
  "Petrol/All artics/km": 0.98913,
  "Petrol/Vans - All artics/km": 0.98913,
  "LPG/All artics/km": 1.23112,
  "LPG/Vans - All artics/km": 1.23112,
  "CNG/All artics/km": 1.07395,
  "CNG/Vans - All artics/km": 1.07395,
  "Diesel/All artics/miles": 1.20241,
  "Diesel/Vans - All artics/miles": 1.20241,
  "Petrol/All artics/miles": 1.59184,
  "Petrol/Vans - All artics/miles": 1.59184,
  "LPG/All artics/miles": 1.98128,
  "LPG/Vans - All artics/miles": 1.98128,
  "CNG/All artics/miles": 1.72834,
  "CNG/Vans - All artics/miles": 1.72834,
  "Diesel/All HGVs/km": 1.04323,
  "Diesel/All HGVs/miles": 1.67891,
  "Diesel/HGVs refrigerated (all diesel) - Rigid (>3.5 - 7.5 tonnes)/km": 0.59005
};

export const EF_FREIGHT = {
  "Vans/Diesel/Class I (up to 1.305 tonnes)": 0.87423,
  "Vans - Diesel - Class I (up to 1.305 tonnes)": 0.87423,
  "Vans - Diesel - Average (up to 3.5 - tonnes)": 0.6313,
  "Vans/Petrol/Class I (up to 1.305 tonnes)": 1.42906,
  "Vans - Petrol - Class I (up to 1.305 tonnes)": 1.42906,
  "Vans - Petrol - Average (up to 3.5 - tonnes)": 0.85537,
  "Vans/Diesel/Class II (1.305 to 1.74 tonnes)": 0.62562,
  "Vans - Diesel - Class II (1.305 to 1.74 tonnes)": 0.62562,
  "Vans/Petrol/Class II (1.305 to 1.74 tonnes)": 0.81534,
  "Vans - Petrol - Class II (1.305 to 1.74 tonnes)": 0.81534,
  "Vans/Diesel/Class III (1.74 to 3.5 tonnes)": 0.62849,
  "Vans - Diesel - Class III (1.74 to 3.5 tonnes)": 0.62849,
  "Vans/Petrol/Class III (1.74 to 3.5 tonnes)": 0.83593,
  "Vans - Petrol - Class III (1.74 to 3.5 tonnes)": 0.83593,
  "Vans/Battery EV/Class III (1.74 to 3.5 tonnes)": 0.36985,
  "Vans - Battery EV - Class III (1.74 to 3.5 tonnes)": 0.36985,
  "Vans - Battery EV - Average (up to 3.5 - tonnes)": 0.36985,
  "Vans/Diesel/Average (up to 3.5 tonnes)": 0.6313,
  "Vans - Diesel - Average (up to 3.5 tonnes)": 0.6313,
  "Vans/Petrol/Average (up to 3.5 tonnes)": 0.85537,
  "Vans - Petrol - Average (up to 3.5 tonnes)": 0.85537,
  "Vans/LPG/Average (up to 3.5 tonnes)": 0.62419,
  "Vans - LPG - Average (up to 3.5 tonnes)": 0.62419,
  "Vans - LPG - Average (up to 3.5 - tonnes)": 0.62419,
  "Vans/CNG/Average (up to 3.5 tonnes)": 0.68621,
  "Vans - CNG - Average (up to 3.5 tonnes)": 0.68621,
  "Vans - CNG - Average (up to 3.5 - tonnes)": 0.68621,
  "Vans/Battery EV/Average (up to 3.5 tonnes)": 0.36985,
  "Vans - Battery EV - Average (up to 3.5 tonnes)": 0.36985,
  "HGV/50% Laden/Rigid (>3.5 - 7.5 tonnes)": 0.45916,
  "HGV - 50% Laden - Rigid (>3.5 - 7.5 tonnes)": 0.45916,
  "HGV - All Diesel - 50% Laden - Rigid (>3.5 - 7.5 tonnes)": 0.45916,
  "HGV - All Diesel/50% Laden/Rigid (>3.5 - 7.5 tonnes)": 0.45916,
  "HGV/100% Laden/Rigid (>3.5 - 7.5 tonnes)": 0.24776,
  "HGV - 100% Laden - Rigid (>3.5 - 7.5 tonnes)": 0.24776,
  "HGV - All Diesel - 100% Laden - Rigid (>3.5 - 7.5 tonnes)": 0.24776,
  "HGV - All Diesel/100% Laden/Rigid (>3.5 - 7.5 tonnes)": 0.24776,
  "HGV/Average/Rigid (>3.5 - 7.5 tonnes)": 0.52761,
  "HGV - Average - Rigid (>3.5 - 7.5 tonnes)": 0.52761,
  "HGV - All Diesel - Average - Rigid (>3.5 - 7.5 tonnes)": 0.52761,
  "HGV - All Diesel/Average/Rigid (>3.5 - 7.5 tonnes)": 0.52761,
  "HGV/50% Laden/Rigid (>7.5 tonnes-17 tonnes)": 0.26427,
  "HGV - 50% Laden - Rigid (>7.5 tonnes-17 tonnes)": 0.26427,
  "HGV - All Diesel - 50% Laden - Rigid (>7.5 tonnes-17 tonnes)": 0.26427,
  "HGV - All Diesel/50% Laden/Rigid (>7.5 tonnes-17 tonnes)": 0.26427,
  "HGV/100% Laden/Rigid (>7.5 tonnes-17 tonnes)": 0.14849,
  "HGV - 100% Laden - Rigid (>7.5 tonnes-17 tonnes)": 0.14849,
  "HGV - All Diesel - 100% Laden - Rigid (>7.5 tonnes-17 tonnes)": 0.14849,
  "HGV - All Diesel/100% Laden/Rigid (>7.5 tonnes-17 tonnes)": 0.14849,
  "HGV/Average/Rigid (>7.5 tonnes-17 tonnes)": 0.36362,
  "HGV - Average - Rigid (>7.5 tonnes-17 tonnes)": 0.36362,
  "HGV - All Diesel - Average - Rigid (>7.5 tonnes-17 tonnes)": 0.36362,
  "HGV - All Diesel/Average/Rigid (>7.5 tonnes-17 tonnes)": 0.36362,
  "HGV/50% Laden/Rigid (>17 tonnes)": 0.21116,
  "HGV - 50% Laden - Rigid (>17 tonnes)": 0.21116,
  "HGV - All Diesel - 50% Laden - Rigid (>17 tonnes)": 0.21116,
  "HGV - All Diesel/50% Laden/Rigid (>17 tonnes)": 0.21116,
  "HGV/100% Laden/Rigid (>17 tonnes)": 0.12436,
  "HGV - 100% Laden - Rigid (>17 tonnes)": 0.12436,
  "HGV - All Diesel - 100% Laden - Rigid (>17 tonnes)": 0.12436,
  "HGV - All Diesel/100% Laden/Rigid (>17 tonnes)": 0.12436,
  "HGV/Average/Rigid (>17 tonnes)": 0.17146,
  "HGV - Average - Rigid (>17 tonnes)": 0.17146,
  "HGV - All Diesel - Average - Rigid (>17 tonnes)": 0.17146,
  "HGV - All Diesel/Average/Rigid (>17 tonnes)": 0.17146,
  "HGV/50% Laden/All rigids": 0.2258,
  "HGV - 50% Laden - All rigids": 0.2258,
  "HGV - All Diesel - 50% Laden - All rigids": 0.2258,
  "HGV - All Diesel/50% Laden/All rigids": 0.2258,
  "HGV/100% Laden/All rigids": 0.13155,
  "HGV - 100% Laden - All rigids": 0.13155,
  "HGV - All Diesel - 100% Laden - All rigids": 0.13155,
  "HGV - All Diesel/100% Laden/All rigids": 0.13155,
  "HGV/Average/All rigids": 0.19748,
  "HGV - Average - All rigids": 0.19748,
  "HGV - All Diesel - Average - All rigids": 0.19748,
  "HGV - All Diesel/Average/All rigids": 0.19748,
  "HGV/50% Laden/Articulated (>3.5 - 33t)": 0.12823,
  "HGV - 50% Laden - Articulated (>3.5 - 33t)": 0.12823,
  "HGV - All Diesel - 50% Laden - Articulated (>3.5 - 33t)": 0.12823,
  "HGV - All Diesel/50% Laden/Articulated (>3.5 - 33t)": 0.12823,
  "HGV/100% Laden/Articulated (>3.5 - 33t)": 0.07674,
  "HGV - 100% Laden - Articulated (>3.5 - 33t)": 0.07674,
  "HGV - All Diesel - 100% Laden - Articulated (>3.5 - 33t)": 0.07674,
  "HGV - All Diesel/100% Laden/Articulated (>3.5 - 33t)": 0.07674,
  "HGV/Average/Articulated (>3.5 - 33t)": 0.12633,
  "HGV - Average - Articulated (>3.5 - 33t)": 0.12633,
  "HGV - All Diesel - Average - Articulated (>3.5 - 33t)": 0.12633,
  "HGV - All Diesel/Average/Articulated (>3.5 - 33t)": 0.12633,
  "HGV/50% Laden/Articulated (>33t)": 0.09612,
  "HGV - 50% Laden - Articulated (>33t)": 0.09612,
  "HGV - All Diesel - 50% Laden - Articulated (>33t)": 0.09612,
  "HGV - All Diesel/50% Laden/Articulated (>33t)": 0.09612,
  "HGV/100% Laden/Articulated (>33t)": 0.05988,
  "HGV - 100% Laden - Articulated (>33t)": 0.05988,
  "HGV - All Diesel - 100% Laden - Articulated (>33t)": 0.05988,
  "HGV - All Diesel/100% Laden/Articulated (>33t)": 0.05988,
  "HGV/Average/Articulated (>33t)": 0.07703,
  "HGV - Average - Articulated (>33t)": 0.07703,
  "HGV - All Diesel - Average - Articulated (>33t)": 0.07703,
  "HGV - All Diesel/Average/Articulated (>33t)": 0.07703,
  "HGV/50% Laden/All artics": 0.09675,
  "HGV - 50% Laden - All artics": 0.09675,
  "HGV - All Diesel - 50% Laden - All artics": 0.09675,
  "HGV - All Diesel/50% Laden/All artics": 0.09675,
  "HGV/100% Laden/All artics": 0.06021,
  "HGV - 100% Laden - All artics": 0.06021,
  "HGV - All Diesel - 100% Laden - All artics": 0.06021,
  "HGV - All Diesel/100% Laden/All artics": 0.06021,
  "HGV/Average/All artics": 0.078,
  "HGV - Average - All artics": 0.078,
  "HGV - All Diesel - Average - All artics": 0.078,
  "HGV - All Diesel/Average/All artics": 0.078,
  "HGV/50% Laden/All HGVs": 0.12226,
  "HGV - 50% Laden - All HGVs": 0.12226,
  "HGV - All Diesel - 50% Laden - All HGVs": 0.12226,
  "HGV - All Diesel/50% Laden/All HGVs": 0.12226,
  "HGV/100% Laden/All HGVs": 0.07431,
  "HGV - 100% Laden - All HGVs": 0.07431,
  "HGV - All Diesel - 100% Laden - All HGVs": 0.07431,
  "HGV - All Diesel/100% Laden/All HGVs": 0.07431,
  "HGV/Average/All HGVs": 0.10163,
  "HGV - Average - All HGVs": 0.10163,
  "HGV - All Diesel - Average - All HGVs": 0.10163,
  "HGV - All Diesel/Average/All HGVs": 0.10163,
  "Freight flights/With RF/Domestic, to/from UK": 4.60397,
  "Freight flights - With RF - Domestic, to/from UK": 4.60397,
  "Freight flights - Domestic, to/from UK - With RF": 4.60397,
  "Freight flights - Domestic, - to/from UK - With RF": 4.60397,
  "Freight flights/Without RF/Domestic, to/from UK": 2.71931,
  "Freight flights - Without RF - Domestic, to/from UK": 2.71931,
  "Freight flights - Domestic, to/from UK - Without RF": 2.71931,
  "Freight flights - Domestic, - to/from UK - Without RF": 2.71931,
  "Freight flights/With RF/Short-haul, to/from UK": 1.27835,
  "Freight flights - With RF - Short-haul, to/from UK": 1.27835,
  "Freight flights - Short-haul, to/from UK - With RF": 1.27835,
  "Freight flights - Short-haul, - to/from UK - With RF": 1.27835,
  "Freight flights/Without RF/Short-haul, to/from UK": 0.75539,
  "Freight flights - Without RF - Short-haul, to/from UK": 0.75539,
  "Freight flights - Short-haul, to/from UK - Without RF": 0.75539,
  "Freight flights - Short-haul, - to/from UK - Without RF": 0.75539,
  "Freight flights/With RF/Long-haul, to/from UK": 0.89939,
  "Freight flights - With RF - Long-haul, to/from UK": 0.89939,
  "Freight flights - Long-haul, to/from UK - With RF": 0.89939,
  "Freight flights - Long-haul, - to/from UK - With RF": 0.89939,
  "Freight flights/Without RF/Long-haul, to/from UK": 0.5313,
  "Freight flights - Without RF - Long-haul, to/from UK": 0.5313,
  "Freight flights - Long-haul, to/from UK - Without RF": 0.5313,
  "Freight flights - Long-haul, - to/from UK - Without RF": 0.5313,
  "Freight flights/With RF/International, to/from non-UK": 0.89939,
  "Freight flights - With RF - International, to/from non-UK": 0.89939,
  "Freight flights - International, to/from non-UK - With RF": 0.89939,
  "Freight flights - International, - to/from non-UK - With RF": 0.89939,
  "Freight flights/Without RF/International, to/from non-UK": 0.5313,
  "Freight flights - Without RF - International, to/from non-UK": 0.5313,
  "Freight flights - International, to/from non-UK - Without RF": 0.5313,
  "Freight flights - International, - to/from non-UK - Without RF": 0.5313,
  "Sea tanker/Crude tanker": 0.00294,
  "Sea tanker - Crude tanker": 0.00294,
  "Sea tanker/Crude tanker/200,000+ dwt": 0.00294,
  "Sea tanker - Crude tanker - 200,000+ dwt": 0.00294,
  "Sea tanker/Products tanker ": 0.00577,
  "Sea tanker - Products tanker ": 0.00577,
  "Sea tanker/Products tanker /60,000+ dwt": 0.00577,
  "Sea tanker - Products tanker  - 60,000+ dwt": 0.00577,
  "Sea tanker/Chemical tanker ": 0.0085,
  "Sea tanker - Chemical tanker ": 0.0085,
  "Sea tanker/Chemical tanker /20,000+ dwt": 0.0085,
  "Sea tanker - Chemical tanker  - 20,000+ dwt": 0.0085,
  "Sea tanker/LNG tanker": 0.00942,
  "Sea tanker - LNG tanker": 0.00942,
  "Sea tanker/LNG tanker/200,000+ m3": 0.00942,
  "Sea tanker - LNG tanker - 200,000+ m3": 0.00942,
  "Sea tanker/LPG Tanker": 0.00911,
  "Sea tanker - LPG Tanker": 0.00911,
  "Sea tanker/LPG Tanker/50,000+ m3": 0.00911,
  "Sea tanker - LPG Tanker - 50,000+ m3": 0.00911,
  "Cargo ship/Bulk carrier": 0.00253,
  "Cargo ship - Bulk carrier": 0.00253,
  "Cargo ship/Bulk carrier/200,000+ dwt": 0.00253,
  "Cargo ship - Bulk carrier - 200,000+ dwt": 0.00253,
  "Cargo ship/General cargo": 0.01205,
  "Cargo ship - General cargo": 0.01205,
  "Cargo ship/General cargo/10,000+ dwt": 0.01205,
  "Cargo ship - General cargo - 10,000+ dwt": 0.01205,
  "Cargo ship/Container ship": 0.01266,
  "Cargo ship - Container ship": 0.01266,
  "Cargo ship/Container ship/8000+ TEU": 0.01266,
  "Cargo ship - Container ship - 8000+ TEU": 0.01266,
  "Cargo ship/Vehicle transport": 0.0324,
  "Cargo ship - Vehicle transport": 0.0324,
  "Cargo ship/Vehicle transport/4000+ CEU": 0.0324,
  "Cargo ship - Vehicle transport - 4000+ CEU": 0.0324,
  "Cargo ship/RoRo-Ferry": 0.05012,
  "Cargo ship - RoRo-Ferry": 0.05012,
  "Cargo ship/RoRo-Ferry/2000+ LM": 0.05012,
  "Cargo ship - RoRo-Ferry - 2000+ LM": 0.05012,
  "Cargo ship/Large RoPax ferry": 0.37612,
  "Cargo ship - Large RoPax ferry": 0.37612,
  "Cargo ship/Large RoPax ferry/Average": 0.37612,
  "Cargo ship - Large RoPax ferry - Average": 0.37612,
  "Cargo ship/Refrigerated cargo": 0.01306,
  "Cargo ship - Refrigerated cargo": 0.01306,
  "Cargo ship/Refrigerated cargo/ All dwt": 0.01306,
  "Cargo ship - Refrigerated cargo -  All dwt": 0.01306
};

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
export const EF_TD_LOSS = 0.0188  // kg CO2e per kWh

// ── Core calculators ──────────────────────────────────────────────────────────

export function calcStationary(type, unit, consumption) {
  const cleanType = (type || '').trim()
  const cleanUnit = (unit || '').trim()
  const key = `${cleanType}/${cleanUnit}`
  
  let ef = EF_STATIONARY[key]
  
  if (ef === undefined) {
    if (cleanUnit.toLowerCase() === 'kwh') {
      ef = EF_STATIONARY[`${cleanType}/kWh (Net CV)`] ?? EF_STATIONARY[`${cleanType}/kWh (Gross CV)`]
    } else {
      const lowerKey = key.toLowerCase()
      const match = Object.keys(EF_STATIONARY).find(k => k.toLowerCase() === lowerKey)
      if (match) {
        ef = EF_STATIONARY[match]
      }
    }
  }
  
  if (ef === undefined) ef = 0
  return { ef, tco2e: +(consumption * ef / 1000).toFixed(6) }
}

export function calcMobile(type, unit, consumption) {
  const cleanType = (type || '').trim()
  const cleanUnit = (unit || '').trim()
  const key = `${cleanType}/${cleanUnit}`
  
  let ef = EF_MOBILE_CASCADED[key] ?? EF_MOBILE[key]
  
  if (ef === undefined) {
    const lowerKey = key.toLowerCase()
    const match = Object.keys(EF_MOBILE_CASCADED).find(k => k.toLowerCase() === lowerKey) ||
                  Object.keys(EF_MOBILE).find(k => k.toLowerCase() === lowerKey)
    if (match) {
      ef = EF_MOBILE_CASCADED[match] ?? EF_MOBILE[match]
    }
  }
  
  if (ef === undefined && cleanType.includes(' - ')) {
    const parts = cleanType.split(' - ').map(p => p.trim())
    if (parts.length >= 2) {
      const cascadedKey = `${parts[0]}/${parts[1]}/${cleanUnit}`
      ef = EF_MOBILE_CASCADED[cascadedKey]
      if (ef === undefined) {
        const lowerCascaded = cascadedKey.toLowerCase()
        const match = Object.keys(EF_MOBILE_CASCADED).find(k => k.toLowerCase() === lowerCascaded)
        if (match) ef = EF_MOBILE_CASCADED[match]
      }
    }
  }
  
  if (ef === undefined) ef = 0
  return { ef, tco2e: +(consumption * ef / 1000).toFixed(6) }
}

export function calcFugitive(refrigerant, kgLeaked) {
  const cleanRef = (refrigerant || '').trim()
  let gwp = EF_FUGITIVE[cleanRef]
  
  if (gwp === undefined) {
    const lowerRef = cleanRef.toLowerCase()
    const match = Object.keys(EF_FUGITIVE).find(k => k.toLowerCase() === lowerRef)
    if (match) {
      gwp = EF_FUGITIVE[match]
    }
  }
  
  if (gwp === undefined) gwp = 0
  return { ef: gwp, tco2e: +(kgLeaked * gwp / 1000).toFixed(6) }
}

export function calcElectricity(country, unit, consumption, isRenewable = false) {
  if (isRenewable) return { ef: 0, tco2e: 0 }
  const ef = EF_GRID[country] ?? EF_GRID['default']
  const kwh = unit === 'MWh' ? consumption * 1000 : consumption
  return { ef, tco2e: +(kwh * ef / 1000).toFixed(6) }
}

export function calcHeatSteam(type, unit, consumption) {
  const ef = EF_HEAT[type] ?? 0.179647
  const kwh = unit === 'MWh' ? consumption * 1000 : consumption
  return { ef, tco2e: +(kwh * ef / 1000).toFixed(6) }
}

export function calcWaterSupply(volumeM3) {
  return { ef: EF_WATER_SUPPLY, tco2e: +(volumeM3 * EF_WATER_SUPPLY / 1000).toFixed(6) }
}

export function calcWaterTreatment(volume, unit) {
  if (typeof unit !== 'string') {
    // Legacy support
    return { ef: EF_WATER_TREATMENT, tco2e: +(volume * EF_WATER_TREATMENT / 1000).toFixed(6) }
  }
  const cleanUnit = (unit || '').trim().toLowerCase()
  const ef = cleanUnit.includes('million') ? 170.87549 : 0.17088
  return { ef, tco2e: +(volume * ef / 1000).toFixed(6) }
}

export function calcTDLoss(country, unit, consumption) {
  if (typeof country === 'number') {
    // Legacy support: country was kwh directly
    const kwh = country
    const ef = 0.0188
    return { ef, tco2e: +(kwh * ef / 1000).toFixed(6) }
  }
  const cleanCountry = (country || '').trim()
  const ef = 0.0188 // Always 0.0188 for India, UAE, Botswana
  const kwh = unit === 'MWh' ? consumption * 1000 : consumption
  return { ef, tco2e: +(kwh * ef / 1000).toFixed(6) }
}

export function calcCommute(vehicleType, numPassengers, kmPerDay, workingDays, twoWay = true) {
  const cleanVehicle = (vehicleType || '').trim()
  
  let ef = EF_COMMUTE[cleanVehicle]
  
  if (ef === undefined) {
    if (cleanVehicle.includes(' - ')) {
      const parts = cleanVehicle.split(' - ').map(p => p.trim())
      const key = `${parts[0]}/${parts[1]}/km`
      ef = EF_MOBILE_CASCADED[key]
    }
  }
  
  if (ef === undefined) {
    const lower = cleanVehicle.toLowerCase()
    const match = Object.keys(EF_COMMUTE).find(k => k.toLowerCase() === lower)
    if (match) ef = EF_COMMUTE[match]
  }
  
  if (ef === undefined) ef = 0
  
  let totalKm = kmPerDay
  if (workingDays > 1 || twoWay === true) {
    totalKm = numPassengers * kmPerDay * workingDays * (twoWay ? 2 : 1)
  }
  return { ef, totalKm: +totalKm.toFixed(2), tco2e: +(totalKm * ef / 1000).toFixed(6) }
}

export function calcTravelAir(haul, flightClass, passengerKm, rfType = 'With RF') {
  const isWithRF = !String(rfType).toLowerCase().includes('without')
  const table = isWithRF ? EF_TRAVEL_AIR_WITH_RF : EF_TRAVEL_AIR_WITHOUT_RF
  
  let cleanHaul = (haul || '').trim()
  let cleanClass = (flightClass || '').trim()
  
  if (cleanHaul.toLowerCase().startsWith('flights')) {
    const parts = cleanHaul.split('-').map(p => p.trim())
    if (parts.length >= 2) {
      cleanHaul = parts[1]
    }
    if (parts.length >= 3) {
      cleanClass = parts[2]
    }
    const hasWithoutRF = cleanHaul.toLowerCase().includes('without') || 
                         (parts.length >= 4 && parts[3].toLowerCase().includes('without'))
    const useTable = hasWithoutRF ? EF_TRAVEL_AIR_WITHOUT_RF : EF_TRAVEL_AIR_WITH_RF
    
    // Exact mapping check
    const key = `${cleanHaul}/${cleanClass}`
    let ef = useTable[key]
    if (ef === undefined) {
      const lowerKey = key.toLowerCase()
      const match = Object.keys(useTable).find(k => k.toLowerCase() === lowerKey)
      if (match) ef = useTable[match]
    }
    if (ef !== undefined) {
      return { ef, tco2e: +(passengerKm * ef / 1000).toFixed(6) }
    }
  }
  
  const key = `${cleanHaul}/${cleanClass}`
  let ef = table[key]
  
  if (ef === undefined) {
    const lowerKey = key.toLowerCase()
    const match = Object.keys(table).find(k => k.toLowerCase() === lowerKey)
    if (match) {
      ef = table[match]
    }
  }
  
  if (ef === undefined) ef = table['Long-haul, to/from UK/Economy class'] ?? 0
  return { ef, tco2e: +(passengerKm * ef / 1000).toFixed(6) }
}

export function calcTravelSea(ferryType, passengerKm) {
  const cleanType = (ferryType || '').trim()
  let ef = EF_TRAVEL_SEA[cleanType]
  if (ef === undefined) {
    if (cleanType.includes(' - ')) {
      const parts = cleanType.split(' - ').map(p => p.trim())
      ef = EF_TRAVEL_SEA[parts[1] || parts[0]]
    }
  }
  if (ef === undefined) ef = 0
  return { ef, tco2e: +(passengerKm * ef / 1000).toFixed(6) }
}

export function calcTravelLand(vehicleType, km) {
  const ef = EF_TRAVEL_LAND[vehicleType] ?? 0
  return { ef, tco2e: +(km * ef / 1000).toFixed(6) }
}

export function calcHotel(country, roomNights) {
  const cleanCountry = (country || '').trim()
  let ef = EF_HOTEL[cleanCountry]
  if (ef === undefined) {
    const lower = cleanCountry.toLowerCase()
    const match = Object.keys(EF_HOTEL).find(k => k.toLowerCase() === lower)
    if (match) ef = EF_HOTEL[match]
  }
  if (ef === undefined) ef = 20
  return { ef, tco2e: +(roomNights * ef / 1000).toFixed(6) }
}

export function calcGoods(material, loop, weightTonnes) {
  let cleanLoop = 'Primary material production'
  let tonnes = 0
  if (typeof loop === 'number') {
    tonnes = loop
  } else {
    cleanLoop = (loop || 'Primary material production').trim()
    tonnes = parseFloat(weightTonnes) || 0
  }
  
  const cleanMaterial = (material || '').trim()
  const loops = EF_GOODS_LOOPS[cleanMaterial]
  let ef = undefined
  if (loops) {
    ef = loops[cleanLoop] ?? loops['Primary material production']
  }
  
  if (ef === undefined) {
    ef = EF_GOODS[cleanMaterial] ?? 0
  }
  
  return { ef, tco2e: +(tonnes * ef / 1000).toFixed(6) }
}

export function calcFreight(vehicleType, fuelType, cls, type, unit, tonnes, distance) {
  const vType = (vehicleType || '').trim()
  const fType = (fuelType || '').trim()
  const c = (cls || '').trim()
  
  let key = ""
  if (vType === 'Vans') {
    key = `Vans/${fType}/${c}`
  } else if (vType.startsWith('HGV')) {
    const prefix = vType.includes('refrigerated') ? 'HGV refrigerated' : 'HGV'
    key = `${prefix}/${fType}/${c}`
  } else if (vType === 'Freight flights') {
    key = `Freight flights/${fType}/${c}`
  } else {
    key = `${vType}/${c}`
  }
  
  let ef = EF_FREIGHT[key]
  
  if (ef === undefined) {
    const lowerKey = key.toLowerCase()
    const match = Object.keys(EF_FREIGHT).find(k => k.toLowerCase() === lowerKey)
    if (match) {
      ef = EF_FREIGHT[match]
    }
  }
  
  if (ef === undefined) {
    const combined = `${vType} - ${fType} - ${c}`
    ef = EF_FREIGHT[combined] ?? EF_FREIGHT[`${vType} - ${c}`] ?? 0
  }
  
  const tkm = (parseFloat(tonnes) || 0) * (parseFloat(distance) || 0)
  return { ef, tco2e: +(tkm * ef / 1000).toFixed(6) }
}

export function calcWaste(method, weightKg) {
  const ef = EF_WASTE[method] ?? 0.300
  return { ef, tco2e: +(weightKg * ef / 1000).toFixed(6) }
}

export function calcFood(foodType, count) {
  const EF_FOOD = {
    '1 standard breakfast':         0.84,
    '1 gourmet breakfast':          2.33,
    '1 cold or hot snack':          2.02,
    '1 average meal':               4.7,
    'Non-alcoholic beverage':       0.2,
    'Alcoholic beverage':           1.87,
    '1 hot snack (burger + fries)': 2.77,
    '1 sandwich':                   1.27,
    'Meal, vegan':                  1.69,
    'Meal, vegetarian':             2.85,
    'Meal, with beef':              6.93,
    'Meal, with chicken':           3.39,
  }
  const ef = EF_FOOD[foodType] ?? 4.7
  return { ef, tco2e: +(count * ef / 1000).toFixed(6) }
}

export function calcGeneric(ef, consumption) {
  return { ef, tco2e: +(consumption * ef / 1000).toFixed(6) }
}

// ── Backward-compatible aliases ───────────────────────────────────────────────
export function calcWater(source, volumeM3) {
  return calcWaterSupply(volumeM3)
}

export function calcTravel(mode, km) {
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
