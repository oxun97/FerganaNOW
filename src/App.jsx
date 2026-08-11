import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { supabase } from './supabase'

const categories = [
  ['🍽', 'Поесть'], ['☕', 'Кофе'], ['❤️', 'Вдвоём'], ['👨‍👩‍👧', 'С детьми'],
  ['🎤', 'Караоке'], ['🎮', 'Развлечения'], ['🌙', 'Ночью'], ['🎉', 'Сегодня'],
]

const categoryMeta = {
  restaurant: ['🍽', 'Ресторан'],
  cafe: ['☕', 'Кафе'],
  coffee: ['☕', 'Кофейня'],
  karaoke: ['🎤', 'Караоке'],
  entertainment: ['🎮', 'Развлечения'],
  kids: ['🎡', 'Для детей'],
  bar: ['🍸', 'Бар'],
}

const metaFor = (category) => categoryMeta[category] || ['📍', 'Место']
const time = (value) => value ? value.slice(0, 5) : ''
const money = (value) => value ? `${new Intl.NumberFormat('ru-RU').format(value)} сум` : 'Цена не указана'
const dtTime = (value) => value ? new Intl.DateTimeFormat('ru-RU', {hour:'2-digit', minute:'2-digit'}).format(new Date(value)) : ''

function activityBadge(start, end) {
  const now = Date.now()
  const s = start ? new Date(start).getTime() : 0
  const e = end ? new Date(end).getTime() : Infinity
  if (s > now) {
    const minutes = Math.max(1, Math.round((s - now) / 60000))
    return minutes < 120 ? `через ${minutes} мин` : `в ${dtTime(start)}`
  }
  if (s <= now && e >= now) return 'ИДЁТ СЕЙЧАС'
  return 'СЕГОДНЯ'
}

