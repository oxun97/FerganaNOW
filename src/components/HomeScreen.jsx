import { CATEGORY_KEYS, CATEGORY_LABEL_KEY } from '../lib/i18n.js'
import {
  activityBadge,
  dtTime,
  isOpenNow,
  localized,
  sortPlaces,
} from '../lib/placeUtils.js'
import PlaceCard from './PlaceCard.jsx'
import { SkeletonCard, SkeletonLiveCard } from './Skeleton.jsx'

export default function HomeScreen({
  places,
  events,
  offers,
  placesById,
  lang,
  t,
  loading,
  userLocation,
  locationState,
  onRequestLocation,
  isFavorite,
  onFavorite,
  onOpenPlace,
  onBrowseCategory,
  onOpenPlaces,
  onOpenPicker,
  onReload,
}) {
  const openCount = places.filter((place) => isOpenNow(place) === true).length
  const nearby = sortPlaces(places, userLocation).slice(0, 5)

  const liveItems = [
    ...events.map((event) => ({
      id: `event-${event.id}`,
      kind: 'event',
      icon: '🎵',
      label: t.event,
      title: localized(event, 'title', lang),
      subtitle: localized(placesById[event.place_id], 'name', lang) || t.city,
      placeId: event.place_id,
      image: event.image_url,
      meta: `${dtTime(event.starts_at, lang)}${event.ends_at ? `–${dtTime(event.ends_at, lang)}` : ''}`,
      badge: activityBadge(event.starts_at, event.ends_at, lang, t),
      note: localized(event, 'description', lang),
    })),
    ...offers.map((offer) => ({
      id: `offer-${offer.id}`,
      kind: 'offer',
      icon: '🔥',
      label: t.offer,
      title: localized(offer, 'title', lang),
      subtitle: localized(placesById[offer.place_id], 'name', lang) || t.city,
      placeId: offer.place_id,
      image: offer.image_url,
      meta: offer.ends_at ? `${t.until} ${dtTime(offer.ends_at, lang)}` : t.today,
      badge: offer.discount_percent ? `−${offer.discount_percent}%` : t.offer.toUpperCase(),
      note: localized(offer, 'description', lang),
    })),
  ].slice(0, 10)

  return (
    <>
      <section className="hero">
        <div className="eyebrow">{t.heroEyebrow}</div>
        <h1>{t.heroTitle}</h1>
        <p>{t.heroText}</p>
        {!loading && <div className="open-summary">● {openCount} {t.openCount}</div>}
        <div className="hero-actions">
          <button className="primary" onClick={onOpenPicker}>{t.pickMe}</button>
          <button
            className={`secondary ${locationState === 'active' ? 'active' : ''}`}
            onClick={onRequestLocation}
          >
            {locationState === 'active' ? `📍 ${t.locationActive}` : t.nearMe}
          </button>
        </div>
        {locationState === 'denied' && <div className="location-hint">{t.locationDenied}</div>}
      </section>

      <section>
        <div className="section-head"><h2>{t.mood}</h2></div>
        <div className="category-grid">
          {CATEGORY_KEYS.map(([icon, key]) => (
            <button className="category-button" key={key} onClick={() => onBrowseCategory(key)}>
              <span>{icon}</span>
              <strong>{t[CATEGORY_LABEL_KEY[key]]}</strong>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>{t.interesting}</h2>
          <button className="text-button" onClick={onReload}>{t.refresh}</button>
        </div>
        {loading ? (
          <div className="horizontal-scroll">
            <SkeletonLiveCard />
            <SkeletonLiveCard />
            <SkeletonLiveCard />
          </div>
        ) : liveItems.length ? (
          <div className="horizontal-scroll">
            {liveItems.map((item) => (
              <article className="live-card" key={item.id} onClick={() => onOpenPlace(item.placeId)}>
                <div className="live-content">
                  {item.image && (
                    <div className="live-thumb" style={{ backgroundImage: `url("${item.image.startsWith('http') ? item.image : `https://xqpfrmsounqbhyiwutrg.supabase.co/storage/v1/object/public/rasmlar/${item.image}`}")` }} />
                  )}
                  <div className="live-info">
                    <div className="live-top"><span>{item.icon} {item.label}</span><b>{item.badge}</b></div>
                    <h3>{item.title}</h3>
                    <div className="muted">{item.subtitle}</div>
                    <div className="muted small-meta">{item.meta}</div>
                    {item.note && item.note !== item.title && (
                      <div className="live-note clamp-2">● {item.note}</div>
                    )}
                  </div>
                </div>
                <button className="small-button full-width-btn">{t.details}</button>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-card">{t.noLive}</div>
        )}
      </section>

      <section>
        <div className="section-head">
          <h2>{userLocation ? t.nearby : t.allPlaces}</h2>
          <button className="text-button" onClick={onOpenPlaces}>{t.allPlaces}</button>
        </div>
        <div className="place-list">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            nearby.map((place) => (
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
            ))
          )}
          {!loading && !nearby.length && <div className="empty-card">{t.noPlaces}</div>}
        </div>
      </section>
    </>
  )
}
