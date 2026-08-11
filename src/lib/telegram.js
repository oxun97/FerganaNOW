export const BOT_USERNAME = 'fergananow_bot'
export const CREATOR_URL = 'https://t.me/oxun_uz'

export function getTelegramWebApp() {
  return window.Telegram?.WebApp || null
}

export function initTelegram() {
  const tg = getTelegramWebApp()
  if (!tg) return null
  tg.ready()
  tg.expand()
  try {
    tg.setHeaderColor?.('#0b0d10')
    tg.setBackgroundColor?.('#0b0d10')
  } catch {
    // Older clients can ignore color methods.
  }
  return tg
}

export function getTelegramUser() {
  return getTelegramWebApp()?.initDataUnsafe?.user || null
}

export function getStartParam() {
  const fromTelegram = getTelegramWebApp()?.initDataUnsafe?.start_param
  if (fromTelegram) return fromTelegram
  return new URLSearchParams(window.location.search).get('tgWebAppStartParam')
}

export function openExternal(url) {
  if (!url) return
  const tg = getTelegramWebApp()
  if (tg?.openLink && /^https?:/i.test(url)) {
    tg.openLink(url)
    return
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}

export function openTelegram(url) {
  if (!url) return
  const tg = getTelegramWebApp()
  if (tg?.openTelegramLink) {
    tg.openTelegramLink(url)
    return
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}

export async function sharePlace(place, placeName, text) {
  const deepLink = `https://t.me/${BOT_USERNAME}?startapp=place_${place.id}`
  if (navigator.share && !getTelegramWebApp()) {
    try {
      await navigator.share({ title: placeName, text: `${text}: ${placeName}`, url: deepLink })
      return
    } catch {
      // Fall back to Telegram share link.
    }
  }
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(deepLink)}&text=${encodeURIComponent(`${text}: ${placeName}`)}`
  openTelegram(shareUrl)
}

export function haptic(style = 'light') {
  const tg = getTelegramWebApp()
  if (!tg?.HapticFeedback) return

  switch (style) {
    case 'light':
    case 'medium':
    case 'heavy':
    case 'rigid':
    case 'soft':
      tg.HapticFeedback.impactOccurred(style)
      break
    case 'success':
    case 'warning':
    case 'error':
      tg.HapticFeedback.notificationOccurred(style)
      break
    case 'selection':
      tg.HapticFeedback.selectionChanged()
      break
  }
}