export default function App() {
  const [tab, setTab] = useState('now')
  const [category, setCategory] = useState(null)
  const [places, setPlaces] = useState([])
  const [events, setEvents] = useState([])
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (tg) { tg.ready(); tg.expand() }
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    setError('')
    const [p, e, o] = await Promise.all([
      supabase.from('places').select('*').eq('is_active', true).order('id'),
      supabase.from('events').select('*').eq('is_active', true).order('starts_at'),
      supabase.from('offers').select('*').eq('is_active', true).order('starts_at'),
    ])
    const err = p.error || e.error || o.error
    if (err) {
      console.error(err)
      setError(err.message)
    } else {
      setPlaces(p.data || [])
      setEvents(e.data || [])
      setOffers(o.data || [])
    }
    setLoading(false)
  }

  const placesById = useMemo(
    () => Object.fromEntries(places.map(p => [p.id, p])),
    [places],
  )

  const filteredPlaces = useMemo(() => {
    if (!category) return places
    return places.filter(p => Array.isArray(p.tags) && p.tags.includes(category))
  }, [places, category])

  const liveItems = useMemo(() => [
    ...events.map(e => ({
      id: `event-${e.id}`, icon: '🎵', label: 'Событие', title: e.title,
      place: placesById[e.place_id]?.name || 'Фергана',
      meta: `${dtTime(e.starts_at)}${e.ends_at ? `–${dtTime(e.ends_at)}` : ''}`,
      badge: activityBadge(e.starts_at, e.ends_at),
      note: e.description || 'Событие сегодня',
    })),
    ...offers.map(o => ({
      id: `offer-${o.id}`, icon: '🔥', label: 'Акция',
      title: placesById[o.place_id]?.name || 'Фергана',
      place: o.title,
      meta: o.ends_at ? `до ${dtTime(o.ends_at)}` : 'сегодня',
      badge: o.discount_percent ? `−${o.discount_percent}%` : 'АКЦИЯ',
      note: o.description || o.title,
    })),
  ].slice(0, 8), [events, offers, placesById])

  return (
    <div className="app">
      <header className="header">
        <div>
          <div className="logo">FERGANA <span>NOW</span></div>
          <div className="caption">Куда пойти прямо сейчас</div>
        </div>
        <button className="location">📍 Фергана</button>
      </header>

      <main className="main">
        {tab === 'now' && <>
          <section className="hero">
            <div className="eyebrow">ФЕРГАНА • ПРЯМО СЕЙЧАС</div>
            <h1>Что будем делать?</h1>
            <p>Места, события и акции из настоящей базы Fergana NOW.</p>
            <button className="primary" onClick={() => setTab('pick')}>🎲 Реши за меня</button>
          </section>

          {error && <section className="result">
            <div className="eyebrow">ОШИБКА</div>
            <h2>Не удалось получить данные</h2>
            <p>{error}</p>
            <button className="primary" onClick={loadData}>Повторить</button>
          </section>}

          <section>
            <div className="section-head">
              <h2>Выбери настроение</h2>
              {category && <button className="text-button" onClick={() => setCategory(null)}>Сбросить</button>}
            </div>
            <div className="category-grid">
              {categories.map(([icon,label]) => (
                <button key={label}
                  className={`category ${category === label ? 'selected' : ''}`}
                  onClick={() => setCategory(label)}>
                  <span>{icon}</span><strong>{label}</strong>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="section-head">
              <h2>🔥 Интересно сейчас</h2>
              <button className="text-button" onClick={loadData}>Обновить</button>
            </div>
            {loading ? <div className="muted">Загрузка…</div> :
              liveItems.length ? <div className="live-row">
                {liveItems.map(item => (
                  <article className="live-card" key={item.id}>
                    <div className="live-top"><span>{item.icon} {item.label}</span><b>{item.badge}</b></div>
                    <h3>{item.title}</h3>
                    <div className="muted">{item.place}</div>
                    <div className="muted">{item.meta}</div>
                    <div className="live-note">● {item.note}</div>
                    <div className="card-actions"><button>Подробнее</button><button className="ghost">Маршрут</button></div>
                  </article>
                ))}
              </div> : <div className="muted">Пока нет активных событий и акций.</div>}
          </section>

          <section>
            <div className="section-head">
              <h2>{category ? `Места: ${category}` : 'Места Ферганы'}</h2>
              <button className="text-button" onClick={() => setTab('places')}>Все места</button>
            </div>
            {loading ? <div className="muted">Загрузка…</div> :
              <div className="place-list">
                {filteredPlaces.map(place => {
                  const [icon,label] = metaFor(place.category)
                  return <article className="place" key={place.id}>
                    <div className="place-icon">{icon}</div>
                    <div className="place-body">
                      <h3>{place.name}</h3>
                      <div className="muted">{place.description || label}</div>
                      <div className="place-meta">
                        <span>🕐 {place.close_time ? `до ${time(place.close_time)}` : 'график уточняется'}</span>
                        <span>📍 {place.address || 'Фергана'}</span>
                        <span>💰 {money(place.average_check)}</span>
                      </div>
                    </div>
                    <button className="arrow">›</button>
                  </article>
                })}
                {!filteredPlaces.length && !error && <div className="muted">В этой категории пока нет мест.</div>}
              </div>}
          </section>
        </>}

        {tab === 'places' && <Places places={places} loading={loading} />}
        {tab === 'today' && <Today events={events} placesById={placesById} />}
        {tab === 'pick' && <Picker places={places} />}
        {tab === 'profile' && <Placeholder icon="👤" title="Профиль"
          text="Позже здесь будут избранное, история и переключатель RU / UZ." />}
      </main>

      <nav className="bottom-nav">
        <Nav icon="⚡" label="Сейчас" active={tab==='now'} onClick={() => setTab('now')} />
        <Nav icon="📍" label="Места" active={tab==='places'} onClick={() => setTab('places')} />
        <Nav icon="🎉" label="Сегодня" active={tab==='today'} onClick={() => setTab('today')} />
        <Nav icon="🎲" label="Куда пойти" active={tab==='pick'} onClick={() => setTab('pick')} />
        <Nav icon="👤" label="Профиль" active={tab==='profile'} onClick={() => setTab('profile')} />
      </nav>
    </div>
  )
}

function Places({ places, loading }) {
  return <section className="picker">
    <div className="placeholder-icon">📍</div><h1>Места</h1>
    <p>Все активные места загружаются из Supabase.</p>
    {loading ? <div className="muted">Загрузка…</div> :
      <div className="place-list">{places.map(place => {
        const [icon,label] = metaFor(place.category)
        return <article className="place" key={place.id}>
          <div className="place-icon">{icon}</div>
          <div className="place-body"><h3>{place.name}</h3>
            <div className="muted">{place.description || label}</div>
            <div className="place-meta"><span>📍 {place.address || 'Фергана'}</span><span>💰 {money(place.average_check)}</span></div>
          </div>
        </article>
      })}</div>}
  </section>
}

function Today({ events, placesById }) {
  return <section className="picker">
    <div className="placeholder-icon">🎉</div><h1>Сегодня</h1>
    <p>События из базы данных Fergana NOW.</p>
    <div className="place-list">
      {events.map(event => <article className="place" key={event.id}>
        <div className="place-icon">🎵</div>
        <div className="place-body"><h3>{event.title}</h3>
          <div className="muted">{placesById[event.place_id]?.name || 'Фергана'}</div>
          <div className="place-meta"><span>🕐 {dtTime(event.starts_at)}</span>{event.price===0 && <span>🎟 Бесплатно</span>}</div>
        </div>
      </article>)}
      {!events.length && <div className="muted">На сегодня событий пока нет.</div>}
    </div>
  </section>
}

function Nav({ icon, label, active, onClick }) {
  return <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
    <span>{icon}</span><small>{label}</small>
  </button>
}

function Placeholder({ icon, title, text }) {
  return <section className="placeholder">
    <div className="placeholder-icon">{icon}</div><h1>{title}</h1><p>{text}</p>
    <div className="pill">MVP • следующий этап</div>
  </section>
}

function Picker({ places }) {
  const [company,setCompany] = useState('Вдвоём')
  const [budget,setBudget] = useState('100–300 тыс.')
  const [result,setResult] = useState(null)
  const choose = () => {
    if (!places.length) return setResult(['Пока нет вариантов','Добавь места в Supabase',''])
    const place = places[Math.floor(Math.random()*places.length)]
    setResult([place.name, place.description || 'Вариант на сегодня', money(place.average_check)])
  }
  return <section className="picker">
    <div className="placeholder-icon">🎲</div><h1>Реши за меня</h1>
    <p>Теперь выбор идёт из реальной базы мест.</p>
    <h3>Кто идёт?</h3>
    <div className="chips">{['Один','Вдвоём','С друзьями','С детьми'].map(v =>
      <button key={v} className={`chip ${company===v?'active':''}`} onClick={() => setCompany(v)}>{v}</button>)}</div>
    <h3>Бюджет</h3>
    <div className="chips">{['до 100 тыс.','100–300 тыс.','300+ тыс.'].map(v =>
      <button key={v} className={`chip ${budget===v?'active':''}`} onClick={() => setBudget(v)}>{v}</button>)}</div>
    <button className="primary full" onClick={choose}>Подобрать вариант</button>
    {result && <div className="result"><div className="eyebrow">ВАШ ВАРИАНТ</div>
      <h2>{result[0]}</h2><p>{result[1]}</p>{result[2] && <strong>{result[2]}</strong>}
      <div className="muted">Для: {company} • бюджет: {budget}</div></div>}
  </section>
}
