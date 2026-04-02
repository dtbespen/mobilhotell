export type AchievementCategory = "streak" | "quest" | "dungeon" | "social" | "collection" | "season" | "hidden";

export interface AchievementDefinition {
  slug: string;
  name: string;
  nameNorwegian: string;
  description: string;
  category: AchievementCategory;
  isHidden: boolean;
  icon: string;
  rewardType: "title" | "emote" | "mana" | "item" | null;
  rewardSlug: string | null;
  rewardAmount: number;
}

const ALL_ACHIEVEMENTS: AchievementDefinition[] = [
  // Streak achievements
  { slug: "streak_3", name: "Getting Started", nameNorwegian: "I gang!", description: "3 dagers streak", category: "streak", isHidden: false, icon: "\uD83D\uDD25", rewardType: "mana", rewardSlug: null, rewardAmount: 50 },
  { slug: "streak_7", name: "Week Warrior", nameNorwegian: "Ukekjemper", description: "7 dagers streak", category: "streak", isHidden: false, icon: "\uD83D\uDD25", rewardType: "title", rewardSlug: "week_warrior", rewardAmount: 0 },
  { slug: "streak_14", name: "Fortnight Force", nameNorwegian: "Fjortendagskraft", description: "14 dagers streak", category: "streak", isHidden: false, icon: "\uD83D\uDD25", rewardType: "mana", rewardSlug: null, rewardAmount: 200 },
  { slug: "streak_30", name: "Streak Master", nameNorwegian: "Streak-mester", description: "30 dagers streak", category: "streak", isHidden: false, icon: "\uD83D\uDD25", rewardType: "emote", rewardSlug: "streak_fire", rewardAmount: 0 },
  { slug: "streak_100", name: "Unbreakable", nameNorwegian: "Ubrytelig", description: "100 dagers streak!", category: "streak", isHidden: false, icon: "\uD83D\uDCA5", rewardType: "title", rewardSlug: "unbreakable", rewardAmount: 0 },

  // Quest achievements
  { slug: "first_quest", name: "First Steps", nameNorwegian: "Forste skritt", description: "Fullfoor din forste quest", category: "quest", isHidden: false, icon: "\uD83C\uDFAF", rewardType: "mana", rewardSlug: null, rewardAmount: 25 },
  { slug: "quests_10", name: "Quest Seeker", nameNorwegian: "Questsoker", description: "Fullfoor 10 quests", category: "quest", isHidden: false, icon: "\uD83C\uDFAF", rewardType: "mana", rewardSlug: null, rewardAmount: 100 },
  { slug: "quests_50", name: "Quest Champion", nameNorwegian: "Questmester", description: "Fullfoor 50 quests", category: "quest", isHidden: false, icon: "\uD83C\uDFC6", rewardType: "title", rewardSlug: "quest_champion", rewardAmount: 0 },
  { slug: "quests_100", name: "Quest Legend", nameNorwegian: "Questlegende", description: "Fullfoor 100 quests", category: "quest", isHidden: false, icon: "\uD83C\uDFC6", rewardType: "title", rewardSlug: "quest_legend", rewardAmount: 0 },

  // Dungeon achievements
  { slug: "first_boss", name: "Boss Slayer", nameNorwegian: "Bossdreper", description: "Bidra til aa beseire forste boss", category: "dungeon", isHidden: false, icon: "\uD83D\uDC32", rewardType: "mana", rewardSlug: null, rewardAmount: 100 },
  { slug: "boss_5", name: "Dungeon Crawler", nameNorwegian: "Dungeon-kraver", description: "Beseire 5 bosser", category: "dungeon", isHidden: false, icon: "\uD83D\uDC32", rewardType: "title", rewardSlug: "dungeon_crawler", rewardAmount: 0 },
  { slug: "boss_10", name: "Dragon Slayer", nameNorwegian: "Dragedreper", description: "Beseire 10 bosser", category: "dungeon", isHidden: false, icon: "\uD83D\uDC09", rewardType: "title", rewardSlug: "dragon_slayer", rewardAmount: 0 },
  { slug: "top_damage", name: "MVP", nameNorwegian: "MVP", description: "Gjoer mest damage i en dungeon", category: "dungeon", isHidden: false, icon: "\u2B50", rewardType: "mana", rewardSlug: null, rewardAmount: 150 },

  // Social achievements
  { slug: "family_hero", name: "Family Hero", nameNorwegian: "Familie-helten", description: "Hele familien fullforer quest samme dag", category: "social", isHidden: false, icon: "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66", rewardType: "emote", rewardSlug: "family_hug", rewardAmount: 0 },
  { slug: "high_five_10", name: "High Five Master", nameNorwegian: "High Five-mester", description: "Gi 10 high fives", category: "social", isHidden: false, icon: "\uD83D\uDD90\uFE0F", rewardType: "mana", rewardSlug: null, rewardAmount: 50 },
  { slug: "guild_support", name: "Guild Support", nameNorwegian: "Guild-stotte", description: "Boost guildet 10 ganger (Druid)", category: "social", isHidden: false, icon: "\uD83D\uDEE1\uFE0F", rewardType: "title", rewardSlug: "guild_support", rewardAmount: 0 },

  // Collection achievements
  { slug: "full_set", name: "Fashionista", nameNorwegian: "Fashionista", description: "Ha fullt sett med utstyr", category: "collection", isHidden: false, icon: "\uD83D\uDC57", rewardType: "title", rewardSlug: "fashionista", rewardAmount: 0 },
  { slug: "legendary_item", name: "Legendary Find", nameNorwegian: "Legendarisk funn", description: "Faa en legendary item", category: "collection", isHidden: false, icon: "\uD83C\uDF1F", rewardType: "mana", rewardSlug: null, rewardAmount: 500 },
  { slug: "all_familiars", name: "Animal Whisperer", nameNorwegian: "Dyre-hvisker", description: "Samle alle familiars", category: "collection", isHidden: false, icon: "\uD83D\uDC3E", rewardType: "title", rewardSlug: "animal_whisperer", rewardAmount: 0 },

  // HIDDEN achievements
  { slug: "night_owl", name: "Night Owl", nameNorwegian: "Nattugla", description: "Fullfoor en quest etter kl. 20", category: "hidden", isHidden: true, icon: "\uD83E\uDD89", rewardType: "mana", rewardSlug: null, rewardAmount: 75 },
  { slug: "marathon", name: "Marathon", nameNorwegian: "Maratonloper", description: "2 timer unplugget paa en dag", category: "hidden", isHidden: true, icon: "\uD83C\uDFC3", rewardType: "mana", rewardSlug: null, rewardAmount: 100 },
  { slug: "silence_master", name: "Silence Master", nameNorwegian: "Stille-mester", description: "3 timer unplugget paa en dag", category: "hidden", isHidden: true, icon: "\uD83E\uDDD8", rewardType: "title", rewardSlug: "silence_master", rewardAmount: 0 },
  { slug: "boss_rusher", name: "Boss Rusher", nameNorwegian: "Boss-rusher", description: "Bidra til boss 5 dager paa rad", category: "hidden", isHidden: true, icon: "\u26A1", rewardType: "mana", rewardSlug: null, rewardAmount: 200 },
  { slug: "early_bird", name: "Early Bird", nameNorwegian: "Morgenfugl", description: "Fullfoor en quest for kl. 08", category: "hidden", isHidden: true, icon: "\uD83D\uDC26", rewardType: "mana", rewardSlug: null, rewardAmount: 50 },
  { slug: "respec_master", name: "Respec Master", nameNorwegian: "Omtenker", description: "Respec skill tree 3 ganger", category: "hidden", isHidden: true, icon: "\uD83D\uDD04", rewardType: "mana", rewardSlug: null, rewardAmount: 100 },
];

