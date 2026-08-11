import { useEffect, useMemo, useState } from 'react'
import { CATEGORY_KEYS, CATEGORY_LABEL_KEY } from '../lib/i18n.js'
import {
  budgetMatches,
  isOpenNow,
  localized,
  matchesTag,
  sortPlaces,
} from '../lib/placeUtils.js'
import { haptic } from '../lib/telegram.js'
import PlaceCard from './PlaceCard.jsx'
import { SkeletonCard } from './Skeleton.jsx'

const budgets = [
  ['low', 'budgetLow'],
  ['mid', 'budgetMid'],
  ['high', 'budgetHigh'],
]

export default function PlacesScreen({
  places,
  lang,
  t,
  loading,
  userLocation,
  locationState,
  onRequestLocation,
  presetCategory,
  presetVersion,
  isFavorite,
  onFavorite,
  onOpenPlace,
}) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(null)
  const [budget, setBudget] = useState(null)
  const [openOnly, setOpenOnly] = useState(false)
  const [sort, setSort] = useState('relevant')

  useEffect(() => {
    if (presetCategory) setCategory(presetCategory)
  }, [presetCategory, presetVersion])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const source = places.filter((place) => {
      if (openOnly && isOpenNow(place) !== true) return false
      if (category && !matchesTag(place, category)) return false
      if (budget && !budgetMatches(place, budget)) return false
      if (q) {
        const haystack = [
          localized(place, 'name', lang),
          localized(place, 'description', lang),
          localized(place, 'address', lang),
          ...(Array.isArray(place.tags) ? place.tags : []),
        ].join(' ').toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
    return sortPlaces(source, userLocation, sort)
  }, [places, query, category, budget, openOnly, sort, userLocation, lang])

  function reset() {
    setQuery('')
    setCategory(null)
    setBudget(null)
    setOpenOnly(false)
    setSort('relevant')
  }

  return (
    <section className="screen-section">
      <div className="page-title-row">
        <div>
          <div className="eyebrow">FERGANA NOW</div>
          <h1>{t.places}</h1>
        </div>
        <div className="found-count">
          <span style={{ color: '#77ffac', marginRight: '4px' }}>{filtered.length}</span>
          {t.found}
        </div>
      </div>

      <div className="search-box">
        <span>⌕</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchPlaceholder} />
        {query && <button onClick={() => setQuery('')}>×</button>}
      </div>

      <div className="filter-toolbar">
        <button className={openOnly ? 'filter-pill active' : 'filter-pill'} onClick={() => { haptic('light'); setOpenOnly((value) => !value); }}>
          ● {t.onlyOpen}
        </button>
        <button
          className={locationState === 'active' ? 'filter-pill active' : 'filter-pill'}
          onClick={onRequestLocation}
        >
          {locationState === 'active' ? `📍 ${t.locationActive}` : t.nearMe}
        </button>
        <button className="filter-pill muted-button" onClick={() => { haptic('rigid'); reset(); }}>{t.reset}</button>
      </div>

      <div className="filter-block">
        <div className="filter-label">{t.category}</div>
        <div className="chips horizontal-chips">
          {CATEGORY_KEYS.map(([emoji, key]) => {
            const icons = {
              eat: <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />,
              coffee: <path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8Z" />,
              date: <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />,
              kids: <><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><circle cx="17" cy="11" r="3"/><path d="M13 21v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1"/></>,
              karaoke: <><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></>,
              entertainment: <><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></>,
              night: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
              today: <><path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="m16 18-2-2 2-2M8 14l2 2-2 2"/></>
            };
            return (
              <button
                key={key}
                className={category === key ? 'chip active' : 'chip'}
                onClick={() => { haptic('selection'); setCategory(category === key ? null : key); }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                  {icons[key]}
                </svg>
                {t[CATEGORY_LABEL_KEY[key]]}
              </button>
            )
          })}
        </div>
      </div>

      <div className="filter-block">
        <div className="filter-label">{t.budget}</div>
        <div className="chips">
          {budgets.map(([key, labelKey]) => (
            <button
              key={key}
              className={budget === key ? 'chip active' : 'chip'}
              onClick={() => { haptic('selection'); setBudget(budget === key ? null : key); }}
            >
              {t[labelKey]}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-block">
        <div className="filter-label">{t.sort}</div>
        <div className="segmented">
          <button className={sort === 'relevant' ? 'active' : ''} onClick={() => { haptic('selection'); setSort('relevant'); }}>{t.sortRelevant}</button>
          <button className={sort === 'near' ? 'active' : ''} onClick={() => {
            haptic('selection');
            if (!userLocation) onRequestLocation()
            setSort('near')
          }}>{t.sortNear}</button>
          <button className={sort === 'cheap' ? 'active' : ''} onClick={() => { haptic('selection'); setSort('cheap'); }}>{t.sortCheap}</button>
        </div>
      </div>

      <div className="place-list top-gap">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : filtered.length ? filtered.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            lang={lang}
            t={t}
            userLocation={userLocation}
            favorite={isFavorite(place.id)}
            onFavorite={() => onFavorite(place.id)}
            onOpen={() => onOpenPlace(place.id)}
          />
        )) : (
          <div className="empty-card">{t.noPlaces}</div>
        )}
      </div>
    </section>
  )
}
