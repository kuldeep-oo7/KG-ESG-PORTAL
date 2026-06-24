# -*- coding: utf-8 -*-
"""Extract DEFRA 2026 'Freighting goods' factors into a JS lookup keyed to match
the official Q13/Q14 bulk-import template columns (Vehicle|Fuel|Class|Type|Unit)."""
import openpyxl, json, io

wb = openpyxl.load_workbook('new data/ghg-conversion-factors-2026-full-set.xlsx', data_only=True, read_only=True)
ws = wb['Freighting goods']
rows = list(ws.iter_rows(values_only=True))

def num(v):
    try:
        return round(float(v), 6)
    except (TypeError, ValueError):
        return None

def norm(s):
    s = '' if s is None else str(s)
    s = s.lower().replace('–', '-').replace('—', '-')
    return ' '.join(s.split()).strip()

def key(parts):
    return '|'.join(norm(p) for p in parts if p is not None and norm(p) != '')

EF = {}

def section_bounds(start_label):
    """Return (header_row_index) for the section whose first data row col0==start_label."""
    for i, r in enumerate(rows):
        if r[0] and str(r[0]).strip() == start_label:
            return i
    return None

# ── Vans: fuel column groups, Type=class, Unit col2 ───────────────────────────
FUELS = [('Diesel', 3), ('Petrol', 7), ('CNG', 11), ('LPG', 15),
         ('Plug-in Hybrid Electric Vehicle', 23), ('Battery Electric Vehicle', 27)]
start = section_bounds('Vans')
cur = None
for r in rows[start:start + 12]:
    if r[1] not in (None, ''):
        cur = str(r[1]).strip()
    unit = r[2]
    if not cur or unit in (None, ''):
        continue
    for fuel, col in FUELS:
        ef = num(r[col]) if col < len(r) else None
        if ef is not None:
            EF[key(['Vans', fuel, cur, unit])] = ef

# ── HGV (All Diesel + refrigerated): use 'Average laden' (col 3), Type=class ──
for veh, lbl in [('HGV - All Diesel', 'HGV - All Diesel'),
                 ('HGV refrigerated (all diesel)', 'HGV refrigerated (all diesel)')]:
    s = section_bounds(veh)
    if s is None:
        continue
    cur = None
    for r in rows[s:s + 30]:
        c0 = str(r[0]).strip() if r[0] else ''
        if c0 and c0 != veh and c0 not in ('', 'Activity') and not c0.startswith('●'):
            break  # next section
        if r[1] not in (None, ''):
            cur = str(r[1]).strip()
        unit = r[2]
        ef = num(r[3]) if len(r) > 3 else None
        if cur and unit not in (None, '') and ef is not None:
            EF[key([veh, cur, unit])] = ef

# ── Freight flights: With RF (col3) / Without RF (col7), Type=haul ────────────
s = section_bounds('Freight flights')
cur = None
for r in rows[s:s + 8]:
    if r[1] not in (None, ''):
        cur = str(r[1]).strip()
    unit = r[2]
    if not cur or unit in (None, ''):
        continue
    for rf, col in [('With RF', 3), ('Without RF', 7)]:
        ef = num(r[col]) if col < len(r) else None
        if ef is not None:
            EF[key(['Freight flights', cur, rf, unit])] = ef

# ── Rail: single col3 ─────────────────────────────────────────────────────────
s = section_bounds('Rail')
cur = None
for r in rows[s:s + 4]:
    if r[1] not in (None, ''):
        cur = str(r[1]).strip()
    unit = r[2]
    ef = num(r[3]) if len(r) > 3 else None
    if cur and unit not in (None, '') and ef is not None:
        EF[key(['Rail', cur, unit])] = ef

# ── Sea tanker / Cargo ship: Activity | Type | Size | Unit | kgCO2e ───────────
for veh in ['Sea tanker', 'Cargo ship']:
    s = section_bounds(veh)
    if s is None:
        continue
    cur = None
    for r in rows[s:s + 60]:
        c0 = str(r[0]).strip() if r[0] else ''
        if c0 and c0 != veh and c0 not in ('', 'Activity') and not c0.startswith('●'):
            break
        if r[1] not in (None, ''):
            cur = str(r[1]).strip()
        size = r[2]
        unit = r[3] if len(r) > 3 else None
        ef = num(r[4]) if len(r) > 4 else None
        if cur and size not in (None, '') and unit not in (None, '') and ef is not None:
            cls = f"{cur} - {size}"
            EF[key([veh, cls, unit])] = ef
wb.close()

js = "// DEFRA 2026 'Freighting goods' factors for Upstream/Downstream bulk import.\n"
js += "// Key = normalized 'Vehicle|Fuel|Class|Type|Unit' (empty parts dropped).\n"
js += "export const FREIGHT_EF = " + json.dumps(EF, indent=0, ensure_ascii=False) + "\n\n"
js += """export function freightNorm(s) {
  return String(s == null ? '' : s).toLowerCase().replace(/[\\u2013\\u2014]/g, '-').replace(/\\s+/g, ' ').trim()
}
export function freightKey(parts) {
  return parts.filter(p => p != null && freightNorm(p) !== '').map(freightNorm).join('|')
}
export function lookupFreightEF({ vehicle, fuel, cls, type, unit }) {
  // try with all parts, then without fuel, then without type — robust to which
  // descriptor columns a given vehicle uses
  const tries = [
    [vehicle, fuel, cls, type, unit],
    [vehicle, cls, type, unit],
    [vehicle, cls, unit],
    [vehicle, fuel, cls, unit],
  ]
  for (const t of tries) {
    const k = freightKey(t)
    if (FREIGHT_EF[k] != null) return FREIGHT_EF[k]
  }
  return 0
}
"""
io.open('portal/src/lib/freightFactors.js', 'w', encoding='utf-8', newline='\n').write(js)
print('Wrote freightFactors.js with', len(EF), 'factors')
import itertools
for k in itertools.islice(EF, 12):
    print('  ', k, '=', EF[k])
