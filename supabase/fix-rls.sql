-- Fix infinite recursion in RLS policies
-- Run this in Supabase SQL Editor

-- Drop the problematic policies
drop policy if exists "Users can view own family" on families;
drop policy if exists "Anyone can find family by invite code" on families;
drop policy if exists "Users can view family profiles" on profiles;
drop policy if exists "Users can view family activity types" on activity_types;
drop policy if exists "Parents can manage activity types" on activity_types;
drop policy if exists "Users can view family activities" on activities;
drop policy if exists "Users can view family blocked apps" on blocked_apps;
drop policy if exists "Parents can manage blocked apps" on blocked_apps;
drop policy if exists "Users can view family rewards" on rewards;
drop policy if exists "Parents can manage rewards" on rewards;

-- Create a security-definer function to get the user's family_id
-- This avoids the recursive RLS check on profiles
create or replace function get_my_family_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select family_id from public.profiles where id = auth.uid();
$$;

-- Families: users can read their own family
create policy "Users can view own family" on families
  for select using (id = get_my_family_id());

-- Families: anyone can read families by invite code (for joining)
create policy "Anyone can find family by invite code" on families
  for select using (true);

-- Profiles: users can read their own profile + profiles in their family
create policy "Users can view family profiles" on profiles
  for select using (
    id = auth.uid()
    or family_id = get_my_family_id()
  );

-- Activity types: users can read types for their family
create policy "Users can view family activity types" on activity_types
  for select using (family_id = get_my_family_id());

-- Activity types: parents can manage types
create policy "Parents can manage activity types" on activity_types
  for all using (
    family_id = get_my_family_id()
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'parent'
    )
  );

-- Activities: users can read activities in their family
create policy "Users can view family activities" on activities
  for select using (
    profile_id in (
      select id from public.profiles where family_id = get_my_family_id()
    )
  );

-- Blocked apps: users can view for their family
create policy "Users can view family blocked apps" on blocked_apps
  for select using (family_id = get_my_family_id());

-- Blocked apps: parents can manage
create policy "Parents can manage blocked apps" on blocked_apps
  for all using (
    family_id = get_my_family_id()
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'parent'
    )
  );

-- Rewards: users can view for their family
create policy "Users can view family rewards" on rewards
  for select using (family_id = get_my_family_id());

-- Rewards: parents can manage
create policy "Parents can manage rewards" on rewards
  for all using (
    family_id = get_my_family_id()
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'parent'
    )
  );
