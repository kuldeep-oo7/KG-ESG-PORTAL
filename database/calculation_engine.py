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
    # (fuel_type, unit) → kgCO2e
    ("Diesel",        "Litres"): 2.680,
    ("Petrol",        "Litres"): 2.310,
    ("LPG",           "Litres"): 2.983,
    ("LPG",           "kg"):     2.983,
    ("CNG",           "m3"):     1.960,
    ("CNG",           "kg"):     2.790,
    ("Natural Gas",   "m3"):     2.020,
    ("Coal",          "kg"):     2.420,
    ("Furnace Oil",   "Litres"): 3.150,
    ("Biomass",       "kg"):     0.000,   # biogenic — not counted per GHG Protocol
}

SCOPE1_MOBILE_EF = {
    ("Diesel",  "Litres"): 2.680,
    ("Petrol",  "Litres"): 2.310,
    ("CNG",     "kg"):     2.790,
    ("CNG",     "m3"):     1.960,
    ("LPG",     "Litres"): 2.983,
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
    "Municipal Supply": 0.344,
    "Groundwater":      0.100,
    "Rainwater":        0.000,
    "Recycled":         0.050,
}


# ── Core Calculation Functions ─────────────────────────────────────────────────

def calc_scope1_stationary(fuel_type: str, unit: str, consumption: float) -> dict:
    """Stationary combustion: generator, boiler, furnace."""
    ef = SCOPE1_STATIONARY_EF.get((fuel_type, unit))
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
    ef = SCOPE1_MOBILE_EF.get((fuel_type, unit))
    if ef is None:
        ef = SCOPE1_STATIONARY_EF.get((fuel_type, unit))
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
    gwp = SCOPE1_FUGITIVE_GWP.get(refrigerant)
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
