import { CATEGORY_META, TAG_ALIASES } from './i18n.js'

export function localized(entity, field, lang) {
  if (!entity) return ''
  if (lang === 'uz' && entity[`${field}_uz`]) return entity[`${field}_uz`]
  return entity[field] || ''
}

export function metaFor(category, t) {
  const meta = CATEGORY_META[category] || ['📍', null]
  return [meta[0], meta[1] ? t[meta[1]] : t.places]
}

export function time(value) {
  return value ? String(value).slice(0, 5) : ''
}

export function formatMoney(value, lang, t) {
  if (value === null || value === undefined || value === '') return t.priceUnknown
  const locale = lang === 'uz' ? 'uz-UZ' : 'ru-RU'
  return `${new Intl.NumberFormat(locale).format(Number(value))} ${t.currency}`
}

export function dtTime(value, lang) {
  if (!value) return ''
  const locale = lang === 'uz' ? 'uz-UZ' : 'ru-RU'
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tashkent',
  }).format(new Date(value))
}

export function ferganaDateKey(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value)
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tashkent',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${map.year}-${map.month}-${map.day}`
}

function ferganaMinutesNow() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Tashkent',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return Number(map.hour || 0) * 60 + Number(map.minute || 0)
}

function parseTimeMinutes(value) {
  if (!value) return null
  const [hours, minutes] = String(value).slice(0, 5).split(':').map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
  return hours * 60 + minutes
}

export function isOpenNow(place) {
  const open = parseTimeMinutes(place?.open_time)
  const close = parseTimeMinutes(place?.close_time)
  if (open === null || close === null) return null

  const now = ferganaMinutesNow()
  if (open === close) return true
  if (close > open) return now >= open && now < close
  return now >= open || now < close
}

export function eventState(event) {
  const now = Date.now()
  const start = event?.starts_at ? new Date(event.starts_at).getTime() : 0
  const end = event?.ends_at ? new Date(event.ends_at).getTime() : start + 3 * 60 * 60 * 1000
  if (now >= start && now <= end) return 'now'
  if (start > now) return 'later'
  return 'ended'
}

export function activityBadge(start, end, lang, t) {
  const now = Date.now()
  const s = start ? new Date(start).getTime() : 0
  const e = end ? new Date(end).getTime() : Infinity

  if (s > now) {
    const minutes = Math.max(1, Math.round((s - now) / 60000))
    if (minutes < 120) return `${t.startsIn} ${minutes} ${t.min}`
    return `${t.startsAt} ${dtTime(start, lang)}`
  }
  if (s <= now && e >= now) return t.happeningNow
  return t.todayBadge
}

export function haversineKm(lat1, lon1, lat2, lon2) {
  const values = [lat1, lon1, lat2, lon2].map(Number)
  if (values.some((value) => Number.isNaN(value))) return null

  const [aLat, aLon, bLat, bLon] = values
  const earthRadiusKm = 6371
  const toRad = (degrees) => degrees * Math.PI / 180
  const dLat = toRad(bLat - aLat)
  const dLon = toRad(bLon - aLon)
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function placeDistanceKm(place, userLocation) {
  if (!userLocation || place?.latitude == null || place?.longitude == null) return null
  return haversineKm(
    userLocation.latitude,
    userLocation.longitude,
    place.latitude,
    place.longitude,
  )
}

export function formatDistance(distanceKm, t) {
  if (distanceKm == null) return null
  if (distanceKm < 1) {
    const meters = Math.max(10, Math.round(distanceKm * 1000 / 10) * 10)
    return `${meters} ${t.meters}`
  }
  return `${distanceKm < 10 ? distanceKm.toFixed(1) : Math.round(distanceKm)} ${t.km}`
}

export function sortPlaces(items, userLocation, sort = 'relevant') {
  return [...items].sort((a, b) => {
    if (sort === 'cheap') {
      const aPrice = a.average_check == null ? Infinity : Number(a.average_check)
      const bPrice = b.average_check == null ? Infinity : Number(b.average_check)
      return aPrice - bPrice
    }

    if (sort === 'near' && userLocation) {
      const aDistance = placeDistanceKm(a, userLocation)
      const bDistance = placeDistanceKm(b, userLocation)
      if (aDistance != null && bDistance != null) return aDistance - bDistance
      if (aDistance != null) return -1
      if (bDistance != null) return 1
    }

    const aOpen = isOpenNow(a)
    const bOpen = isOpenNow(b)
    if (aOpen !== bOpen) {
      if (aOpen === true) return -1
      if (bOpen === true) return 1
      if (aOpen === null) return -1
      if (bOpen === null) return 1
    }

    if (userLocation) {
      const aDistance = placeDistanceKm(a, userLocation)
      const bDistance = placeDistanceKm(b, userLocation)
      if (aDistance != null && bDistance != null) return aDistance - bDistance
      if (aDistance != null) return -1
      if (bDistance != null) return 1
    }

    return String(a.name || '').localeCompare(String(b.name || ''))
  })
}

export function matchesTag(place, key) {
  if (!key) return true
  const aliases = TAG_ALIASES[key] || []
  const tags = Array.isArray(place?.tags) ? place.tags : []
  return aliases.some((alias) => tags.includes(alias))
}

export function budgetMatches(place, budget) {
  if (!budget) return true
  const price = Number(place?.average_check)
  if (!price) return false
  if (budget === 'low') return price < 100000
  if (budget === 'mid') return price >= 100000 && price <= 300000
  if (budget === 'high') return price > 300000
  return true
}

export function normalizeInstagram(value) {
  if (!value) return null
  const trimmed = String(value).trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  const username = trimmed
    .replace(/^@/, '')
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/^instagram\.com\//i, '')
    .replace(/\/+$/, '')
  return username ? `https://instagram.com/${username}` : null
}

export function mapsUrl(place, lang) {
  if (place?.latitude != null && place?.longitude != null) {
    return `https://yandex.uz/maps/?ll=${place.longitude}%2C${place.latitude}&z=16&pt=${place.longitude}%2C${place.latitude}`
  }
  const query = [
    localized(place, 'name', lang),
    localized(place, 'address', lang),
    lang === 'uz' ? 'Farg‘ona' : 'Фергана',
  ].filter(Boolean).join(', ')
  return `https://yandex.uz/maps/?text=${encodeURIComponent(query)}`
}

export function placeImageUrl(place, supabaseUrl) {
  const value = place?.image_url
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  const clean = String(value).replace(/^\/+/, '')
  return `${supabaseUrl}/storage/v1/object/public/rasmlar/${encodeURI(clean)}`
}
