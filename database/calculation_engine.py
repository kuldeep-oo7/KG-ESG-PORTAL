"""
GHG Calculation Engine
Exact logic used by ESGTech portal — GHG = Consumption × Emission Factor
"""

from decimal import Decimal
from dataclasses import dataclass
from typing import Optional


# ── Emission Factor Tables ─────────────────────────────────────────────────────
# These match the portal's internal lookup. Unit: kgCO2e per input unit.

SCOPE1_STATIONARY_EF = {
    ("Aviation spirit", "kWh (Gross CV)"): 0.24382,
    ("Aviation spirit", "Kwh (gross cv)"): 0.24382,
    ("Aviation spirit", "kWh (Net CV)"): 0.25666,
    ("Aviation spirit", "Kwh (net cv)"): 0.25666,
    ("Aviation spirit", "litres"): 2.33116,
    ("Aviation spirit", "Litres"): 2.33116,
    ("Aviation spirit", "tonnes"): 3193.6948,
    ("Aviation spirit", "Tonnes"): 3193.6948,
    ("Aviation turbine fuel", "kWh (Gross CV)"): 0.24758,
    ("Aviation turbine fuel", "Kwh (gross cv)"): 0.24758,
    ("Aviation turbine fuel", "kWh (Net CV)"): 0.26061,
    ("Aviation turbine fuel", "Kwh (net cv)"): 0.26061,
    ("Aviation turbine fuel", "litres"): 2.54269,
    ("Aviation turbine fuel", "Litres"): 2.54269,
    ("Aviation turbine fuel", "tonnes"): 3178.3652,
    ("Aviation turbine fuel", "Tonnes"): 3178.3652,
    ("Avtur (renewable)", "GJ"): 0.7234,
    ("Avtur (renewable)", "Gj"): 0.7234,
    ("Avtur (renewable)", "kg"): 0.03179,
    ("Avtur (renewable)", "Kg"): 0.03179,
    ("Avtur (renewable)", "litres"): 0.02531,
    ("Avtur (renewable)", "Litres"): 0.02531,
    ("Biodiesel HVO", "GJ"): 1.03677,
    ("Biodiesel HVO", "Gj"): 1.03677,
    ("Biodiesel HVO", "kg"): 0.04562,
    ("Biodiesel HVO", "Kg"): 0.04562,
    ("Biodiesel HVO", "litres"): 0.03558,
    ("Biodiesel HVO", "Litres"): 0.03558,
    ("Biodiesel ME (from tallow)", "GJ"): 5.05961,
    ("Biodiesel ME (from tallow)", "Gj"): 5.05961,
    ("Biodiesel ME (from tallow)", "kg"): 0.18822,
    ("Biodiesel ME (from tallow)", "Kg"): 0.18822,
    ("Biodiesel ME (from tallow)", "litres"): 0.16751,
    ("Biodiesel ME (from tallow)", "Litres"): 0.16751,
    ("Biodiesel ME (from used cooking oil)", "GJ"): 5.05961,
    ("Biodiesel ME (from used cooking oil)", "Gj"): 5.05961,
    ("Biodiesel ME (from used cooking oil)", "kg"): 0.18822,
    ("Biodiesel ME (from used cooking oil)", "Kg"): 0.18822,
    ("Biodiesel ME (from used cooking oil)", "litres"): 0.16751,
    ("Biodiesel ME (from used cooking oil)", "Litres"): 0.16751,
    ("Biodiesel ME", "GJ"): 5.05961,
    ("Biodiesel ME", "Gj"): 5.05961,
    ("Biodiesel ME", "kg"): 0.18822,
    ("Biodiesel ME", "Kg"): 0.18822,
    ("Biodiesel ME", "litres"): 0.16751,
    ("Biodiesel ME", "Litres"): 0.16751,
    ("Bioethanol", "GJ"): 0.42339,
    ("Bioethanol", "Gj"): 0.42339,
    ("Bioethanol", "kg"): 0.01135,
    ("Bioethanol", "Kg"): 0.01135,
    ("Bioethanol", "litres"): 0.00901,
    ("Bioethanol", "Litres"): 0.00901,
    ("Biogas", "kWh"): 0.00022,
    ("Biogas", "Kwh"): 0.00022,
    ("Biogas", "tonnes"): 1.24314,
    ("Biogas", "Tonnes"): 1.24314,
    ("Biomethane (compressed)", "GJ"): 0.10625,
    ("Biomethane (compressed)", "Gj"): 0.10625,
    ("Biomethane (compressed)", "kg"): 0.00521,
    ("Biomethane (compressed)", "Kg"): 0.00521,
    ("Biomethane (liquified)", "GJ"): 0.10625,
    ("Biomethane (liquified)", "Gj"): 0.10625,
    ("Biomethane (liquified)", "kg"): 0.00521,
    ("Biomethane (liquified)", "Kg"): 0.00521,
    ("Biopropane", "GJ"): 0.08952,
    ("Biopropane", "Gj"): 0.08952,
    ("Biopropane", "kg"): 0.00415,
    ("Biopropane", "Kg"): 0.00415,
    ("Biopropane", "litres"): 0.00213,
    ("Biopropane", "Litres"): 0.00213,
    ("Burning oil", "kWh (Gross CV)"): 0.24677,
    ("Burning oil", "Kwh (gross cv)"): 0.24677,
    ("Burning oil", "kWh (Net CV)"): 0.25975,
    ("Burning oil", "Kwh (net cv)"): 0.25975,
    ("Burning oil", "litres"): 2.54016,
    ("Burning oil", "Litres"): 2.54016,
    ("Burning oil", "tonnes"): 3165.04181,
    ("Burning oil", "Tonnes"): 3165.04181,
    ("Butane", "kWh (Gross CV)"): 0.22241,
    ("Butane", "Kwh (gross cv)"): 0.22241,
    ("Butane", "kWh (Net CV)"): 0.24107,
    ("Butane", "Kwh (net cv)"): 0.24107,
    ("Butane", "litres"): 1.74533,
    ("Butane", "Litres"): 1.74533,
    ("Butane", "tonnes"): 3033.38067,
    ("Butane", "Tonnes"): 3033.38067,
    ("CNG", "kWh (Gross CV)"): 0.18296,
    ("CNG", "Kwh (gross cv)"): 0.18296,
    ("CNG", "kWh (Net CV)"): 0.2027,
    ("CNG", "Kwh (net cv)"): 0.2027,
    ("CNG", "litres"): 0.4507,
    ("CNG", "Litres"): 0.4507,
    ("CNG", "tonnes"): 2575.46441,
    ("CNG", "Tonnes"): 2575.46441,
    ("Coal (domestic)", "kWh (Gross CV)"): 0.34721,
    ("Coal (domestic)", "Kwh (gross cv)"): 0.34721,
    ("Coal (domestic)", "kWh (Net CV)"): 0.36549,
    ("Coal (domestic)", "Kwh (net cv)"): 0.36549,
    ("Coal (domestic)", "tonnes"): 2904.95234,
    ("Coal (domestic)", "Tonnes"): 2904.95234,
    ("Coal (electricity generation - home produced coal only)", "kWh (Gross CV)"): 0.31939,
    ("Coal (electricity generation - home produced coal only)", "Kwh (gross cv)"): 0.31939,
    ("Coal (electricity generation - home produced coal only)", "kWh (Net CV)"): 0.33621,
    ("Coal (electricity generation - home produced coal only)", "Kwh (net cv)"): 0.33621,
    ("Coal (electricity generation - home produced coal only)", "tonnes"): 2221.7467,
    ("Coal (electricity generation - home produced coal only)", "Tonnes"): 2221.7467,
    ("Coal (electricity generation)", "kWh (Gross CV)"): 0.31939,
    ("Coal (electricity generation)", "Kwh (gross cv)"): 0.31939,
    ("Coal (electricity generation)", "kWh (Net CV)"): 0.33621,
    ("Coal (electricity generation)", "Kwh (net cv)"): 0.33621,
    ("Coal (electricity generation)", "tonnes"): 2225.22448,
    ("Coal (electricity generation)", "Tonnes"): 2225.22448,
    ("Coal (industrial)", "kWh (Gross CV)"): 0.32246,
    ("Coal (industrial)", "Kwh (gross cv)"): 0.32246,
    ("Coal (industrial)", "kWh (Net CV)"): 0.33944,
    ("Coal (industrial)", "Kwh (net cv)"): 0.33944,
    ("Coal (industrial)", "tonnes"): 2395.28994,
    ("Coal (industrial)", "Tonnes"): 2395.28994,
    ("Coking coal", "kWh (Gross CV)"): 0.3579,
    ("Coking coal", "Kwh (gross cv)"): 0.3579,
    ("Coking coal", "kWh (Net CV)"): 0.37675,
    ("Coking coal", "Kwh (net cv)"): 0.37675,
    ("Coking coal", "tonnes"): 3164.65002,
    ("Coking coal", "Tonnes"): 3164.65002,
    ("Development diesel", "GJ"): 1.03677,
    ("Development diesel", "Gj"): 1.03677,
    ("Development diesel", "kg"): 0.04461,
    ("Development diesel", "Kg"): 0.04461,
    ("Development diesel", "litres"): 0.03705,
    ("Development diesel", "Litres"): 0.03705,
    ("Development petrol", "GJ"): 0.42339,
    ("Development petrol", "Gj"): 0.42339,
    ("Development petrol", "kg"): 0.0189,
    ("Development petrol", "Kg"): 0.0189,
    ("Development petrol", "litres"): 0.01402,
    ("Development petrol", "Litres"): 0.01402,
    ("Diesel (100% mineral diesel)", "kWh (Gross CV)"): 0.25199,
    ("Diesel (100% mineral diesel)", "Kwh (gross cv)"): 0.25199,
    ("Diesel (100% mineral diesel)", "kWh (Net CV)"): 0.26808,
    ("Diesel (100% mineral diesel)", "Kwh (net cv)"): 0.26808,
    ("Diesel (100% mineral diesel)", "litres"): 2.66155,
    ("Diesel (100% mineral diesel)", "Litres"): 2.66155,
    ("Diesel (100% mineral diesel)", "tonnes"): 3203.91143,
    ("Diesel (100% mineral diesel)", "Tonnes"): 3203.91143,
    ("Diesel (average biofuel blend)", "kWh (Gross CV)"): 0.24411,
    ("Diesel (average biofuel blend)", "Kwh (gross cv)"): 0.24411,
    ("Diesel (average biofuel blend)", "kWh (Net CV)"): 0.25953,
    ("Diesel (average biofuel blend)", "Kwh (net cv)"): 0.25953,
    ("Diesel (average biofuel blend)", "litres"): 2.57082,
    ("Diesel (average biofuel blend)", "Litres"): 2.57082,
    ("Diesel (average biofuel blend)", "tonnes"): 3087.94462,
    ("Diesel (average biofuel blend)", "Tonnes"): 3087.94462,
    ("Fuel oil", "kWh (Gross CV)"): 0.26813,
    ("Fuel oil", "Kwh (gross cv)"): 0.26813,
    ("Fuel oil", "kWh (Net CV)"): 0.28523,
    ("Fuel oil", "Kwh (net cv)"): 0.28523,
    ("Fuel oil", "litres"): 3.17492,
    ("Fuel oil", "Litres"): 3.17492,
    ("Fuel oil", "tonnes"): 3228.89019,
    ("Fuel oil", "Tonnes"): 3228.89019,
    ("Gas oil", "kWh (Gross CV)"): 0.2565,
    ("Gas oil", "Kwh (gross cv)"): 0.2565,
    ("Gas oil", "kWh (Net CV)"): 0.27288,
    ("Gas oil", "Kwh (net cv)"): 0.27288,
    ("Gas oil", "litres"): 2.75541,
    ("Gas oil", "Litres"): 2.75541,
    ("Gas oil", "tonnes"): 3226.57859,
    ("Gas oil", "Tonnes"): 3226.57859,
    ("Grass/straw", "kWh"): 0.01273,
    ("Grass/straw", "Kwh"): 0.01273,
    ("Grass/straw", "tonnes"): 47.35709,
    ("Grass/straw", "Tonnes"): 47.35709,
    ("LNG", "kWh (Gross CV)"): 0.18494,
    ("LNG", "Kwh (gross cv)"): 0.18494,
    ("LNG", "kWh (Net CV)"): 0.20489,
    ("LNG", "Kwh (net cv)"): 0.20489,
    ("LNG", "litres"): 1.17797,
    ("LNG", "Litres"): 1.17797,
    ("LNG", "tonnes"): 2603.30441,
    ("LNG", "Tonnes"): 2603.30441,
    ("LPG", "kWh (Gross CV)"): 0.2145,
    ("LPG", "Kwh (gross cv)"): 0.2145,
    ("LPG", "kWh (Net CV)"): 0.23032,
    ("LPG", "Kwh (net cv)"): 0.23032,
    ("LPG", "litres"): 1.55713,
    ("LPG", "Litres"): 1.55713,
    ("LPG", "tonnes"): 2939.36095,
    ("LPG", "Tonnes"): 2939.36095,
    ("Landfill gas", "kWh"): 0.0002,
    ("Landfill gas", "Kwh"): 0.0002,
    ("Landfill gas", "tonnes"): 0.69696,
    ("Landfill gas", "Tonnes"): 0.69696,
    ("Lubricants", "kWh (Gross CV)"): 0.26414,
    ("Lubricants", "Kwh (gross cv)"): 0.26414,
    ("Lubricants", "kWh (Net CV)"): 0.281,
    ("Lubricants", "Kwh (net cv)"): 0.281,
    ("Lubricants", "litres"): 2.74934,
    ("Lubricants", "Litres"): 2.74934,
    ("Lubricants", "tonnes"): 3180.99992,
    ("Lubricants", "Tonnes"): 3180.99992,
    ("Marine fuel oil", "kWh (Gross CV)"): 0.26197,
    ("Marine fuel oil", "Kwh (gross cv)"): 0.26197,
    ("Marine fuel oil", "kWh (Net CV)"): 0.27869,
    ("Marine fuel oil", "Kwh (net cv)"): 0.27869,
    ("Marine fuel oil", "litres"): 3.10202,
    ("Marine fuel oil", "Litres"): 3.10202,
    ("Marine fuel oil", "tonnes"): 3154.75334,
    ("Marine fuel oil", "Tonnes"): 3154.75334,
    ("Marine gas oil", "kWh (Gross CV)"): 0.25798,
    ("Marine gas oil", "Kwh (gross cv)"): 0.25798,
    ("Marine gas oil", "kWh (Net CV)"): 0.27445,
    ("Marine gas oil", "Kwh (net cv)"): 0.27445,
    ("Marine gas oil", "litres"): 2.77139,
    ("Marine gas oil", "Litres"): 2.77139,
    ("Marine gas oil", "tonnes"): 3245.30441,
    ("Marine gas oil", "Tonnes"): 3245.30441,
    ("Methanol (bio)", "GJ"): 0.42339,
    ("Methanol (bio)", "Gj"): 0.42339,
    ("Methanol (bio)", "kg"): 0.00844,
    ("Methanol (bio)", "Kg"): 0.00844,
    ("Methanol (bio)", "litres"): 0.00669,
    ("Methanol (bio)", "Litres"): 0.00669,
    ("Naphtha", "kWh (Gross CV)"): 0.23647,
    ("Naphtha", "Kwh (gross cv)"): 0.23647,
    ("Naphtha", "kWh (Net CV)"): 0.24891,
    ("Naphtha", "Kwh (net cv)"): 0.24891,
    ("Naphtha", "litres"): 2.11894,
    ("Naphtha", "Litres"): 2.11894,
    ("Naphtha", "tonnes"): 3142.3789,
    ("Naphtha", "Tonnes"): 3142.3789,
    ("Natural gas (100% mineral blend)", "cubic metres"): 2.08906,
    ("Natural gas (100% mineral blend)", "Cubic metres"): 2.08906,
    ("Natural gas (100% mineral blend)", "kWh (Gross CV)"): 0.18494,
    ("Natural gas (100% mineral blend)", "Kwh (gross cv)"): 0.18494,
    ("Natural gas (100% mineral blend)", "kWh (Net CV)"): 0.20489,
    ("Natural gas (100% mineral blend)", "Kwh (net cv)"): 0.20489,
    ("Natural gas (100% mineral blend)", "tonnes"): 2603.30441,
    ("Natural gas (100% mineral blend)", "Tonnes"): 2603.30441,
    ("Natural gas", "cubic metres"): 2.06672,
    ("Natural gas", "Cubic metres"): 2.06672,
    ("Natural gas", "kWh (Gross CV)"): 0.18296,
    ("Natural gas", "Kwh (gross cv)"): 0.18296,
    ("Natural gas", "kWh (Net CV)"): 0.2027,
    ("Natural gas", "Kwh (net cv)"): 0.2027,
    ("Natural gas", "tonnes"): 2575.46441,
    ("Natural gas", "Tonnes"): 2575.46441,
    ("Off road biodiesel", "GJ"): 5.05961,
    ("Off road biodiesel", "Gj"): 5.05961,
    ("Off road biodiesel", "kg"): 0.18822,
    ("Off road biodiesel", "Kg"): 0.18822,
    ("Off road biodiesel", "litres"): 0.16751,
    ("Off road biodiesel", "Litres"): 0.16751,
    ("Other petroleum gas", "kWh (Gross CV)"): 0.18323,
    ("Other petroleum gas", "Kwh (gross cv)"): 0.18323,
    ("Other petroleum gas", "kWh (Net CV)"): 0.19917,
    ("Other petroleum gas", "Kwh (net cv)"): 0.19917,
    ("Other petroleum gas", "litres"): 0.94442,
    ("Other petroleum gas", "Litres"): 0.94442,
    ("Other petroleum gas", "tonnes"): 2578.24647,
    ("Other petroleum gas", "Tonnes"): 2578.24647,
    ("Petrol (100% mineral petrol)", "kWh (Gross CV)"): 0.24159,
    ("Petrol (100% mineral petrol)", "Kwh (gross cv)"): 0.24159,
    ("Petrol (100% mineral petrol)", "kWh (Net CV)"): 0.25431,
    ("Petrol (100% mineral petrol)", "Kwh (net cv)"): 0.25431,
    ("Petrol (100% mineral petrol)", "litres"): 2.33984,
    ("Petrol (100% mineral petrol)", "Litres"): 2.33984,
    ("Petrol (100% mineral petrol)", "tonnes"): 3154.08213,
    ("Petrol (100% mineral petrol)", "Tonnes"): 3154.08213,
    ("Petrol (average biofuel blend)", "kWh (Gross CV)"): 0.21956,
    ("Petrol (average biofuel blend)", "Kwh (gross cv)"): 0.21956,
    ("Petrol (average biofuel blend)", "kWh (Net CV)"): 0.23181,
    ("Petrol (average biofuel blend)", "Kwh (net cv)"): 0.23181,
    ("Petrol (average biofuel blend)", "litres"): 2.06916,
    ("Petrol (average biofuel blend)", "Litres"): 2.06916,
    ("Petrol (average biofuel blend)", "tonnes"): 2772.97935,
    ("Petrol (average biofuel blend)", "Tonnes"): 2772.97935,
    ("Petroleum coke", "kWh (Gross CV)"): 0.34092,
    ("Petroleum coke", "Kwh (gross cv)"): 0.34092,
    ("Petroleum coke", "kWh (Net CV)"): 0.35887,
    ("Petroleum coke", "Kwh (net cv)"): 0.35887,
    ("Petroleum coke", "tonnes"): 3386.57168,
    ("Petroleum coke", "Tonnes"): 3386.57168,
    ("Processed fuel oils - distillate oil", "kWh (Gross CV)"): 0.2565,
    ("Processed fuel oils - distillate oil", "Kwh (gross cv)"): 0.2565,
    ("Processed fuel oils - distillate oil", "kWh (Net CV)"): 0.27288,
    ("Processed fuel oils - distillate oil", "Kwh (net cv)"): 0.27288,
    ("Processed fuel oils - distillate oil", "litres"): 2.75541,
    ("Processed fuel oils - distillate oil", "Litres"): 2.75541,
    ("Processed fuel oils - distillate oil", "tonnes"): 3226.57859,
    ("Processed fuel oils - distillate oil", "Tonnes"): 3226.57859,
    ("Processed fuel oils - residual oil", "kWh (Gross CV)"): 0.26813,
    ("Processed fuel oils - residual oil", "Kwh (gross cv)"): 0.26813,
    ("Processed fuel oils - residual oil", "kWh (Net CV)"): 0.28523,
    ("Processed fuel oils - residual oil", "Kwh (net cv)"): 0.28523,
    ("Processed fuel oils - residual oil", "litres"): 3.17492,
    ("Processed fuel oils - residual oil", "Litres"): 3.17492,
    ("Processed fuel oils - residual oil", "tonnes"): 3228.89019,
    ("Processed fuel oils - residual oil", "Tonnes"): 3228.89019,
    ("Propane", "kWh (Gross CV)"): 0.2141,
    ("Propane", "Kwh (gross cv)"): 0.2141,
    ("Propane", "kWh (Net CV)"): 0.23258,
    ("Propane", "Kwh (net cv)"): 0.23258,
    ("Propane", "litres"): 1.54358,
    ("Propane", "Litres"): 1.54358,
    ("Propane", "tonnes"): 2997.63233,
    ("Propane", "Tonnes"): 2997.63233,
    ("Refinery miscellaneous", "kWh (Gross CV)"): 0.24663,
    ("Refinery miscellaneous", "Kwh (gross cv)"): 0.24663,
    ("Refinery miscellaneous", "kWh (Net CV)"): 0.25961,
    ("Refinery miscellaneous", "Kwh (net cv)"): 0.25961,
    ("Refinery miscellaneous", "tonnes"): 2944.32093,
    ("Refinery miscellaneous", "Tonnes"): 2944.32093,
    ("Waste oils", "kWh (Gross CV)"): 0.25641,
    ("Waste oils", "Kwh (gross cv)"): 0.25641,
    ("Waste oils", "kWh (Net CV)"): 0.27459,
    ("Waste oils", "Kwh (net cv)"): 0.27459,
    ("Waste oils", "litres"): 2.74924,
    ("Waste oils", "Litres"): 2.74924,
    ("Waste oils", "tonnes"): 3219.37916,
    ("Waste oils", "Tonnes"): 3219.37916,
    ("Wood chips", "kWh"): 0.0115,
    ("Wood chips", "Kwh"): 0.0115,
    ("Wood chips", "tonnes"): 43.43964,
    ("Wood chips", "Tonnes"): 43.43964,
    ("Wood logs", "kWh"): 0.0115,
    ("Wood logs", "Kwh"): 0.0115,
    ("Wood logs", "tonnes"): 46.98508,
    ("Wood logs", "Tonnes"): 46.98508,
    ("Wood pellets", "kWh"): 0.0115,
    ("Wood pellets", "Kwh"): 0.0115,
    ("Wood pellets", "tonnes"): 55.19389,
    ("Wood pellets", "Tonnes"): 55.19389,
}

