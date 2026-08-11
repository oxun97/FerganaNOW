FERGANA NOW — MVP 1.0 FULL
Создатель: Oxun.M — https://t.me/oxun_uz
Telegram Mini App: @fergananow_bot
Production: https://fergana-now.vercel.app

ЭТО ПОЛНЫЙ ПРОЕКТ. Больше не нужно собирать предыдущие архивы по кускам.

ЧТО УЖЕ ЕСТЬ В ЭТОЙ ВЕРСИИ
- RU / UZ, язык запоминается, UZ выбирается автоматически для узбекского Telegram;
- главная «Сейчас»;
- реальная загрузка places / events / offers из Supabase;
- «Открыто сейчас» с учётом ночного графика вроде 16:00–04:00;
- геолокация и расстояние до заведений;
- реальные фото через places.image_url и public Storage bucket rasmlar;
- поиск по названию / описанию / адресу / тегам;
- фильтры по категориям, бюджету и «только открытые»;
- сортировка «подходящие / ближе / дешевле»;
- карточка заведения: фото, адрес, телефон, Instagram, карта, средний чек, акции, события;
- «Сегодня»: сейчас / позже / все события + активные акции;
- «Реши за меня»: компания + бюджет + интерес + открытость + расстояние;
- избранное;
- история просмотренных мест;
- Telegram-профиль (имя / username / фото, если Mini App открыт внутри Telegram);
- deep-link конкретного места через @fergananow_bot?startapp=place_ID;
- кнопка «Поделиться»;
- автор Oxun.M + кнопка Telegram @oxun_uz;
- optional Supabase-синхронизация избранного через anonymous Auth; по умолчанию выключена, а избранное и история надёжно работают локально.

КАК ЗАМЕНИТЬ ПРОЕКТ ОДИН РАЗ
1. Останови Vite клавишами Ctrl+C.
2. Распакуй содержимое этого архива ВНУТРЬ:
   C:\Users\admin_pc\Desktop\FerganaNOW
   с заменой файлов.
   Папку .git НЕ удаляй.
3. В терминале из папки FerganaNOW выполни:
   npm install
4. Supabase → SQL Editor → New query.
   Открой файл supabase/mvp_1_0.sql, скопируй весь текст → Run.
5. Необязательно, но для Supabase sync избранного:
   Supabase → Authentication → Providers / Sign In → Anonymous Sign-Ins → Enable.
   Если не включать — избранное и история всё равно работают через localStorage.
6. Запусти локально:
   npm run dev -- --host 127.0.0.1 --port 5173
7. Открой:
   http://127.0.0.1:5173/
8. Проверь вкладки Сейчас / Места / Сегодня / Куда пойти / Профиль.
9. Если всё нормально:
   git add .
   git commit -m "Fergana NOW MVP 1.0"
   git push
10. Vercel автоматически соберёт production.

SUPABASE / ФОТО
- bucket: rasmlar
- places.image_url может быть:
  a) полный public https URL;
  b) просто имя файла, например wGarden.webp.
  Если указано только имя, приложение само строит URL bucket rasmlar.

ENV
Проект использует Vercel env:
- VITE_SUPABASE_URL
- VITE_SUPABASE_PUBLISHABLE_KEY
Но сохранён fallback на текущий public Supabase URL + sb_publishable_ ключ, поэтому production не должен снова падать пустой страницей из-за отсутствующей VITE переменной.
Никогда не вставлять secret/service_role ключ в frontend.

ВАЖНО ПРО TELEGRAM USER
Имя / username / photo_url из Telegram используются только для отображения в интерфейсе.
Для защищённых серверных действий initDataUnsafe нельзя считать доказательством личности — это потребуется валидировать на backend, когда будем строить кабинет бизнеса / платежи / настоящую account-синхронизацию.

СЛЕДУЮЩИЙ БОЛЬШОЙ ЭТАП ПОСЛЕ MVP 1.0
Отдельный кабинет бизнеса + модерация:
- заявка на добавление заведения;
- владелец редактирует карточку;
- загружает фото;
- создаёт акции и события;
- «есть места сейчас»;
- модерация Oxun.M;
- платное продвижение / поднятие / featured-размещения.


НАДЁЖНОСТЬ
- Добавлен Error Boundary: при runtime-ошибке приложение показывает понятный экран вместо пустой страницы.
- Supabase URL и publishable key имеют frontend-fallback, поэтому отсутствие Vercel env не должно снова ломать production.
- Cloud Sync по умолчанию выключен: включай только когда понадобится.
