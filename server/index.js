import express from 'express'
import cors from 'cors'
import { initDb } from './database.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Initialize DB on startup
let db
initDb().then(database => {
  db = database
  console.log('SQLite Database ready.')
}).catch(err => {
  console.error('Failed to initialize SQLite database:', err)
})

// ─── Auth Endpoints ─────────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  try {
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase()])
    if (!user) {
      return res.status(400).json({ error: 'Email address not registered.' })
    }
    if (user.password !== password) {
      return res.status(400).json({ error: 'Incorrect password.' })
    }
    res.json({ id: user.id, name: user.name, email: user.email })
  } catch (err) {
    res.status(500).json({ error: 'Database error occurred during login.' })
  }
})

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' })
  }

  try {
    const existing = await db.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase()])
    if (existing) {
      return res.status(400).json({ error: 'This email is already registered.' })
    }

    const result = await db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email.toLowerCase(), password]
    )
    res.status(201).json({ id: result.lastID, name, email: email.toLowerCase() })
  } catch (err) {
    res.status(500).json({ error: 'Database error occurred during signup.' })
  }
})

// ─── Sites Endpoints (User isolated) ──────────────────────────────────────────
app.get('/api/sites', async (req, res) => {
  const email = req.query.email
  if (!email) {
    return res.status(400).json({ error: 'Email query parameter is required.' })
  }

  try {
    const rows = await db.all('SELECT * FROM sites WHERE user_email = ?', [email.toLowerCase()])
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Database error retrieving sites.' })
  }
})

app.post('/api/sites', async (req, res) => {
  const { email, code, name, type, address, city, country, country_code } = req.body
  if (!email || !code || !name) {
    return res.status(400).json({ error: 'Email, site code, and name are required.' })
  }

  try {
    // Check duplicate code for this specific user
    const existing = await db.get('SELECT * FROM sites WHERE user_email = ? AND code = ?', [email.toLowerCase(), code])
    if (existing) {
      return res.status(400).json({ error: 'A site with this code already exists.' })
    }

    const result = await db.run(
      'INSERT INTO sites (user_email, code, name, type, address, city, country, country_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [email.toLowerCase(), code, name, type || '', address || '', city || '', country || '', country_code || '']
    )
    res.status(201).json({ id: result.lastID, code, name, type, address, city, country, country_code })
  } catch (err) {
    res.status(500).json({ error: 'Database error saving site.' })
  }
})

app.put('/api/sites', async (req, res) => {
  const { email, code, name, type, address, city, country, country_code } = req.body
  if (!email || !code || !name) {
    return res.status(400).json({ error: 'Email, site code, and name are required.' })
  }

  try {
    await db.run(
      'UPDATE sites SET name = ?, type = ?, address = ?, city = ?, country = ?, country_code = ? WHERE user_email = ? AND code = ?',
      [name, type || '', address || '', city || '', country || '', country_code || '', email.toLowerCase(), code]
    )
    res.json({ code, name, type, address, city, country, country_code })
  } catch (err) {
    res.status(500).json({ error: 'Database error updating site.' })
  }
})

app.delete('/api/sites', async (req, res) => {
  const { email, code } = req.query
  if (!email || !code) {
    return res.status(400).json({ error: 'Email and code parameters are required.' })
  }

  try {
    await db.run('DELETE FROM sites WHERE user_email = ? AND code = ?', [email.toLowerCase(), code])
    // Clean up all entries related to this site for this user
    await db.run('DELETE FROM ghg_entries WHERE user_email = ? AND site_code = ?', [email.toLowerCase(), code])
    res.json({ message: 'Site deleted successfully.' })
  } catch (err) {
    res.status(500).json({ error: 'Database error deleting site.' })
  }
})

// ─── GHG Entries Endpoints (User isolated) ────────────────────────────────────
app.get('/api/ghg-entries', async (req, res) => {
  const email = req.query.email
  if (!email) {
    return res.status(400).json({ error: 'Email query parameter is required.' })
  }

  try {
    const rows = await db.all('SELECT * FROM ghg_entries WHERE user_email = ?', [email.toLowerCase()])
    
    // Construct the structured map expected by frontend:
    // { siteCode: { module: [entryObjects] } }
    const entriesMap = {}
    
    for (const row of rows) {
      const entry = JSON.parse(row.data_json)
      entry.id = row.id // enforce DB primary key id
      
      if (!entriesMap[row.site_code]) {
        entriesMap[row.site_code] = {}
      }
      if (!entriesMap[row.site_code][row.module]) {
        entriesMap[row.site_code][row.module] = []
      }
      entriesMap[row.site_code][row.module].push(entry)
    }
    
    res.json(entriesMap)
  } catch (err) {
    res.status(500).json({ error: 'Database error retrieving GHG entries.' })
  }
})