SCOPE1_MOBILE_EF = {
    ("Diesel",  "Litres"): 2.57082,
    ("Diesel",  "litres"): 2.57082,
    ("Petrol",  "Litres"): 2.06916,
    ("Petrol",  "litres"): 2.06916,
    ("CNG",     "kg"):     2.57546,
    ("CNG",     "Kg"):     2.57546,
    ("LPG",     "Litres"): 1.55713,
    ("LPG",     "litres"): 1.55713,
    
    # Size/segment car aliases in km and miles
    ("Diesel - Average car", "km"): 0.17304,
    ("Diesel - Average car", "miles"): 0.27854,
    ("Hybrid - Small car", "km"): 0.11413,
    ("Hybrid - Small car", "miles"): 0.18367,
    ("Petrol - Average car", "km"): 0.16272,
    ("Petrol - Average car", "miles"): 0.26187,
    ("Petrol - Large car", "km"): 0.27156,
    ("Petrol - Large car", "miles"): 0.43702,
    ("Petrol - Small car", "km"): 0.14308,
    ("Petrol - Small car", "miles"): 0.23027,
}


SCOPE1_FUGITIVE_GWP = {
    # refrigerant → GWP100 (IPCC AR6)
    # Formula: kg_leaked × GWP / 1000 = tCO2e
    "R-410A":   2088,
    "R-22":     1810,
    "R-32":      675,
    "R-134a":   1430,
    "R-407C":   1774,
    "R-404A":   3943,
    "R-507A":   3985,
    "HFC-32":    675,
    "HFC-125":  3500,
    "CO2":         1,
    "R-290":       3,  # propane
    "HFC-134a": 1300,
    "R-134a":   1300,
    "Refrigerants - HFC-134a": 1300,
    "R601 = pentane": 5,
    "R601 = n-pentane": 5,
    "R1270 = propene": 2,
    "R1270 = propylene": 2,
}

