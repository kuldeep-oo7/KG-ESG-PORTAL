# -*- coding: utf-8 -*-
"""Extract DEFRA 2026 factors and update flat EF tables in calculations.js in-place.

Strategy: keep every existing key in calculations.js; refresh its numeric value
from the 2026 workbook where the same fuel/unit/type/country exists. Keys not
found in 2026 keep their current value. Seed data (SEED.js) is never touched.
"""
import openpyxl, re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

WB = 'new data/ghg-conversion-factors-2026-full-set.xlsx'
CALC = 'portal/src/lib/calculations.js'
wb = openpyxl.load_workbook(WB, data_only=True, read_only=True)

def rows(sheet):
    return list(wb[sheet].iter_rows(values_only=True))

def find_header(sheet, must_have):
    for i, row in enumerate(rows(sheet)):
        cells = [('' if c is None else str(c).strip()) for c in row]
        if all(any(h == c for c in cells) for h in must_have):
            return i, cells
    return None, None

def num(v):
    if v is None or v == '':
        return None
    try:
        return float(v)
    except (ValueError, TypeError):
        return None

# ── Build 2026 lookup dicts ───────────────────────────────────────────────────
def build_fuels():
    d = {}
    for sheet in ['Fuels', 'Bioenergy']:
        hi, hdr = find_header(sheet, ['Activity', 'Fuel', 'Unit', 'kg CO2e'])
        if hi is None:
            continue
        ci = {h: hdr.index(h) for h in ['Fuel', 'Unit', 'kg CO2e']}
        fuel = None
        for row in rows(sheet)[hi + 1:]:
            f = row[ci['Fuel']]
            if f not in (None, ''):
                fuel = str(f).strip()
            unit = row[ci['Unit']]
            ef = num(row[ci['kg CO2e']])
            if fuel and unit not in (None, '') and ef is not None:
                d[f"{fuel}/{str(unit).strip()}"] = ef
    return d

def build_simple(sheet, name_col, val_col='kg CO2e', must=None):
    must = must or ['Activity', name_col, 'Unit', 'kg CO2e']
    hi, hdr = find_header(sheet, must)
    d = {}
    if hi is None:
        return d
    ni, vi = hdr.index(name_col), hdr.index(val_col)
    cur = None
    for row in rows(sheet)[hi + 1:]:
        nm = row[ni]
        if nm not in (None, ''):
            cur = str(nm).strip()
        ef = num(row[vi])
        if cur and ef is not None and (row[ni] not in (None, '') or sheet == 'Heat and steam'):
            d[cur if row[ni] in (None, '') else str(row[ni]).strip()] = ef
    return d

def build_refrigerant():
    hi, hdr = find_header('Refrigerant & other', ['Activity', 'Emission', 'Unit'])
    d = {}
    if hi is None:
        return d
    ei = hdr.index('Emission')
    # value = first 'kg CO2e' column (idx 3 per inspection)
    vi = 3
    for row in rows('Refrigerant & other')[hi + 1:]:
        nm = row[ei]
        ef = num(row[vi])
        if nm not in (None, '') and ef is not None:
            d[str(nm).strip()] = ef
    return d

def build_air():
    hi, hdr = find_header('Business travel- air', ['Activity', 'Haul', 'Class', 'Unit'])
    withrf, without = {}, {}
    if hi is None:
        return withrf, without
    hauli, classi = hdr.index('Haul'), hdr.index('Class')
    # two 'kg CO2e' columns: first = with RF (idx4), second = without RF (idx8)
    kg_idxs = [i for i, h in enumerate(hdr) if h == 'kg CO2e']
    rf_i = kg_idxs[0]
    norf_i = kg_idxs[1] if len(kg_idxs) > 1 else kg_idxs[0]
    haul = None
    for row in rows('Business travel- air')[hi + 1:]:
        h = row[hauli]
        if h not in (None, ''):
            haul = str(h).strip()
        cls = row[classi]
        if haul and cls not in (None, ''):
            key = f"{haul}/{str(cls).strip()}"
            if num(row[rf_i]) is not None:
                withrf[key] = num(row[rf_i])
            if num(row[norf_i]) is not None:
                without[key] = num(row[norf_i])
    return withrf, without

def build_scalar(sheet, must=('Activity', 'Type', 'Unit', 'kg CO2e')):
    hi, hdr = find_header(sheet, list(must))
    if hi is None:
        return None
    vi = hdr.index('kg CO2e')
    for row in rows(sheet)[hi + 1:]:
        ef = num(row[vi])
        if ef is not None:
            return ef
    return None

def build_land():
    """Business travel- land: Type -> first 'kg CO2e' (the average/primary factor).
    Returns (by_type, by_type_unit). Prefer non-miles rows for by_type."""
    by_type, by_tu = {}, {}
    for i, row in enumerate(rows('Business travel- land')):
        cells = [('' if c is None else str(c).strip()) for c in row]
        if len(cells) < 4:
            continue
        if cells[0] == 'Activity' and cells[1] == 'Type':
            continue
        typ, unit = cells[1], cells[2]
        ef = num(row[3])
        if typ and unit and ef is not None and typ != 'Type':
            by_tu[f"{typ}/{unit}"] = ef
            if typ not in by_type or unit != 'miles':
                if not (typ in by_type and unit == 'miles'):
                    by_type[typ] = ef
    return by_type, by_tu

