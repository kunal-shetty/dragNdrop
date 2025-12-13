export const USAGE_KEY = "BuildIT-usage"
export const limit = 5

export function getCookie(name: string) {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null
  return null
}

export function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

export function getUsageCount() {
  const count = getCookie(USAGE_KEY)
  return count ? Number.parseInt(count, 10) : 0
}

export function trackUsage(limit: number) {
  const count = getUsageCount()
  if (count >= limit) return false
  setCookie(USAGE_KEY, String(count + 1))
  return true
}
