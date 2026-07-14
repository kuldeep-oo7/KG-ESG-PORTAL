// One-time (idempotent) upload of the seed dataset to Vercel Blob as the shared
// company-wide GHG store. Reads the BLOB token from ../.env.vercel.
import { put, list } from '@vercel/blob'
import { readFileSync } from 'fs'
import { SEED } from '../src/store/SEED.js'

// load token from ../../.env.vercel (repo root) or ../.env.vercel
function loadToken() {
  for (const p of ['../.env.vercel', '.env.vercel', '../../.env.vercel']) {
    try {
      const txt = readFileSync(new URL(p, import.meta.url), 'utf8')
      const m = txt.match(/BLOB_READ_WRITE_TOKEN\s*=\s*"?([^"\n\r]+)"?/)
      if (m) return m[1].trim()
    } catch { /* try next */ }
  }
  return process.env.BLOB_READ_WRITE_TOKEN
}

const token = loadToken()
if (!token) { console.error('No BLOB_READ_WRITE_TOKEN found'); process.exit(1) }

const PATHNAME = 'kg/ghg-shared.json'

const args = process.argv.slice(2)
const force = args.includes('--force')

const existing = await list({ prefix: 'kg/ghg-shared', token })
if (existing.blobs.length && !force) {
  console.log('Shared store already exists:', existing.blobs[0].url)
  console.log('(use --force to overwrite with a fresh seed)')
  process.exit(0)
}

const count = Object.values(SEED).reduce((s, site) => s + Object.values(site).reduce((a, m) => a + m.length, 0), 0)
const data = { version: 1, updatedAt: new Date().toISOString(), entries: SEED, activity: [] }
const res = await put(PATHNAME, JSON.stringify(data), {
  access: 'public', addRandomSuffix: false, allowOverwrite: true,
  contentType: 'application/json', cacheControlMaxAge: 0, token,
})
console.log(`Seeded shared store with ${count} records -> ${res.url}`)
