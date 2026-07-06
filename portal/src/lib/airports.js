// Airport dataset for the Business Travel (Air) auto-distance feature.
// [code, name, city, country(ISO2), lat, lon]. Coordinates are airport reference
// points; great-circle distance is accurate to well within a few km.
const RAW = [
  // ── India ─────────────────────────────────────────────────────────────
  ['BOM', 'Chhatrapati Shivaji Maharaj International Airport', 'Mumbai', 'IN', 19.0887, 72.8679],
  ['NMI', 'Navi Mumbai International Airport', 'Navi Mumbai', 'IN', 18.9950, 73.0730],
  ['DEL', 'Indira Gandhi International Airport', 'Delhi', 'IN', 28.5562, 77.1000],
  ['STV', 'Surat Airport', 'Surat', 'IN', 21.1141, 72.7418],
  ['AMD', 'Sardar Vallabhbhai Patel International Airport', 'Ahmedabad', 'IN', 23.0772, 72.6347],
  ['BLR', 'Kempegowda International Airport', 'Bengaluru', 'IN', 13.1986, 77.7066],
  ['MAA', 'Chennai International Airport', 'Chennai', 'IN', 12.9941, 80.1709],
  ['HYD', 'Rajiv Gandhi International Airport', 'Hyderabad', 'IN', 17.2403, 78.4294],
  ['CCU', 'Netaji Subhas Chandra Bose International Airport', 'Kolkata', 'IN', 22.6547, 88.4467],
  ['COK', 'Cochin International Airport', 'Kochi', 'IN', 10.1520, 76.4019],
  ['GOI', 'Dabolim Airport', 'Goa', 'IN', 15.3808, 73.8314],
  ['PNQ', 'Pune Airport', 'Pune', 'IN', 18.5821, 73.9197],
  ['JAI', 'Jaipur International Airport', 'Jaipur', 'IN', 26.8242, 75.8122],
  ['NAG', 'Dr. Babasaheb Ambedkar International Airport', 'Nagpur', 'IN', 21.0922, 79.0472],
  ['LKO', 'Chaudhary Charan Singh International Airport', 'Lucknow', 'IN', 26.7606, 80.8893],
  ['IXC', 'Chandigarh Airport', 'Chandigarh', 'IN', 30.6735, 76.7885],
  ['TRV', 'Trivandrum International Airport', 'Thiruvananthapuram', 'IN', 8.4821, 76.9200],
  ['VNS', 'Lal Bahadur Shastri Airport', 'Varanasi', 'IN', 25.4524, 82.8593],
  ['BBI', 'Biju Patnaik International Airport', 'Bhubaneswar', 'IN', 20.2444, 85.8178],
  ['IDR', 'Devi Ahilya Bai Holkar Airport', 'Indore', 'IN', 22.7218, 75.8011],
  ['BDQ', 'Vadodara Airport', 'Vadodara', 'IN', 22.3362, 73.2263],
  ['RAJ', 'Rajkot Airport', 'Rajkot', 'IN', 22.3092, 70.7794],
  ['GAU', 'Lokpriya Gopinath Bordoloi International Airport', 'Guwahati', 'IN', 26.1061, 91.5859],
  ['PAT', 'Jay Prakash Narayan Airport', 'Patna', 'IN', 25.5913, 85.0880],
  // ── Middle East ───────────────────────────────────────────────────────
  ['DXB', 'Dubai International Airport', 'Dubai', 'AE', 25.2532, 55.3657],
  ['DWC', 'Al Maktoum International Airport', 'Dubai', 'AE', 24.8967, 55.1614],
  ['AUH', 'Zayed International Airport', 'Abu Dhabi', 'AE', 24.4330, 54.6511],
  ['SHJ', 'Sharjah International Airport', 'Sharjah', 'AE', 25.3286, 55.5172],
  ['DOH', 'Hamad International Airport', 'Doha', 'QA', 25.2731, 51.6081],
  ['RUH', 'King Khalid International Airport', 'Riyadh', 'SA', 24.9576, 46.6988],
  ['JED', 'King Abdulaziz International Airport', 'Jeddah', 'SA', 21.6796, 39.1565],
  ['KWI', 'Kuwait International Airport', 'Kuwait City', 'KW', 29.2266, 47.9689],
  ['BAH', 'Bahrain International Airport', 'Manama', 'BH', 26.2708, 50.6336],
  ['MCT', 'Muscat International Airport', 'Muscat', 'OM', 23.5933, 58.2844],
  ['TLV', 'Ben Gurion Airport', 'Tel Aviv', 'IL', 32.0114, 34.8867],
  // ── Europe ────────────────────────────────────────────────────────────
  ['LHR', 'Heathrow Airport', 'London', 'GB', 51.4700, -0.4543],
  ['LGW', 'Gatwick Airport', 'London', 'GB', 51.1537, -0.1821],
  ['BRU', 'Brussels Airport', 'Brussels', 'BE', 50.9014, 4.4844],
  ['AMS', 'Amsterdam Airport Schiphol', 'Amsterdam', 'NL', 52.3105, 4.7683],
  ['CDG', 'Charles de Gaulle Airport', 'Paris', 'FR', 49.0097, 2.5479],
  ['FRA', 'Frankfurt Airport', 'Frankfurt', 'DE', 50.0379, 8.5622],
  ['MUC', 'Munich Airport', 'Munich', 'DE', 48.3538, 11.7861],
  ['ZRH', 'Zurich Airport', 'Zurich', 'CH', 47.4582, 8.5555],
  ['GVA', 'Geneva Airport', 'Geneva', 'CH', 46.2381, 6.1090],
  ['FCO', 'Leonardo da Vinci Airport', 'Rome', 'IT', 41.8003, 12.2389],
  ['MXP', 'Milan Malpensa Airport', 'Milan', 'IT', 45.6306, 8.7281],
  ['MAD', 'Adolfo Suarez Madrid-Barajas Airport', 'Madrid', 'ES', 40.4936, -3.5668],
  ['BCN', 'Barcelona-El Prat Airport', 'Barcelona', 'ES', 41.2971, 2.0785],
  ['VIE', 'Vienna International Airport', 'Vienna', 'AT', 48.1103, 16.5697],
  ['IST', 'Istanbul Airport', 'Istanbul', 'TR', 41.2753, 28.7519],
  ['CPH', 'Copenhagen Airport', 'Copenhagen', 'DK', 55.6180, 12.6560],
  ['DUB', 'Dublin Airport', 'Dublin', 'IE', 53.4213, -6.2701],
  // ── East / Southeast Asia ─────────────────────────────────────────────
  ['HKG', 'Hong Kong International Airport', 'Hong Kong', 'HK', 22.3080, 113.9185],
  ['SIN', 'Singapore Changi Airport', 'Singapore', 'SG', 1.3592, 103.9894],
  ['BKK', 'Suvarnabhumi Airport', 'Bangkok', 'TH', 13.6900, 100.7501],
  ['URT', 'Surat Thani Airport', 'Surat Thani', 'TH', 9.1326, 99.1357],
  ['KUL', 'Kuala Lumpur International Airport', 'Kuala Lumpur', 'MY', 2.7456, 101.7099],
  ['PVG', 'Shanghai Pudong International Airport', 'Shanghai', 'CN', 31.1443, 121.8083],
  ['PEK', 'Beijing Capital International Airport', 'Beijing', 'CN', 40.0801, 116.5846],
  ['CAN', 'Guangzhou Baiyun International Airport', 'Guangzhou', 'CN', 23.3924, 113.2988],
  ['SZX', 'Shenzhen Baoan International Airport', 'Shenzhen', 'CN', 22.6393, 113.8108],
  ['HND', 'Tokyo Haneda Airport', 'Tokyo', 'JP', 35.5494, 139.7798],
  ['NRT', 'Narita International Airport', 'Tokyo', 'JP', 35.7720, 140.3929],
  ['ICN', 'Incheon International Airport', 'Seoul', 'KR', 37.4602, 126.4407],
  ['TPE', 'Taiwan Taoyuan International Airport', 'Taipei', 'TW', 25.0777, 121.2328],
  ['CMB', 'Bandaranaike International Airport', 'Colombo', 'LK', 7.1808, 79.8841],
  // ── Americas ──────────────────────────────────────────────────────────
  ['JFK', 'John F. Kennedy International Airport', 'New York', 'US', 40.6413, -73.7781],
  ['EWR', 'Newark Liberty International Airport', 'Newark', 'US', 40.6895, -74.1745],
  ['LAX', 'Los Angeles International Airport', 'Los Angeles', 'US', 33.9416, -118.4085],
  ['ORD', "O'Hare International Airport", 'Chicago', 'US', 41.9742, -87.9073],
  ['SFO', 'San Francisco International Airport', 'San Francisco', 'US', 37.6213, -122.3790],
  ['MIA', 'Miami International Airport', 'Miami', 'US', 25.7959, -80.2870],
  ['IAD', 'Washington Dulles International Airport', 'Washington', 'US', 38.9531, -77.4565],
  ['BOS', 'Logan International Airport', 'Boston', 'US', 42.3656, -71.0096],
  ['YYZ', 'Toronto Pearson International Airport', 'Toronto', 'CA', 43.6777, -79.6248],
  ['GRU', 'Sao Paulo/Guarulhos International Airport', 'Sao Paulo', 'BR', -23.4356, -46.4731],
  ['MEX', 'Mexico City International Airport', 'Mexico City', 'MX', 19.4363, -99.0721],
  // ── Africa / Oceania ──────────────────────────────────────────────────
  ['GBE', 'Sir Seretse Khama International Airport', 'Gaborone', 'BW', -24.5553, 25.9182],
  ['JNB', 'O. R. Tambo International Airport', 'Johannesburg', 'ZA', -26.1392, 28.2460],
  ['CPT', 'Cape Town International Airport', 'Cape Town', 'ZA', -33.9715, 18.6021],
  ['NBO', 'Jomo Kenyatta International Airport', 'Nairobi', 'KE', -1.3192, 36.9278],
  ['CAI', 'Cairo International Airport', 'Cairo', 'EG', 30.1219, 31.4056],
  ['SYD', 'Sydney Kingsford Smith Airport', 'Sydney', 'AU', -33.9399, 151.1753],
  ['MEL', 'Melbourne Airport', 'Melbourne', 'AU', -37.6690, 144.8410],
]

