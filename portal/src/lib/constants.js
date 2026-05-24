// Dropdown options — sourced from Defra GHG Conversion Factors 2025

// ── Scope 1: Stationary Combustion ────────────────────────────────────────────
export const STATIONARY_FUEL_GASEOUS = [
  'Butane', 'CNG', 'LNG', 'LPG', 'Natural gas',
  'Natural gas (100% mineral blend)', 'Other petroleum gas', 'Propane',
]
export const STATIONARY_FUEL_LIQUID = [
  'Aviation spirit', 'Aviation turbine fuel', 'Burning oil',
  'Diesel (average biofuel blend)', 'Diesel (100% mineral diesel)',
  'Fuel oil', 'Gas oil', 'Lubricants', 'Marine fuel oil', 'Marine gas oil',
  'Naphtha', 'Petrol (average biofuel blend)', 'Petrol (100% mineral petrol)',
  'Processed fuel oils - distillate oil', 'Processed fuel oils - residual oil',
  'Refinery miscellaneous', 'Waste oils',
]
export const STATIONARY_FUEL_SOLID = [
  'Coal (domestic)', 'Coal (electricity generation)',
  'Coal (electricity generation - home produced coal only)',
  'Coal (industrial)', 'Coking coal', 'Petroleum coke',
]
export const STATIONARY_FUEL_BIOENERGY = [
  'Avtur (renewable)', 'Biodiesel HVO', 'Biodiesel ME',
  'Biodiesel ME (from tallow)', 'Biodiesel ME (from used cooking oil)',
  'Bioethanol', 'Biopropane', 'Development diesel', 'Development petrol',
  'Methanol (bio)', 'Off road biodiesel',
  'Grass/straw', 'Wood chips', 'Wood logs', 'Wood pellets',
  'Biogas', 'Landfill gas',
]

export const STATIONARY_TYPES = [
  ...STATIONARY_FUEL_GASEOUS,
  ...STATIONARY_FUEL_LIQUID,
  ...STATIONARY_FUEL_SOLID,
  ...STATIONARY_FUEL_BIOENERGY,
]

export const STATIONARY_UNITS = ['litres', 'tonnes', 'kWh (Net CV)', 'kWh (Gross CV)', 'cubic metres']

// ── Scope 1: Mobile Combustion ─────────────────────────────────────────────────
// Cars by market segment
export const MOBILE_CARS_MARKET = [
  'Mini', 'Supermini', 'Lower medium', 'Upper medium',
  'Executive', 'Luxury', 'Sports', 'Dual purpose 4X4', 'MPV',
]
// Cars by size
export const MOBILE_CARS_SIZE = ['Small car', 'Medium car', 'Large car', 'Average car']
// Motorbikes
export const MOBILE_MOTORBIKE = ['Motorbike (Small)', 'Motorbike (Medium)', 'Motorbike (Large)', 'Motorbike (Average)']
// Vans
export const MOBILE_VANS = [
  'Van - Class I (up to 1.305 tonnes)', 'Van - Class II (1.305 to 1.74 tonnes)',
  'Van - Class III (1.74 to 3.5 tonnes)', 'Van - Average (up to 3.5 tonnes)',
]
// HGVs (all diesel)
export const MOBILE_HGVS = [
  'HGV - Rigid (>3.5 - 7.5 tonnes)', 'HGV - Rigid (>7.5 tonnes-17 tonnes)',
  'HGV - Rigid (>17 tonnes)', 'HGV - All rigids',
  'HGV - Articulated (>3.5 - 33t)', 'HGV - Articulated (>33t)',
  'HGV - All artics', 'HGV - All HGVs',
]

export const MOBILE_TYPES = [
  ...MOBILE_CARS_SIZE, ...MOBILE_CARS_MARKET,
  ...MOBILE_MOTORBIKE, ...MOBILE_VANS, ...MOBILE_HGVS,
]
export const MOBILE_UNITS = ['km', 'miles']

