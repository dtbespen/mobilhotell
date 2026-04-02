export type ActivityCategory = "screen_free" | "reading" | "creating" | "custom";
export type ActivitySource = "manual" | "sensor" | "screen_time_api";
export type UserRole = "parent" | "child";
export type CharacterClass = "wizard" | "knight" | "druid" | "rogue";
export type WizardRank = "apprentice" | "novice" | "adept" | "mage" | "archmage" | "grandmaster";
export type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type ItemType = "hat" | "robe" | "staff" | "familiar" | "body_color";

export type AvatarConfig = {
  body_color: string;
  hat: string | null;
  robe: string | null;
  staff: string | null;
  familiar: string | null;
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

// Wizard World types

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
