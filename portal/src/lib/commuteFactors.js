// DEFRA 2026 Business travel- land cascading factors (Employee Commute / Business Travel Land)
// Auto-extracted from ghg-conversion-factors-2026-full-set.xlsx
export const COMMUTE_TREE = {
  "Cars (by size)": {
    "hasFuel": true,
    "fuels": [
      "Diesel",
      "Petrol",
      "Hybrid",
      "CNG",
      "LPG",
      "Plug-in Hybrid Electric Vehicle",
      "Battery Electric Vehicle"
    ],
    "types": [
      "Small car",
      "Medium car",
      "Large car",
      "Average car"
    ],
    "units": [
      "km",
      "miles"
    ],
    "ef": {
      "Diesel|Small car|km": 0.14327,
      "Petrol|Small car|km": 0.14257,
      "Hybrid|Small car|km": 0.1138,
      "Plug-in Hybrid Electric Vehicle|Small car|km": 0.04969,
      "Battery Electric Vehicle|Small car|km": 0.02712,
      "Diesel|Small car|miles": 0.23058,
      "Petrol|Small car|miles": 0.22943,
      "Hybrid|Small car|miles": 0.18314,
      "Plug-in Hybrid Electric Vehicle|Small car|miles": 0.07998,
      "Battery Electric Vehicle|Small car|miles": 0.04365,
      "Diesel|Medium car|km": 0.17209,
      "Petrol|Medium car|km": 0.17411,
      "Hybrid|Medium car|km": 0.11678,
      "CNG|Medium car|km": 0.15407,
      "LPG|Medium car|km": 0.17378,
      "Plug-in Hybrid Electric Vehicle|Medium car|km": 0.08109,
      "Battery Electric Vehicle|Medium car|km": 0.02816,
      "Diesel|Medium car|miles": 0.27696,
      "Petrol|Medium car|miles": 0.2802,
      "Hybrid|Medium car|miles": 0.18794,
      "CNG|Medium car|miles": 0.24796,
      "LPG|Medium car|miles": 0.27966,
      "Plug-in Hybrid Electric Vehicle|Medium car|miles": 0.13049,
      "Battery Electric Vehicle|Medium car|miles": 0.04531,
      "Diesel|Large car|km": 0.20905,
      "Petrol|Large car|km": 0.26606,
      "Hybrid|Large car|km": 0.15846,
      "CNG|Large car|km": 0.23463,
      "LPG|Large car|km": 0.26569,
      "Plug-in Hybrid Electric Vehicle|Large car|km": 0.10877,
      "Battery Electric Vehicle|Large car|km": 0.03065,
      "Diesel|Large car|miles": 0.33643,
      "Petrol|Large car|miles": 0.42817,
      "Hybrid|Large car|miles": 0.25499,
      "CNG|Large car|miles": 0.3776,
      "LPG|Large car|miles": 0.42757,
      "Plug-in Hybrid Electric Vehicle|Large car|miles": 0.17505,
      "Battery Electric Vehicle|Large car|miles": 0.04933,
      "Diesel|Average car|km": 0.17265,
      "Petrol|Average car|km": 0.16152,
      "Hybrid|Average car|km": 0.12961,
      "CNG|Average car|km": 0.17314,
      "LPG|Average car|km": 0.19553,
      "Plug-in Hybrid Electric Vehicle|Average car|km": 0.09918,
      "Battery Electric Vehicle|Average car|km": 0.02951,
      "Diesel|Average car|miles": 0.27786,
      "Petrol|Average car|miles": 0.25993,
      "Hybrid|Average car|miles": 0.20857,
      "CNG|Average car|miles": 0.27865,
      "LPG|Average car|miles": 0.31468,
      "Plug-in Hybrid Electric Vehicle|Average car|miles": 0.15961,
      "Battery Electric Vehicle|Average car|miles": 0.04749
    }
  },
  "Motorbike": {
    "hasFuel": false,
    "types": [
      "Small",
      "Medium",
      "Large",
      "Average"
    ],
    "units": [
      "km",
      "miles"
    ],
    "ef": {
      "Small|km": 0.08319,
      "Small|miles": 0.13389,
      "Medium|km": 0.10108,
      "Medium|miles": 0.16266,
      "Large|km": 0.13252,
      "Large|miles": 0.21326,
      "Average|km": 0.11367,
      "Average|miles": 0.18294
    }
  },
  "Taxis": {
    "hasFuel": false,
    "types": [
      "Regular taxi",
      "Black cab"
    ],
    "units": [
      "passenger.km",
      "km"
    ],
    "ef": {
      "Regular taxi|passenger.km": 0.14861,
      "Regular taxi|km": 0.20806,
      "Black cab|passenger.km": 0.20402,
      "Black cab|km": 0.30604
    }
  },
  "Bus": {
    "hasFuel": false,
    "types": [
      "Local bus (not London)",
      "Local London bus",
      "Average local bus",
      "Coach"
    ],
    "units": [
      "passenger.km"
    ],
    "ef": {
      "Local bus (not London)|passenger.km": 0.12552,
      "Local London bus|passenger.km": 0.0636,
      "Average local bus|passenger.km": 0.10151,
      "Coach|passenger.km": 0.03948
    }
  },
  "Rail": {
    "hasFuel": false,
    "types": [
      "National rail",
      "International rail",
      "Light rail and tram",
      "London Underground"
    ],
    "units": [
      "passenger.km"
    ],
    "ef": {
      "National rail|passenger.km": 0.03092,
      "International rail|passenger.km": 0.01135,
      "Light rail and tram|passenger.km": 0.02121,
      "London Underground|passenger.km": 0.01549
    }
  }
}

export const COMMUTE_ACTIVITIES = ["Cars (by size)", "Motorbike", "Taxis", "Bus", "Rail"]