// ── Scope 1: Fugitive Emissions ────────────────────────────────────────────────
// Ordered: common first, then HFCs, CFCs, blends
export const REFRIGERANTS = [
  // Common / widely used
  'Carbon dioxide', 'Methane', 'Nitrous oxide',
  'HFC-32', 'HFC-125', 'HFC-134a', 'HFC-143a', 'HFC-152a',
  'HFC-23', 'HFC-227ea', 'HFC-236fa', 'HFC-245fa',
  // Kyoto HFCs
  'HFC-41', 'HFC-134', 'HFC-143', 'HFC-152', 'HFC-161',
  'HFC-236cb', 'HFC-236ea', 'HFC-245ca', 'HFC-365mfc', 'HFC-43-I0mee',
  // PFCs
  'Perfluoromethane (PFC-14)', 'Perfluoroethane (PFC-116)',
  'Perfluoropropane (PFC-218)', 'Perfluorocyclobutane (PFC-318)',
  'Perfluorocyclopropane', 'Perfluorobutane (PFC-3-1-10)',
  'Perfluoropentane (PFC-4-1-12)', 'Perfluorohexane (PFC-5-1-14)',
  'PFC-9-1-18', 'PFPMIE',
  // Other high-GWP
  'Sulphur hexafluoride (SF6)', 'Nitrogen trifluoride',
  // Montreal protocol
  'CFC-11/R11 = trichlorofluoromethane', 'CFC-12/R12 = dichlorodifluoromethane',
  'CFC-13', 'CFC-113', 'CFC-114', 'CFC-115',
  'Halon-1211', 'Halon-1301', 'Halon-2402',
  'Carbon tetrachloride', 'Methyl chloroform', 'Methyl bromide',
  'HCFC-21', 'HCFC-22/R22 = chlorodifluoromethane',
  'HCFC-123', 'HCFC-124', 'HCFC-141b', 'HCFC-142b',
  'HCFC-225ca', 'HCFC-225cb',
  'Methyl chloride', 'Methylene chloride', 'Dimethylether',
  // Fluorinated ethers
  'HFE-125', 'HFE-134', 'HFE-143a', 'HCFE-235da2',
  'HFE-245cb2', 'HFE-245fa2', 'HFE-254cb2',
  'HFE-347mcc3', 'HFE-347pcf2', 'HFE-356pcc3',
  'HFE-449sl (HFE-7100)', 'HFE-569sf2 (HFE-7200)',
  'HFE-43-10pccc124 (H-Galden1040x)', 'HFE-236ca12 (HG-10)', 'HFE-338pcc13 (HG-01)',
  'Trifluoromethyl sulphur pentafluoride',
  // Natural refrigerants
  'R290 = propane', 'R600 = butane', 'R600A = isobutane',
  'R601 = n-pentane', 'R601A = isopentane',
  'R170 = ethane', 'R1270 = propylene', 'R1234yf*', 'R1234ze*',
  // R-series blends (most common)
  'R401A', 'R401B', 'R401C', 'R402A', 'R402B',
  'R403A', 'R403B', 'R404A', 'R405A', 'R406A',
  'R407A', 'R407B', 'R407C', 'R407D', 'R407E', 'R407F',
  'R408A', 'R409A', 'R409B', 'R410A', 'R410B',
  'R411A', 'R411B', 'R412A', 'R413A',
  'R414A', 'R414B', 'R415A', 'R415B', 'R416A',
  'R417A', 'R417B', 'R417C', 'R418A',
  'R419A', 'R419B', 'R420A', 'R421A', 'R421B',
  'R422A', 'R422B', 'R422C', 'R422D', 'R422E',
  'R423A', 'R424A', 'R425A', 'R426A', 'R427A', 'R428A',
  'R429A', 'R430A', 'R431A', 'R432A',
  'R433A', 'R433B', 'R433C', 'R434A', 'R435A',
  'R436A', 'R436B', 'R437A', 'R438A', 'R439A', 'R440A',
  'R441A', 'R442A', 'R443A', 'R444A', 'R445A',
  'R500', 'R501', 'R502', 'R503', 'R504', 'R505', 'R506',
  'R507A', 'R508A', 'R508B', 'R509A', 'R510A', 'R511A', 'R512A',
]

