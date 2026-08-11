import { useEffect, useMemo, useRef, useState } from 'react'
import Header from './components/Header.jsx'
import BottomNav from './components/BottomNav.jsx'
import HomeScreen from './components/HomeScreen.jsx'
import PlacesScreen from './components/PlacesScreen.jsx'
import TodayScreen from './components/TodayScreen.jsx'
import PickerScreen from './components/PickerScreen.jsx'
import ProfileScreen from './components/ProfileScreen.jsx'
import PlaceDetails from './components/PlaceDetails.jsx'
import AddPlaceScreen from './components/AddPlaceScreen.jsx'
import MapScreen from './components/MapScreen.jsx'
import AdminScreen from './components/AdminScreen.jsx'
import { I18N } from './lib/i18n.js'
import { readLanguage, readList, writeList } from './lib/storage.js'
import { getStartParam, getTelegramUser, getTelegramWebApp, initTelegram } from './lib/telegram.js'
import { supabase } from './lib/supabase.js'
import { ensureCloudUser, getCloudFavorites, pushHistory, setCloudFavorite } from './services/cloudSync.js'

const FAVORITES_KEY = 'ferganaNowFavorites'
const HISTORY_KEY = 'ferganaNowHistory'

export default function App() {
  const [lang, setLang] = useState(readLanguage)
  const [tab, setTab] = useState('home')
  const [places, setPlaces] = useState([])
  const [events, setEvents] = useState([])
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPlaceId, setSelectedPlaceId] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [locationState, setLocationState] = useState('idle')
  const [favoriteIds, setFavoriteIds] = useState(() => readList(FAVORITES_KEY))
  const [historyIds, setHistoryIds] = useState(() => readList(HISTORY_KEY))
  const [cloudUserId, setCloudUserId] = useState(null)
  const [placesPreset, setPlacesPreset] = useState({ category: null, version: 0 })
  const startHandled = useRef(false)

  const t = I18N[lang]
  const telegramUser = getTelegramUser()

  const placesById = useMemo(
    () => Object.fromEntries(places.map((place) => [String(place.id), place])),
    [places],
  )

  const selectedPlace = selectedPlaceId ? placesById[String(selectedPlaceId)] : null

  useEffect(() => {
    initTelegram()
    loadData()

    let cancelled = false
    ensureCloudUser().then(async (user) => {
      if (cancelled || !user) return
      setCloudUserId(user.id)
      const cloudFavorites = await getCloudFavorites(user.id)
      if (cancelled) return
      setFavoriteIds((current) => [...new Set([...current, ...cloudFavorites])])
    })

    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    window.localStorage.setItem('ferganaNowLanguage', lang)
  }, [lang])

  useEffect(() => writeList(FAVORITES_KEY, favoriteIds), [favoriteIds])
  useEffect(() => writeList(HISTORY_KEY, historyIds), [historyIds])

  useEffect(() => {
    const tg = getTelegramWebApp()
    if (!tg?.BackButton) return

    if (selectedPlace) {
      tg.BackButton.show()
      const handler = () => setSelectedPlaceId(null)
      tg.BackButton.onClick(handler)
      return () => {
        tg.BackButton.offClick(handler)
        tg.BackButton.hide()
      }
    }

    tg.BackButton.hide()
  }, [selectedPlace])

  useEffect(() => {
    if (startHandled.current || !places.length) return
    const startParam = getStartParam()
    const match = startParam?.match(/^place_(\d+)$/)
    if (!match) {
      startHandled.current = true
      return
    }
    const id = match[1]
    if (placesById[id]) {
      startHandled.current = true
      openPlace(id)
    }
  }, [places, placesById])

  async function loadData() {
    setLoading(true)
    setError('')
    const [placeResult, eventResult, offerResult] = await Promise.all([
      supabase.from('places').select('*').eq('is_active', true).order('id'),
      supabase.from('events').select('*').eq('is_active', true).order('starts_at'),
      supabase.from('offers').select('*').eq('is_active', true).order('starts_at'),
    ])

    const firstError = placeResult.error || eventResult.error || offerResult.error
    if (firstError) {
      console.error('Supabase Error:', firstError)
      setError(firstError.message)
    } else {
      console.log('Successfully loaded from Supabase:', {
        places: placeResult.data?.length,
        events: eventResult.data?.length,
        offers: offerResult.data?.length
      })
      setPlaces(placeResult.data || [])
      setEvents(eventResult.data || [])
      setOffers(offerResult.data || [])
    }
    setLoading(false)
  }

  function requestLocation() {
    if (!navigator.geolocation) {
      setLocationState('denied')
      return
    }
    setLocationState('loading')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setLocationState('active')
      },
      () => setLocationState('denied'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    )
  }

  function isFavorite(placeId) {
    return favoriteIds.includes(String(placeId))
  }

  function toggleFavorite(placeId) {
    const id = String(placeId)
    const enabled = !favoriteIds.includes(id)
    setFavoriteIds((current) => enabled
      ? [...new Set([...current, id])]
      : current.filter((item) => item !== id))
    if (cloudUserId) setCloudFavorite(cloudUserId, id, enabled)
  }

  function openPlace(placeOrId) {
    const id = String(typeof placeOrId === 'object' ? placeOrId.id : placeOrId)
    if (!placesById[id]) return
    setSelectedPlaceId(id)
    setHistoryIds((current) => [id, ...current.filter((item) => item !== id)].slice(0, 20))
    if (cloudUserId) pushHistory(cloudUserId, id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function browseCategory(category) {
    setPlacesPreset({ category, version: Date.now() })
    setTab('places')
  }

  function switchTab(nextTab) {
    setSelectedPlaceId(null)
    setTab(nextTab)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const selectedEvents = selectedPlace
    ? events.filter((event) => String(event.place_id) === String(selectedPlace.id))
    : []
  const selectedOffers = selectedPlace
    ? offers.filter((offer) => String(offer.place_id) === String(selectedPlace.id))
    : []

  if (selectedPlace) {
    return (
      <div className="app">
        <PlaceDetails
          place={selectedPlace}
          events={selectedEvents}
          offers={selectedOffers}
          lang={lang}
          t={t}
          userLocation={userLocation}
          favorite={isFavorite(selectedPlace.id)}
          onFavorite={() => toggleFavorite(selectedPlace.id)}
          onBack={() => setSelectedPlaceId(null)}
        />
      </div>
    )
  }

  return (
    <div className="app">
      <Header lang={lang} t={t} onLanguageChange={setLang} />

      <main className="main">
        {error && (
          <div className="error-card">
            <strong>{t.error}</strong>
            <span>{error}</span>
            <button className="small-button" onClick={loadData}>{t.retry}</button>
          </div>
        )}

        {tab === 'home' && (
          <HomeScreen
            places={places}
            events={events}
            offers={offers}
            placesById={placesById}
            lang={lang}
            t={t}
            loading={loading}
            userLocation={userLocation}
            locationState={locationState}
            onRequestLocation={requestLocation}
            isFavorite={isFavorite}
            onFavorite={toggleFavorite}
            onOpenPlace={openPlace}
            onBrowseCategory={browseCategory}
            onOpenPlaces={() => switchTab('places')}
            onOpenPicker={() => switchTab('pick')}
            onReload={loadData}
          />
        )}

        {tab === 'places' && (
          <PlacesScreen
            places={places}
            lang={lang}
            t={t}
            loading={loading}
            userLocation={userLocation}
            locationState={locationState}
            onRequestLocation={requestLocation}
            presetCategory={placesPreset.category}
            presetVersion={placesPreset.version}
            isFavorite={isFavorite}
            onFavorite={toggleFavorite}
            onOpenPlace={openPlace}
          />
        )}

        {tab === 'map' && (
          <MapScreen
            places={places}
            lang={lang}
            t={t}
            userLocation={userLocation}
            onOpenPlace={openPlace}
          />
        )}

        {tab === 'today' && (
          <TodayScreen
            events={events}
            offers={offers}
            placesById={placesById}
            lang={lang}
            t={t}
            onOpenPlace={openPlace}
          />
        )}

        {tab === 'pick' && (
          <PickerScreen
            places={places}
            lang={lang}
            t={t}
            userLocation={userLocation}
            onRequestLocation={requestLocation}
            onOpenPlace={openPlace}
          />
        )}

        {tab === 'profile' && (
          <ProfileScreen
            telegramUser={telegramUser}
            placesById={placesById}
            favoriteIds={favoriteIds}
            historyIds={historyIds}
            lang={lang}
            t={t}
            userLocation={userLocation}
            cloudEnabled={Boolean(cloudUserId)}
            onFavorite={toggleFavorite}
            onOpenPlace={openPlace}
            onOpenAddPlace={() => setTab('add-place')}
            onOpenAdmin={() => setTab('admin')}
          />
        )}

        {tab === 'add-place' && (
          <AddPlaceScreen
            lang={lang}
            t={t}
            onBack={() => setTab('profile')}
          />
        )}

        {tab === 'admin' && (
          <AdminScreen
            lang={lang}
            t={t}
            onBack={() => setTab('profile')}
          />
        )}
      </main>

      <BottomNav tab={tab} t={t} onChange={switchTab} />
    </div>
  )
}
