import {
  formatDistance,
  formatMoney,
  isOpenNow,
  localized,
  metaFor,
  placeDistanceKm,
  placeImageUrl,
  time,
} from '../lib/placeUtils.js'
import { SUPABASE_URL } from '../lib/supabase.js'

export default function PlaceCard({ place, lang, t, userLocation, favorite, onFavorite, onOpen }) {
  const [icon, category] = metaFor(place.category, t)
  const open = isOpenNow(place)
  const distance = formatDistance(placeDistanceKm(place, userLocation), t)
  const image = placeImageUrl(place, SUPABASE_URL)

  return (
    <article className="place-card" onClick={onOpen}>
      {image ? (
        <div className="place-thumb" style={{ backgroundImage: `url("${image}")` }} />
      ) : (
        <div className="place-icon">{icon}</div>
      )}

      <div className="place-copy">
        <div className="place-title-line">
          <h3>{localized(place, 'name', lang)}</h3>
          {open !== null && (
            <span className={`status-badge ${open ? 'open' : 'closed'}`}>
              {open ? t.openNow : t.closedNow}
            </span>
          )}
        </div>
        <div className="muted description-preview">{localized(place, 'description', lang) || category}</div>
        <div className="place-meta">
          <span>🕐 {place.close_time ? `${t.until} ${time(place.close_time)}` : t.scheduleUnknown}</span>
          <span>💰 {formatMoney(place.average_check, lang, t)}</span>
          {distance && <span>🧭 {distance}</span>}
        </div>
      </div>

      <button
        className={`favorite-button ${favorite ? 'active' : ''}`}
        aria-label={favorite ? t.removeFavorite : t.addFavorite}
        onClick={(event) => {
          event.stopPropagation()
          onFavorite?.()
        }}
      >
        {favorite ? '♥' : '♡'}
      </button>
      <span className="chevron">›</span>
    </article>
  )
}
