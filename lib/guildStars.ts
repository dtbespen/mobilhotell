/**
 * Guild Stars - the family currency earned from dungeon victories.
 *
 * Pipeline: Quests -> Mana -> Dungeon -> Guild Stars -> Rewards
 *
 * Guild Stars are earned collectively by the family when bosses are defeated.
 * Distribution is proportional to contribution, but with a floor so everyone
 * gets something ("yte etter evne, få etter behov").
 *
 * Stars can be spent on Guild Rewards set by parents: real-world things
 * (pizza night, movie, new toy) or in-game bonuses.
 */

export interface GuildStarPayout {
  profileId: string;
  displayName: string;
  contributionPercent: number;
  starsEarned: number;
  bonusStars: number;
  bonusReason: string | null;
}

export interface DungeonRewardSummary {
  totalStars: number;
  payouts: GuildStarPayout[];
  bonusDungeonUnlocked: boolean;
  lootDrops: Array<{ profileId: string; itemSlug: string; isMysteryCrate: boolean }>;
}

const BASE_STARS_BY_DIFFICULTY: Record<string, number> = {
  easy: 3,
  normal: 5,
  hard: 8,
  legendary: 12,
};

const BONUS_DUNGEON_THRESHOLD = 0.6;

export function calculateDungeonStars(
  difficulty: string,
  daysRemaining: number,
  totalContributors: number
): number {
  const base = BASE_STARS_BY_DIFFICULTY[difficulty] ?? 5;
  const speedBonus = daysRemaining >= 3 ? 2 : daysRemaining >= 1 ? 1 : 0;
  const teamBonus = totalContributors >= 4 ? 2 : totalContributors >= 2 ? 1 : 0;
  return base + speedBonus + teamBonus;
}

export function distributeDungeonStars(
  totalStars: number,
  contributions: Array<{ profileId: string; displayName: string; damageDealt: number }>
): GuildStarPayout[] {
  if (contributions.length === 0) return [];

  const totalDamage = contributions.reduce((sum, c) => sum + c.damageDealt, 0);
  if (totalDamage === 0) return [];

  const FLOOR_PERCENT = 0.15;
  const floorStars = Math.max(1, Math.floor(totalStars * FLOOR_PERCENT));
  const poolStars = totalStars - floorStars * contributions.length;

  return contributions.map((c) => {
    const pct = c.damageDealt / totalDamage;
    const proportional = Math.round(poolStars * pct);
    const earned = floorStars + Math.max(0, proportional);

    let bonusStars = 0;
    let bonusReason: string | null = null;

    if (pct >= 0.4 && contributions.length >= 2) {
      bonusStars = 1;
      bonusReason = "MVP-bonus";
    }

    return {
      profileId: c.profileId,
      displayName: c.displayName,
      contributionPercent: Math.round(pct * 100),
      starsEarned: earned,
      bonusStars,
      bonusReason,
    };
  });
}

export function shouldUnlockBonusDungeon(
  bossHp: number,
  totalDamage: number,
  daysUsed: number,
  totalDays: number
): boolean {
  if (totalDamage < bossHp) return false;
  return (daysUsed / totalDays) <= BONUS_DUNGEON_THRESHOLD;
}

export function getBonusDungeonDifficulty(baseDifficulty: string): string {
  const progression: Record<string, string> = {
    easy: "normal",
    normal: "hard",
    hard: "legendary",
    legendary: "legendary",
  };
  return progression[baseDifficulty] ?? "hard";
}

export interface GuildRewardDefinition {
  id: string;
  familyId: string;
  name: string;
  description: string;
  starCost: number;
  category: GuildRewardCategory;
  emoji: string;
  isRepeatable: boolean;
  isActive: boolean;
  createdBy: string;
  claimedCount: number;
}

export type GuildRewardCategory =
  | "experience"
  | "food"
  | "activity"
  | "purchase"
  | "privilege"
  | "ingame"
  | "custom";

export const REWARD_CATEGORIES: Array<{ key: GuildRewardCategory; label: string; emoji: string }> = [
  { key: "experience", label: "Opplevelse", emoji: "\uD83C\uDF89" },
  { key: "food", label: "Mat & Drikke", emoji: "\uD83C\uDF55" },
  { key: "activity", label: "Aktivitet", emoji: "\u26BD" },
  { key: "purchase", label: "Kjop", emoji: "\uD83D\uDED2" },
  { key: "privilege", label: "Privilegium", emoji: "\uD83D\uDC51" },
  { key: "ingame", label: "I spillet", emoji: "\uD83C\uDFAE" },
  { key: "custom", label: "Annet", emoji: "\u2728" },
];

export const SUGGESTED_REWARDS: Array<{ name: string; description: string; stars: number; category: GuildRewardCategory; emoji: string }> = [
  { name: "Pizzakveld", description: "Hele familien bestiller pizza!", stars: 15, category: "food", emoji: "\uD83C\uDF55" },
  { name: "Filmkveld", description: "Velg en film alle ser sammen", stars: 10, category: "experience", emoji: "\uD83C\uDFAC" },
  { name: "Godteripose", description: "Velg en pose fra butikken", stars: 8, category: "food", emoji: "\uD83C\uDF6C" },
  { name: "Ekstra skjermtid", description: "30 min ekstra skjermtid en dag", stars: 5, category: "privilege", emoji: "\uD83D\uDCF1" },
  { name: "Legge seg sent", description: "Fa legge seg 1 time senere", stars: 12, category: "privilege", emoji: "\uD83C\uDF19" },
  { name: "Brettspillkveld", description: "Familien spiller brettspill", stars: 8, category: "activity", emoji: "\uD83C\uDFB2" },
  { name: "Tur til badeland", description: "Familietur til badeland!", stars: 30, category: "experience", emoji: "\uD83C\uDFCA" },
  { name: "Ny bok", description: "Velg en bok pa bokhandelen", stars: 12, category: "purchase", emoji: "\uD83D\uDCDA" },
  { name: "Velge middag", description: "Du bestemmer hva vi spiser", stars: 6, category: "privilege", emoji: "\uD83C\uDF73" },
  { name: "Venn pa overnatting", description: "Inviter en venn pa overnatting", stars: 15, category: "experience", emoji: "\uD83D\uDECF\uFE0F" },
  { name: "Familieutflukt", description: "Velg et utfluktmal for familien", stars: 25, category: "experience", emoji: "\uD83C\uDFD5\uFE0F" },
  { name: "Eget valg", description: "Forelder og barn avtaler", stars: 10, category: "custom", emoji: "\u2728" },
  // In-game rewards
  { name: "Mystery Crate", description: "Apne en mysterie-kiste med tilfeldig item", stars: 5, category: "ingame", emoji: "\uD83D\uDCE6" },
  { name: "Streak Freeze", description: "Fa en ekstra streak freeze", stars: 3, category: "ingame", emoji: "\u2744\uFE0F" },
  { name: "XP-boost", description: "Dobbel season XP i 24 timer", stars: 8, category: "ingame", emoji: "\u26A1" },
  { name: "Bonus Mana", description: "+200 bonus mana", stars: 4, category: "ingame", emoji: "\uD83D\uDD2E" },
];

export function getCategoryLabel(category: GuildRewardCategory): string {
  return REWARD_CATEGORIES.find((c) => c.key === category)?.label ?? "Annet";
}

export function getCategoryEmoji(category: GuildRewardCategory): string {
  return REWARD_CATEGORIES.find((c) => c.key === category)?.emoji ?? "\u2728";
}