// ── Scope 2: Electricity ───────────────────────────────────────────────────────
export const COUNTRIES = [
  'India', 'Afghanistan', 'Albania', 'Algeria', 'American Samoa', 'Andorra',
  'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia',
  'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados',
  'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia (Plurinational State of)',
  'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei Darussalam', 'Bulgaria',
  'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cabo Verde',
  'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Congo',
  'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czechia', 'Denmark', 'Djibouti',
  'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Eritrea', 'Estonia',
  'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia',
  'Georgia', 'Germany', 'Ghana', 'Greece', 'Greenland', 'Guatemala', 'Guinea',
  'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'Indonesia',
  'Iran (Islamic Republic of)', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica',
  'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Republic of Korea', 'Kuwait',
  'Kyrgyzstan', 'Latvia', 'Lebanon', 'Lesotho', 'Libya', 'Lithuania', 'Luxembourg',
  'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritius',
  'Mexico', 'Republic of Moldova', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique',
  'Myanmar', 'Namibia', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger',
  'Nigeria', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Panama',
  'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Qatar', 'Romania', 'Russian Federation', 'Rwanda', 'Saudi Arabia', 'Senegal',
  'Serbia', 'Singapore', 'Slovakia', 'Slovenia', 'Somalia', 'South Africa',
  'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden',
  'Switzerland', 'Taiwan (Chinese Taipei)', 'Tajikistan',
  'United Republic of Tanzania', 'Thailand', 'Timor-Leste', 'Togo',
  'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Uganda', 'Ukraine',
  'United Arab Emirates', 'United Kingdom of Great Britain and Northern Ireland',
  'United States of America', 'Uruguay', 'Uzbekistan', 'Venezuela (Bolivarian Republic of)',
  'Viet Nam', 'Yemen', 'Zambia', 'Zimbabwe',
]
export const ELEC_UNITS = ['kWh', 'MWh']

// ── Scope 2: Heat & Steam ──────────────────────────────────────────────────────
export const HEAT_TYPES = ['Onsite', 'District']
export const HEAT_UNITS = ['kWh', 'MWh']

// ── Scope 3: Employee Commute ─────────────────────────────────────────────────
export const COMMUTE_TYPES = ['Cars (by size)', 'Motorbike', 'Taxis', 'Bus', 'Rail']
export const VEHICLE_TYPES = [
  'Small car', 'Medium car', 'Large car', 'Average car',
  'Motorbike (Small)', 'Motorbike (Medium)', 'Motorbike (Large)', 'Motorbike (Average)',
  'Regular taxi', 'Black cab', 'Average taxi',
  'Average local bus', 'Local bus (not London)', 'Local London bus', 'Coach',
  'National rail', 'International rail', 'Light rail and tram', 'London Underground',
]
export const FUEL_TYPES = ['Diesel', 'Petrol', 'Hybrid', 'Battery EV', 'Plug-in Hybrid', 'CNG', 'LPG', 'Average']
export const DISTANCE_UNITS = ['km', 'miles']

// ── Scope 3: Food Consumption ─────────────────────────────────────────────────
export const FOOD_TYPES = [
  '1 standard breakfast', '1 gourmet breakfast', '1 cold or hot snack',
  '1 average meal', 'Non-alcoholic beverage', 'Alcoholic beverage',
  '1 hot snack (burger + frites)', '1 sandwich',
  'Meal, vegan', 'Meal, vegetarian', 'Meal, with beef', 'Meal, with chicken',
]
export const FOOD_UNITS = ['number of meals', 'count']

