import type { ItemRarity } from "./database.types";

export type SeasonReward =
  | { type: "item"; itemSlug: string; rarity: ItemRarity; label: string }
  | { type: "emote"; emoteSlug: string; label: string }
  | { type: "title"; titleSlug: string; label: string }
  | { type: "mana_bonus"; amount: number; label: string }
  | { type: "familiar"; familiarSlug: string; label: string }
  | { type: "body_color"; colorSlug: string; label: string };

export interface SeasonTier {
  tier: number;
  xpRequired: number;
  cumulativeXp: number;
  reward: SeasonReward;
}

export type QuestRequirementType =
  | "unplug_minutes"
  | "complete_quest"
  | "contribute_dungeon"
  | "earn_mana"
  | "family_quest"
  | "streak_days"
  | "boss_defeat";

export interface QuestRequirement {
  type: QuestRequirementType;
  target: number;
}

export interface DailyQuestTemplate {
  questType: string;
  description: string;
  requirement: QuestRequirement;
  seasonXP: number;
}

export interface WeeklyQuestTemplate {
  questType: string;
  description: string;
  requirement: QuestRequirement;
  seasonXP: number;
}

const DAILY_QUEST_POOL: DailyQuestTemplate[] = [
  { questType: "daily_unplug_30", description: "Vaer unplugget i 30 minutter", requirement: { type: "unplug_minutes", target: 30 }, seasonXP: 50 },
  { questType: "daily_unplug_60", description: "Vaer unplugget i 1 time", requirement: { type: "unplug_minutes", target: 60 }, seasonXP: 75 },
  { questType: "daily_quest_1", description: "Fullfoor en quest", requirement: { type: "complete_quest", target: 1 }, seasonXP: 50 },
  { questType: "daily_quest_2", description: "Fullfoor 2 quests", requirement: { type: "complete_quest", target: 2 }, seasonXP: 75 },
  { questType: "daily_dungeon", description: "Bidra til dungeon-bossen", requirement: { type: "contribute_dungeon", target: 1 }, seasonXP: 50 },
  { questType: "daily_mana_100", description: "Samle 100 mana", requirement: { type: "earn_mana", target: 100 }, seasonXP: 50 },
  { questType: "daily_mana_200", description: "Samle 200 mana", requirement: { type: "earn_mana", target: 200 }, seasonXP: 75 },
];

const WEEKLY_QUEST_POOL: WeeklyQuestTemplate[] = [
  { questType: "weekly_mana_500", description: "Samle 500 mana denne uken", requirement: { type: "earn_mana", target: 500 }, seasonXP: 200 },
  { questType: "weekly_mana_1000", description: "Samle 1000 mana denne uken", requirement: { type: "earn_mana", target: 1000 }, seasonXP: 300 },
  { questType: "weekly_streak_5", description: "Hold streaken i 5 dager", requirement: { type: "streak_days", target: 5 }, seasonXP: 200 },
  { questType: "weekly_quests_10", description: "Fullfoor 10 quests denne uken", requirement: { type: "complete_quest", target: 10 }, seasonXP: 250 },
  { questType: "weekly_dungeon_3", description: "Bidra til dungeon 3 ganger", requirement: { type: "contribute_dungeon", target: 3 }, seasonXP: 200 },
  { questType: "weekly_family", description: "Alle i guildet fullforer en quest samme dag", requirement: { type: "family_quest", target: 1 }, seasonXP: 300 },
];

export function generateDailyQuests(
  dayOfWeek: number,
  seed: number
): DailyQuestTemplate[] {
  const shuffled = [...DAILY_QUEST_POOL].sort(
    (a, b) => hashCode(a.questType + seed) - hashCode(b.questType + seed)
  );
  return shuffled.slice(0, 3);
}

export function generateWeeklyQuests(weekNumber: number): WeeklyQuestTemplate[] {
  const shuffled = [...WEEKLY_QUEST_POOL].sort(
    (a, b) => hashCode(a.questType + weekNumber) - hashCode(b.questType + weekNumber)
  );
  return shuffled.slice(0, 2);
}

function hashCode(s: string | number): number {
  const str = String(s);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash;
}

export function buildSeasonTiers(): SeasonTier[] {
  const tiers: SeasonTier[] = [];
  let cumXp = 0;

  const rewards = SEASON_1_REWARDS;
  for (let i = 0; i < rewards.length; i++) {
    const xpNeeded = getTierXpCost(i + 1);
    cumXp += xpNeeded;
    tiers.push({
      tier: i + 1,
      xpRequired: xpNeeded,
      cumulativeXp: cumXp,
      reward: rewards[i],
    });
  }

  return tiers;
}

