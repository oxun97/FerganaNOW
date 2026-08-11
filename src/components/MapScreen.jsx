import { useEffect, useRef } from 'react'

export default function MapScreen({ places, lang, t, userLocation, onOpenPlace }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Wait for Yandex Maps API to be ready
    const ymaps = window.ymaps
    if (!ymaps) {
      console.error('Yandex Maps API not found')
      return
    }

    ymaps.ready(() => {
      if (mapInstance.current) {
        mapInstance.current.destroy()
      }

      // Fergana center
      const center = userLocation
        ? [userLocation.latitude, userLocation.longitude]
        : [40.3833, 71.7833]

      mapInstance.current = new ymaps.Map(mapRef.current, {
        center: center,
        zoom: 14,
        controls: ['zoomControl', 'geolocationControl']
      }, {
        searchControlProvider: 'yandex#search'
      })

      // Add places markers
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
                  padding: 8px 12px;
                  border-radius: 8px;
                  font-weight: bold;
                  cursor: pointer;
                  width: 100%;
                  color: #000;
                ">${t.details}</button>
              </div>
            `,
            hintContent: place.name
          }, {
            preset: 'islands#greenDotIcon'
          })

          mapInstance.current.geoObjects.add(placemark)

          // Handle button click inside balloon
          placemark.events.add('balloonopen', () => {
            const btn = document.getElementById(`map-btn-${place.id}`)
            if (btn) {
              btn.onclick = () => onOpenPlace(place.id)
            }
          })
        }
      })

      // Add user location marker
      if (userLocation) {
        const userMark = new ymaps.Placemark([userLocation.latitude, userLocation.longitude], {
          hintContent: t.locationActive
        }, {
          preset: 'islands#blueCircleDotIconWithOutline'
        })
        mapInstance.current.geoObjects.add(userMark)
      }
    })

    return () => {
      if (mapInstance.current && typeof mapInstance.current.destroy === 'function') {
        mapInstance.current.destroy()
        mapInstance.current = null
      }
    }
  }, [places, userLocation, t, onOpenPlace])

  return (
    <section className="screen-section no-padding full-height">
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: 'calc(100vh - 160px)',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: '#1a1d21'
        }}
      />
    </section>
  )
}
