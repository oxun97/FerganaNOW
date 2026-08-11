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
import { CREATOR_URL, openTelegram } from '../lib/telegram.js'

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
          <button className="primary" onClick={onOpenPicker}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <path d="M19 8.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3.5"></path>
              <path d="m19 11-4-4"></path>
              <path d="m15 11 4-4"></path>
            </svg>
            {t.pickMe}
          </button>
          <button
            className={`secondary ${locationState === 'active' ? 'active' : ''}`}
            onClick={onRequestLocation}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', color: '#77ffac' }}>
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {locationState === 'active' ? t.locationActive : t.nearMe}
          </button>
        </div>
        {locationState === 'denied' && <div className="location-hint">{t.locationDenied}</div>}
      </section>

      <section>
        <div className="section-head"><h2>{t.mood}</h2></div>
        <div className="category-grid">
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
              <button className="category-button" key={key} onClick={() => onBrowseCategory(key)}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#77ffac' }}>
                  {icons[key]}
                </svg>
                <strong>{t[CATEGORY_LABEL_KEY[key]]}</strong>
              </button>
            )
          })}
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
                <div className="live-header-row">
                  {item.image && (
                    <div className="live-thumb" style={{ backgroundImage: `url("${item.image.startsWith('http') ? item.image : `https://xqpfrmsounqbhyiwutrg.supabase.co/storage/v1/object/public/rasmlar/${item.image}`}")` }} />
                  )}
                  <div className="live-main-info">
                    <div className="live-top" style={{ marginBottom: '6px' }}>
                      <span>{item.icon} {item.label}</span>
                      <b>{item.badge}</b>
                    </div>
                    <h3>{item.title}</h3>
                    <div className="muted" style={{ fontSize: '13px', fontWeight: '600' }}>{item.subtitle}</div>
                    <div className="muted" style={{ fontSize: '11px', marginTop: '2px' }}>{item.meta}</div>
                  </div>
                </div>
                {item.note && item.note !== item.title && (
                  <div className="live-note-box clamp-2">
                    ● {item.note}
                  </div>
                )}
                <button className="primary small-button" style={{ width: '100%', marginTop: '12px' }}>{t.details}</button>
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

      <div className="section-head"><h2>{t.creatorLabel}</h2></div>
      <article className="creator-card creator-card-personal" style={{ margin: '0 16px 20px' }}>
        <div className="creator-photo" role="img" aria-label={t.creatorName} />
        <div className="creator-copy">
          <div className="creator-label">{t.creatorLabel}</div>
          <div className="creator-name">{t.creatorName}</div>
          <div className="creator-row">
            <a
              className="creator-handle"
              href={CREATOR_URL}
              onClick={(event) => {
                event.preventDefault()
                openTelegram(CREATOR_URL)
              }}
            >
              @oxun_uz
            </a>
            <button className="creator-write-btn" onClick={() => openTelegram(CREATOR_URL)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              <span>{lang === 'uz' ? 'Yozish' : 'Написать'}</span>
            </button>
          </div>
          <div className="creator-text">{t.creatorText}</div>
        </div>
      </article>
    </>
  )
}
