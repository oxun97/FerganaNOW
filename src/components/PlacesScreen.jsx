import { useEffect, useMemo, useState } from 'react'
import { CATEGORY_KEYS, CATEGORY_LABEL_KEY } from '../lib/i18n.js'
import {
  budgetMatches,
  isOpenNow,
  localized,
  matchesTag,
  sortPlaces,
} from '../lib/placeUtils.js'
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
        <div className="found-count">{t.found}: {filtered.length}</div>
      </div>

      <div className="search-box">
        <span>⌕</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchPlaceholder} />
        {query && <button onClick={() => setQuery('')}>×</button>}
      </div>

      <div className="filter-toolbar">
        <button className={openOnly ? 'filter-pill active' : 'filter-pill'} onClick={() => setOpenOnly((value) => !value)}>
          ● {t.onlyOpen}
        </button>
        <button
          className={locationState === 'active' ? 'filter-pill active' : 'filter-pill'}
          onClick={onRequestLocation}
        >
          {locationState === 'active' ? `📍 ${t.locationActive}` : t.nearMe}
        </button>
        <button className="filter-pill muted-button" onClick={reset}>{t.reset}</button>
      </div>

      <div className="filter-block">
        <div className="filter-label">{t.category}</div>
        <div className="chips horizontal-chips">
          {CATEGORY_KEYS.slice(0, 7).map(([icon, key]) => (
            <button
              key={key}
              className={category === key ? 'chip active' : 'chip'}
              onClick={() => setCategory(category === key ? null : key)}
            >
              {icon} {t[CATEGORY_LABEL_KEY[key]]}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-block">
        <div className="filter-label">{t.budget}</div>
        <div className="chips">
          {budgets.map(([key, labelKey]) => (
            <button
              key={key}
              className={budget === key ? 'chip active' : 'chip'}
              onClick={() => setBudget(budget === key ? null : key)}
            >
              {t[labelKey]}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-block">
        <div className="filter-label">{t.sort}</div>
        <div className="segmented">
          <button className={sort === 'relevant' ? 'active' : ''} onClick={() => setSort('relevant')}>{t.sortRelevant}</button>
          <button className={sort === 'near' ? 'active' : ''} onClick={() => {
            if (!userLocation) onRequestLocation()
            setSort('near')
          }}>{t.sortNear}</button>
          <button className={sort === 'cheap' ? 'active' : ''} onClick={() => setSort('cheap')}>{t.sortCheap}</button>
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
