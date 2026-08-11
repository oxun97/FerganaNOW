import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { supabase } from './supabase'

const I18N = {
  ru: {
    city: 'Фергана',
    subtitle: 'Куда пойти прямо сейчас',
    nowEyebrow: 'ФЕРГАНА • ПРЯМО СЕЙЧАС',
    heroTitle: 'Что будем делать?',
    heroText: 'Места, события и акции из настоящей базы Fergana NOW.',
    pickMe: '🎲 Реши за меня',
    error: 'ОШИБКА',
    loadFailed: 'Не удалось получить данные',
    retry: 'Повторить',
    mood: 'Выбери настроение',
    reset: 'Сбросить',
    interesting: '🔥 Интересно сейчас',
    refresh: 'Обновить',
    loading: 'Загрузка…',
    noLive: 'Пока нет активных событий и акций.',
    placesCity: 'Места Ферганы',
    allPlaces: 'Все места',
    noCategoryPlaces: 'В этой категории пока нет мест.',
    event: 'Событие',
    offer: 'Акция',
    eventToday: 'Событие сегодня',
    today: 'сегодня',
    until: 'до',
    startsIn: 'через',
    min: 'мин',
    at: 'в',
    happeningNow: 'ИДЁТ СЕЙЧАС',
    todayBadge: 'СЕГОДНЯ',
    details: 'Подробнее',
    route: 'Маршрут',
    schedulePending: 'график уточняется',
    priceMissing: 'Цена не указана',
    place: 'Место',
    places: 'Места',
    placesDescription: 'Все активные места загружаются из Supabase.',
    todayTitle: 'Сегодня',
    todayDescription: 'События из базы данных Fergana NOW.',
    noEvents: 'На сегодня событий пока нет.',
    free: 'Бесплатно',
    profile: 'Профиль',
    profileText: 'Здесь будут избранное, история и настройки приложения.',
    nextStage: 'MVP • следующий этап',
    navNow: 'Сейчас',
    navPlaces: 'Места',
    navToday: 'Сегодня',
    navPick: 'Куда пойти',
    navProfile: 'Профиль',
    decideTitle: 'Реши за меня',
    decideText: 'Выбор идёт из реальной базы мест.',
    who: 'Кто идёт?',
    budget: 'Бюджет',
    one: 'Один',
    two: 'Вдвоём',
    friends: 'С друзьями',
    children: 'С детьми',
    budget1: 'до 100 тыс.',
    budget2: '100–300 тыс.',
    budget3: '300+ тыс.',
    choose: 'Подобрать вариант',
    yourChoice: 'ВАШ ВАРИАНТ',
    choiceFor: 'Для',
    openPlace: 'Открыть место →',
    about: 'О месте',
    noDescription: 'Описание заведения скоро появится.',
    schedule: 'График',
    averageCheck: 'Средний чек',
    address: 'Адрес',
    phone: 'Телефон',
    offersNow: '🔥 Акции сейчас',
    specialOffer: 'Специальное предложение',
    eventsHere: '🎉 Сегодня здесь',
    contact: 'Связаться',
    call: '📞 Позвонить',
    instagram: '📸 Instagram',
    onMap: '📍 На карте',
    categoryPrefix: 'Места',
    categoryRestaurant: 'Ресторан',
    categoryCafe: 'Кафе',
    categoryCoffee: 'Кофейня',
    categoryKaraoke: 'Караоке',
    categoryEntertainment: 'Развлечения',
    categoryKids: 'Для детей',
    categoryBar: 'Бар',
    categoryClub: 'Клуб',
    tagEat: 'Поесть',
    tagCoffee: 'Кофе',
    tagDate: 'Вдвоём',
    tagKids: 'С детьми',
    tagKaraoke: 'Караоке',
    tagEntertainment: 'Развлечения',
    tagNight: 'Ночью',
    tagToday: 'Сегодня',
    currency: 'сум',
  },
  uz: {
    city: 'Farg‘ona',
    subtitle: 'Hozir qayerga borish mumkin',
    nowEyebrow: 'FARG‘ONA • HOZIR',
    heroTitle: 'Nima qilamiz?',
    heroText: 'Fergana NOW bazasidagi joylar, tadbirlar va aksiyalar.',
    pickMe: '🎲 Men uchun tanla',
    error: 'XATO',
    loadFailed: 'Ma’lumotlarni yuklab bo‘lmadi',
    retry: 'Qayta urinish',
    mood: 'Kayfiyatni tanlang',
    reset: 'Tozalash',
    interesting: '🔥 Hozir qiziqarli',
    refresh: 'Yangilash',
    loading: 'Yuklanmoqda…',
    noLive: 'Hozircha faol tadbir yoki aksiya yo‘q.',
    placesCity: 'Farg‘onadagi joylar',
    allPlaces: 'Barcha joylar',
    noCategoryPlaces: 'Bu bo‘limda hozircha joylar yo‘q.',
    event: 'Tadbir',
    offer: 'Aksiya',
    eventToday: 'Bugungi tadbir',
    today: 'bugun',
    until: 'gacha',
    startsIn: 'yana',
    min: 'daq',
    at: 'soat',
    happeningNow: 'HOZIR BO‘LYAPTI',
    todayBadge: 'BUGUN',
    details: 'Batafsil',
    route: 'Yo‘nalish',
    schedulePending: 'ish vaqti aniqlanmoqda',
    priceMissing: 'Narx ko‘rsatilmagan',
    place: 'Joy',
    places: 'Joylar',
    placesDescription: 'Barcha faol joylar Supabase bazasidan yuklanadi.',
    todayTitle: 'Bugun',
    todayDescription: 'Fergana NOW bazasidagi bugungi tadbirlar.',
    noEvents: 'Bugun uchun hozircha tadbirlar yo‘q.',
    free: 'Bepul',
    profile: 'Profil',
    profileText: 'Bu yerda sevimlilar, tarix va ilova sozlamalari bo‘ladi.',
    nextStage: 'MVP • keyingi bosqich',
    navNow: 'Hozir',
    navPlaces: 'Joylar',
    navToday: 'Bugun',
    navPick: 'Qayerga borish',
    navProfile: 'Profil',
    decideTitle: 'Men uchun tanla',
    decideText: 'Tanlov haqiqiy joylar bazasidan amalga oshiriladi.',
    who: 'Kim bilan?',
    budget: 'Byudjet',
    one: 'Yolg‘iz',
    two: 'Ikki kishi',
    friends: 'Do‘stlar bilan',
    children: 'Bolalar bilan',
    budget1: '100 minggacha',
    budget2: '100–300 ming',
    budget3: '300 ming+',
    choose: 'Variant tanlash',
    yourChoice: 'SIZNING VARIANTINGIZ',
    choiceFor: 'Kim uchun',
    openPlace: 'Joyni ochish →',
    about: 'Joy haqida',
    noDescription: 'Joy tavsifi tez orada qo‘shiladi.',
    schedule: 'Ish vaqti',
    averageCheck: 'O‘rtacha chek',
    address: 'Manzil',
    phone: 'Telefon',
    offersNow: '🔥 Hozirgi aksiyalar',
    specialOffer: 'Maxsus taklif',
    eventsHere: '🎉 Bugun bu yerda',
    contact: 'Bog‘lanish',
    call: '📞 Qo‘ng‘iroq',
    instagram: '📸 Instagram',
    onMap: '📍 Xaritada',
    categoryPrefix: 'Joylar',
    categoryRestaurant: 'Restoran',
    categoryCafe: 'Kafe',
    categoryCoffee: 'Qahvaxona',
    categoryKaraoke: 'Karaoke',
    categoryEntertainment: 'Ko‘ngilochar',
    categoryKids: 'Bolalar uchun',
    categoryBar: 'Bar',
    categoryClub: 'Klub',
    tagEat: 'Ovqatlanish',
    tagCoffee: 'Qahva',
    tagDate: 'Ikki kishilik',
    tagKids: 'Bolalar bilan',
    tagKaraoke: 'Karaoke',
    tagEntertainment: 'Ko‘ngilochar',
    tagNight: 'Tunda',
    tagToday: 'Bugun',
    currency: 'so‘m',
  },
}

