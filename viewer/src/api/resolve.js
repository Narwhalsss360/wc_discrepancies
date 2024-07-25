import { BACKEND_ROOT } from "./constants"

export default async function resolve(discrepancy) {
  const url = new URL(BACKEND_ROOT)
  url.pathname += 'resolve'

  return await (await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(discrepancy)
  })).json()
}