export function getAllAchievements(): AchievementDefinition[] {
  return ALL_ACHIEVEMENTS;
}

export function getVisibleAchievements(): AchievementDefinition[] {
  return ALL_ACHIEVEMENTS.filter((a) => !a.isHidden);
}

export function getHiddenAchievements(): AchievementDefinition[] {
  return ALL_ACHIEVEMENTS.filter((a) => a.isHidden);
}

export function getAchievementBySlug(slug: string): AchievementDefinition | undefined {
  return ALL_ACHIEVEMENTS.find((a) => a.slug === slug);
}

export function getAchievementsByCategory(category: AchievementCategory): AchievementDefinition[] {
  return ALL_ACHIEVEMENTS.filter((a) => a.category === category);
}

export function isAchievementUnlocked(slug: string, unlockedSlugs: string[]): boolean {
  return unlockedSlugs.includes(slug);
}

export function getAchievementProgress(
  slug: string,
  currentValue: number
): { target: number; current: number; percentage: number } {
  const targets: Record<string, number> = {
    streak_3: 3, streak_7: 7, streak_14: 14, streak_30: 30, streak_100: 100,
    first_quest: 1, quests_10: 10, quests_50: 50, quests_100: 100,
    first_boss: 1, boss_5: 5, boss_10: 10,
    high_five_10: 10,
  };

  const target = targets[slug] ?? 1;
  const current = Math.min(currentValue, target);
  return { target, current, percentage: (current / target) * 100 };
}
