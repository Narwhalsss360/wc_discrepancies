import { BACKEND_ROOT } from "./constants"

export default async function detect() {
  const url = new URL(BACKEND_ROOT)
  url.pathname += 'detect'
  return await fetch(url, { method: 'POST' })
}