SCOPE2_GRID_EF = {
    # country_code → kgCO2/kWh (location-based)
    "IN":  0.716,   # India CEA 2024
    "AE":  0.450,   # UAE IEA 2023
    "BW":  1.050,   # Botswana IEA 2023
    "GB":  0.233,   # UK DEFRA 2023
    "US":  0.386,   # USA EPA 2023
    "default": 0.500,
}

SCOPE3_COMMUTE_EF = {
    # (mode) → kgCO2e per km per person
    "Motorbike":       0.114,
    "Car":             0.192,
    "Car (Petrol)":    0.192,
    "Car (Diesel)":    0.171,
    "Car (CNG)":       0.132,
    "Bus":             0.089,
    "Auto Rickshaw":   0.132,
    "Electric Vehicle":0.050,
    "Train":           0.041,
    "Metro":           0.041,
    "Walk/Cycle":      0.000,
}

SCOPE3_TRAVEL_EF = {
    "Flight Economy":  0.255,   # kgCO2e per km
    "Flight Business": 0.510,
    "Flight First":    0.765,
    "Car (Petrol)":    0.192,
    "Car (Diesel)":    0.171,
    "Train":           0.041,
    "Bus":             0.089,
}

SCOPE3_WASTE_EF = {
    # kgCO2e per kg waste
    "Landfill":        0.467,
    "Recycling":       0.021,
    "Incineration":    0.021,
    "Composting":      0.010,
    "Anaerobic":       0.200,
    "Reuse":           0.000,
}

