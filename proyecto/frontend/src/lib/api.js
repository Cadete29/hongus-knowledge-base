export async function api(path, options = {}) {
  const csrf = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('hongus_csrf=') || part.startsWith('__Host-hongus_csrf='))
    ?.split('=')
    .slice(1)
    .join('=')
  const response = await fetch(`/api/v1${path}`, {
    credentials: 'same-origin',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(csrf && options.method && options.method !== 'GET' ? { 'X-CSRF-Token': csrf } : {}),
      ...options.headers,
    },
  })
  if (response.status === 204) return null
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error?.message || 'No pudimos completar la solicitud')
  return data
}

export const post = (path, body) => api(path, { method: 'POST', body: JSON.stringify(body) })
