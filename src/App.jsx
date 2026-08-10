import { useEffect, useMemo, useState } from 'react'
import './App.css'

const categories = [
  ['🍽', 'Поесть'],
  ['☕', 'Кофе'],
  ['❤️', 'Вдвоём'],
  ['👨‍👩‍👧', 'С детьми'],
  ['🎤', 'Караоке'],
  ['🎮', 'Развлечения'],
  ['🌙', 'Ночью'],
  ['🎉', 'Сегодня'],
]

const places = [
  {
    name: 'Giotto',
    icon: '🍝',
    type: 'Итальянская кухня',
    status: 'Открыто до 00:00',
    price: '150–250 тыс. сум',
    distance: '1,7 км',
    tags: ['Поесть', 'Вдвоём', 'Сегодня'],
  },
  {
    name: 'Coffee Boom',
    icon: '☕',
    type: 'Кофе • десерты',
    status: 'Открыто до 23:30',
    price: '50–120 тыс. сум',
    distance: '2,1 км',
    tags: ['Кофе', 'Вдвоём', 'Сегодня'],
  },
  {
    name: 'Royal Hall',
    icon: '🎤',
    type: 'Караоке • lounge',
    status: 'Открыто до 03:00',
    price: '120–300 тыс. сум',
    distance: '2,9 км',
    tags: ['Караоке', 'Развлечения', 'Ночью', 'Сегодня'],
  },
  {
    name: 'Family Park',
    icon: '🎡',
    type: 'Для детей • развлечения',
    status: 'Открыто до 22:00',
    price: '40–150 тыс. сум',
    distance: '3,2 км',
    tags: ['С детьми', 'Развлечения', 'Сегодня'],
  },
]

const live = [
  {
    icon: '🎵',
    label: 'Живая музыка',
    title: 'Giotto',
    meta: 'Сегодня • 20:00–23:00',
    badge: 'ИДЁТ СЕЙЧАС',
    note: 'Есть свободные столики',
  },
  {
    icon: '🔥',
    label: 'Акция',
    title: 'Coffee Boom',
    meta: 'До 23:30',
    badge: '−20%',
    note: 'На десерты после 21:00',
  },
  {
    icon: '🎤',
    label: 'Караоке',
    title: 'Royal Hall',
    meta: 'Старт через 35 минут',
    badge: 'СКОРО',
    note: 'Вход свободный до 22:00',
  },
]