SCOPE3_WATER_EF = {
    # kgCO2e per m3
    "Municipal Supply": 0.1913,
    "Water Supply": 0.1913,
    "Groundwater":      0.100,
    "Rainwater":        0.000,
    "Recycled":         0.050,
}


# ── Core Calculation Functions ─────────────────────────────────────────────────

def calc_scope1_stationary(fuel_type: str, unit: str, consumption: float) -> dict:
    """Stationary combustion: generator, boiler, furnace."""
    clean_t = (fuel_type or "").strip()
    clean_u = (unit or "").strip()
    
    ef = SCOPE1_STATIONARY_EF.get((clean_t, clean_u))
    if ef is None:
        if clean_u.lower() == "kwh":
            ef = SCOPE1_STATIONARY_EF.get((clean_t, "kWh (Net CV)")) or SCOPE1_STATIONARY_EF.get((clean_t, "kWh (Gross CV)"))
        else:
            # case insensitive check
            for (ft, u_m), val in SCOPE1_STATIONARY_EF.items():
                if ft.lower() == clean_t.lower() and u_m.lower() == clean_u.lower():
                    ef = val
                    break
                    
    if ef is None:
        raise ValueError(f"No EF for Stationary: fuel='{fuel_type}' unit='{unit}'")
    tco2e = consumption * ef / 1000
    return {
        "scope": 1, "category": "Stationary Combustion",
        "fuel_type": fuel_type, "unit": unit, "consumption": consumption,
        "emission_factor": ef, "ef_unit": "kgCO2e/" + unit,
        "ghg_tco2e": round(tco2e, 6),
    }


