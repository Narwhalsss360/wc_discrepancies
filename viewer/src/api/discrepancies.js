import { BACKEND_ROOT } from "./constants"

export default async function discrepancies() {
  const url = new URL(BACKEND_ROOT)
  url.pathname += 'discrepancies'
  return await (await fetch(url)).json()
}
