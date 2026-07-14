// Shared company-wide GHG store, backed by Vercel Blob.
// GET  /api/data            -> { version, updatedAt, entries, activity }
// POST /api/data { action } -> apply add/update/delete, append activity, return data
import { list, put } from '@vercel/blob'

const PATHNAME = 'kg/ghg-shared.json'
const token = process.env.BLOB_READ_WRITE_TOKEN

async function readStore() {
  const { blobs } = await list({ prefix: 'kg/ghg-shared', token })
  if (!blobs.length) return { version: 1, updatedAt: null, entries: {}, activity: [] }
  const url = blobs[0].url + (blobs[0].url.includes('?') ? '&' : '?') + 't=' + Date.now()
  const r = await fetch(url, { cache: 'no-store' })
  if (!r.ok) throw new Error('blob read failed: ' + r.status)
  return await r.json()
}

async function writeStore(data) {
  data.updatedAt = new Date().toISOString()
  await put(PATHNAME, JSON.stringify(data), {
    access: 'public', addRandomSuffix: false, allowOverwrite: true,
    contentType: 'application/json', cacheControlMaxAge: 0, token,
  })
}

function appendActivity(data, user, action, siteCode, module, entry) {
  data.activity = data.activity || []
  data.activity.unshift({
    ts: new Date().toISOString(),
    user: user || 'unknown',
    action, siteCode, module,
    label: (entry && (entry.Type || entry.category || entry['Type of Vehicle'] || entry.id)) || '',
    tco2e: (entry && (entry.tco2e ?? entry.ghg)) || 0,
  })
  if (data.activity.length > 1000) data.activity.length = 1000
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (!token) return res.status(500).json({ error: 'BLOB token not configured' })
  try {
    if (req.method === 'GET') {
      return res.status(200).json(await readStore())
    }
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
      const { action, siteCode, module, entry, id, patch, user } = body
      if (!action || !siteCode || !module) return res.status(400).json({ error: 'missing action/siteCode/module' })
      const data = await readStore()
      data.entries = data.entries || {}
      data.entries[siteCode] = data.entries[siteCode] || {}
      const arr = Array.isArray(data.entries[siteCode][module]) ? data.entries[siteCode][module] : []

      if (action === 'add') {
        const newEntry = { ...entry, id: (entry && entry.id) || Date.now() }
        arr.push(newEntry)
        data.entries[siteCode][module] = arr
        appendActivity(data, user, 'add', siteCode, module, newEntry)
        await writeStore(data)
        return res.status(200).json({ ok: true, entry: newEntry, updatedAt: data.updatedAt })
      }
      if (action === 'update') {
        const idx = arr.findIndex(e => String(e.id) === String(id))
        if (idx >= 0) arr[idx] = { ...arr[idx], ...patch }
        data.entries[siteCode][module] = arr
        appendActivity(data, user, 'update', siteCode, module, { id, ...(patch || {}) })
        await writeStore(data)
        return res.status(200).json({ ok: true, updatedAt: data.updatedAt })
      }
      if (action === 'delete') {
        data.entries[siteCode][module] = arr.filter(e => String(e.id) !== String(id))
        appendActivity(data, user, 'delete', siteCode, module, { id })
        await writeStore(data)
        return res.status(200).json({ ok: true, updatedAt: data.updatedAt })
      }
      return res.status(400).json({ error: 'unknown action' })
    }
    return res.status(405).json({ error: 'method not allowed' })
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) })
  }
}
