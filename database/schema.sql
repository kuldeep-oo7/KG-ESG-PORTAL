-- ============================================================
-- ESG / GHG Reporting Database Schema
-- K. Girdharlal International Pvt. Ltd.
-- Based on: ESGTech portal field map + GHG Protocol
-- ============================================================

-- ── 1. ORGANIZATIONS ──────────────────────────────────────────
CREATE TABLE organizations (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(200) NOT NULL,
    cin           VARCHAR(50),                    -- company identification number
    gstin         VARCHAR(30),
    industry      VARCHAR(100),
    reporting_year_start INT DEFAULT 4,           -- April (Indian FY)
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. SITES (Locations) ──────────────────────────────────────
INSERT INTO organizations (id, name, industry, reporting_year_start) VALUES
(1, 'K. Girdharlal International Pvt. Ltd.', 'Diamonds and Jewelry', 4)
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('organizations', 'id'), COALESCE((SELECT MAX(id) FROM organizations), 1), true);

CREATE TABLE sites (
    id              SERIAL PRIMARY KEY,
    org_id          INT REFERENCES organizations(id),
    code            VARCHAR(20) UNIQUE NOT NULL,  -- KGIPL-01, KGIPL-02, etc.
    name            VARCHAR(200) NOT NULL,
    type            VARCHAR(50),                  -- Office / Factory / Branch Office / Sales Office
    address         TEXT,
    city            VARCHAR(100),
    state           VARCHAR(100),
    country         VARCHAR(100) NOT NULL,
    country_code    CHAR(2),                      -- IN, AE, BW
    grid_region     VARCHAR(100),                 -- for country-specific grid EF lookup
    latitude        DECIMAL(9,6),
    longitude       DECIMAL(9,6),
    area_sqm        DECIMAL(10,2),                -- floor area for intensity calc
    active          BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. EMISSION FACTORS (lookup table) ────────────────────────
-- Single source of truth — all EFs the system uses
INSERT INTO sites (id, org_id, code, name, type, address, city, state, country, country_code) VALUES
(1, 1, 'KGIPL-01', 'K. Girdharlal International Pvt. Ltd.', 'Corporate Office', 'EE-9012, Bharat Diamond Bourse, Bandra Kurla Complex, Bandra (E), Mumbai, Maharashtra, India - 400051', 'Mumbai', 'Maharashtra', 'India', 'IN'),
(2, 1, 'KGIPL-02', 'K. Girdharlal International Private Limited (Branch Office)', 'Branch Office', '2nd Floor, X-03-05, Gujarat Hira Bourne Gem & Jewellery Park, Hazira Road, Ichchapore GIDC, Surat, Gujarat, India - 394510', 'Surat', 'Gujarat', 'India', 'IN'),
(3, 1, 'KGIPL-03', 'Facets Gems Polishing Works Pvt. Ltd.', 'Factory', 'X-03-05, Gujarat Hira Bourne Gem & Jewellery Park, Hazira Road, Ichchapore GIDC, Surat, Gujarat, India - 394510', 'Surat', 'Gujarat', 'India', 'IN'),
(4, 1, 'KGIPL-04', 'K. Girdharlal DMCC', 'Sales Office', 'Unit No: AG-03-C, AG Tower, Plot No: 01 JLT ITA, Jumeirah Lakes Towers, Dubai, United Arab Emirates - 44753', 'Dubai', 'Dubai', 'United Arab Emirates', 'AE'),
(5, 1, 'KGIPL-05', 'KG Mfg Botswana Proprietary Ltd.', 'Branch Office', 'Plot 64260, Unit B4, Phakathe Road, Block 3 Industrial, Gaborone, Botswana - 2307', 'Gaborone', 'Southern District', 'Botswana', 'BW')
ON CONFLICT (code) DO NOTHING;

SELECT setval(pg_get_serial_sequence('sites', 'id'), COALESCE((SELECT MAX(id) FROM sites), 1), true);

CREATE TABLE emission_factors (
    id              SERIAL PRIMARY KEY,
    scope           SMALLINT NOT NULL,            -- 1, 2, or 3
    category        VARCHAR(100) NOT NULL,        -- Stationary Combustion, Electricity, etc.
    sub_category    VARCHAR(100),
    fuel_type       VARCHAR(100),                 -- Diesel, LPG, R-410A, etc.
    unit            VARCHAR(30) NOT NULL,          -- Litres, kWh, kg, m3, km
    ef_value        DECIMAL(12,6) NOT NULL,        -- kgCO2e per unit
    ef_unit         VARCHAR(50) DEFAULT 'kgCO2e', -- always kgCO2e
    gwp             DECIMAL(10,3) DEFAULT 1.0,    -- for refrigerants: GWP multiplier
    country_code    CHAR(2),                      -- NULL = global, 'IN' = India only
    source          VARCHAR(100),                 -- CEA 2024, DEFRA 2023, IPCC AR6, MoEFCC
    valid_from      DATE,
    valid_to        DATE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Seed: core emission factors
INSERT INTO emission_factors (scope, category, fuel_type, unit, ef_value, source) VALUES
-- Scope 1 Stationary & Mobile Combustion (MoEFCC / IPCC)
(1, 'Stationary Combustion', 'Diesel',          'Litres',  2.680, 'MoEFCC'),
(1, 'Stationary Combustion', 'Petrol',          'Litres',  2.310, 'MoEFCC'),
(1, 'Stationary Combustion', 'LPG',             'Litres',  2.983, 'MoEFCC'),
(1, 'Stationary Combustion', 'LPG',             'kg',      2.983, 'MoEFCC'),
(1, 'Stationary Combustion', 'CNG',             'm3',      1.960, 'MoEFCC'),
(1, 'Stationary Combustion', 'Natural Gas',     'm3',      2.020, 'MoEFCC'),
(1, 'Stationary Combustion', 'Coal',            'kg',      2.420, 'MoEFCC'),
(1, 'Stationary Combustion', 'Furnace Oil',     'Litres',  3.150, 'MoEFCC'),
(1, 'Mobile Combustion',     'Diesel',          'Litres',  2.680, 'MoEFCC'),
(1, 'Mobile Combustion',     'Petrol',          'Litres',  2.310, 'MoEFCC'),
(1, 'Mobile Combustion',     'CNG',             'kg',      2.790, 'MoEFCC'),
-- Scope 1 Fugitive (IPCC AR6 GWP100)
(1, 'Fugitive Emissions',    'R-410A',          'kg',    2088.000, 'IPCC AR6'),
(1, 'Fugitive Emissions',    'R-22',            'kg',    1810.000, 'IPCC AR6'),
(1, 'Fugitive Emissions',    'R-32',            'kg',     675.000, 'IPCC AR6'),
(1, 'Fugitive Emissions',    'R-134a',          'kg',    1430.000, 'IPCC AR6'),
(1, 'Fugitive Emissions',    'R-407C',          'kg',    1774.000, 'IPCC AR6'),
-- Scope 2 Electricity by country
(2, 'Electricity',           'Grid',            'kWh',     0.716, 'CEA 2024'),      -- India
(2, 'Electricity',           'Grid',            'kWh',     0.450, 'IEA 2023'),      -- UAE
(2, 'Electricity',           'Grid',            'kWh',     1.050, 'IEA 2023'),      -- Botswana
(2, 'Electricity',           'Wind (SLDC)',     'kWh',     0.000, 'Market-Based'),  -- certified renewable
(2, 'Electricity',           'Solar Rooftop',   'kWh',     0.000, 'Market-Based'),
-- Scope 3 Employee Commute (DEFRA 2023)
(3, 'Employee Commute',      'Motorbike',       'km',      0.114, 'DEFRA 2023'),
(3, 'Employee Commute',      'Car (Petrol)',     'km',      0.192, 'DEFRA 2023'),
(3, 'Employee Commute',      'Car (Diesel)',     'km',      0.171, 'DEFRA 2023'),
(3, 'Employee Commute',      'Bus',             'km',      0.089, 'DEFRA 2023'),
(3, 'Employee Commute',      'Auto Rickshaw',   'km',      0.132, 'DEFRA 2023'),
(3, 'Employee Commute',      'Electric Vehicle','km',      0.050, 'DEFRA 2023'),
(3, 'Employee Commute',      'Train/Metro',     'km',      0.041, 'DEFRA 2023'),
-- Scope 3 Business Travel
(3, 'Business Travel',       'Flight Economy',  'km',      0.255, 'DEFRA 2023'),
(3, 'Business Travel',       'Flight Business', 'km',      0.510, 'DEFRA 2023'),
(3, 'Business Travel',       'Car (Petrol)',     'km',      0.192, 'DEFRA 2023'),
(3, 'Business Travel',       'Train',           'km',      0.041, 'DEFRA 2023'),
-- Scope 3 Waste
(3, 'Waste',                 'Landfill',        'kg',      0.467, 'DEFRA 2023'),
(3, 'Waste',                 'Recycling',       'kg',      0.021, 'DEFRA 2023'),
(3, 'Waste',                 'Incineration',    'kg',      0.021, 'DEFRA 2023'),
(3, 'Waste',                 'Composting',      'kg',      0.010, 'DEFRA 2023'),
-- Scope 3 Water
(3, 'Water',                 'Municipal Supply','m3',      0.344, 'DEFRA 2023');


-- ── 4. REPORTING PERIODS ──────────────────────────────────────
CREATE TABLE reporting_periods (
    id          SERIAL PRIMARY KEY,
    org_id      INT REFERENCES organizations(id),
    year        INT NOT NULL,
    period_type VARCHAR(10) DEFAULT 'FY',         -- FY (Apr-Mar) or CY (Jan-Dec)
    start_date  DATE NOT NULL,
    end_date    DATE NOT NULL,
    locked      BOOLEAN DEFAULT FALSE,            -- prevent edits once report filed
    UNIQUE (org_id, year, period_type)
);


-- ── 5. PERSONNEL (data entry responsibility) ──────────────────
INSERT INTO reporting_periods (id, org_id, year, period_type, start_date, end_date) VALUES
(1, 1, 2026, 'CY', '2026-01-01', '2026-12-31'),
(2, 1, 2026, 'FY', '2026-04-01', '2027-03-31')
ON CONFLICT (org_id, year, period_type) DO NOTHING;

SELECT setval(pg_get_serial_sequence('reporting_periods', 'id'), COALESCE((SELECT MAX(id) FROM reporting_periods), 1), true);

CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    org_id          INT REFERENCES organizations(id),
    email           VARCHAR(200) UNIQUE NOT NULL,
    name            VARCHAR(200),
    role            VARCHAR(50) DEFAULT 'data_entry',  -- admin | data_entry | viewer
    site_id         INT REFERENCES sites(id),           -- primary site responsibility
    created_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ── 6. GHG ENTRIES (the core fact table) ──────────────────────
-- One row per data entry in the portal.
-- Mirrors exactly the portal's report export columns.
CREATE TABLE ghg_entries (
    id                      BIGSERIAL PRIMARY KEY,

    -- context
    site_id                 INT NOT NULL REFERENCES sites(id),
    period_id               INT NOT NULL REFERENCES reporting_periods(id),
    entry_date              DATE NOT NULL,
    entry_month             SMALLINT,                   -- 1-12
    entry_quarter           CHAR(2),                    -- Q1-Q4
    entered_by              INT REFERENCES users(id),
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW(),

    -- scope & category (mirrors portal URL: Q1=Stationary, Q2=Mobile, Q3=Fugitive, Q4=Scope2, Q16=Scope3)
    scope                   SMALLINT NOT NULL CHECK (scope IN (1,2,3)),
    category                VARCHAR(100) NOT NULL,      -- Stationary Combustion / Electricity / Employee Commute / …
    portal_category_code    VARCHAR(10),                -- Q1, Q2, Q3, Q4, Q16 (portal's internal code)

    -- ── Scope 1 & 2 fields ──────────────────────────────────
    fuel_type               VARCHAR(100),               -- Diesel / LPG / R-410A / Grid / Wind…
    unit_of_measurement     VARCHAR(30),                -- Litres / kWh / kg / m3
    consumption             DECIMAL(15,4),              -- the number the user typed
    source                  VARCHAR(100),               -- Grid / Wind Farm / Solar / etc.
    country_name            VARCHAR(100),               -- for grid EF selection
    remarks                 TEXT,
    supporting_document     VARCHAR(500),               -- file path / URL

    -- ── Scope 3 — Employee Commute fields ───────────────────
    commute_type            VARCHAR(50),                -- One-way / Two-way
    vehicle_type            VARCHAR(100),               -- Car / Bus / Motorbike…
    fuel_type_s3            VARCHAR(100),               -- Petrol / Diesel / Electric (S3 specific)
    number_of_passengers    INT,
    kilometers_travelled    DECIMAL(10,3),              -- distance per day per person

    -- ── Scope 3 — Goods transport fields ────────────────────
    type_of_goods           VARCHAR(100),
    loop                    VARCHAR(20),                -- One-way / Return
    generation              VARCHAR(50),                -- upstream / downstream

    -- ── Scope 3 — Waste / Water ─────────────────────────────
    select_type             VARCHAR(100),               -- Landfill / Recycling / Municipal...
    waste_weight_kg         DECIMAL(12,4),
    water_volume_m3         DECIMAL(12,4),

    -- ── Calculated (server fills these) ─────────────────────
    emission_factor_id      INT REFERENCES emission_factors(id),
    emission_factor_value   DECIMAL(12,6),              -- kgCO2e per unit (snapshotted at entry)
    ghg_emissions_tco2e     DECIMAL(15,6),              -- = consumption × EF / 1000

    -- ── Validation ──────────────────────────────────────────
    is_verified             BOOLEAN DEFAULT FALSE,
    verified_by             INT REFERENCES users(id),
    verified_at             TIMESTAMPTZ
);

-- Index for fast aggregation queries
CREATE INDEX idx_ghg_site_period  ON ghg_entries(site_id, period_id);
CREATE INDEX idx_ghg_scope_cat    ON ghg_entries(scope, category);
CREATE INDEX idx_ghg_entry_date   ON ghg_entries(entry_date);


-- ── 7. RENEWABLE ENERGY CERTIFICATES ─────────────────────────
CREATE TABLE renewable_certificates (
    id              SERIAL PRIMARY KEY,
    site_id         INT NOT NULL REFERENCES sites(id),
    period_id       INT NOT NULL REFERENCES reporting_periods(id),
    source_name     VARCHAR(200),                       -- Moti Vavdi Wind Farm
    cert_type       VARCHAR(50),                        -- SLDC / REC / I-REC
    cert_number     VARCHAR(100),
    kwh_certified   DECIMAL(15,4),
    cert_date       DATE,
    valid_until     DATE,
    document_path   VARCHAR(500)
);


-- ── 8. ENERGY SUMMARY (derived — populated by aggregation job) ─
CREATE TABLE energy_summary (
    id                      SERIAL PRIMARY KEY,
    site_id                 INT NOT NULL REFERENCES sites(id),
    period_id               INT NOT NULL REFERENCES reporting_periods(id),
    month                   SMALLINT,                   -- NULL = full year

    -- consumption
    total_electricity_kwh   DECIMAL(15,4) DEFAULT 0,
    renewable_kwh           DECIMAL(15,4) DEFAULT 0,
    non_renewable_kwh       DECIMAL(15,4) DEFAULT 0,
    renewable_pct           DECIMAL(6,3),               -- % renewable

    -- fuel
    diesel_litres           DECIMAL(15,4) DEFAULT 0,
    lpg_litres              DECIMAL(15,4) DEFAULT 0,
    cng_m3                  DECIMAL(15,4) DEFAULT 0,

    -- emissions
    scope1_tco2e            DECIMAL(15,6) DEFAULT 0,
    scope2_location_tco2e   DECIMAL(15,6) DEFAULT 0,   -- grid EF
    scope2_market_tco2e     DECIMAL(15,6) DEFAULT 0,   -- after renewable deduction
    scope3_tco2e            DECIMAL(15,6) DEFAULT 0,
    total_tco2e             DECIMAL(15,6) DEFAULT 0,

    UNIQUE (site_id, period_id, month)
);


-- ── 9. SCOPE 3 BREAKDOWN ──────────────────────────────────────
-- Sub-totals by Scope 3 category for the report charts
CREATE TABLE scope3_summary (
    id                      SERIAL PRIMARY KEY,
    site_id                 INT NOT NULL REFERENCES sites(id),
    period_id               INT NOT NULL REFERENCES reporting_periods(id),
    month                   SMALLINT,

    employee_commute_tco2e  DECIMAL(15,6) DEFAULT 0,
    business_travel_tco2e   DECIMAL(15,6) DEFAULT 0,
    upstream_transport_tco2e DECIMAL(15,6) DEFAULT 0,
    downstream_transport_tco2e DECIMAL(15,6) DEFAULT 0,
    purchased_goods_tco2e   DECIMAL(15,6) DEFAULT 0,
    waste_tco2e             DECIMAL(15,6) DEFAULT 0,
    water_tco2e             DECIMAL(15,6) DEFAULT 0,
    total_scope3_tco2e      DECIMAL(15,6) DEFAULT 0,

    UNIQUE (site_id, period_id, month)
);


-- ── 10. INTENSITY METRICS ─────────────────────────────────────
CREATE TABLE intensity_metrics (
    id                  SERIAL PRIMARY KEY,
    site_id             INT NOT NULL REFERENCES sites(id),
    period_id           INT NOT NULL REFERENCES reporting_periods(id),
    month               SMALLINT,

    -- denominators (entered by user)
    revenue_inr_cr      DECIMAL(15,4),                  -- revenue in crores INR
    employees_count     INT,
    production_units    DECIMAL(15,4),
    production_unit_label VARCHAR(50),                  -- tonnes / pieces / carats

    -- calculated intensities
    ghg_per_revenue     DECIMAL(12,6),                  -- tCO2e / INR cr
    ghg_per_employee    DECIMAL(12,6),                  -- tCO2e / employee
    ghg_per_production  DECIMAL(12,6),                  -- tCO2e / production unit
    energy_per_revenue  DECIMAL(12,6),                  -- kWh / INR cr

    UNIQUE (site_id, period_id, month)
);


-- ── 11. TARGETS (2030 reduction goals) ────────────────────────
CREATE TABLE targets (
    id                  SERIAL PRIMARY KEY,
    org_id              INT NOT NULL REFERENCES organizations(id),
    site_id             INT REFERENCES sites(id),        -- NULL = org-wide
    metric              VARCHAR(100) NOT NULL,            -- total_tco2e / renewable_pct / etc.
    baseline_year       INT NOT NULL,                    -- e.g. 2023
    baseline_value      DECIMAL(15,6) NOT NULL,
    target_year         INT NOT NULL,                    -- 2030
    target_value        DECIMAL(15,6) NOT NULL,
    target_pct_reduction DECIMAL(6,3),                   -- e.g. 42.0 (42% reduction)
    description         TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- K. Girdharlal 2030 targets from sustainability report
INSERT INTO targets (org_id, site_id, metric, baseline_year, baseline_value, target_year, target_value, target_pct_reduction, description) VALUES
(1, NULL, 'total_tco2e',        2023, 4500.0, 2030, 2610.0, 42.0, 'Total GHG 42% reduction by 2030'),
(1, NULL, 'renewable_pct',      2023,   15.0, 2030,   50.0,  NULL, '50% renewable energy by 2030'),
(1, NULL, 'scope2_tco2e',       2023, 1200.0, 2030,    0.0, 100.0, 'Net zero Scope 2 by 2030'),
(1, NULL, 'water_recycled_pct', 2023,   20.0, 2030,   60.0,  NULL, '60% water recycled by 2030');


-- ── 12. WATER DATA ────────────────────────────────────────────
CREATE TABLE water_entries (
    id              BIGSERIAL PRIMARY KEY,
    site_id         INT NOT NULL REFERENCES sites(id),
    period_id       INT NOT NULL REFERENCES reporting_periods(id),
    entry_date      DATE NOT NULL,
    source_type     VARCHAR(100),                        -- Municipal / Groundwater / Rainwater / Recycled
    consumption_m3  DECIMAL(15,4),
    discharged_m3   DECIMAL(15,4),
    recycled_m3     DECIMAL(15,4),
    intensity_m3_per_employee DECIMAL(10,4),
    entered_by      INT REFERENCES users(id),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ── 13. WASTE DATA ────────────────────────────────────────────
CREATE TABLE waste_entries (
    id              BIGSERIAL PRIMARY KEY,
    site_id         INT NOT NULL REFERENCES sites(id),
    period_id       INT NOT NULL REFERENCES reporting_periods(id),
    entry_date      DATE NOT NULL,
    waste_type      VARCHAR(100),                        -- Hazardous / Non-Hazardous / e-Waste
    disposal_method VARCHAR(100),                        -- Landfill / Recycling / Incineration / Compost
    weight_kg       DECIMAL(15,4),
    ghg_tco2e       DECIMAL(12,6),                       -- weight × disposal EF / 1000
    vendor          VARCHAR(200),
    entered_by      INT REFERENCES users(id),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ── 14. AUDIT LOG ─────────────────────────────────────────────
CREATE TABLE audit_log (
    id          BIGSERIAL PRIMARY KEY,
    table_name  VARCHAR(100),
    record_id   BIGINT,
    action      VARCHAR(10),                             -- INSERT / UPDATE / DELETE
    changed_by  INT REFERENCES users(id),
    changed_at  TIMESTAMPTZ DEFAULT NOW(),
    old_values  JSONB,
    new_values  JSONB
);


-- ── VIEWS (for the dashboard & reports) ───────────────────────

-- Live scope totals per site per year
CREATE VIEW v_scope_totals AS
SELECT
    s.code          AS site_code,
    s.name          AS site_name,
    rp.year,
    e.scope,
    e.category,
    SUM(e.consumption)          AS total_consumption,
    MAX(e.unit_of_measurement)  AS unit,
    SUM(e.ghg_emissions_tco2e)  AS total_tco2e,
    COUNT(*)                    AS entry_count
FROM ghg_entries e
JOIN sites s ON s.id = e.site_id
JOIN reporting_periods rp ON rp.id = e.period_id
GROUP BY s.code, s.name, rp.year, e.scope, e.category;

-- Monthly trend view
CREATE VIEW v_monthly_emissions AS
SELECT
    s.code  AS site_code,
    rp.year,
    e.entry_month   AS month,
    SUM(CASE WHEN e.scope=1 THEN e.ghg_emissions_tco2e ELSE 0 END) AS scope1_tco2e,
    SUM(CASE WHEN e.scope=2 THEN e.ghg_emissions_tco2e ELSE 0 END) AS scope2_tco2e,
    SUM(CASE WHEN e.scope=3 THEN e.ghg_emissions_tco2e ELSE 0 END) AS scope3_tco2e,
    SUM(e.ghg_emissions_tco2e) AS total_tco2e
FROM ghg_entries e
JOIN sites s ON s.id = e.site_id
JOIN reporting_periods rp ON rp.id = e.period_id
GROUP BY s.code, rp.year, e.entry_month;

-- Target vs actuals
CREATE VIEW v_target_progress AS
SELECT
    t.metric,
    t.baseline_year,
    t.baseline_value,
    t.target_year,
    t.target_value,
    t.target_pct_reduction,
    es.scope1_tco2e + es.scope2_market_tco2e + es.scope3_tco2e AS current_tco2e,
    rp.year AS current_year,
    ROUND(
        100.0 * (t.baseline_value - (es.scope1_tco2e + es.scope2_market_tco2e + es.scope3_tco2e))
        / NULLIF(t.baseline_value, 0), 2
    ) AS pct_reduced_so_far
FROM targets t
JOIN reporting_periods rp ON rp.org_id = t.org_id
JOIN energy_summary es ON es.period_id = rp.id AND es.month IS NULL
WHERE t.site_id IS NULL;