export default function App() {
  const [tab, setTab] = useState('now')
  const [category, setCategory] = useState(null)

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (!tg) return
    tg.ready()
    tg.expand()
  }, [])

  const filteredPlaces = useMemo(() => {
    if (!category) return places
    return places.filter((place) => place.tags.includes(category))
  }, [category])

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
        {tab === 'now' && (
          <>
            <section className="hero">
              <div className="eyebrow">ФЕРГАНА • ПРЯМО СЕЙЧАС</div>
              <h1>Что будем делать?</h1>
              <p>Места, события и акции, которыми можно воспользоваться уже сегодня.</p>
              <button className="primary" onClick={() => setTab('pick')}>
                🎲 Реши за меня
              </button>
            </section>

            <section>
              <div className="section-head">
                <h2>Выбери настроение</h2>
                {category && (
                  <button className="text-button" onClick={() => setCategory(null)}>
                    Сбросить
                  </button>
                )}
              </div>

              <div className="category-grid">
                {categories.map(([icon, label]) => (
                  <button
                    key={label}
                    className={`category ${category === label ? 'selected' : ''}`}
                    onClick={() => setCategory(label)}
                  >
                    <span>{icon}</span>
                    <strong>{label}</strong>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="section-head">
                <h2>🔥 Интересно сейчас</h2>
                <button className="text-button">Все</button>
              </div>

              <div className="live-row">
                {live.map((item) => (
                  <article className="live-card" key={item.title + item.label}>
                    <div className="live-top">
                      <span>{item.icon} {item.label}</span>
                      <b>{item.badge}</b>
                    </div>
                    <h3>{item.title}</h3>
                    <div className="muted">{item.meta}</div>
                    <div className="live-note">● {item.note}</div>
                    <div className="card-actions">
                      <button>Подробнее</button>
                      <button className="ghost">Маршрут</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <div className="section-head">
                <h2>{category ? `Места: ${category}` : 'Рядом с вами'}</h2>
                <button className="text-button" onClick={() => setTab('places')}>
                  Все места
                </button>
              </div>

              <div className="place-list">
                {filteredPlaces.map((place) => (
                  <article className="place" key={place.name}>
                    <div className="place-icon">{place.icon}</div>
                    <div className="place-body">
                      <h3>{place.name}</h3>
                      <div className="muted">{place.type}</div>
                      <div className="place-meta">
                        <span>🟢 {place.status}</span>
                        <span>📍 {place.distance}</span>
                        <span>💰 {place.price}</span>
                      </div>
                    </div>
                    <button className="arrow">›</button>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}

        {tab === 'places' && (
          <Placeholder
            icon="📍"
            title="Места"
            text="Здесь будет каталог заведений с фильтрами: открыто сейчас, рядом, недорого, для свидания и с детьми."
          />
        )}

        {tab === 'today' && (
          <Placeholder
            icon="🎉"
            title="Сегодня"
            text="Здесь будет лента мероприятий по времени. Прошедшие события будут автоматически скрываться."
          />
        )}

        {tab === 'pick' && <Picker />}

        {tab === 'profile' && (
          <Placeholder
            icon="👤"
            title="Профиль"
            text="Позже здесь будут избранные места, история и переключатель RU / UZ."
          />
        )}
      </main>

      <nav className="bottom-nav">
        <NavItem icon="⚡" label="Сейчас" active={tab === 'now'} onClick={() => setTab('now')} />
        <NavItem icon="📍" label="Места" active={tab === 'places'} onClick={() => setTab('places')} />
        <NavItem icon="🎉" label="Сегодня" active={tab === 'today'} onClick={() => setTab('today')} />
        <NavItem icon="🎲" label="Куда пойти" active={tab === 'pick'} onClick={() => setTab('pick')} />
        <NavItem icon="👤" label="Профиль" active={tab === 'profile'} onClick={() => setTab('profile')} />
      </nav>
    </div>
  )
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      <span>{icon}</span>
      <small>{label}</small>
    </button>
  )
}

function Placeholder({ icon, title, text }) {
  return (
    <section className="placeholder">
      <div className="placeholder-icon">{icon}</div>
      <h1>{title}</h1>
      <p>{text}</p>
      <div className="pill">MVP • следующий этап</div>
    </section>
  )
}

function Picker() {
  const [company, setCompany] = useState('Вдвоём')
  const [budget, setBudget] = useState('100–300 тыс.')
  const [result, setResult] = useState(null)

  const choose = () => {
    const variants = [
      ['Ужин + кофе', 'Giotto → Coffee Boom', '≈ 220 000 сум'],
      ['Караоке-вечер', 'Royal Hall', '≈ 180 000 сум'],
      ['Прогулка + десерт', 'Центр Ферганы → Coffee Boom', '≈ 90 000 сум'],
    ]
    setResult(variants[Math.floor(Math.random() * variants.length)])
  }

  return (
    <section className="picker">
      <div className="placeholder-icon">🎲</div>
      <h1>Реши за меня</h1>
      <p>Два ответа — и Fergana NOW предложит готовый вариант на вечер.</p>

      <h3>Кто идёт?</h3>
      <div className="chips">
        {['Один', 'Вдвоём', 'С друзьями', 'С детьми'].map((value) => (
          <button
            key={value}
            className={`chip ${company === value ? 'active' : ''}`}
            onClick={() => setCompany(value)}
          >
            {value}
          </button>
        ))}
      </div>

      <h3>Бюджет</h3>
      <div className="chips">
        {['до 100 тыс.', '100–300 тыс.', '300+ тыс.'].map((value) => (
          <button
            key={value}
            className={`chip ${budget === value ? 'active' : ''}`}
            onClick={() => setBudget(value)}
          >
            {value}
          </button>
        ))}
      </div>

      <button className="primary full" onClick={choose}>Подобрать вариант</button>

      {result && (
        <div className="result">
          <div className="eyebrow">ВАШ ВАРИАНТ</div>
          <h2>{result[0]}</h2>
          <p>{result[1]}</p>
          <strong>{result[2]}</strong>
          <div className="muted">Для: {company} • бюджет: {budget}</div>
        </div>
      )}
    </section>
  )
}
