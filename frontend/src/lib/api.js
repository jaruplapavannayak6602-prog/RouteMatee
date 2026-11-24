const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function searchJourneys(payload) {
  const response = await fetch(`${API_URL}/journeys/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Could not search journeys.')
  return data
}