def calc_scope1_mobile(fuel_type: str, unit: str, consumption: float) -> dict:
    """Mobile combustion: company vehicles fuel logs."""
    clean_t = (fuel_type or "").strip()
    clean_u = (unit or "").strip()
    
    ef = SCOPE1_MOBILE_EF.get((clean_t, clean_u))
    if ef is None:
        ef = SCOPE1_STATIONARY_EF.get((clean_t, clean_u))
        
    if ef is None:
        # Case insensitive check in mobile
        for (ft, u_m), val in SCOPE1_MOBILE_EF.items():
            if ft.lower() == clean_t.lower() and u_m.lower() == clean_u.lower():
                ef = val
                break
        if ef is None:
            # Case insensitive check in stationary
            for (ft, u_m), val in SCOPE1_STATIONARY_EF.items():
                if ft.lower() == clean_t.lower() and u_m.lower() == clean_u.lower():
                    ef = val
                    break
                    
    if ef is None:
        raise ValueError(f"No EF for Mobile: fuel='{fuel_type}' unit='{unit}'")
    tco2e = consumption * ef / 1000
    return {
        "scope": 1, "category": "Mobile Combustion",
        "fuel_type": fuel_type, "unit": unit, "consumption": consumption,
        "emission_factor": ef, "ef_unit": "kgCO2e/" + unit,
        "ghg_tco2e": round(tco2e, 6),
    }


