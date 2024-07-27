export default async function call(fn, ...args) {
  const responseData = await fn.apply(null, args)
  if ('error' in responseData || 'fatal' in responseData) {
    throw responseData
  }
  return responseData
}
