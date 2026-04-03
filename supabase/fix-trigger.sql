-- Fix: trigger function must bypass RLS to seed default activity types
-- Run this in Supabase SQL Editor

create or replace function seed_default_activity_types()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.activity_types (family_id, name, category, points_per_minute, icon, is_default) values
    (new.id, 'Skjermfri tid', 'screen_free', 1, '📵', true),
    (new.id, 'Lese bok', 'reading', 2, '📚', true),
    (new.id, 'Lydbok', 'reading', 2, '🎧', true),
    (new.id, 'Lage ting', 'creating', 2, '🎨', true),
    (new.id, 'Mobilhotell', 'screen_free', 1.5, '🏨', true),
    (new.id, 'Bonus Mana', 'custom', 0, '🎁', true);
  return new;
end;
$$;