def calc_scope1_fugitive(refrigerant: str, kg_leaked: float) -> dict:
    """Fugitive emissions: refrigerant leakage from AC/refrigeration."""
    clean_r = (refrigerant or "").strip()
    gwp = SCOPE1_FUGITIVE_GWP.get(clean_r)
    
    if gwp is None:
        # Case insensitive check
        for ref_key, val in SCOPE1_FUGITIVE_GWP.items():
            if ref_key.lower() == clean_r.lower():
                gwp = val
                break
                
    if gwp is None:
        raise ValueError(f"Unknown refrigerant: '{refrigerant}'")
    tco2e = kg_leaked * gwp / 1000
    return {
        "scope": 1, "category": "Fugitive Emissions",
        "fuel_type": refrigerant, "unit": "kg", "consumption": kg_leaked,
        "emission_factor": gwp, "ef_unit": "GWP (kgCO2e/kg)",
        "ghg_tco2e": round(tco2e, 6),
    }


def calc_scope2_electricity(
    kwh: float,
    country_code: str = "IN",
    is_renewable: bool = False,
    accounting: str = "location",   # "location" or "market"
) -> dict:
    """Scope 2 electricity consumption."""
    if is_renewable and accounting == "market":
        ef = 0.0    # certified renewable = zero under market-based accounting
        source = "Renewable (Market-Based)"
    else:
        ef = SCOPE2_GRID_EF.get(country_code, SCOPE2_GRID_EF["default"])
        source = f"Grid ({country_code})"
    tco2e = kwh * ef / 1000
    return {
        "scope": 2, "category": "Electricity",
        "fuel_type": source, "unit": "kWh", "consumption": kwh,
        "country_code": country_code,
        "emission_factor": ef, "ef_unit": "kgCO2e/kWh",
        "ghg_tco2e": round(tco2e, 6),
    }


