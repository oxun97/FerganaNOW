# Комплексное обновление Fergana NOW (MVP 2.0)

Этот план описывает процесс внедрения всех предложенных улучшений: от визуальных эффектов загрузки до системы добавления заведений и интерактивной карты.

## Proposed Changes

### [Component] UI/UX: Skeleton Loaders & Animations
Добавление эффекта плавной загрузки вместо текстовых индикаторов.

#### [NEW] [Skeleton.jsx](file:///C:/Users/admin_pc/Desktop/FerganaNOW/src/components/Skeleton.jsx)
Создание универсального компонента для анимации загрузки.
#### [MODIFY] [HomeScreen.jsx](file:///C:/Users/admin_pc/Desktop/FerganaNOW/src/components/HomeScreen.jsx)
#### [MODIFY] [PlacesScreen.jsx](file:///C:/Users/admin_pc/Desktop/FerganaNOW/src/components/PlacesScreen.jsx)
#### [MODIFY] [App.css](file:///C:/Users/admin_pc/Desktop/FerganaNOW/src/App.css)
Добавление ключевых кадров анимации (`@keyframes shimmer`).

---

### [Component] B2B: Система заявок на добавление мест
Позволит владельцам бизнеса самостоятельно предлагать контент.

#### [NEW] [AddPlaceScreen.jsx](file:///C:/Users/admin_pc/Desktop/FerganaNOW/src/components/AddPlaceScreen.jsx)
Экран с формой отправки данных в Supabase.
#### [MODIFY] [supabase/schema.sql](file:///C:/Users/admin_pc/Desktop/FerganaNOW/supabase/schema.sql)
SQL-запрос на создание таблицы `place_requests` и настройку политик доступа.
#### [MODIFY] [ProfileScreen.jsx](file:///C:/Users/admin_pc/Desktop/FerganaNOW/src/components/ProfileScreen.jsx)
Добавление кнопки перехода к форме.

---

### [Component] Navigation: Интерактивная карта
Визуализация всех заведений на карте города.

#### [NEW] [MapScreen.jsx](file:///C:/Users/admin_pc/Desktop/FerganaNOW/src/components/MapScreen.jsx)
Интеграция с библиотекой карт (например, Leaflet или Yandex Maps).
#### [MODIFY] [App.jsx](file:///C:/Users/admin_pc/Desktop/FerganaNOW/src/App.jsx)
Добавление новой вкладки "Карта" в основную навигацию.
#### [MODIFY] [BottomNav.jsx](file:///C:/Users/admin_pc/Desktop/FerganaNOW/src/components/BottomNav.jsx)

---

### [Component] Social: Рейтинги и отзывы (MVP версия)
Базовая возможность оставлять оценки.

#### [MODIFY] [PlaceDetails.jsx](file:///C:/Users/admin_pc/Desktop/FerganaNOW/src/components/PlaceDetails.jsx)
Отображение рейтинга и списка отзывов.
#### [MODIFY] [supabase/schema.sql](file:///C:/Users/admin_pc/Desktop/FerganaNOW/supabase/schema.sql)
Создание таблицы `reviews`.

## User Review Required

> [!IMPORTANT]
> Интеграция полноценных карт (Leaflet/Yandex) может увеличить вес приложения. Если критичен моментальный запуск в слабом Telegram, можно ограничиться ссылками на внешние карты, но в плане заложена полноценная интерактивная карта.

> [!WARNING]
> Для работы формы добавления заведений в Supabase потребуется создать новую таблицу. Я подготовлю SQL-скрипт, который нужно будет запустить в SQL Editor.

## Verification Plan

### Automated Tests
- Проверка загрузки данных через консоль (логирование).
- Тестирование отправки формы "Add Place" (проверка записи в БД).

### Manual Verification
- Визуальная проверка Skeleton-эффектов при медленном интернете (Network throttling в Chrome).
- Проверка работы переключателя вкладок с учетом новой кнопки "Карта".
