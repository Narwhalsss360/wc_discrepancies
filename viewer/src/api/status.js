import { BACKEND_ROOT } from "./constants"

export default async function status() {
  const url = new URL(BACKEND_ROOT)
  return await (await fetch(url)).json()
}
