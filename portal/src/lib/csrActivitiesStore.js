/* eslint-disable no-empty */
const STORAGE_KEY = 'csr_activities_v1'

export function loadActivities(fallback) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function saveActivities(activities) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities))
  } catch {}
}