const CATEGORY_KEYS = [
  ['🍽', 'eat'],
  ['☕', 'coffee'],
  ['❤️', 'date'],
  ['👨‍👩‍👧', 'kids'],
  ['🎤', 'karaoke'],
  ['🎮', 'entertainment'],
  ['🌙', 'night'],
  ['🎉', 'today'],
]

const TAG_ALIASES = {
  eat: ['Поесть', 'Ovqatlanish'],
  coffee: ['Кофе', 'Qahva'],
  date: ['Вдвоём', 'Ikki kishilik'],
  kids: ['С детьми', 'Bolalar bilan'],
  karaoke: ['Караоке', 'Karaoke'],
  entertainment: ['Развлечения', 'Ko‘ngilochar'],
  night: ['Ночью', 'Tunda'],
  today: ['Сегодня', 'Bugun'],
}

const TAG_TO_KEY = Object.entries(TAG_ALIASES).reduce((acc, [key, values]) => {
  values.forEach((value) => { acc[value] = key })
  return acc
}, {})

const CATEGORY_META = {
  restaurant: ['🍽', 'categoryRestaurant'],
  cafe: ['☕', 'categoryCafe'],
  coffee: ['☕', 'categoryCoffee'],
  karaoke: ['🎤', 'categoryKaraoke'],
  entertainment: ['🎮', 'categoryEntertainment'],
  kids: ['🎡', 'categoryKids'],
  bar: ['🍸', 'categoryBar'],
  club: ['🎵', 'categoryClub'],
}