export const AIRPORTS = RAW.map(([code, name, city, country, lat, lon]) => ({ code, name, city, country, lat, lon }))
const BY_CODE = Object.fromEntries(AIRPORTS.map(a => [a.code, a]))

export function getAirport(code) {
  return BY_CODE[(code || '').toUpperCase()] || null
}

// Great-circle (haversine) distance in km, rounded to whole km.
export function haversineKm(a, b) {
  if (!a || !b) return 0
  const R = 6371
  const toRad = d => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const lat1 = toRad(a.lat), lat2 = toRad(b.lat)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return Math.round(2 * R * Math.asin(Math.min(1, Math.sqrt(h))))
}

// DEFRA haul band from distance (km) for auto-selecting the emission factor.
// Returns one of the exact FLIGHT_HAULS labels used by calcTravelAir.
export function haulForKm(km) {
  if (km <= 0) return ''
  if (km < 785) return 'Domestic, to/from UK'
  if (km < 3700) return 'Short-haul, to/from UK'
  return 'Long-haul, to/from UK'
}

export function searchAirports(query, limit = 8) {
  const q = (query || '').trim().toLowerCase()
  if (!q) return []
  const scored = []
  for (const a of AIRPORTS) {
    const code = a.code.toLowerCase()
    const city = a.city.toLowerCase()
    const name = a.name.toLowerCase()
    let score = -1
    if (code === q) score = 0
    else if (city === q) score = 1
    else if (code.startsWith(q)) score = 2
    else if (city.startsWith(q)) score = 3
    else if (name.startsWith(q)) score = 4
    else if (city.includes(q) || name.includes(q) || code.includes(q)) score = 5
    if (score >= 0) scored.push([score, a])
  }
  scored.sort((x, y) => x[0] - y[0] || x[1].city.localeCompare(y[1].city))
  return scored.slice(0, limit).map(s => s[1])
}
