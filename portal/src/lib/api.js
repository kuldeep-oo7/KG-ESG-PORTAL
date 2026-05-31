const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || ''

export const API_BASE_URL = rawBaseUrl.replace(/\/$/, '')
export const API_ENABLED = Boolean(API_BASE_URL)
export const LOCAL_FALLBACK_ENABLED = import.meta.env.DEV || import.meta.env.VITE_ENABLE_LOCAL_FALLBACK === 'true'

export function apiUrl(path) {
  if (!API_ENABLED) {
    throw new Error('Production API is not configured. Set VITE_API_BASE_URL in Vercel.')
  }
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function isNetworkError(error) {
  const message = error?.message || ''
  return message.includes('Failed to fetch') || message.includes('fetch') || message.includes('network')
}
