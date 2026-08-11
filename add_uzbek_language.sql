-- Fergana NOW: Russian + Uzbek content fields
-- Выполнить один раз в Supabase → SQL Editor.

alter table public.places
  add column if not exists name_uz text,
  add column if not exists description_uz text,
  add column if not exists address_uz text,
  add column if not exists image_url text;

alter table public.events
  add column if not exists title_uz text,
  add column if not exists description_uz text;

alter table public.offers
  add column if not exists title_uz text,
  add column if not exists description_uz text;

-- Узбекские переводы для текущих тестовых данных.
-- Если у тебя названия уже изменены, просто заполни *_uz вручную в Table Editor.

update public.places
set
  name_uz = 'Giotto',
  description_uz = 'Italiya va Yevropa taomlari',
  address_uz = 'Farg‘ona'
where name = 'Giotto';

update public.places
set
  name_uz = 'Coffee Boom',
  description_uz = 'Qahva va desertlar',
  address_uz = 'Farg‘ona'
where name = 'Coffee Boom';

update public.places
set
  name_uz = 'Royal Hall',
  description_uz = 'Karaoke va lounge',
  address_uz = 'Farg‘ona'
where name = 'Royal Hall';

update public.events
set
  title_uz = 'Jonli musiqa',
  description_uz = 'Bugun kechqurun jonli musiqa'
where title = 'Живая музыка';

update public.offers
set
  title_uz = 'Desertlarga −20%',
  description_uz = 'Chegirma cheklangan vaqt davomida amal qiladi'
where title in ('-20% на десерты', '−20% на десерты');