const CATEGORY_LABEL_KEY = {
  eat: 'tagEat',
  coffee: 'tagCoffee',
  date: 'tagDate',
  kids: 'tagKids',
  karaoke: 'tagKaraoke',
  entertainment: 'tagEntertainment',
  night: 'tagNight',
  today: 'tagToday',
}

function initialLanguage() {
  const saved = window.localStorage.getItem('ferganaNowLanguage')
  if (saved === 'ru' || saved === 'uz') return saved

  const telegramLanguage = window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code || ''
  return telegramLanguage.toLowerCase().startsWith('uz') ? 'uz' : 'ru'
}

function localized(entity, field, lang) {
  if (!entity) return ''
  if (lang === 'uz' && entity[`${field}_uz`]) return entity[`${field}_uz`]
  return entity[field] || ''
}

function metaFor(category, t) {
  const meta = CATEGORY_META[category] || ['📍', null]
  return [meta[0], meta[1] ? t[meta[1]] : t.place]
}

function time(value) {
  return value ? value.slice(0, 5) : ''
}

function formatMoney(value, lang, t) {
  if (!value) return t.priceMissing
  const locale = lang === 'uz' ? 'uz-UZ' : 'ru-RU'
  return `${new Intl.NumberFormat(locale).format(value)} ${t.currency}`
}

