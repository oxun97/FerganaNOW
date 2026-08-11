import { useMemo, useState } from 'react'
import {
  dtTime,
  eventState,
  ferganaDateKey,
  formatMoney,
  localized,
} from '../lib/placeUtils.js'

export default function TodayScreen({ events, offers, placesById, lang, t, onOpenPlace }) {
  const [filter, setFilter] = useState('now')
  const todayKey = ferganaDateKey()

  const todayEvents = useMemo(() => events.filter((event) => {
    if (!event.starts_at || ferganaDateKey(event.starts_at) !== todayKey) return false
    const state = eventState(event)
    if (filter === 'now') return state === 'now'
    if (filter === 'later') return state === 'later'
    return state !== 'ended'
  }), [events, filter, todayKey])

  const activeOffers = useMemo(() => {
    const now = Date.now()
    return offers.filter((offer) => {
      const start = offer.starts_at ? new Date(offer.starts_at).getTime() : 0
      const end = offer.ends_at ? new Date(offer.ends_at).getTime() : Infinity
      return start <= now && end >= now
    })
  }, [offers])

  return (
    <section className="screen-section">
      <div className="page-title-row">
        <div>
          <div className="eyebrow">FERGANA NOW</div>
          <h1>{t.today}</h1>
        </div>
      </div>

      <div className="segmented wide">
        <button className={filter === 'now' ? 'active' : ''} onClick={() => setFilter('now')}>{t.nowFilter}</button>
        <button className={filter === 'later' ? 'active' : ''} onClick={() => setFilter('later')}>{t.laterFilter}</button>
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>{t.allFilter}</button>
      </div>

      <div className="section-head"><h2>{t.todayEvents}</h2></div>
      <div className="event-list">
        {todayEvents.length ? todayEvents.map((event) => {
          const place = placesById[event.place_id]
          const state = eventState(event)
          return (
            <article className="event-card" key={event.id} onClick={() => onOpenPlace(event.place_id)}>
              <div className="event-time-box">
                <strong>{dtTime(event.starts_at, lang)}</strong>
                <span>{state === 'now' ? '● NOW' : t.todayBadge}</span>
              </div>
              <div className="event-copy">
                <h3>{localized(event, 'title', lang)}</h3>
                <div className="muted">📍 {localized(place, 'name', lang) || t.city}</div>
                <p>{localized(event, 'description', lang) || t.eventToday}</p>
                <div className="event-price">{Number(event.price) === 0 ? t.free : formatMoney(event.price, lang, t)}</div>
              </div>
              <span className="chevron">›</span>
            </article>
          )
        }) : <div className="empty-card">{t.noEvents}</div>}
      </div>

      <div className="section-head"><h2>{t.todayOffers}</h2></div>
      <div className="event-list">
        {activeOffers.length ? activeOffers.map((offer) => {
          const place = placesById[offer.place_id]
          return (
            <article className="offer-card" key={offer.id} onClick={() => onOpenPlace(offer.place_id)}>
              <div className="offer-icon">🔥</div>
              <div className="event-copy">
                <h3>{localized(offer, 'title', lang)}</h3>
                <div className="muted">{localized(place, 'name', lang) || t.city}</div>
                <p>{localized(offer, 'description', lang) || t.specialOffer}</p>
              </div>
              {offer.discount_percent ? <div className="discount-badge">−{offer.discount_percent}%</div> : <span className="chevron">›</span>}
            </article>
          )
        }) : <div className="empty-card">{t.noOffers}</div>}
      </div>
    </section>
  )
}