app.post('/api/ghg-entries', async (req, res) => {
  const { email, siteCode, module, entry } = req.body
  if (!email || !siteCode || !module || !entry) {
    return res.status(400).json({ error: 'Email, siteCode, module, and entry are required.' })
  }

  try {
    const tco2e = parseFloat(entry.tco2e || entry.ghg || 0)
    
    // Save details
    const result = await db.run(
      'INSERT INTO ghg_entries (user_email, site_code, module, tco2e, data_json) VALUES (?, ?, ?, ?, ?)',
      [email.toLowerCase(), siteCode, module, tco2e, JSON.stringify(entry)]
    )
    
    const savedEntry = { ...entry, id: result.lastID }
    res.status(201).json(savedEntry)
  } catch (err) {
    res.status(500).json({ error: 'Database error saving GHG entry.' })
  }
})

app.put('/api/ghg-entries/:id', async (req, res) => {
  const { email, patch } = req.body
  const id = req.params.id
  if (!email || !id || !patch) {
    return res.status(400).json({ error: 'Email, id, and patch are required.' })
  }

  try {
    const row = await db.get('SELECT * FROM ghg_entries WHERE id = ? AND user_email = ?', [id, email.toLowerCase()])
    if (!row) {
      return res.status(404).json({ error: 'Entry not found.' })
    }
    const merged = { ...JSON.parse(row.data_json), ...patch }
    const tco2e = parseFloat(merged.tco2e || merged.ghg || 0)
    await db.run(
      'UPDATE ghg_entries SET tco2e = ?, data_json = ? WHERE id = ? AND user_email = ?',
      [tco2e, JSON.stringify(merged), id, email.toLowerCase()]
    )
    res.json({ ...merged, id: row.id })
  } catch (err) {
    res.status(500).json({ error: 'Database error updating GHG entry.' })
  }
})

app.delete('/api/ghg-entries/:id', async (req, res) => {
  const email = req.query.email
  const id = req.params.id
  if (!email || !id) {
    return res.status(400).json({ error: 'Email parameter and ID are required.' })
  }

  try {
    await db.run('DELETE FROM ghg_entries WHERE id = ? AND user_email = ?', [id, email.toLowerCase()])
    res.json({ message: 'Entry deleted successfully.' })
  } catch (err) {
    res.status(500).json({ error: 'Database error deleting GHG entry.' })
  }
})

// ─── CSR Activities Endpoints (User isolated) ─────────────────────────────────
app.get('/api/csr-activities', async (req, res) => {
  const email = req.query.email
  if (!email) {
    return res.status(400).json({ error: 'Email query parameter is required.' })
  }

  try {
    const rows = await db.all('SELECT * FROM csr_activities WHERE user_email = ?', [email.toLowerCase()])
    const list = rows.map(row => {
      const act = JSON.parse(row.data_json)
      act.id = row.id // enforce DB key
      return act
    })
    res.json(list)
  } catch (err) {
    res.status(500).json({ error: 'Database error retrieving CSR activities.' })
  }
})

app.post('/api/csr-activities/sync', async (req, res) => {
  const { email, activities } = req.body
  if (!email || !activities) {
    return res.status(400).json({ error: 'Email and activities are required.' })
  }

  try {
    await db.run('DELETE FROM csr_activities WHERE user_email = ?', [email.toLowerCase()])
    for (const act of activities) {
      await db.run(
        'INSERT INTO csr_activities (user_email, data_json) VALUES (?, ?)',
        [email.toLowerCase(), JSON.stringify(act)]
      )
    }
    res.json({ message: 'CSR activities synced.' })
  } catch (err) {
    res.status(500).json({ error: 'Database error syncing CSR activities.' })
  }
})

app.post('/api/csr-activities', async (req, res) => {
  const { email, activity } = req.body
  if (!email || !activity) {
    return res.status(400).json({ error: 'Email and activity are required.' })
  }

  try {
    const result = await db.run(
      'INSERT INTO csr_activities (user_email, data_json) VALUES (?, ?)',
      [email.toLowerCase(), JSON.stringify(activity)]
    )
    const savedAct = { ...activity, id: result.lastID }
    res.status(201).json(savedAct)
  } catch (err) {
    res.status(500).json({ error: 'Database error saving CSR activity.' })
  }
})

app.delete('/api/csr-activities/:id', async (req, res) => {
  const email = req.query.email
  const id = req.params.id
  if (!email || !id) {
    return res.status(400).json({ error: 'Email parameter and ID are required.' })
  }

  try {
    await db.run('DELETE FROM csr_activities WHERE id = ? AND user_email = ?', [id, email.toLowerCase()])
    res.json({ message: 'Activity deleted successfully.' })
  } catch (err) {
    res.status(500).json({ error: 'Database error deleting CSR activity.' })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
