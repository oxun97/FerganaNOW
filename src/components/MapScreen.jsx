import { useEffect, useRef } from 'react'

export default function MapScreen({ places, lang, t, userLocation, locationState, onRequestLocation, onOpenPlace }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const userMarkerRef = useRef(null)

  // Auto request location when entering map if not already active
  useEffect(() => {
    if (locationState === 'idle') {
      onRequestLocation()
    }
  }, [locationState, onRequestLocation])

  useEffect(() => {
    if (!mapRef.current) return

    const ymaps = window.ymaps
    if (!ymaps) return

    ymaps.ready(() => {
      if (mapInstance.current) return

      // Initial center: user if known, else Fergana
      const center = userLocation
        ? [userLocation.latitude, userLocation.longitude]
        : [40.3833, 71.7833]

      mapInstance.current = new ymaps.Map(mapRef.current, {
        center: center,
        zoom: 15,
        controls: ['zoomControl', 'geolocationControl']
      })

      // Add places
      places.forEach(place => {
        if (place.latitude && place.longitude) {
          const placemark = new ymaps.Placemark([place.latitude, place.longitude], {
            balloonContentHeader: `<b style="color:#000">${place.name || ''}</b>`,
            balloonContentBody: `
              <div style="color:#333; font-family: sans-serif;">
                <p>${place.address || ''}</p>
                <button id="map-btn-${place.id}" style="
                  background: #77ffac;
                  border: none;
                  padding: 10px;
                  border-radius: 10px;
                  font-weight: bold;
                  width: 100%;
                  color: #000;
                ">Подробнее</button>
              </div>
            `
          }, {
            preset: 'islands#greenDotIcon'
          })

          mapInstance.current.geoObjects.add(placemark)

          placemark.events.add('balloonopen', () => {
            const btn = document.getElementById(`map-btn-${place.id}`)
            if (btn) btn.onclick = () => onOpenPlace(place.id)
          })
        }
      })
    })

    return () => {
      if (mapInstance.current) {
        // We don't destroy immediately to avoid flickering on tab switch if possible,
        // but for safety in React strict mode:
        mapInstance.current.destroy()
        mapInstance.current = null
      }
    }
  }, [places, t, onOpenPlace])

  // Update user marker and pan when location changes
  useEffect(() => {
    const ymaps = window.ymaps
    if (!ymaps || !mapInstance.current || !userLocation) return

    if (userMarkerRef.current) {
      userMarkerRef.current.geometry.setCoordinates([userLocation.latitude, userLocation.longitude])
    } else {
      userMarkerRef.current = new ymaps.Placemark([userLocation.latitude, userLocation.longitude], {
        hintContent: 'Вы здесь'
      }, {
        preset: 'islands#blueCircleDotIconWithOutline'
      })
      mapInstance.current.geoObjects.add(userMarkerRef.current)
    }

    // Smooth pan to user
    mapInstance.current.panTo([userLocation.latitude, userLocation.longitude], {
      flying: true,
      duration: 1000
    })
  }, [userLocation])

  return (
    <section className="screen-section no-padding full-height">
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: 'calc(100vh - 155px)',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: '#1a1d21'
        }}
      />
    </section>
  )
}
