const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export function apiPath(path) {
  return `${apiBase}${path}`
}

export function apiFetch(path, options = {}) {
  return fetch(apiPath(path), options)
}
