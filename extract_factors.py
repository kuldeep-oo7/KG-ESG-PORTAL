import openpyxl
import warnings
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
warnings.filterwarnings('ignore')

wb = openpyxl.load_workbook(r'E:\HACKATHON\ghg-conversion-factors-2025.xlsx', data_only=True)

def get_rows(sheet_name, max_rows=300):
    ws = wb[sheet_name]
    rows = []
    for row in ws.iter_rows(values_only=True):
        vals = [str(v) if v is not None else '' for v in row]
        if any(v.strip() for v in vals):
            rows.append(vals)
        if len(rows) >= max_rows:
            break
    return rows

def print_sheet(name, max_rows=300):
    print(f'\n===== {name} =====')
    for row in get_rows(name, max_rows):
        print('\t'.join(row[:10]))  # first 10 cols

# Key sheets for implementation
sheets_needed = [
    'SC 1- Fuels',
    'SC1 - Bioenergy',
    'SC1-Mobile com',
    'SC1-Mobile com2',
    'SC1 - Fugitive Emission',
    'sc 2-UK electricity',
    'Overseas electricity',
    'SC 2- Heat and steam',
    'SC3 - Trans and distribution',
    'SC 3- Water supply',
    'SC- 3 Water treatment',
    'S 3- Purchase Good',
    'S 3- Waste disposal',
    'S 3- Business travel- air',
    'S 3 -Business travel- sea',
    'S3-Business travel&empco - land',
    'S3-Up & down stream Act',
    'S3- Hotel stay',
]

for s in sheets_needed:
    print_sheet(s)
