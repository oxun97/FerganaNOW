FERGANA NOW — RU + UZ

Что добавлено:
- переключатель RU / UZ в верхней части приложения;
- язык запоминается на устройстве;
- для Telegram-пользователей с языком uz при первом запуске автоматически выбирается UZ;
- переведены главная, навигация, карточка места, акции, события, «Реши за меня»;
- добавлены *_uz поля для контента Supabase;
- если узбекский перевод для конкретного места ещё не заполнен, приложение автоматически показывает русский текст.

Установка:
1. Останови Vite клавишами Ctrl+C.
2. Замени:
   src/App.jsx
   src/App.css
3. Supabase → SQL Editor → вставь содержимое add_uzbek_language.sql → Run.
4. Запусти:
   npm run dev -- --host 127.0.0.1 --port 5173
5. Проверь переключатель RU / UZ.
6. Если всё работает:
   git add .
   git commit -m "Add Uzbek language"
   git push

Для новых заведений в Supabase заполняй:
places:
- name — русский
- name_uz — узбекский
- description — русский
- description_uz — узбекский
- address — русский
- address_uz — узбекский

events:
- title / title_uz
- description / description_uz

offers:
- title / title_uz
- description / description_uz
