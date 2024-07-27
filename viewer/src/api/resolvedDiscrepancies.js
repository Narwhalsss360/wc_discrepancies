import { BACKEND_ROOT } from './constants'

export default async function resolvedDiscrepancies() {
  const url = new URL(BACKEND_ROOT)
  url.pathname += 'resolved_discrepancies'
  return await (await fetch(url)).json()
}
