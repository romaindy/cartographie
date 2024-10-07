export function isJsonValid(data) {
  try {
    JSON.parse(data)
    return true
  }
  catch (e) {
    console.error(e)
    return false
  }
}
