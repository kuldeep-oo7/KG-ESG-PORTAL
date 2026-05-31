import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'database.db')

export async function getDb() {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  })
  return db
}

export async function initDb() {
  const db = await getDb()

  // 1. Users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `)

  // 2. Sites table (isolated by user_email)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS sites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT,
      address TEXT,
      city TEXT,
      country TEXT,
      country_code TEXT
    );
  `)

  // 3. GHG Entries table (isolated by user_email)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS ghg_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL,
      site_code TEXT NOT NULL,
      module TEXT NOT NULL,
      tco2e REAL NOT NULL,
      data_json TEXT NOT NULL
    );
  `)

  // 4. CSR Activities table (isolated by user_email)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS csr_activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL,
      data_json TEXT NOT NULL
    );
  `)

  // ── Seeding default user & records ───────────────────────────────────────
  const defaultEmail = 'ketanbheda@kgirdharlal.com'
  const defaultPass = 'password123'
  
  const user = await db.get('SELECT * FROM users WHERE email = ?', [defaultEmail])
  if (!user) {
    console.log('Seeding default admin user and data...')
    await db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      ['K. Girdharlal', defaultEmail, defaultPass]
    )

    // Seed default sites
    const defaultSites = [
      { code: 'KGIPL-01', name: 'K. Girdharlal International Pvt. Ltd.', type: 'Corporate Office', address: 'EE-9012, Bharat Diamond Bourse, Bandra Kurla Complex, Bandra (E), Mumbai, Maharashtra, India - 400051', city: 'Mumbai', country: 'India', country_code: 'IN' },
      { code: 'KGIPL-02', name: 'K. Girdharlal Private Limited (Branch Office)', type: 'Branch Office', address: '2nd Floor, X-03-05, Gujarat Hira Bourne Gem & Jewellery Park, Hazira Road, Ichchapore GIDC, Surat, Gujarat, India - 394510', city: 'Surat', country: 'India', country_code: 'IN' },
      { code: 'KGIPL-03', name: 'Facets Gems Polishing Works Pvt. Ltd.', type: 'Factory', address: 'X-03-05, Gujarat Hira Bourne Gem & Jewellery Park, Hazira Road, Ichchapore GIDC, Surat, Gujarat, India - 394510', city: 'Surat', country: 'India', country_code: 'IN' },
      { code: 'KGIPL-04', name: 'K. Girdharlal DMCC', type: 'Sales Office', address: 'Unit No: AG-03-C, AG Tower, Plot No: 01 JLT ITA, Jumeirah Lakes Towers, Dubai, United Arab Emirates - 44753', city: 'Dubai', country: 'United Arab Emirates', country_code: 'AE' },
      { code: 'KGIPL-05', name: 'KG Mfg Botswana Proprietary Ltd.', type: 'Branch Office', address: 'Plot 64260, Unit B4, Phakathe Road, Block 3 Industrial, Gaborone, Botswana - 2307', city: 'Gaborone', country: 'Botswana', country_code: 'BW' }
    ]

    for (const site of defaultSites) {
      await db.run(
        'INSERT INTO sites (user_email, code, name, type, address, city, country, country_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [defaultEmail, site.code, site.name, site.type, site.address, site.city, site.country, site.country_code]
      )
    }

    // Seed default CSR activities
    const defaultActivities = [
      { tag: 'JAN', month: 'Jan 2026',  esg: 'S', title: 'Employees Upgrading Initiative',                                   sdgs: [4, 8],     budget: 0,     status: 'Completed', parties: 'Employees'                },
      { tag: 'FEB', month: 'Feb 2026',  esg: 'E', title: 'Food Donation & Food Waste Reduction Drive',                       sdgs: [2, 12],    budget: 10000, status: 'Completed', parties: 'NGOs / Community'         },
      { tag: 'MAR', month: 'Mar 2026',  esg: 'S', title: "Women's Day – Inclusion & Equality Program",                       sdgs: [5, 10],    budget: 20000, status: 'Completed', parties: 'Employees'                },
      { tag: 'APR', month: 'Apr 2026',  esg: 'S', title: 'Health Check-up Camp / Eye Check-up Camp',                         sdgs: [3],        budget: 20000, status: 'Completed', parties: 'Employees / Medical'      },
      { tag: 'MAY', month: 'May 2026',  esg: 'S', title: "Labour's Day Celebration & No-Tobacco Awareness Session",           sdgs: [3, 8],     budget: 20000, status: 'Completed', parties: 'Employees'                },
      { tag: 'JUN', month: 'Jun 2026',  esg: 'E', title: 'Environment Day Celebration',                                      sdgs: [13, 15],   budget: 5000,  status: 'Upcoming',  parties: 'NGOs / Community'         },
      { tag: 'JUN', month: 'Jun 2026',  esg: 'S', title: 'Blood Donation Camp',                                              sdgs: [3],        budget: 0,     status: 'Upcoming',  parties: 'Employees'                },
      { tag: 'JUN', month: 'Jun 2026',  esg: 'S', title: 'Yoga Day',                                                         sdgs: [3],        budget: 2000,  status: 'Upcoming',  parties: 'Employees'                },
      { tag: 'JUL', month: 'Jul 2026',  esg: 'S', title: 'Support to Local Schools / Anganwadi',                             sdgs: [4, 6, 10], budget: 20000, status: 'Planning',  parties: 'Community'                },
      { tag: 'AUG', month: 'Aug 2026',  esg: 'E', title: 'Animal Welfare Support Program',                                   sdgs: [15],       budget: 15000, status: 'Planning',  parties: 'NGOs'                     },
      { tag: 'SEP', month: 'Sep 2026',  esg: 'G', title: 'Seminar – Code of Conduct, POSH & Whistleblower Awareness',        sdgs: [5, 16],    budget: 5000,  status: 'Planning',  parties: 'Employees / NGOs'         },
      { tag: 'OCT', month: 'Oct 2026',  esg: 'E', title: 'Clean Up Drive',                                                   sdgs: [11, 12],   budget: 3000,  status: 'Planning',  parties: 'Employees'                },
      { tag: 'NOV', month: 'Nov 2026',  esg: 'S', title: "Men's Day Celebration",                                            sdgs: [5, 10],    budget: 0,     status: 'Planning',  parties: 'Employees'                },
      { tag: 'NOV', month: 'Nov 2026',  esg: 'S', title: 'Donation Drive',                                                   sdgs: [1, 10],    budget: 0,     status: 'Planning',  parties: 'Employees'                },
      { tag: 'DEC', month: 'Dec 2026',  esg: 'E', title: 'Energy Conservation Awareness Program',                            sdgs: [7, 13],    budget: 5000,  status: 'Planning',  parties: 'Employees'                },
      { tag: 'JAN', month: 'Jan 2027',  esg: 'G', title: 'Invite Sustainability Experts',                                    sdgs: [12, 13],   budget: 0,     status: 'Planning',  parties: 'Employees'                },
      { tag: 'FEB', month: 'Feb 2027',  esg: 'S', title: 'Financial Literacy & Tax Awareness Session',                       sdgs: [4, 8],     budget: 5000,  status: 'Planning',  parties: 'Employees'                }
    ]

    for (const act of defaultActivities) {
      await db.run(
        'INSERT INTO csr_activities (user_email, data_json) VALUES (?, ?)',
        [defaultEmail, JSON.stringify(act)]
      )
    }

    // Seed default GHG entries from SEED.js
    const seedFilePath = path.join(__dirname, '../portal/src/store/SEED.js')
    if (fs.existsSync(seedFilePath)) {
      try {
        const seedModule = await import(pathToFileURL(seedFilePath).href)
        const SEED = seedModule.SEED
        
        let count = 0
        for (const siteCode of Object.keys(SEED)) {
          const modules = SEED[siteCode] || {}
          for (const moduleName of Object.keys(modules)) {
            const entriesList = modules[moduleName] || []
            for (const entry of entriesList) {
              const tco2e = parseFloat(entry.tco2e || entry.ghg || 0)
              await db.run(
                'INSERT INTO ghg_entries (user_email, site_code, module, tco2e, data_json) VALUES (?, ?, ?, ?, ?)',
                [defaultEmail, siteCode, moduleName, tco2e, JSON.stringify(entry)]
              )
              count++
            }
          }
        }
        console.log(`Successfully seeded ${count} historical GHG entries for ${defaultEmail}.`)
      } catch (err) {
        console.error('Error importing seed data:', err)
      }
    } else {
      console.warn('SEED.js file not found, skipping GHG seeding.')
    }
  }

  return db
}
