export const USAGE_KEY = "buildit-usage"
export const limit = 5

export function getCookie(name) {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(";").shift()
  return null
}

export function setCookie(name, value, days = 365) {
  if (typeof document === "undefined") return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

export function getUsageCount() {
  const count = getCookie(USAGE_KEY)
  return count ? Number.parseInt(count, 10) : 0
}

export function trackUsage() {
  const count = getUsageCount()
  if (count >= limit) {
    return false // Reached limit
  }
  setCookie(USAGE_KEY, String(count + 1))
  return true
}

export const usageCount = getUsageCount()
