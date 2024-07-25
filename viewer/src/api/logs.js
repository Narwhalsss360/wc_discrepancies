import { BACKEND_ROOT } from "./constants"

export default async function status() {
  const url = new URL(BACKEND_ROOT)
  url.pathname += 'logs'
  return await (await fetch(url)).json()
}
