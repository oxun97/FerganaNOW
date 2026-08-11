import { useRef } from 'react'
import PlaceCard from './PlaceCard.jsx'
import { CREATOR_URL, openTelegram } from '../lib/telegram.js'

export default function ProfileScreen({
  telegramUser,
  placesById,
  favoriteIds,
  historyIds,
  lang,
  t,
  userLocation,
  cloudEnabled,
  onFavorite,
  onOpenPlace,
  onOpenAddPlace,
  onOpenAdmin,
}) {
  const clickData = useRef({ count: 0, last: 0 })
  const favoritePlaces = favoriteIds.map((id) => placesById[id]).filter(Boolean)
  const historyPlaces = historyIds.map((id) => placesById[id]).filter(Boolean)

  const displayName = telegramUser
    ? [telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(' ')
    : t.guest

  function handleAdminClick() {
    const now = Date.now()
    if (now - clickData.current.last > 2000) {
      clickData.current.count = 1
    } else {
      clickData.current.count++
    }
    clickData.current.last = now

    if (clickData.current.count >= 5) {
      clickData.current.count = 0
      onOpenAdmin()
    }
  }

  return (
    <section className="screen-section profile-screen">
      <div className="page-title-row">
        <div>
          <div className="eyebrow">FERGANA NOW</div>
          <h1>{t.profile}</h1>
        </div>
      </div>

      <article className="telegram-card">
        {telegramUser?.photo_url ? (
          <img className="telegram-avatar" src={telegramUser.photo_url} alt={displayName} />
        ) : (
          <div className="telegram-avatar fallback">👤</div>
        )}
        <div className="telegram-copy">
          <div className="creator-label">{t.telegramProfile}</div>
          <h2>{displayName}</h2>
          {telegramUser?.username && <div className="muted">@{telegramUser.username}</div>}
          <div className={`sync-state ${cloudEnabled ? 'on' : ''}`}>● {cloudEnabled ? t.cloudOn : t.cloudLocal}</div>
        </div>
      </article>

      <div style={{ margin: '16px 0' }}>
        <button className="primary full-width" onClick={onOpenAddPlace}>
          {lang === 'uz' ? '+ Joy qo\'shish' : '+ Добавить место'}
        </button>
      </div>

      <div className="section-head"><h2>♥ {t.favorites}</h2><span className="count-pill">{favoritePlaces.length}</span></div>
      {favoritePlaces.length ? (
        <div className="place-list">
          {favoritePlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              lang={lang}
              t={t}
              userLocation={userLocation}
              favorite
              onFavorite={() => onFavorite(place.id)}
              onOpen={() => onOpenPlace(place.id)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-card">♡<br />{t.favoritesEmpty}</div>
      )}

      <div className="section-head"><h2>◷ {t.history}</h2><span className="count-pill">{historyPlaces.length}</span></div>
      {historyPlaces.length ? (
        <div className="compact-history">
          {historyPlaces.slice(0, 8).map((place) => (
            <button key={place.id} onClick={() => onOpenPlace(place.id)}>
              <span>{place.name}</span><b>›</b>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty-card">{t.historyEmpty}</div>
      )}

      <div className="section-head"><h2>{t.creatorLabel}</h2></div>
      <article className="creator-card creator-card-personal">
        <div className="creator-photo" role="img" aria-label={t.creatorName} onClick={handleAdminClick} />
        <div className="creator-copy">
          <div className="creator-label">{t.creatorLabel}</div>
          <div className="creator-name">{t.creatorName}</div>
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
          <div className="creator-text">{t.creatorText}</div>
        </div>
        <button className="creator-link creator-link-wide" onClick={() => openTelegram(CREATOR_URL)}>
          <span className="creator-telegram-icon">✈️</span>
          <span>{t.creatorTelegram}</span>
          <b>›</b>
        </button>
      </article>
    </section>
  )
}
