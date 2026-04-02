import type { CharacterClass } from "./database.types";

export type EmoteSource = "level" | "season" | "boss" | "achievement" | "default";

export interface EmoteDefinition {
  slug: string;
  name: string;
  nameNorwegian: string;
  description: string;
  animationFrames: number;
  duration: number;
  source: EmoteSource;
  unlockRequirement: EmoteUnlockRequirement;
  icon: string;
}

export type EmoteUnlockRequirement =
  | { type: "level"; level: number }
  | { type: "season"; season: number; tier: number }
  | { type: "boss"; bossSlug: string }
  | { type: "achievement"; achievementSlug: string }
  | { type: "default" };

const ALL_EMOTES: EmoteDefinition[] = [
  // Default emotes (everyone gets these)
  { slug: "wave", name: "Wave", nameNorwegian: "Vinke", description: "En vennlig hilsen", animationFrames: 8, duration: 1000, source: "default", unlockRequirement: { type: "default" }, icon: "\uD83D\uDC4B" },
  { slug: "cheer", name: "Cheer", nameNorwegian: "Heie", description: "Hepp hepp hurra!", animationFrames: 6, duration: 800, source: "default", unlockRequirement: { type: "default" }, icon: "\uD83C\uDF89" },

  // Level unlocks
  { slug: "victory_dance", name: "Victory Dance", nameNorwegian: "Seierdans", description: "Dans som en vinner", animationFrames: 12, duration: 2000, source: "level", unlockRequirement: { type: "level", level: 5 }, icon: "\uD83D\uDD7A" },
  { slug: "flex", name: "Flex", nameNorwegian: "Vis styrke", description: "Se paa disse musklene!", animationFrames: 8, duration: 1200, source: "level", unlockRequirement: { type: "level", level: 10 }, icon: "\uD83D\uDCAA" },
  { slug: "wizard_bow", name: "Wizard Bow", nameNorwegian: "Trollmannsbue", description: "Et elegant bue", animationFrames: 10, duration: 1500, source: "level", unlockRequirement: { type: "level", level: 15 }, icon: "\uD83E\uDDD9" },
  { slug: "shield_bash", name: "Shield Bash", nameNorwegian: "Skjold-flex", description: "Slaa skjoldet!", animationFrames: 8, duration: 1000, source: "level", unlockRequirement: { type: "level", level: 20 }, icon: "\uD83D\uDEE1\uFE0F" },
  { slug: "dragon_roar", name: "Dragon Roar", nameNorwegian: "Dragerop", description: "ROOOOAR!", animationFrames: 10, duration: 1500, source: "level", unlockRequirement: { type: "level", level: 30 }, icon: "\uD83D\uDC09" },
  { slug: "epic_pose", name: "Epic Pose", nameNorwegian: "Episk Posering", description: "Den ultimate poseringen", animationFrames: 12, duration: 2000, source: "level", unlockRequirement: { type: "level", level: 40 }, icon: "\u2B50" },

  // Season emotes
  { slug: "dance_frost", name: "Frost Dance", nameNorwegian: "Frostdans", description: "Dans i snoen", animationFrames: 12, duration: 2000, source: "season", unlockRequirement: { type: "season", season: 1, tier: 7 }, icon: "\u2744\uFE0F" },
  { slug: "snowflake", name: "Snowflake", nameNorwegian: "Snofnugg", description: "Snofnugg-virvler", animationFrames: 8, duration: 1200, source: "season", unlockRequirement: { type: "season", season: 1, tier: 12 }, icon: "\u2744\uFE0F" },
  { slug: "ice_storm", name: "Ice Storm", nameNorwegian: "Isstorm", description: "Kall paa isstormen", animationFrames: 10, duration: 1500, source: "season", unlockRequirement: { type: "season", season: 1, tier: 19 }, icon: "\uD83C\uDF28\uFE0F" },
  { slug: "blizzard", name: "Blizzard", nameNorwegian: "Snestorm", description: "Episk snestorm!", animationFrames: 14, duration: 2500, source: "season", unlockRequirement: { type: "season", season: 1, tier: 28 }, icon: "\uD83C\uDF2C\uFE0F" },

  // Boss drop emotes
  { slug: "troll_stomp", name: "Troll Stomp", nameNorwegian: "Trollstamp", description: "Stamp som Skjermtrollet", animationFrames: 10, duration: 1500, source: "boss", unlockRequirement: { type: "boss", bossSlug: "boss_skjermtrollet" }, icon: "\uD83E\uDDCC" },
  { slug: "dragon_flight", name: "Dragon Flight", nameNorwegian: "Drageflukt", description: "Fly som Data-Dragen", animationFrames: 12, duration: 2000, source: "boss", unlockRequirement: { type: "boss", bossSlug: "boss_data_dragen" }, icon: "\uD83D\uDC09" },

  // Achievement emotes
  { slug: "streak_fire", name: "Streak Fire", nameNorwegian: "Streakflamme", description: "Du brenner!", animationFrames: 8, duration: 1200, source: "achievement", unlockRequirement: { type: "achievement", achievementSlug: "streak_30" }, icon: "\uD83D\uDD25" },
  { slug: "family_hug", name: "Family Hug", nameNorwegian: "Familieklem", description: "Gruppeknuser!", animationFrames: 10, duration: 1500, source: "achievement", unlockRequirement: { type: "achievement", achievementSlug: "family_hero" }, icon: "\uD83E\uDD17" },
];

export function getAllEmotes(): EmoteDefinition[] {
  return ALL_EMOTES;
}

export function getEmoteBySlug(slug: string): EmoteDefinition | undefined {
  return ALL_EMOTES.find((e) => e.slug === slug);
}

export function getDefaultEmotes(): EmoteDefinition[] {
  return ALL_EMOTES.filter((e) => e.source === "default");
}

export function getEmotesForLevel(level: number): EmoteDefinition[] {
  return ALL_EMOTES.filter(
    (e) =>
      e.source === "default" ||
      (e.unlockRequirement.type === "level" && e.unlockRequirement.level <= level)
  );
}

export function isEmoteUnlocked(
  emote: EmoteDefinition,
  unlockedSlugs: string[]
): boolean {
  if (emote.source === "default") return true;
  return unlockedSlugs.includes(emote.slug);
}

export const MAX_EQUIPPED_EMOTES = 4;
