-- Mobilhotell Database Schema
-- Run this in Supabase SQL Editor to set up all tables

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Families table
create table if not exists families (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  invite_code text unique not null,
  created_at timestamp with time zone default now()
);

-- Profiles table (linked to Supabase auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  family_id uuid references families(id) on delete set null,
  display_name text not null,
  avatar_url text,
  role text not null default 'child' check (role in ('parent', 'child')),
  created_at timestamp with time zone default now()
);

-- Activity types table
create table if not exists activity_types (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid not null references families(id) on delete cascade,
  name text not null,
  category text not null default 'custom' check (category in ('screen_free', 'reading', 'creating', 'custom')),
  points_per_minute numeric not null default 1,
  icon text not null default '⭐',
  is_default boolean not null default false,
  created_at timestamp with time zone default now()
);

-- Activities table (logged activities)
create table if not exists activities (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  activity_type_id uuid not null references activity_types(id) on delete cascade,
  started_at timestamp with time zone not null default now(),
  ended_at timestamp with time zone,
  duration_minutes integer not null default 0,
  points_earned integer not null default 0,
  source text not null default 'manual' check (source in ('manual', 'sensor', 'screen_time_api')),
  metadata jsonb,
  created_at timestamp with time zone default now()
);

-- Blocked apps table
create table if not exists blocked_apps (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid not null references families(id) on delete cascade,
  app_name text not null,
  bundle_id text,
  created_at timestamp with time zone default now()
);

-- Rewards table (future use)
create table if not exists rewards (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid not null references families(id) on delete cascade,
  name text not null,
  points_cost integer not null,
  created_at timestamp with time zone default now()
);

-- Indexes for performance
create index if not exists idx_profiles_family on profiles(family_id);
create index if not exists idx_activity_types_family on activity_types(family_id);
create index if not exists idx_activities_profile on activities(profile_id);
create index if not exists idx_activities_started on activities(started_at);
create index if not exists idx_activities_type on activities(activity_type_id);

-- Row Level Security (RLS)
alter table families enable row level security;
alter table profiles enable row level security;
alter table activity_types enable row level security;
alter table activities enable row level security;
alter table blocked_apps enable row level security;
alter table rewards enable row level security;

-- Families: users can read their own family
create policy "Users can view own family" on families
  for select using (
    id in (select family_id from profiles where id = auth.uid())
  );

-- Families: anyone authenticated can create a family
create policy "Authenticated users can create families" on families
  for insert with check (auth.uid() is not null);

-- Families: anyone can read families by invite code (for joining)
create policy "Anyone can find family by invite code" on families
  for select using (true);

-- Profiles: users can read profiles in their family
create policy "Users can view family profiles" on profiles
  for select using (
    family_id in (select family_id from profiles where id = auth.uid())
    or id = auth.uid()
  );

-- Profiles: users can insert/update their own profile
create policy "Users can manage own profile" on profiles
  for insert with check (id = auth.uid());

create policy "Users can update own profile" on profiles
  for update using (id = auth.uid());

-- Activity types: users can read types for their family
create policy "Users can view family activity types" on activity_types
  for select using (
    family_id in (select family_id from profiles where id = auth.uid())
  );

-- Activity types: parents can manage types
create policy "Parents can manage activity types" on activity_types
  for all using (
    family_id in (
      select family_id from profiles where id = auth.uid() and role = 'parent'
    )
  );

-- Activities: users can read activities in their family
create policy "Users can view family activities" on activities
  for select using (
    profile_id in (
      select p2.id from profiles p1
      join profiles p2 on p1.family_id = p2.family_id
      where p1.id = auth.uid()
    )
  );

-- Activities: users can manage their own activities
create policy "Users can manage own activities" on activities
  for insert with check (profile_id = auth.uid());

create policy "Users can update own activities" on activities
  for update using (profile_id = auth.uid());

-- Blocked apps: users can view for their family
create policy "Users can view family blocked apps" on blocked_apps
  for select using (
    family_id in (select family_id from profiles where id = auth.uid())
  );

-- Blocked apps: parents can manage
create policy "Parents can manage blocked apps" on blocked_apps
  for all using (
    family_id in (
      select family_id from profiles where id = auth.uid() and role = 'parent'
    )
  );

-- Rewards: users can view for their family
create policy "Users can view family rewards" on rewards
  for select using (
    family_id in (select family_id from profiles where id = auth.uid())
  );

-- Rewards: parents can manage
create policy "Parents can manage rewards" on rewards
  for all using (
    family_id in (
      select family_id from profiles where id = auth.uid() and role = 'parent'
    )
  );

-- Function to seed default activity types when a family is created
create or replace function seed_default_activity_types()
returns trigger as $$
begin
  insert into activity_types (family_id, name, category, points_per_minute, icon, is_default) values
    (new.id, 'Skjermfri tid', 'screen_free', 1, '📵', true),
    (new.id, 'Lese bok', 'reading', 2, '📚', true),
    (new.id, 'Lydbok', 'reading', 2, '🎧', true),
    (new.id, 'Lage ting', 'creating', 2, '🎨', true),
    (new.id, 'Mobilhotell', 'screen_free', 1.5, '🏨', true);
  return new;
end;
$$ language plpgsql;

-- Trigger to auto-seed activity types
drop trigger if exists on_family_created on families;
create trigger on_family_created
  after insert on families
  for each row
  execute function seed_default_activity_types();
