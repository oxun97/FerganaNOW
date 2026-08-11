export function readList(key) {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || '[]')
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

export function writeList(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value.map(String)))
}

export function readLanguage() {
  const saved = window.localStorage.getItem('ferganaNowLanguage')
  if (saved === 'ru' || saved === 'uz') return saved
  const telegramLanguage = window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code || ''
  return telegramLanguage.toLowerCase().startsWith('uz') ? 'uz' : 'ru'
}