// ── Scope 3: Purchased Goods ──────────────────────────────────────────────────
export const GOODS_TYPES = [
  // Construction
  'Aggregates', 'Asphalt', 'Average construction', 'Bricks', 'Concrete',
  'Insulation', 'Plasterboard',
  // Metals
  'Metals', 'Metal: aluminium cans and foil', 'Metal: mixed cans',
  'Metal: scrap metal', 'Metal: steel cans',
  // Plastics
  'Plastics: average plastics', 'Plastics: average plastic film',
  'Plastics: average plastic rigid', 'Plastics: HDPE',
  'Plastics: LDPE and LLDPE', 'Plastics: PET', 'Plastics: PP',
  'Plastics: PS', 'Plastics: PVC',
  // Paper
  'Paper and board: paper', 'Paper and board: board', 'Paper and board: mixed',
  'Books',
  // Electricals
  'Electrical items - IT', 'Electrical items - large',
  'Electrical items - small', 'Electrical items - fridges and freezers',
  // Organic
  'Food and drink', 'Compost derived from food and garden waste',
  'Compost derived from garden waste',
  // Other
  'Clothing', 'Glass', 'Mineral oil', 'Soils', 'Tyres', 'Wood',
  'Batteries - Alkaline', 'Batteries - Li ion', 'Batteries - NiMh',
]
export const GOODS_UNITS = ['tonnes', 'kg']
export const UPSTREAM_VEHICLE_TYPES = ['Vans', 'HGV - All Diesel', 'HGV refrigerated (all diesel)', 'Freight flights', 'Rail', 'Sea tanker', 'Cargo ship']
export const LOOP_TYPES = ['Open-loop', 'Closed-loop']

// ── Scope 3: Waste Disposal ───────────────────────────────────────────────────
export const WASTE_TYPES = [
  'Aggregates', 'Asbestos', 'Asphalt', 'Average construction',
  'Batteries', 'Books', 'Bricks', 'Clothing',
  'Commercial and industrial waste', 'Concrete', 'Glass',
  'Household residual waste', 'Insulation',
  'Metal: aluminium cans and foil', 'Metal: mixed cans',
  'Metal: scrap metal', 'Metal: steel cans', 'Metals', 'Mineral oil',
  'Organic: food and drink waste', 'Organic: garden waste',
  'Organic: mixed food and garden waste',
  'Paper and board: board', 'Paper and board: mixed', 'Paper and board: paper',
  'Plasterboard',
  'Plastics: HDPE', 'Plastics: LDPE and LLDPE', 'Plastics: PET',
  'Plastics: PP', 'Plastics: PS', 'Plastics: PVC',
  'Plastics: average plastic film', 'Plastics: average plastic rigid',
  'Plastics: average plastics', 'Soils', 'Tyres',
  'WEEE - fridges and freezers', 'WEEE - large', 'WEEE - mixed',
  'WEEE - small', 'Wood',
]
export const WASTE_METHODS = [
  'Open-loop', 'Closed-loop', 'Incineration with energy recovery',
  'Composting', 'Landfill', 'Anaerobic digestion',
]
export const WASTE_UNITS = ['tonnes', 'kg']

// ── Scope 3: Water ────────────────────────────────────────────────────────────
export const WATER_UNITS = ['cubic metres', 'm3', 'litres', 'KL']

// ── Scope 3: Business Travel (Air) ────────────────────────────────────────────
export const FLIGHT_HAULS = [
  'Domestic, to/from UK', 'Short-haul, to/from UK',
  'Long-haul, to/from UK', 'International, to/from non-UK',
]
export const FLIGHT_CLASSES = [
  'Average passenger', 'Economy class', 'Premium economy class',
  'Business class', 'First class',
]
export const TRAVEL_UNITS_AIR = ['passenger.km', 'km']

// ── Scope 3: Business Travel (Sea) ────────────────────────────────────────────
export const FERRY_TYPES = ['Foot passenger', 'Car passenger', 'Average (all passenger)']
export const TRAVEL_UNITS_SEA = ['passenger.km', 'km']

// ── Scope 3: Business Travel (Land) ──────────────────────────────────────────
export const LAND_VEHICLE_TYPES = [
  'Small car', 'Medium car', 'Large car', 'Average car',
  'Mini', 'Supermini', 'Lower medium', 'Upper medium', 'Executive',
  'Luxury', 'Sports', 'Dual purpose 4X4', 'MPV',
  'Motorbike (Small)', 'Motorbike (Medium)', 'Motorbike (Large)', 'Motorbike (Average)',
  'Average local bus', 'Local London bus', 'Local bus (not London)', 'Coach',
  'National rail', 'International rail', 'Light rail and tram', 'London Underground',
  'Regular taxi', 'Black cab', 'Average taxi',
]
export const TRAVEL_UNITS_LAND = ['km', 'miles', 'passenger.km']

