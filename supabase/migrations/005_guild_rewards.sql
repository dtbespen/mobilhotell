-- Guild Stars & Reward System
-- Pipeline: Quests -> Mana -> Dungeon -> Guild Stars -> Rewards

-- 1. Track guild star balance per family
CREATE TABLE IF NOT EXISTS guild_star_balance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  current_stars INT NOT NULL DEFAULT 0,
  total_earned INT NOT NULL DEFAULT 0,
  total_spent INT NOT NULL DEFAULT 0,
  UNIQUE(family_id)
);

-- 2. Star transaction ledger
CREATE TABLE IF NOT EXISTS guild_star_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  amount INT NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN (
    'dungeon_victory', 'bonus_dungeon', 'mvp_bonus',
    'reward_claim', 'parent_grant', 'family_challenge'
  )),
  description TEXT,
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_star_tx_family
  ON guild_star_transactions(family_id, created_at DESC);

-- 3. Individual star contributions (so kids see their impact)
CREATE TABLE IF NOT EXISTS guild_star_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dungeon_id UUID REFERENCES dungeons(id) ON DELETE SET NULL,
  stars_earned INT NOT NULL DEFAULT 0,
  bonus_stars INT NOT NULL DEFAULT 0,
  contribution_percent INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Guild rewards (parent-defined)
CREATE TABLE IF NOT EXISTS guild_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  star_cost INT NOT NULL DEFAULT 5,
  category TEXT NOT NULL DEFAULT 'custom',
  emoji TEXT NOT NULL DEFAULT '✨',
  is_repeatable BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_guild_rewards_family
  ON guild_rewards(family_id, is_active);

-- 5. Reward claims
CREATE TABLE IF NOT EXISTS reward_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES guild_rewards(id) ON DELETE CASCADE,
  claimed_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  approved_by UUID REFERENCES profiles(id),
  stars_spent INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'fulfilled', 'rejected')),
  claimed_at TIMESTAMPTZ DEFAULT now(),
  fulfilled_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_reward_claims_family
  ON reward_claims(family_id, status);

-- 6. Dungeon completion tracking (for bonus dungeon logic)
CREATE TABLE IF NOT EXISTS dungeon_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dungeon_id UUID NOT NULL REFERENCES dungeons(id) ON DELETE CASCADE,
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT now(),
  days_used INT NOT NULL DEFAULT 7,
  total_stars_awarded INT NOT NULL DEFAULT 0,
  bonus_dungeon_unlocked BOOLEAN DEFAULT false,
  UNIQUE(dungeon_id, family_id)
);

-- 7. Extend dungeons with bonus fields
ALTER TABLE dungeons ADD COLUMN IF NOT EXISTS is_bonus BOOLEAN DEFAULT false;
ALTER TABLE dungeons ADD COLUMN IF NOT EXISTS parent_dungeon_id UUID REFERENCES dungeons(id);

-- 8. RLS
ALTER TABLE guild_star_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE guild_star_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE guild_star_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE guild_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE dungeon_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family members can read star balance" ON guild_star_balance
  FOR SELECT USING (
    family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Family members can read star transactions" ON guild_star_transactions
  FOR SELECT USING (
    family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can read their star contributions" ON guild_star_contributions
  FOR SELECT USING (
    family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Family members can read guild rewards" ON guild_rewards
  FOR SELECT USING (
    family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Parents can manage guild rewards" ON guild_rewards
  FOR ALL USING (
    family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid() AND role = 'parent')
  );

CREATE POLICY "Family members can read reward claims" ON reward_claims
  FOR SELECT USING (
    family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can create reward claims" ON reward_claims
  FOR INSERT WITH CHECK (claimed_by = auth.uid());

CREATE POLICY "Parents can update reward claims" ON reward_claims
  FOR UPDATE USING (
    family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid() AND role = 'parent')
  );

CREATE POLICY "Family members can read dungeon completions" ON dungeon_completions
  FOR SELECT USING (
    family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())
  );

-- Enable realtime on star balance and reward claims
ALTER PUBLICATION supabase_realtime ADD TABLE guild_star_balance;
ALTER PUBLICATION supabase_realtime ADD TABLE reward_claims;

-- 9. Helper: get family star balance
CREATE OR REPLACE FUNCTION get_guild_stars(p_family_id UUID)
RETURNS INT AS $$
  SELECT COALESCE(current_stars, 0)
  FROM guild_star_balance
  WHERE family_id = p_family_id;
$$ LANGUAGE SQL STABLE;
