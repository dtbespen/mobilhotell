export type TitleSource = "rank" | "achievement" | "season" | "boss" | "special";

export interface TitleDefinition {
  slug: string;
  name: string;
  source: TitleSource;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  description: string;
}

const ALL_TITLES: TitleDefinition[] = [
  // Rank titles (automatic)
  { slug: "apprentice", name: "Laerling", source: "rank", rarity: "common", description: "Level 1-5" },
  { slug: "novice", name: "Novise", source: "rank", rarity: "common", description: "Level 6-10" },
  { slug: "adept", name: "Adept", source: "rank", rarity: "uncommon", description: "Level 11-20" },
  { slug: "mage", name: "Trollmann", source: "rank", rarity: "rare", description: "Level 21-30" },
  { slug: "archmage", name: "Erketrollmann", source: "rank", rarity: "epic", description: "Level 31-40" },
  { slug: "grandmaster", name: "Stormester", source: "rank", rarity: "legendary", description: "Level 41+" },

  // Achievement titles
  { slug: "week_warrior", name: "Ukekjemper", source: "achievement", rarity: "uncommon", description: "7 dagers streak" },
  { slug: "unbreakable", name: "Ubrytelig", source: "achievement", rarity: "legendary", description: "100 dagers streak" },
  { slug: "quest_champion", name: "Questmester", source: "achievement", rarity: "rare", description: "50 quests fullfort" },
  { slug: "quest_legend", name: "Questlegende", source: "achievement", rarity: "epic", description: "100 quests fullfort" },
  { slug: "dungeon_crawler", name: "Dungeon-kraver", source: "achievement", rarity: "rare", description: "5 bosser beseiret" },
  { slug: "dragon_slayer", name: "Dragedreper", source: "achievement", rarity: "epic", description: "10 bosser beseiret" },
  { slug: "guild_support", name: "Guild-stotte", source: "achievement", rarity: "rare", description: "10 guild boosts" },
  { slug: "fashionista", name: "Fashionista", source: "achievement", rarity: "rare", description: "Fullt utstyrssett" },
  { slug: "animal_whisperer", name: "Dyre-hvisker", source: "achievement", rarity: "epic", description: "Alle familiars" },
  { slug: "silence_master", name: "Stille-mester", source: "achievement", rarity: "rare", description: "3 timer unplugget" },

  // Season titles
  { slug: "frost_apprentice", name: "Frostlaerling", source: "season", rarity: "uncommon", description: "Season 1, Tier 9" },
  { slug: "frost_warrior", name: "Frostkriger", source: "season", rarity: "rare", description: "Season 1, Tier 18" },
  { slug: "frost_mage", name: "Frostmagiker", source: "season", rarity: "epic", description: "Season 1, Tier 24" },

  // Boss titles
  { slug: "troll_slayer", name: "Trolldreper", source: "boss", rarity: "rare", description: "Beseiret Skjermtrollet" },
  { slug: "dragon_conqueror", name: "Drageerobrer", source: "boss", rarity: "epic", description: "Beseiret Data-Dragen" },

  // Special
  { slug: "streak_master", name: "Streak-mester", source: "special", rarity: "epic", description: "30 dagers streak" },
];

export function getAllTitles(): TitleDefinition[] {
  return ALL_TITLES;
}

export function getTitleBySlug(slug: string): TitleDefinition | undefined {
  return ALL_TITLES.find((t) => t.slug === slug);
}

export function getTitlesBySource(source: TitleSource): TitleDefinition[] {
  return ALL_TITLES.filter((t) => t.source === source);
}
