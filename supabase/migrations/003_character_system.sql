-- Character System Overhaul: Migration
-- Run after 002_seed_data.sql

-- 1. Extend profiles with new fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS active_title TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS equipped_emotes TEXT[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS active_loadout INT DEFAULT 1;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS skill_points_spent INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_respec TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS streak_freezes INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login_streak INT DEFAULT 0;

-- 2. Extend avatar_items with stats and set_id
ALTER TABLE avatar_items ADD COLUMN IF NOT EXISTS stats JSONB;
ALTER TABLE avatar_items ADD COLUMN IF NOT EXISTS set_id TEXT;

-- Update avatar_items type check to include new types
ALTER TABLE avatar_items DROP CONSTRAINT IF EXISTS avatar_items_type_check;
ALTER TABLE avatar_items ADD CONSTRAINT avatar_items_type_check
  CHECK (type IN ('hat','robe','staff','armor','cape','weapon','shield','familiar','body_color'));

-- 3. Skill allocations
CREATE TABLE IF NOT EXISTS skill_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL,
  current_rank INT DEFAULT 1,
  allocated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(profile_id, skill_id)
);

-- 4. Seasons
CREATE TABLE IF NOT EXISTS seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  theme TEXT NOT NULL,
  starts_at DATE NOT NULL,
  ends_at DATE NOT NULL,
  tier_rewards JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Season progress
CREATE TABLE IF NOT EXISTS season_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  current_xp INT DEFAULT 0,
  current_tier INT DEFAULT 0,
  claimed_tiers INT[] DEFAULT '{}',
  UNIQUE(profile_id, season_id)
);

-- 6. Daily quests
CREATE TABLE IF NOT EXISTS daily_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quest_date DATE NOT NULL,
  quest_type TEXT NOT NULL,
  description TEXT NOT NULL,
  requirement JSONB NOT NULL,
  season_xp INT NOT NULL DEFAULT 50,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(profile_id, quest_date, quest_type)
);

-- 7. Unlocked emotes
CREATE TABLE IF NOT EXISTS unlocked_emotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  emote_slug TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  source TEXT NOT NULL DEFAULT 'default',
  UNIQUE(profile_id, emote_slug)
);

-- 8. Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_slug TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(profile_id, achievement_slug)
);

-- 9. Guild activity log
CREATE TABLE IF NOT EXISTS guild_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_guild_activity_family
  ON guild_activity(family_id, created_at DESC);

-- 10. Loadouts
CREATE TABLE IF NOT EXISTS loadouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  slot INT NOT NULL DEFAULT 1,
  name TEXT NOT NULL DEFAULT 'Loadout 1',
  config JSONB NOT NULL DEFAULT '{}',
  UNIQUE(profile_id, slot)
);

-- 11. Daily login tracking
CREATE TABLE IF NOT EXISTS daily_logins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  login_date DATE NOT NULL DEFAULT CURRENT_DATE,
  bonus_mana INT NOT NULL DEFAULT 0,
  reward_claimed BOOLEAN DEFAULT false,
  UNIQUE(profile_id, login_date)
);

-- 12. Enable RLS on new tables
ALTER TABLE skill_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE season_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE unlocked_emotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE guild_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE loadouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logins ENABLE ROW LEVEL SECURITY;

-- 13. RLS Policies
CREATE POLICY "Users can manage their own skills" ON skill_allocations
  FOR ALL USING (profile_id = auth.uid());

CREATE POLICY "Seasons are readable by everyone" ON seasons
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own season progress" ON season_progress
  FOR ALL USING (profile_id = auth.uid());

CREATE POLICY "Users can manage their own daily quests" ON daily_quests
  FOR ALL USING (profile_id = auth.uid());

CREATE POLICY "Users can manage their own emotes" ON unlocked_emotes
  FOR ALL USING (profile_id = auth.uid());

CREATE POLICY "Users can manage their own achievements" ON achievements
  FOR ALL USING (profile_id = auth.uid());

CREATE POLICY "Users can read guild activity for their family" ON guild_activity
  FOR SELECT USING (
    family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert guild activity" ON guild_activity
  FOR INSERT WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can manage their own loadouts" ON loadouts
  FOR ALL USING (profile_id = auth.uid());

CREATE POLICY "Users can manage their own daily logins" ON daily_logins
  FOR ALL USING (profile_id = auth.uid());

-- 14. Enable Realtime on guild_activity
ALTER PUBLICATION supabase_realtime ADD TABLE guild_activity;

-- 15. Seed first season
INSERT INTO seasons (name, theme, starts_at, ends_at, tier_rewards) VALUES
  (
    'Frostmagiernes Vinter',
    'frost',
    CURRENT_DATE,
    (CURRENT_DATE + INTERVAL '28 days')::DATE,
    '[]'::JSONB
  );