def calc_scope3_commute(
    mode: str,
    num_employees: int,
    km_per_day: float,
    working_days: int,
    commute_type: str = "Two-way",
) -> dict:
    """Scope 3 employee commute."""
    ef = SCOPE3_COMMUTE_EF.get(mode)
    if ef is None:
        raise ValueError(f"Unknown commute mode: '{mode}'")
    multiplier = 2 if commute_type == "Two-way" else 1
    total_km = num_employees * km_per_day * working_days * multiplier
    tco2e = total_km * ef / 1000
    return {
        "scope": 3, "category": "Employee Commute",
        "vehicle_type": mode, "unit": "km",
        "number_of_passengers": num_employees,
        "km_per_day": km_per_day, "working_days": working_days,
        "total_km": total_km,
        "emission_factor": ef, "ef_unit": "kgCO2e/km",
        "ghg_tco2e": round(tco2e, 6),
    }


def calc_scope3_travel(mode: str, km: float) -> dict:
    """Scope 3 business travel."""
    ef = SCOPE3_TRAVEL_EF.get(mode)
    if ef is None:
        raise ValueError(f"Unknown travel mode: '{mode}'")
    tco2e = km * ef / 1000
    return {
        "scope": 3, "category": "Business Travel",
        "vehicle_type": mode, "unit": "km", "consumption": km,
        "emission_factor": ef, "ef_unit": "kgCO2e/km",
        "ghg_tco2e": round(tco2e, 6),
    }