// ── Scope 3: Upstream / Downstream Freight ────────────────────────────────────
export const FREIGHT_VEHICLE_TYPES = [
  // Vans
  'Van - Class I (up to 1.305 tonnes)', 'Van - Class II (1.305 to 1.74 tonnes)',
  'Van - Class III (1.74 to 3.5 tonnes)', 'Van - Average (up to 3.5 tonnes)',
  // HGVs
  'HGV - Rigid (>3.5 - 7.5 tonnes)', 'HGV - Rigid (>7.5 tonnes-17 tonnes)',
  'HGV - Rigid (>17 tonnes)', 'HGV - All rigids',
  'HGV - Articulated (>3.5 - 33t)', 'HGV - Articulated (>33t)',
  'HGV - All artics', 'HGV - All HGVs',
  // Rail
  'Freight train',
  // Sea
  'Container ship', 'Bulk carrier', 'Chemical tanker', 'Products tanker',
  'Crude tanker', 'LNG tanker', 'LPG Tanker', 'Refrigerated cargo',
  'General cargo', 'Large RoPax ferry', 'RoRo-Ferry', 'Vehicle transport',
  // Air
  'Freight flight - Domestic', 'Freight flight - Short-haul',
  'Freight flight - Long-haul', 'Freight flight - International',
]
export const FREIGHT_UNITS = ['tonne.km', 'km', 'miles']

// ── Scope 3: Hotel Stay ───────────────────────────────────────────────────────
export const HOTEL_COUNTRIES = [
  'UK', 'UK (London)', 'Australia', 'Belgium', 'Brazil', 'Canada',
  'Chile', 'China', 'Colombia', 'Costa Rica', 'Egypt', 'France',
  'Germany', 'Hong Kong, China', 'India', 'Indonesia', 'Italy',
  'Japan', 'Jordan', 'Korea', 'Malaysia', 'Maldives', 'Mexico',
  'Netherlands', 'Oman', 'Philippines', 'Portugal', 'Qatar',
  'Russian Federation', 'Saudi Arabia', 'Singapore', 'South Africa',
  'Spain', 'Switzerland', 'Thailand', 'Turkey',
  'United Arab Emirates', 'United States', 'Vietnam',
]
export const HOTEL_UNITS = ['room per night', 'nights']

// ── Backward-compatible aliases ───────────────────────────────────────────────
export const WATER_SOURCES = ['Municipal Supply', 'Groundwater', 'Rainwater', 'Recycled Water']
export const TRAVEL_MODES_AIR  = FLIGHT_HAULS
export const TRAVEL_MODES_SEA  = FERRY_TYPES
export const TRAVEL_MODES_LAND = LAND_VEHICLE_TYPES
export const HOTEL_STANDARDS = HOTEL_COUNTRIES
export const CURRENCIES = ['INR', 'USD', 'AED', 'BWP', 'GBP']

// ── Scope 3 module list ───────────────────────────────────────────────────────
export const SCOPE3_MODULES = [
  { key: 'employeeCommute',    label: 'Employee Commute' },
  { key: 'foodConsumption',    label: 'Food Consumption' },
  { key: 'purchasedGoods',     label: 'Purchased Goods' },
  { key: 'tdLoss',             label: 'Transmission & Distribution Loss' },
  { key: 'upstream',           label: 'Upstream Activities' },
  { key: 'downstream',         label: 'Downstream Activities' },
  { key: 'wasteDisposal',      label: 'Waste Disposal' },
  { key: 'waterSupply',        label: 'Water Supply' },
  { key: 'waterTreatment',     label: 'Water Treatment' },
  { key: 'businessTravelAir',  label: 'Business Travel (Air)' },
  { key: 'businessTravelSea',  label: 'Business Travel (Sea)' },
  { key: 'businessTravelLand', label: 'Business Travel (Land)' },
  { key: 'hotelStay',          label: 'Hotel Stay' },
]
