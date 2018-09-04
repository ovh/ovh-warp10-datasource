/**
 * Check if object is an array of geo data
 * @param o object to check
 * @returns bool is it ?
 */
export function isGeoJson(o: any): boolean {
  if (!Array.isArray(o)) return false

  for (let d of o) {
    if (!d.latitude || !d.longitude) return false
  }

  return true
}