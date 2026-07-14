// Client for the shared company-wide GHG store (/api/data, Vercel Blob backed).
// Enabled in production builds; in local dev it's off so the app uses localStorage.
export const SHARED_ENABLED = import.meta.env.PROD && import.meta.env.VITE_DISABLE_SHARED !== 'true'

const BASE = '/api/data'

// Fetch the whole shared dataset: { version, updatedAt, entries, activity }
export async function fetchShared() {
  const r = await fetch(`${BASE}?t=${Date.now()}`, { cache: 'no-store' })
  if (!r.ok) throw new Error('shared fetch failed ' + r.status)
  return r.json()
}

// Apply a mutation to the shared store. Fire-and-forget friendly (returns a promise).
// m = { action:'add'|'update'|'delete', siteCode, module, entry?, id?, patch?, user }
export async function pushMutation(m) {
  const r = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(m),
  })
  if (!r.ok) throw new Error('mutation failed ' + r.status)
  return r.json()
}

export async function fetchActivity() {
  try {
    const d = await fetchShared()
    return Array.isArray(d.activity) ? d.activity : []
  } catch {
    return []
  }
}