def calc_scope3_waste(disposal_method: str, weight_kg: float) -> dict:
    """Scope 3 waste disposal."""
    ef = SCOPE3_WASTE_EF.get(disposal_method)
    if ef is None:
        raise ValueError(f"Unknown disposal method: '{disposal_method}'")
    tco2e = weight_kg * ef / 1000
    return {
        "scope": 3, "category": "Waste",
        "select_type": disposal_method, "unit": "kg", "consumption": weight_kg,
        "emission_factor": ef, "ef_unit": "kgCO2e/kg",
        "ghg_tco2e": round(tco2e, 6),
    }


def calc_scope3_water(source_type: str, volume_m3: float) -> dict:
    """Scope 3 water consumption."""
    ef = SCOPE3_WATER_EF.get(source_type, 0.344)
    tco2e = volume_m3 * ef / 1000
    return {
        "scope": 3, "category": "Water",
        "select_type": source_type, "unit": "m3", "consumption": volume_m3,
        "emission_factor": ef, "ef_unit": "kgCO2e/m3",
        "ghg_tco2e": round(tco2e, 6),
    }


# ── Aggregation ────────────────────────────────────────────────────────────────

def aggregate_totals(entries: list[dict]) -> dict:
    """Sum all entries into scope totals and grand total."""
    s1 = sum(e["ghg_tco2e"] for e in entries if e["scope"] == 1)
    s2 = sum(e["ghg_tco2e"] for e in entries if e["scope"] == 2)
    s3 = sum(e["ghg_tco2e"] for e in entries if e["scope"] == 3)

    s3_by_cat = {}
    for e in entries:
        if e["scope"] == 3:
            cat = e["category"]
            s3_by_cat[cat] = round(s3_by_cat.get(cat, 0) + e["ghg_tco2e"], 6)

    return {
        "scope1_tco2e": round(s1, 4),
        "scope2_tco2e": round(s2, 4),
        "scope3_tco2e": round(s3, 4),
        "scope3_breakdown": s3_by_cat,
        "grand_total_tco2e": round(s1 + s2 + s3, 4),
    }


def calc_intensity(total_tco2e: float, revenue_inr_cr: float = None,
                   employees: int = None, production_units: float = None) -> dict:
    """Intensity metrics — emissions per unit of business activity."""
    result = {}
    if revenue_inr_cr:
        result["tco2e_per_cr_revenue"] = round(total_tco2e / revenue_inr_cr, 4)
    if employees:
        result["tco2e_per_employee"] = round(total_tco2e / employees, 4)
    if production_units:
        result["tco2e_per_production_unit"] = round(total_tco2e / production_units, 4)
    return result


# ── Example: Surat 2025 (from sustainability report PDF) ──────────────────────

if __name__ == "__main__":
    entries = []

    # Scope 1 — Diesel generator
    entries.append(calc_scope1_stationary("Diesel", "Litres", 12000))

    # Scope 2 — Grid electricity (Surat, India)
    entries.append(calc_scope2_electricity(kwh=1254159, country_code="IN"))
    # Scope 2 — Wind power (market-based = zero)
    entries.append(calc_scope2_electricity(kwh=450000, country_code="IN",
                                           is_renewable=True, accounting="market"))

    # Scope 3 — Motorbike commute (Surat factory, dominant source)
    entries.append(calc_scope3_commute(
        mode="Motorbike", num_employees=180, km_per_day=12,
        working_days=250, commute_type="Two-way"
    ))
    entries.append(calc_scope3_commute(
        mode="Car", num_employees=40, km_per_day=20,
        working_days=250, commute_type="Two-way"
    ))
    entries.append(calc_scope3_commute(
        mode="Bus", num_employees=60, km_per_day=15,
        working_days=250, commute_type="Two-way"
    ))

    # Scope 3 — Waste
    entries.append(calc_scope3_waste("Landfill", weight_kg=5000))
    entries.append(calc_scope3_waste("Recycling", weight_kg=2000))

    totals = aggregate_totals(entries)
    intensity = calc_intensity(totals["grand_total_tco2e"],
                                revenue_inr_cr=850, employees=280)

    print("=== Surat Site — GHG Calculation ===")
    for e in entries:
        print(f"  [{e['scope']}] {e['category']:<25} {e['ghg_tco2e']:>10.4f} tCO2e")
    print()
    print(f"  Scope 1 Total:  {totals['scope1_tco2e']:>10.4f} tCO2e")
    print(f"  Scope 2 Total:  {totals['scope2_tco2e']:>10.4f} tCO2e")
    print(f"  Scope 3 Total:  {totals['scope3_tco2e']:>10.4f} tCO2e")
    print(f"  GRAND TOTAL:    {totals['grand_total_tco2e']:>10.4f} tCO2e")
    print()
    print(f"  Scope 3 breakdown: {totals['scope3_breakdown']}")
    print()
    print(f"  Intensity: {intensity}")
