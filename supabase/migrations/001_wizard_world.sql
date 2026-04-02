-- Wizard World MVP: Database migration
-- Run this in your Supabase SQL Editor

-- 1. Add wizard columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS character_class TEXT DEFAULT 'wizard'
  CHECK (character_class IN ('wizard','knight','druid','rogue'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wizard_rank TEXT DEFAULT 'apprentice';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_config JSONB DEFAULT '{}';

-- 2. Avatar items table
CREATE TABLE IF NOT EXISTS avatar_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('hat','robe','staff','familiar','body_color')),
  name TEXT NOT NULL,
  unlock_level INT NOT NULL DEFAULT 1,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common','uncommon','rare','epic','legendary')),
  class_restriction TEXT DEFAULT NULL CHECK (class_restriction IN ('wizard','knight','druid','rogue', NULL)),
  is_boss_drop BOOLEAN DEFAULT false,
  pixel_asset TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Class abilities table
CREATE TABLE IF NOT EXISTS class_abilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  character_class TEXT NOT NULL CHECK (character_class IN ('wizard','knight','druid','rogue')),
  unlock_level INT NOT NULL,
  effect_type TEXT NOT NULL,
  effect_value NUMERIC DEFAULT 1,
  cooldown_hours INT DEFAULT 24,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Dungeons (weekly bosses)
CREATE TABLE IF NOT EXISTS dungeons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  boss_name TEXT NOT NULL,
  boss_hp INT NOT NULL,
  boss_pixel_asset TEXT NOT NULL DEFAULT 'boss_default',
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  difficulty TEXT DEFAULT 'normal' CHECK (difficulty IN ('easy','normal','hard','legendary')),
  loot_table JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Dungeon contributions (guild members contributing mana)
CREATE TABLE IF NOT EXISTS dungeon_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dungeon_id UUID NOT NULL REFERENCES dungeons(id) ON DELETE CASCADE,
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mana_contributed INT NOT NULL,
  damage_dealt INT NOT NULL,
  ability_used TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dungeon_contrib_dungeon_family
  ON dungeon_contributions(dungeon_id, family_id);

-- 6. Boss loot (drops for players when boss is defeated)
CREATE TABLE IF NOT EXISTS boss_loot (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dungeon_id UUID NOT NULL REFERENCES dungeons(id) ON DELETE CASCADE,
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_slug TEXT NOT NULL,
  claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Enable Realtime on dungeon_contributions
ALTER PUBLICATION supabase_realtime ADD TABLE dungeon_contributions;

-- 8. RLS policies
ALTER TABLE avatar_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_abilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE dungeons ENABLE ROW LEVEL SECURITY;
ALTER TABLE dungeon_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE boss_loot ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Avatar items are readable by everyone" ON avatar_items
  FOR SELECT USING (true);

CREATE POLICY "Class abilities are readable by everyone" ON class_abilities
  FOR SELECT USING (true);

CREATE POLICY "Dungeons are readable by everyone" ON dungeons
  FOR SELECT USING (true);

CREATE POLICY "Users can read contributions for their family" ON dungeon_contributions
  FOR SELECT USING (
    family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert their own contributions" ON dungeon_contributions
  FOR INSERT WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can read their own loot" ON boss_loot
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Users can claim their own loot" ON boss_loot
  FOR UPDATE USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- 9. Helper function: get remaining boss HP for a family
CREATE OR REPLACE FUNCTION get_boss_hp(p_dungeon_id UUID, p_family_id UUID)
RETURNS INT AS $$
  SELECT GREATEST(
    d.boss_hp - COALESCE(SUM(dc.damage_dealt), 0),
    0
  )::INT
  FROM dungeons d
  LEFT JOIN dungeon_contributions dc
    ON dc.dungeon_id = d.id AND dc.family_id = p_family_id
  WHERE d.id = p_dungeon_id
  GROUP BY d.boss_hp;
$$ LANGUAGE SQL STABLE;

-- 10. Helper function: dungeon leaderboard
CREATE OR REPLACE FUNCTION get_dungeon_leaderboard(p_dungeon_id UUID)
RETURNS TABLE(
  family_id UUID,
  family_name TEXT,
  total_damage BIGINT,
  boss_defeated BOOLEAN
) AS $$
  SELECT
    dc.family_id,
    f.name AS family_name,
    SUM(dc.damage_dealt)::BIGINT AS total_damage,
    SUM(dc.damage_dealt) >= d.boss_hp AS boss_defeated
  FROM dungeon_contributions dc
  JOIN families f ON f.id = dc.family_id
  JOIN dungeons d ON d.id = dc.dungeon_id
  WHERE dc.dungeon_id = p_dungeon_id
  GROUP BY dc.family_id, f.name, d.boss_hp
  ORDER BY total_damage DESC;
$$ LANGUAGE SQL STABLE;