function getTierXpCost(tier: number): number {
  if (tier <= 5) return 100;
  if (tier <= 15) return 150;
  if (tier <= 25) return 200;
  return 300;
}

export function getTierForXp(xp: number, tiers: SeasonTier[]): number {
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (xp >= tiers[i].cumulativeXp) return tiers[i].tier;
  }
  return 0;
}

export function getXpToNextTier(
  xp: number,
  currentTier: number,
  tiers: SeasonTier[]
): { current: number; required: number } {
  if (currentTier >= tiers.length) return { current: 0, required: 0 };
  const nextTier = tiers[currentTier];
  const prevCumXp = currentTier > 0 ? tiers[currentTier - 1].cumulativeXp : 0;
  return {
    current: xp - prevCumXp,
    required: nextTier.xpRequired,
  };
}

const SEASON_1_REWARDS: SeasonReward[] = [
  { type: "mana_bonus", amount: 50, label: "50 Bonus Mana" },
  { type: "body_color", colorSlug: "frost_blue", label: "Frostbla farge" },
  { type: "emote", emoteSlug: "wave", label: "Emote: Vinke" },
  { type: "mana_bonus", amount: 75, label: "75 Bonus Mana" },
  { type: "item", itemSlug: "frost_hat_1", rarity: "common", label: "Frosthatt" },
  { type: "mana_bonus", amount: 100, label: "100 Bonus Mana" },
  { type: "emote", emoteSlug: "dance_frost", label: "Emote: Frostdans" },
  { type: "item", itemSlug: "frost_robe_1", rarity: "uncommon", label: "Frostkappe" },
  { type: "title", titleSlug: "frost_apprentice", label: "Tittel: Frostlaerling" },
  { type: "mana_bonus", amount: 100, label: "100 Bonus Mana" },
  { type: "item", itemSlug: "frost_staff_1", rarity: "uncommon", label: "Froststav" },
  { type: "emote", emoteSlug: "snowflake", label: "Emote: Snofnugg" },
  { type: "mana_bonus", amount: 125, label: "125 Bonus Mana" },
  { type: "item", itemSlug: "frost_cape_1", rarity: "uncommon", label: "Frostkappe" },
  { type: "body_color", colorSlug: "ice_white", label: "Ishvit farge" },
  { type: "mana_bonus", amount: 150, label: "150 Bonus Mana" },
  { type: "item", itemSlug: "frost_hat_2", rarity: "rare", label: "Iskrystallhatt" },
  { type: "title", titleSlug: "frost_warrior", label: "Tittel: Frostkriger" },
  { type: "emote", emoteSlug: "ice_storm", label: "Emote: Isstorm" },
  { type: "mana_bonus", amount: 175, label: "175 Bonus Mana" },
  { type: "item", itemSlug: "frost_robe_2", rarity: "rare", label: "Isdrakt" },
  { type: "item", itemSlug: "frost_staff_2", rarity: "rare", label: "Isstav" },
  { type: "mana_bonus", amount: 200, label: "200 Bonus Mana" },
  { type: "title", titleSlug: "frost_mage", label: "Tittel: Frostmagiker" },
  { type: "item", itemSlug: "frost_cape_2", rarity: "rare", label: "Frostvingekappe" },
  { type: "familiar", familiarSlug: "ice_fox", label: "Familiar: Isrev" },
  { type: "item", itemSlug: "frost_hat_3", rarity: "epic", label: "Frostkongens krone" },
  { type: "emote", emoteSlug: "blizzard", label: "Emote: Snestorm" },
  { type: "item", itemSlug: "frost_weapon_3", rarity: "epic", label: "Frostbladet" },
  { type: "item", itemSlug: "frost_legendary_set", rarity: "legendary", label: "Frostmagiernes Rustning" },
];

export function getRewardEmoji(reward: SeasonReward): string {
  switch (reward.type) {
    case "item": return "\uD83C\uDFA9";
    case "emote": return "\uD83D\uDC83";
    case "title": return "\uD83D\uDC51";
    case "mana_bonus": return "\u26A1";
    case "familiar": return "\uD83D\uDC3E";
    case "body_color": return "\uD83C\uDFA8";
  }
}

export function getRarityForReward(reward: SeasonReward): ItemRarity {
  if (reward.type === "item") return reward.rarity;
  if (reward.type === "familiar") return "epic";
  if (reward.type === "title") return "rare";
  if (reward.type === "emote") return "uncommon";
  return "common";
}

export const MAX_DAILY_MANA = 500;
export const MAX_DAILY_DUNGEON_CONTRIBUTIONS = 1;
export const MAX_STACKED_DAILY_QUESTS = 9;

export const BOSS_DEFEAT_SEASON_XP = 500;
