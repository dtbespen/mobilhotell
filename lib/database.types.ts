export type ActivityCategory = "screen_free" | "reading" | "creating" | "custom";
export type ActivitySource = "manual" | "sensor" | "screen_time_api";
export type UserRole = "parent" | "child";
export type CharacterClass = "wizard" | "knight" | "druid" | "rogue";
export type WizardRank = "apprentice" | "novice" | "adept" | "mage" | "archmage" | "grandmaster";
export type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type ItemType = "hat" | "armor" | "cape" | "weapon" | "shield" | "staff" | "familiar" | "body_color";

export type AvatarConfig = {
  body_color: string;
  body_shape?: string;
  eye_color?: string;
  gender?: string;
  face_variant?: string;
  hair_style: string | null;
  hair_color: string | null;
  hat: string | null;
  armor: string | null;
  cape: string | null;
  weapon: string | null;
  shield: string | null;
  familiar: string | null;
};

export type EquipmentStats = {
  manaBonus: number;
  damageBonus: number;
  streakShield: number;
  guildBoost: number;
  lootBonus: number;
};

export type Family = {
  id: string;
  name: string;
  invite_code: string;
  created_at: string;
};

export type Profile = {
  id: string;
  family_id: string;
  display_name: string;
  avatar_url: string | null;
  role: UserRole;
  character_class: CharacterClass;
  wizard_rank: WizardRank;
  avatar_config: AvatarConfig;
  active_title: string | null;
  equipped_emotes: string[];
  active_loadout: number;
  skill_points_spent: number;
  last_respec: string | null;
  streak_freezes: number;
  login_streak: number;
  created_at: string;
};

export type ActivityType = {
  id: string;
  family_id: string;
  name: string;
  category: ActivityCategory;
  points_per_minute: number;
  icon: string;
  is_default: boolean;
  created_at: string;
};

export type Activity = {
  id: string;
  profile_id: string;
  activity_type_id: string;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number;
  points_earned: number;
  source: ActivitySource;
  metadata: Record<string, unknown> | null;
  created_at: string;
  activity_type?: ActivityType;
  profile?: Profile;
};

export type BlockedApp = {
  id: string;
  family_id: string;
  app_name: string;
  bundle_id: string | null;
  created_at: string;
};

export type Reward = {
  id: string;
  family_id: string;
  name: string;
  points_cost: number;
  created_at: string;
};

export type AvatarItem = {
  id: string;
  slug: string;
  type: ItemType;
  name: string;
  unlock_level: number;
  rarity: ItemRarity;
  class_restriction: CharacterClass | null;
  is_boss_drop: boolean;
  pixel_asset: string;
  stats: EquipmentStats | null;
  set_id: string | null;
  created_at: string;
};

export type ClassAbility = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  character_class: CharacterClass;
  unlock_level: number;
  effect_type: string;
  effect_value: number;
  cooldown_hours: number;
  created_at: string;
};

export type Dungeon = {
  id: string;
  name: string;
  boss_name: string;
  boss_hp: number;
  boss_pixel_asset: string;
  week_start: string;
  week_end: string;
  difficulty: "easy" | "normal" | "hard" | "legendary";
  loot_table: Array<{ item_slug: string; drop_chance: number }>;
  created_at: string;
};

export type DungeonContribution = {
  id: string;
  dungeon_id: string;
  family_id: string;
  profile_id: string;
  mana_contributed: number;
  damage_dealt: number;
  ability_used: string | null;
  created_at: string;
  profile?: Profile;
};

export type BossLoot = {
  id: string;
  dungeon_id: string;
  family_id: string;
  profile_id: string;
  item_slug: string;
  claimed: boolean;
  created_at: string;
};

export type Season = {
  id: string;
  name: string;
  theme: string;
  starts_at: string;
  ends_at: string;
  tier_rewards: unknown;
  created_at: string;
};

export type SeasonProgress = {
  id: string;
  profile_id: string;
  season_id: string;
  current_xp: number;
  current_tier: number;
  claimed_tiers: number[];
};

export type DailyQuest = {
  id: string;
  profile_id: string;
  quest_date: string;
  quest_type: string;
  description: string;
  requirement: { type: string; target: number };
  season_xp: number;
  completed: boolean;
  completed_at: string | null;
};

export type Achievement = {
  id: string;
  profile_id: string;
  achievement_slug: string;
  unlocked_at: string;
};

export type GuildActivity = {
  id: string;
  family_id: string;
  profile_id: string;
  event_type: string;
  event_data: Record<string, unknown> | null;
  created_at: string;
  profile?: Profile;
};

export type Loadout = {
  id: string;
  profile_id: string;
  slot: number;
  name: string;
  config: AvatarConfig;
};

export type DailyLogin = {
  id: string;
  profile_id: string;
  login_date: string;
  bonus_mana: number;
  reward_claimed: boolean;
};

export type SkillAllocation = {
  id: string;
  profile_id: string;
  skill_id: string;
  current_rank: number;
  allocated_at: string;
};

export type UnlockedEmote = {
  id: string;
  profile_id: string;
  emote_slug: string;
  unlocked_at: string;
  source: string;
};

export type GuildStarBalance = {
  id: string;
  family_id: string;
  current_stars: number;
  total_earned: number;
  total_spent: number;
};

export type GuildStarTransaction = {
  id: string;
  family_id: string;
  profile_id: string | null;
  amount: number;
  transaction_type: string;
  description: string | null;
  reference_id: string | null;
  created_at: string;
};

export type GuildStarContribution = {
  id: string;
  family_id: string;
  profile_id: string;
  dungeon_id: string | null;
  stars_earned: number;
  bonus_stars: number;
  contribution_percent: number;
  created_at: string;
};

export type GuildReward = {
  id: string;
  family_id: string;
  name: string;
  description: string | null;
  star_cost: number;
  category: string;
  emoji: string;
  is_repeatable: boolean;
  is_active: boolean;
  created_by: string;
  created_at: string;
};

export type RewardClaim = {
  id: string;
  family_id: string;
  reward_id: string;
  claimed_by: string;
  approved_by: string | null;
  stars_spent: number;
  status: "pending" | "approved" | "fulfilled" | "rejected";
  claimed_at: string;
  fulfilled_at: string | null;
  reward?: GuildReward;
  claimant?: Profile;
};

export type DungeonCompletion = {
  id: string;
  dungeon_id: string;
  family_id: string;
  completed_at: string;
  days_used: number;
  total_stars_awarded: number;
  bonus_dungeon_unlocked: boolean;
};
