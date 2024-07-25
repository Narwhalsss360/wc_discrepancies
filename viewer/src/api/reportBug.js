import { BACKEND_ROOT } from './constants'

export default async function reportBug(message) {
  const url = new URL(BACKEND_ROOT)
  url.pathname += '/report-bug'
  return await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  })
}
