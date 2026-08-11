import { useMemo, useState } from 'react'
import { CATEGORY_LABEL_KEY, TAG_ALIASES } from '../lib/i18n.js'
import {
  budgetMatches,
  formatDistance,
  formatMoney,
  isOpenNow,
  localized,
  matchesTag,
  placeDistanceKm,
} from '../lib/placeUtils.js'

const companyOptions = [
  ['alone', 'alone'],
  ['couple', 'couple'],
  ['friends', 'friends'],
  ['kids', 'kids'],
]

const interestOptions = [
  [null, '✨', 'any'],
  ['eat', '🍽', 'tagEat'],
  ['coffee', '☕', 'tagCoffee'],
  ['karaoke', '🎤', 'tagKaraoke'],
  ['entertainment', '🎮', 'tagEntertainment'],
  ['night', '🌙', 'tagNight'],
]

const budgetOptions = [
  ['low', 'budgetLow'],
  ['mid', 'budgetMid'],
  ['high', 'budgetHigh'],
]

function companyMatches(place, company) {
  if (company === 'kids') return matchesTag(place, 'kids')
  if (company === 'couple') return matchesTag(place, 'date')
  if (company === 'friends') {
    return matchesTag(place, 'entertainment') || matchesTag(place, 'karaoke') || matchesTag(place, 'night')
  }
  return true
}

function rankPlaces(places, company, budget, interest, userLocation) {
  // Фильтруем: оставляем только те, что точно открыты (true) или где график не указан (null)
  // Исключаем только те, что точно закрыты (false)
  const available = places.filter((place) => isOpenNow(place) !== false)
  const base = available.length ? available : places

  return base.map((place) => {
    let score = 0
    if (companyMatches(place, company)) score += 4
    if (!interest || matchesTag(place, interest)) score += interest ? 5 : 1
    if (budgetMatches(place, budget)) score += 4
    else if (place.average_check == null) score += 1

    const distance = placeDistanceKm(place, userLocation)
    if (distance != null) score += Math.max(0, 5 - Math.min(distance, 5))

    return { place, score, distance }
  }).sort((a, b) => b.score - a.score || (a.distance ?? Infinity) - (b.distance ?? Infinity))
}

export default function PickerScreen({ places, lang, t, userLocation, onRequestLocation, onOpenPlace }) {
  const [company, setCompany] = useState('couple')
  const [budget, setBudget] = useState('mid')
  const [interest, setInterest] = useState(null)
  const [resultIndex, setResultIndex] = useState(null)

  const ranked = useMemo(
    () => rankPlaces(places, company, budget, interest, userLocation).slice(0, 8),
    [places, company, budget, interest, userLocation],
  )

  const current = resultIndex === null || !ranked.length ? null : ranked[resultIndex % ranked.length]

  function choose() {
    setResultIndex(0)
  }

  function another() {
    setResultIndex((index) => index === null ? 0 : (index + 1) % Math.max(ranked.length, 1))
  }

  return (
    <section className="screen-section picker-screen">
      <div className="picker-hero-icon">🎲</div>
      <div className="eyebrow">FERGANA NOW</div>
      <h1>{t.pickerTitle}</h1>
      <p className="page-description">{t.pickerText}</p>

      <div className="picker-block">
        <h3>{t.who}</h3>
        <div className="chips">
          {companyOptions.map(([key, labelKey]) => (
            <button key={key} className={company === key ? 'chip active' : 'chip'} onClick={() => { setCompany(key); setResultIndex(null) }}>
              {t[labelKey]}
            </button>
          ))}
        </div>
      </div>

      <div className="picker-block">
        <h3>{t.budget}</h3>
        <div className="chips">
          {budgetOptions.map(([key, labelKey]) => (
            <button key={key} className={budget === key ? 'chip active' : 'chip'} onClick={() => { setBudget(key); setResultIndex(null) }}>
              {t[labelKey]}
            </button>
          ))}
        </div>
      </div>

      <div className="picker-block">
        <h3>{t.interest}</h3>
        <div className="chips">
          {interestOptions.map(([key, icon, labelKey]) => (
            <button key={String(key)} className={interest === key ? 'chip active' : 'chip'} onClick={() => { setInterest(key); setResultIndex(null) }}>
              {icon} {t[labelKey]}
            </button>
          ))}
        </div>
      </div>

      {!userLocation && (
        <button className="secondary full-width" onClick={onRequestLocation}>{t.nearMe}</button>
      )}
      <button className="primary full-width" onClick={choose}>{t.choose}</button>

      {current && (
        <article className="picker-result" onClick={() => onOpenPlace(current.place.id)}>
          <div className="eyebrow">{t.yourChoice}</div>
          <h2>{localized(current.place, 'name', lang)}</h2>
          <p>{localized(current.place, 'description', lang)}</p>
          <div className="picker-result-meta">
            <span>💰 {formatMoney(current.place.average_check, lang, t)}</span>
            {current.distance != null && <span>🧭 {formatDistance(current.distance, t)}</span>}
            <span>● {isOpenNow(current.place) === true ? t.openNow : (isOpenNow(current.place) === false ? t.closedNow : t.scheduleUnknown)}</span>
          </div>
          <div className="result-reason">
            <strong>{t.whyFits}:</strong> {
              isOpenNow(current.place) === true
                ? t.openAndFits
                : (lang === 'uz' ? 'Tanlangan shartlarga mos keladi' : 'Подходит под выбранные условия')
            }
          </div>
          <div className="picker-result-actions">
            <button className="small-button" onClick={(event) => { event.stopPropagation(); another() }}>{t.another}</button>
            <button className="small-button light" onClick={() => onOpenPlace(current.place.id)}>{t.details}</button>
          </div>
        </article>
      )}

      {!places.length && <div className="empty-card">{t.noPlaces}</div>}
    </section>
  )
}
