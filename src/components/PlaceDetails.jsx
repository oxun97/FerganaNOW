import {
  dtTime,
  formatDistance,
  formatMoney,
  isOpenNow,
  localized,
  mapsUrl,
  metaFor,
  normalizeInstagram,
  placeDistanceKm,
  placeImageUrl,
  time,
} from '../lib/placeUtils.js'
import { SUPABASE_URL } from '../lib/supabase.js'
import { openExternal, sharePlace } from '../lib/telegram.js'

export default function PlaceDetails({
  place,
  events,
  offers,
  lang,
  t,
  userLocation,
  favorite,
  onFavorite,
  onBack,
}) {
  const [icon, category] = metaFor(place.category, t)
  const image = placeImageUrl(place, SUPABASE_URL)
  const open = isOpenNow(place)
  const distance = formatDistance(placeDistanceKm(place, userLocation), t)
  const instagram = normalizeInstagram(place.instagram)
  const tags = Array.isArray(place.tags) ? place.tags : []

  return (
    <div className="detail-shell">
      <header className="detail-header">
        <button className="back-button" onClick={onBack}>‹</button>
        <div className="detail-header-copy">
          <strong>{localized(place, 'name', lang)}</strong>
          <span>{category}</span>
        </div>
        <button className={`favorite-button ${favorite ? 'active' : ''}`} onClick={onFavorite}>{favorite ? '♥' : '♡'}</button>
      </header>

      <main className="detail-main">
        <section
          className={`place-hero ${image ? 'with-image' : ''}`}
          style={image ? { backgroundImage: `url("${image}")` } : undefined}
        >
          {!image && <div className="place-hero-icon">{icon}</div>}
          <div className="place-hero-overlay">
            <div className="eyebrow">FERGANA NOW</div>
            <h1>{localized(place, 'name', lang)}</h1>
            {open !== null && <div className={`detail-status ${open ? 'open' : 'closed'}`}>● {open ? t.openNow : t.closedNow}</div>}
            <div className="hero-meta">
              <span>📍 {localized(place, 'address', lang) || t.city}</span>
              <span>💰 {formatMoney(place.average_check, lang, t)}</span>
              {distance && <span>🧭 {distance}</span>}
            </div>
          </div>
        </section>

        <div className="detail-actions">
          <button className="primary" onClick={() => openExternal(mapsUrl(place, lang))}>🧭 {t.route}</button>
          {place.phone && <button className="secondary" onClick={() => { window.location.href = `tel:${place.phone}` }}>📞 {t.call}</button>}
        </div>

        <div className="detail-secondary-actions">
          <button className={favorite ? 'active' : ''} onClick={onFavorite}>{favorite ? '♥' : '♡'} {favorite ? t.removeFavorite : t.addFavorite}</button>
          <button onClick={() => sharePlace(place, localized(place, 'name', lang), t.shareText)}>↗ {t.share}</button>
        </div>

        {tags.length > 0 && (
          <div className="tag-row">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        )}

        <section className="detail-section">
          <h2>{t.about}</h2>
          <p className="detail-description">{localized(place, 'description', lang) || category}</p>
          <div className="info-list">
            <div className="info-row"><span>🕐 {t.schedule}</span><strong>{place.open_time && place.close_time ? `${time(place.open_time)}–${time(place.close_time)}` : t.scheduleUnknown}</strong></div>
            <div className="info-row"><span>💰 {t.averageCheck}</span><strong>{formatMoney(place.average_check, lang, t)}</strong></div>
            <div className="info-row"><span>📍 {t.address}</span><strong>{localized(place, 'address', lang) || t.city}</strong></div>
            {place.phone && <div className="info-row"><span>📞 {t.phone}</span><strong>{place.phone}</strong></div>}
          </div>
        </section>

        {offers.length > 0 && (
          <section className="detail-section">
            <h2>{t.offersNow}</h2>
            <div className="detail-list">
              {offers.map((offer) => (
                <article className="detail-card" key={offer.id}>
                  <div className="detail-card-top">
                    <strong>{localized(offer, 'title', lang)}</strong>
                    {offer.discount_percent ? <span className="discount-badge">−{offer.discount_percent}%</span> : null}
                  </div>
                  <p>{localized(offer, 'description', lang) || t.specialOffer}</p>
                  {offer.ends_at && <div className="muted">{t.until} {dtTime(offer.ends_at, lang)}</div>}
                </article>
              ))}
            </div>
          </section>
        )}

        {events.length > 0 && (
          <section className="detail-section">
            <h2>{t.eventsHere}</h2>
            <div className="detail-list">
              {events.map((event) => (
                <article className="detail-card" key={event.id}>
                  <div className="detail-card-top"><strong>{localized(event, 'title', lang)}</strong><span className="time-badge">{dtTime(event.starts_at, lang)}</span></div>
                  <p>{localized(event, 'description', lang) || t.eventToday}</p>
                  <div className="muted">{Number(event.price) === 0 ? t.free : formatMoney(event.price, lang, t)}</div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="detail-section">
          <h2>{t.details}</h2>
          <div className="contact-grid">
            {place.phone && <button onClick={() => { window.location.href = `tel:${place.phone}` }}>📞 {t.call}</button>}
            {instagram && <button onClick={() => openExternal(instagram)}>📸 {t.instagram}</button>}
            <button onClick={() => openExternal(mapsUrl(place, lang))}>📍 {t.onMap}</button>
          </div>
        </section>
      </main>
    </div>
  )
}