function dtTime(value, lang) {
  if (!value) return ''
  const locale = lang === 'uz' ? 'uz-UZ' : 'ru-RU'
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function activityBadge(start, end, lang, t) {
  const now = Date.now()
  const s = start ? new Date(start).getTime() : 0
  const e = end ? new Date(end).getTime() : Infinity

  if (s > now) {
    const minutes = Math.max(1, Math.round((s - now) / 60000))
    if (minutes < 120) {
      return lang === 'uz'
        ? `${t.startsIn} ${minutes} ${t.min}`
        : `${t.startsIn} ${minutes} ${t.min}`
    }
    return `${t.at} ${dtTime(start, lang)}`
  }

  if (s <= now && e >= now) return t.happeningNow
  return t.todayBadge
}

function openExternal(url) {
  if (!url) return
  const tg = window.Telegram?.WebApp
  if (tg?.openLink && /^https?:/i.test(url)) {
    tg.openLink(url)
    return
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}

function normalizeInstagram(value) {
  if (!value) return null
  const trimmed = value.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  const username = trimmed
    .replace(/^@/, '')
    .replace(/^instagram\.com\//, '')
    .replace(/\/+$/, '')
  return `https://instagram.com/${username}`
}

function mapsUrl(place, lang) {
  if (place.latitude && place.longitude) {
    return `https://yandex.uz/maps/?ll=${place.longitude}%2C${place.latitude}&z=16&pt=${place.longitude}%2C${place.latitude}`
  }

  const query = [
    localized(place, 'name', lang),
    localized(place, 'address', lang),
    lang === 'uz' ? 'Farg‘ona' : 'Фергана',
  ].filter(Boolean).join(', ')

  return `https://yandex.uz/maps/?text=${encodeURIComponent(query)}`
}

function tagLabel(tag, t) {
  const key = TAG_TO_KEY[tag]
  return key ? t[CATEGORY_LABEL_KEY[key]] : tag
}

function LanguageSwitcher({ lang, onChange }) {
  return (
    <div className="language-switch" aria-label="Language">
      <button
        className={lang === 'ru' ? 'active' : ''}
        onClick={() => onChange('ru')}
      >
        RU
      </button>
      <button
        className={lang === 'uz' ? 'active' : ''}
        onClick={() => onChange('uz')}
      >
        UZ
      </button>
    </div>
  )
}

export default function App() {
  const [lang, setLang] = useState(initialLanguage)
  const [tab, setTab] = useState('now')
  const [category, setCategory] = useState(null)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [places, setPlaces] = useState([])
  const [events, setEvents] = useState([])
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const t = I18N[lang]

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.ready()
      tg.expand()
    }
    loadData()
  }, [])

  useEffect(() => {
    window.localStorage.setItem('ferganaNowLanguage', lang)
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (!tg?.BackButton) return

    if (selectedPlace) {
      tg.BackButton.show()
      const handler = () => setSelectedPlace(null)
      tg.BackButton.onClick(handler)
      return () => {
        tg.BackButton.offClick(handler)
        tg.BackButton.hide()
      }
    }

    tg.BackButton.hide()
  }, [selectedPlace])

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
    () => Object.fromEntries(places.map((place) => [place.id, place])),
    [places],
  )

  const filteredPlaces = useMemo(() => {
    if (!category) return places
    const aliases = TAG_ALIASES[category] || []
    return places.filter((place) => {
      const tags = Array.isArray(place.tags) ? place.tags : []
      return aliases.some((alias) => tags.includes(alias))
    })
  }, [places, category])

  const liveItems = useMemo(() => [
    ...events.map((event) => ({
      id: `event-${event.id}`,
      icon: '🎵',
      label: t.event,
      title: localized(event, 'title', lang),
      place: localized(placesById[event.place_id], 'name', lang) || t.city,
      placeId: event.place_id,
      meta: `${dtTime(event.starts_at, lang)}${event.ends_at ? `–${dtTime(event.ends_at, lang)}` : ''}`,
      badge: activityBadge(event.starts_at, event.ends_at, lang, t),
      note: localized(event, 'description', lang) || t.eventToday,
    })),
    ...offers.map((offer) => ({
      id: `offer-${offer.id}`,
      icon: '🔥',
      label: t.offer,
      title: localized(placesById[offer.place_id], 'name', lang) || t.city,
      place: localized(offer, 'title', lang),
      placeId: offer.place_id,
      meta: offer.ends_at ? `${t.until} ${dtTime(offer.ends_at, lang)}` : t.today,
      badge: offer.discount_percent ? `−${offer.discount_percent}%` : t.offer.toUpperCase(),
      note: localized(offer, 'description', lang) || localized(offer, 'title', lang),
    })),
  ].slice(0, 8), [events, offers, placesById, lang, t])

  function openPlace(placeOrId) {
    const place = typeof placeOrId === 'object'
      ? placeOrId
      : places.find((item) => item.id === placeOrId)

    if (place) {
      setSelectedPlace(place)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (selectedPlace) {
    return (
      <div className="app">
        <PlaceDetails
          place={selectedPlace}
          events={events.filter((event) => event.place_id === selectedPlace.id)}
          offers={offers.filter((offer) => offer.place_id === selectedPlace.id)}
          lang={lang}
          t={t}
          onLanguageChange={setLang}
          onBack={() => setSelectedPlace(null)}
        />
      </div>
    )
  }

  const categoryTitle = category
    ? `${t.categoryPrefix}: ${t[CATEGORY_LABEL_KEY[category]]}`
    : t.placesCity

  return (
    <div className="app">
      <header className="header">
        <div>
          <div className="logo">FERGANA <span>NOW</span></div>
          <div className="caption">{t.subtitle}</div>
        </div>

        <div className="header-controls">
          <LanguageSwitcher lang={lang} onChange={setLang} />
          <button className="location">📍 {t.city}</button>
        </div>
      </header>

      <main className="main">
        {tab === 'now' && (
          <>
            <section className="hero">
              <div className="eyebrow">{t.nowEyebrow}</div>
              <h1>{t.heroTitle}</h1>
              <p>{t.heroText}</p>
              <button className="primary" onClick={() => setTab('pick')}>
                {t.pickMe}
              </button>
            </section>

            {error && (
              <section className="result">
                <div className="eyebrow">{t.error}</div>
                <h2>{t.loadFailed}</h2>
                <p>{error}</p>
                <button className="primary" onClick={loadData}>{t.retry}</button>
              </section>
            )}

            <section>
              <div className="section-head">
                <h2>{t.mood}</h2>
                {category && (
                  <button className="text-button" onClick={() => setCategory(null)}>
                    {t.reset}
                  </button>
                )}
              </div>

              <div className="category-grid">
                {CATEGORY_KEYS.map(([icon, key]) => (
                  <button
                    key={key}
                    className={`category ${category === key ? 'selected' : ''}`}
                    onClick={() => setCategory(key)}
                  >
                    <span>{icon}</span>
                    <strong>{t[CATEGORY_LABEL_KEY[key]]}</strong>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="section-head">
                <h2>{t.interesting}</h2>
                <button className="text-button" onClick={loadData}>{t.refresh}</button>
              </div>

              {loading ? (
                <div className="muted">{t.loading}</div>
              ) : liveItems.length ? (
                <div className="live-row">
                  {liveItems.map((item) => (
                    <article className="live-card" key={item.id}>
                      <div className="live-top">
                        <span>{item.icon} {item.label}</span>
                        <b>{item.badge}</b>
                      </div>
                      <h3>{item.title}</h3>
                      <div className="muted">{item.place}</div>
                      <div className="muted">{item.meta}</div>
                      <div className="live-note">● {item.note}</div>
                      <div className="card-actions">
                        <button onClick={() => openPlace(item.placeId)}>{t.details}</button>
                        <button
                          className="ghost"
                          onClick={() => {
                            const place = placesById[item.placeId]
                            if (place) openExternal(mapsUrl(place, lang))
                          }}
                        >
                          {t.route}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="muted">{t.noLive}</div>
              )}
            </section>

            <section>
              <div className="section-head">
                <h2>{categoryTitle}</h2>
                <button className="text-button" onClick={() => setTab('places')}>
                  {t.allPlaces}
                </button>
              </div>

              {loading ? (
                <div className="muted">{t.loading}</div>
              ) : (
                <div className="place-list">
                  {filteredPlaces.map((place) => (
                    <PlaceRow
                      key={place.id}
                      place={place}
                      lang={lang}
                      t={t}
                      onClick={() => openPlace(place)}
                    />
                  ))}

                  {!filteredPlaces.length && !error && (
                    <div className="muted">{t.noCategoryPlaces}</div>
                  )}
                </div>
              )}
            </section>
          </>
        )}

        {tab === 'places' && (
          <Places
            places={places}
            loading={loading}
            lang={lang}
            t={t}
            onOpen={openPlace}
          />
        )}

        {tab === 'today' && (
          <Today
            events={events}
            placesById={placesById}
            lang={lang}
            t={t}
            onOpen={openPlace}
          />
        )}

        {tab === 'pick' && (
          <Picker
            places={places}
            lang={lang}
            t={t}
            onOpen={openPlace}
          />
        )}

        {tab === 'profile' && (
          <Placeholder
            icon="👤"
            title={t.profile}
            text={t.profileText}
            badge={t.nextStage}
          />
        )}
      </main>

      <nav className="bottom-nav">
        <Nav icon="⚡" label={t.navNow} active={tab === 'now'} onClick={() => setTab('now')} />
        <Nav icon="📍" label={t.navPlaces} active={tab === 'places'} onClick={() => setTab('places')} />
        <Nav icon="🎉" label={t.navToday} active={tab === 'today'} onClick={() => setTab('today')} />
        <Nav icon="🎲" label={t.navPick} active={tab === 'pick'} onClick={() => setTab('pick')} />
        <Nav icon="👤" label={t.navProfile} active={tab === 'profile'} onClick={() => setTab('profile')} />
      </nav>
    </div>
  )
}

function PlaceRow({ place, lang, t, onClick }) {
  const [icon, label] = metaFor(place.category, t)

  return (
    <button className="place place-button" onClick={onClick}>
      <div className="place-icon">{icon}</div>

      <div className="place-body">
        <h3>{localized(place, 'name', lang)}</h3>
        <div className="muted">{localized(place, 'description', lang) || label}</div>

        <div className="place-meta">
          <span>
            🕐 {place.close_time
              ? `${t.until} ${time(place.close_time)}`
              : t.schedulePending}
          </span>
          <span>📍 {localized(place, 'address', lang) || t.city}</span>
          <span>💰 {formatMoney(place.average_check, lang, t)}</span>
        </div>
      </div>

      <span className="arrow">›</span>
    </button>
  )
}

function PlaceDetails({ place, events, offers, lang, t, onLanguageChange, onBack }) {
  const [icon, label] = metaFor(place.category, t)
  const instagramUrl = normalizeInstagram(place.instagram)
  const tags = Array.isArray(place.tags) ? place.tags : []
  const placeName = localized(place, 'name', lang)

  return (
    <>
      <header className="detail-header">
        <button className="back-button" onClick={onBack}>‹</button>

        <div className="detail-header-copy">
          <div className="detail-header-title">{placeName}</div>
          <div className="caption">{label}</div>
        </div>

        <LanguageSwitcher lang={lang} onChange={onLanguageChange} />
      </header>

      <main className="detail-main">
        <section
          className={`place-hero ${place.image_url ? 'with-image' : ''}`}
          style={place.image_url ? { backgroundImage: `url("${place.image_url}")` } : undefined}
        >
          {!place.image_url && <div className="place-hero-icon">{icon}</div>}

          <div className="place-hero-overlay">
            <div className="eyebrow">FERGANA NOW</div>
            <h1>{placeName}</h1>

            <div className="hero-meta">
              <span>📍 {localized(place, 'address', lang) || t.city}</span>
              <span>💰 {formatMoney(place.average_check, lang, t)}</span>
            </div>
          </div>
        </section>

        <div className="detail-actions">
          <button className="primary" onClick={() => openExternal(mapsUrl(place, lang))}>
            🧭 {t.route}
          </button>

          {place.phone && (
            <button
              className="secondary-action"
              onClick={() => { window.location.href = `tel:${place.phone}` }}
            >
              {t.call}
            </button>
          )}
        </div>

        {tags.length > 0 && (
          <div className="tag-row">
            {tags.map((tag) => (
              <span className="detail-tag" key={tag}>{tagLabel(tag, t)}</span>
            ))}
          </div>
        )}

        <section className="detail-section">
          <h2>{t.about}</h2>

          <p className="detail-description">
            {localized(place, 'description', lang) || t.noDescription}
          </p>

          <div className="info-list">
            <div className="info-row">
              <span>🕐 {t.schedule}</span>
              <strong>
                {place.open_time && place.close_time
                  ? `${time(place.open_time)}–${time(place.close_time)}`
                  : t.schedulePending}
              </strong>
            </div>

            <div className="info-row">
              <span>💰 {t.averageCheck}</span>
              <strong>{formatMoney(place.average_check, lang, t)}</strong>
            </div>

            <div className="info-row">
              <span>📍 {t.address}</span>
              <strong>{localized(place, 'address', lang) || t.city}</strong>
            </div>

            {place.phone && (
              <div className="info-row">
                <span>📞 {t.phone}</span>
                <strong>{place.phone}</strong>
              </div>
            )}
          </div>
        </section>

        {offers.length > 0 && (
          <section className="detail-section">
            <div className="section-head compact">
              <h2>{t.offersNow}</h2>
            </div>

            <div className="detail-list">
              {offers.map((offer) => (
                <article className="detail-card" key={offer.id}>
                  <div className="detail-card-top">
                    <strong>{localized(offer, 'title', lang)}</strong>

                    {offer.discount_percent && (
                      <span className="offer-badge">−{offer.discount_percent}%</span>
                    )}
                  </div>

                  <p>{localized(offer, 'description', lang) || t.specialOffer}</p>

                  {offer.ends_at && (
                    <div className="muted">
                      {t.until} {dtTime(offer.ends_at, lang)}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {events.length > 0 && (
          <section className="detail-section">
            <div className="section-head compact">
              <h2>{t.eventsHere}</h2>
            </div>

            <div className="detail-list">
              {events.map((event) => (
                <article className="detail-card" key={event.id}>
                  <div className="detail-card-top">
                    <strong>{localized(event, 'title', lang)}</strong>
                    <span className="event-time">{dtTime(event.starts_at, lang)}</span>
                  </div>

                  <p>{localized(event, 'description', lang) || t.eventToday}</p>

                  <div className="muted">
                    {event.price === 0
                      ? t.free
                      : formatMoney(event.price, lang, t)}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="detail-section">
          <h2>{t.contact}</h2>

          <div className="contact-buttons">
            {place.phone && (
              <button
                className="contact-button"
                onClick={() => { window.location.href = `tel:${place.phone}` }}
              >
                {t.call}
              </button>
            )}

            {instagramUrl && (
              <button
                className="contact-button"
                onClick={() => openExternal(instagramUrl)}
              >
                {t.instagram}
              </button>
            )}

            <button
              className="contact-button"
              onClick={() => openExternal(mapsUrl(place, lang))}
            >
              {t.onMap}
            </button>
          </div>
        </section>
      </main>
    </>
  )
}

function Places({ places, loading, lang, t, onOpen }) {
  return (
    <section className="picker">
      <div className="placeholder-icon">📍</div>
      <h1>{t.places}</h1>
      <p>{t.placesDescription}</p>

      {loading ? (
        <div className="muted">{t.loading}</div>
      ) : (
        <div className="place-list">
          {places.map((place) => (
            <PlaceRow
              key={place.id}
              place={place}
              lang={lang}
              t={t}
              onClick={() => onOpen(place)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function Today({ events, placesById, lang, t, onOpen }) {
  return (
    <section className="picker">
      <div className="placeholder-icon">🎉</div>
      <h1>{t.todayTitle}</h1>
      <p>{t.todayDescription}</p>

      <div className="place-list">
        {events.map((event) => (
          <button
            className="place place-button"
            key={event.id}
            onClick={() => onOpen(event.place_id)}
          >
            <div className="place-icon">🎵</div>

            <div className="place-body">
              <h3>{localized(event, 'title', lang)}</h3>
              <div className="muted">
                {localized(placesById[event.place_id], 'name', lang) || t.city}
              </div>

              <div className="place-meta">
                <span>🕐 {dtTime(event.starts_at, lang)}</span>
                {event.price === 0 && <span>🎟 {t.free}</span>}
              </div>
            </div>

            <span className="arrow">›</span>
          </button>
        ))}

        {!events.length && <div className="muted">{t.noEvents}</div>}
      </div>
    </section>
  )
}

function Nav({ icon, label, active, onClick }) {
  return (
    <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      <span>{icon}</span>
      <small>{label}</small>
    </button>
  )
}

function Placeholder({ icon, title, text, badge }) {
  return (
    <section className="placeholder">
      <div className="placeholder-icon">{icon}</div>
      <h1>{title}</h1>
      <p>{text}</p>
      <div className="pill">{badge}</div>
    </section>
  )
}

function Picker({ places, lang, t, onOpen }) {
  const [company, setCompany] = useState('two')
  const [budget, setBudget] = useState('budget2')
  const [result, setResult] = useState(null)

  const companyLabels = {
    one: t.one,
    two: t.two,
    friends: t.friends,
    children: t.children,
  }

  const budgetLabels = {
    budget1: t.budget1,
    budget2: t.budget2,
    budget3: t.budget3,
  }

  function choose() {
    if (!places.length) {
      setResult(null)
      return
    }

    const place = places[Math.floor(Math.random() * places.length)]
    setResult(place)
  }

  return (
    <section className="picker">
      <div className="placeholder-icon">🎲</div>
      <h1>{t.decideTitle}</h1>
      <p>{t.decideText}</p>

      <h3>{t.who}</h3>
      <div className="chips">
        {Object.entries(companyLabels).map(([key, label]) => (
          <button
            key={key}
            className={`chip ${company === key ? 'active' : ''}`}
            onClick={() => setCompany(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <h3>{t.budget}</h3>
      <div className="chips">
        {Object.entries(budgetLabels).map(([key, label]) => (
          <button
            key={key}
            className={`chip ${budget === key ? 'active' : ''}`}
            onClick={() => setBudget(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <button className="primary full" onClick={choose}>{t.choose}</button>

      {result && (
        <button className="result result-button" onClick={() => onOpen(result)}>
          <div className="eyebrow">{t.yourChoice}</div>
          <h2>{localized(result, 'name', lang)}</h2>
          <p>{localized(result, 'description', lang) || metaFor(result.category, t)[1]}</p>
          <strong>{formatMoney(result.average_check, lang, t)}</strong>
          <div className="muted">
            {t.choiceFor}: {companyLabels[company]} • {t.budget.toLowerCase()}: {budgetLabels[budget]}
          </div>
          <div className="result-link">{t.openPlace}</div>
        </button>
      )}
    </section>
  )
}
