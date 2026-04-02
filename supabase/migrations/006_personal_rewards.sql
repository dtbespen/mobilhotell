-- Legg til is_personal flagg på guild_rewards
-- Personlige belønninger kan kun løses inn av én person med sine egne opptjente stjerner
-- Familie-belønninger bruker den delte guild-potten

ALTER TABLE guild_rewards
  ADD COLUMN IF NOT EXISTS is_personal BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Legg til transaction_type for quest-belønninger
-- (guild_star_transactions.transaction_type er en text-kolonne, ingen ALTER nødvendig)

-- Legg til personal_stars per profil for å tracke individuelle opptjente stjerner
CREATE TABLE IF NOT EXISTS personal_star_balance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  current_stars INTEGER NOT NULL DEFAULT 0,
  total_earned INTEGER NOT NULL DEFAULT 0,
  total_spent INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id)
);

ALTER TABLE personal_star_balance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Familiemedlemmer kan se personlige stjerner"
  ON personal_star_balance FOR SELECT
  USING (family_id = get_my_family_id());

CREATE POLICY "Kun eieren kan oppdatere sine personlige stjerner"
  ON personal_star_balance FOR ALL
  USING (profile_id = auth.uid());

-- Indeks
CREATE INDEX IF NOT EXISTS idx_personal_stars_profile ON personal_star_balance(profile_id);
CREATE INDEX IF NOT EXISTS idx_personal_stars_family ON personal_star_balance(family_id);