def build_materials():
    """Material use: Material -> first 'kg CO2e' (primary production, per tonnes)."""
    d = {}
    for row in rows('Material use'):
        cells = [('' if c is None else str(c).strip()) for c in row]
        if len(cells) < 4 or cells[1] in ('Material', '') or cells[0] == 'Activity':
            continue
        ef = num(row[3])
        if cells[1] and ef is not None and cells[2] in ('tonnes', 'kg'):
            d[cells[1]] = ef
    return d

LOOKUPS = {}
LOOKUPS['fuels'] = build_fuels()
land_type, land_tu = build_land()
LOOKUPS['land_type'] = land_type
LOOKUPS['land_tu'] = land_tu
LOOKUPS['materials'] = build_materials()
LOOKUPS['heat'] = build_simple('Heat and steam', 'Type', must=['Activity', 'Type', 'Unit', 'kg CO2e'])
LOOKUPS['refrigerant'] = build_refrigerant()
air_rf, air_norf = build_air()
LOOKUPS['air_rf'] = air_rf
LOOKUPS['air_norf'] = air_norf
LOOKUPS['sea'] = build_simple('Business travel- sea', 'Type')
LOOKUPS['hotel'] = build_simple('Hotel stay', 'Country', must=['Activity', 'Country', 'Unit', 'kg CO2e'])
water_supply = build_scalar('Water supply')
water_treat = build_scalar('Water treatment')

print('=== 2026 LOOKUP SIZES ===')
for k, v in LOOKUPS.items():
    print(f'  {k}: {len(v)} entries')
print(f'  water_supply scalar: {water_supply}')
print(f'  water_treatment scalar: {water_treat}')
print('  sample fuels:', dict(list(LOOKUPS['fuels'].items())[:3]))
print('  sample heat:', LOOKUPS['heat'])
print('  sample air_rf:', dict(list(LOOKUPS['air_rf'].items())[:2]))

# ── In-place update of calculations.js flat maps ──────────────────────────────
text = open(CALC, encoding='utf-8').read()

def update_block(text, var, lookup, report):
    m = re.search(r'(export const ' + re.escape(var) + r' = \{)(.*?)(\n\})', text, re.S)
    if not m:
        report.append(f'{var}: BLOCK NOT FOUND')
        return text
    block = m.group(2)
    upd = same = miss = 0
    def repl(mm):
        nonlocal upd, same, miss
        key = mm.group('k')
        if key in lookup:
            newv = lookup[key]
            oldv = float(mm.group('v'))
            if abs(newv - oldv) > 1e-9:
                upd += 1
            else:
                same += 1
            # preserve formatting: number with up to needed precision
            ns = repr(newv)
            return f'{mm.group("q")}{key}{mm.group("q")}{mm.group("sep")}{ns}'
        else:
            miss += 1
            return mm.group(0)
    newblock = re.sub(r'(?P<q>["\'])(?P<k>[^"\']+)(?P=q)(?P<sep>\s*:\s*)(?P<v>-?\d+\.?\d*(?:[eE][-+]?\d+)?)', repl, block)
    report.append(f'{var}: updated={upd} unchanged={same} kept(no 2026 match)={miss}')
    return text[:m.start(2)] + newblock + text[m.end(2):]

report = []
text = update_block(text, 'EF_STATIONARY', LOOKUPS['fuels'], report)
text = update_block(text, 'EF_HEAT', LOOKUPS['heat'], report)
text = update_block(text, 'EF_FUGITIVE', LOOKUPS['refrigerant'], report)
text = update_block(text, 'EF_TRAVEL_AIR', LOOKUPS['air_rf'], report)
text = update_block(text, 'EF_TRAVEL_AIR_WITH_RF', LOOKUPS['air_rf'], report)
text = update_block(text, 'EF_TRAVEL_AIR_WITHOUT_RF', LOOKUPS['air_norf'], report)
text = update_block(text, 'EF_TRAVEL_SEA', LOOKUPS['sea'], report)
text = update_block(text, 'EF_HOTEL', LOOKUPS['hotel'], report)
text = update_block(text, 'EF_TRAVEL_LAND', LOOKUPS['land_type'], report)
text = update_block(text, 'EF_MOBILE', LOOKUPS['land_tu'], report)
text = update_block(text, 'EF_GOODS', LOOKUPS['materials'], report)

# scalars
if water_supply is not None:
    text = re.sub(r'(export const EF_WATER_SUPPLY = )[\d.]+', r'\g<1>' + repr(water_supply), text)
if water_treat is not None:
    text = re.sub(r'(export const EF_WATER_TREATMENT = )[\d.]+', r'\g<1>' + repr(water_treat), text)

# update header comment
text = text.replace('// GHG Calculation Engine — Defra 2025 Conversion Factors',
                    '// GHG Calculation Engine — DEFRA 2026 Conversion Factors (full set, v1)')

print('\n=== UPDATE REPORT ===')
for r in report:
    print('  ' + r)

open(CALC, 'w', encoding='utf-8', newline='\n').write(text)
print('\nWrote', CALC)
wb.close()
