export type CharacterClass = "wizard" | "knight" | "druid" | "rogue";
export type WizardRank =
  | "apprentice"
  | "novice"
  | "adept"
  | "mage"
  | "archmage"
  | "grandmaster";
export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface ClassConfig {
  name: string;
  nameNorwegian: string;
  description: string;
  damageMult: number;
  classBonus: string;
  emoji: string;
  colorToken: string;
}

export const CLASS_CONFIG: Record<CharacterClass, ClassConfig> = {
  wizard: {
    name: "Wizard",
    nameNorwegian: "Trollmann",
    description: "Allsidig magi. +10% mana fra alle quests.",
    damageMult: 1.0,
    classBonus: "mana_boost_10",
    emoji: "\u{1F9D9}",
    colorToken: "info",
  },
  knight: {
    name: "Knight",
    nameNorwegian: "Ridder",
    description: "Sterk i kamp. +20% damage mot bosser.",
    damageMult: 1.3,
    classBonus: "boss_damage_20",
    emoji: "\u{2694}\u{FE0F}",
    colorToken: "danger",
  },
  druid: {
    name: "Druid",
    nameNorwegian: "Druide",
    description: "St\u00f8tter guildet. Alle f\u00e5r +5% mana.",
    damageMult: 0.8,
    classBonus: "guild_mana_5",
    emoji: "\u{1F33F}",
    colorToken: "primary",
  },
  rogue: {
    name: "Rogue",
    nameNorwegian: "Skurk",
    description: "Skattejeger. +25% sjanse for sjeldne drops.",
    damageMult: 1.0,
    classBonus: "loot_bonus_25",
    emoji: "\u{1F5E1}\u{FE0F}",
    colorToken: "accent",
  },
};

export interface RankConfig {
  rank: WizardRank;
  name: string;
  minLevel: number;
  maxLevel: number;
  minMana: number;
  maxMana: number;
}

export const RANKS: RankConfig[] = [
  { rank: "apprentice", name: "L\u00e6rling",        minLevel: 1,  maxLevel: 5,  minMana: 0,     maxMana: 500 },
  { rank: "novice",     name: "Novise",         minLevel: 6,  maxLevel: 10, minMana: 501,   maxMana: 1500 },
  { rank: "adept",      name: "Adept",          minLevel: 11, maxLevel: 20, minMana: 1501,  maxMana: 4000 },
  { rank: "mage",       name: "Trollmann",      minLevel: 21, maxLevel: 30, minMana: 4001,  maxMana: 10000 },
  { rank: "archmage",   name: "Erketrollmann",  minLevel: 31, maxLevel: 40, minMana: 10001, maxMana: 25000 },
  { rank: "grandmaster", name: "Stormester",    minLevel: 41, maxLevel: 99, minMana: 25001, maxMana: Infinity },
];

const LEVEL_THRESHOLDS = buildLevelThresholds();

function buildLevelThresholds(): number[] {
  const thresholds: number[] = [0];
  for (let lvl = 1; lvl <= 99; lvl++) {
    const manaNeeded = Math.round(50 * Math.pow(lvl, 1.5));
    thresholds.push(manaNeeded);
  }
  return thresholds;
}

export function getLevel(totalMana: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalMana >= LEVEL_THRESHOLDS[i]) return i;
  }
  return 1;
}

export function getManaForLevel(level: number): number {
  return LEVEL_THRESHOLDS[level] ?? 0;
}

export function getManaForNextLevel(level: number): number {
  return LEVEL_THRESHOLDS[level + 1] ?? LEVEL_THRESHOLDS[level] ?? 0;
}

export function getWizardRank(level: number): RankConfig {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (level >= RANKS[i].minLevel) return RANKS[i];
  }
  return RANKS[0];
}

export interface LevelUnlock {
  level: number;
  type: "item" | "ability" | "rank";
  slug: string;
  name: string;
}

const UNLOCK_TABLE: LevelUnlock[] = [
  { level: 3,  type: "item",    slug: "cat",            name: "Familiar: Katt" },
  { level: 5,  type: "ability", slug: "class_ability_1", name: "Klasse-evne 1" },
  { level: 5,  type: "item",    slug: "tier2_hat",      name: "Ny hatt" },
  { level: 6,  type: "rank",    slug: "novice",         name: "Rank: Novise" },
  { level: 8,  type: "item",    slug: "tier2_robe",     name: "Ny kappe" },
  { level: 10, type: "item",    slug: "owl",            name: "Familiar: Ugle" },
  { level: 10, type: "item",    slug: "tier3_hat",      name: "Sjelden hatt" },
  { level: 11, type: "rank",    slug: "adept",          name: "Rank: Adept" },
  { level: 12, type: "ability", slug: "class_ability_2", name: "Klasse-evne 2" },
  { level: 15, type: "item",    slug: "tier3_robe",     name: "Sjelden kappe" },
  { level: 18, type: "item",    slug: "tier3_staff",    name: "Sjeldent v\u00e5pen" },
  { level: 20, type: "item",    slug: "baby_dragon",    name: "Familiar: Drage" },
  { level: 20, type: "item",    slug: "tier4_hat",      name: "Episk hatt" },
  { level: 21, type: "rank",    slug: "mage",           name: "Rank: Trollmann" },
  { level: 25, type: "item",    slug: "tier4_robe",     name: "Episk kappe" },
  { level: 31, type: "rank",    slug: "archmage",       name: "Rank: Erketrollmann" },
  { level: 35, type: "item",    slug: "phoenix",        name: "Familiar: F\u00f8niks" },
  { level: 41, type: "rank",    slug: "grandmaster",    name: "Rank: Stormester" },
];

export function getUnlocksForLevel(level: number): LevelUnlock[] {
  return UNLOCK_TABLE.filter((u) => u.level === level);
}

export function getAllUnlocksUpToLevel(level: number): LevelUnlock[] {
  return UNLOCK_TABLE.filter((u) => u.level <= level);
}

export function calculateDamage(
  mana: number,
  characterClass: CharacterClass,
  abilityMultiplier: number = 1.0
): number {
  const classConfig = CLASS_CONFIG[characterClass];
  return Math.round(mana * classConfig.damageMult * abilityMultiplier);
}

export function getClassInfo(characterClass: CharacterClass): ClassConfig {
  return CLASS_CONFIG[characterClass];
}
