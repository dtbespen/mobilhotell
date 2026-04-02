import type { EquipmentStats, AvatarConfig, ItemRarity } from "./database.types";

export interface SetBonus {
  piecesRequired: number;
  bonus: Partial<EquipmentStats>;
  label: string;
  isActive: boolean;
}

export function calculateTotalStats(
  equippedItems: Array<{ stats: EquipmentStats | null }>
): EquipmentStats {
  const base: EquipmentStats = {
    manaBonus: 0,
    damageBonus: 0,
    streakShield: 0,
    guildBoost: 0,
    lootBonus: 0,
  };

  for (const item of equippedItems) {
    if (!item.stats) continue;
    base.manaBonus += item.stats.manaBonus ?? 0;
    base.damageBonus += item.stats.damageBonus ?? 0;
    base.streakShield += item.stats.streakShield ?? 0;
    base.guildBoost += item.stats.guildBoost ?? 0;
    base.lootBonus += item.stats.lootBonus ?? 0;
  }

  return base;
}

export function getSetBonuses(
  equippedSetPieces: number,
  totalSlots: number = 8
): SetBonus[] {
  return [
    {
      piecesRequired: 3,
      bonus: { manaBonus: 10 },
      label: "+10% Mana",
      isActive: equippedSetPieces >= 3,
    },
    {
      piecesRequired: 5,
      bonus: { damageBonus: 15 },
      label: "+15% Boss Damage + Glow",
      isActive: equippedSetPieces >= 5,
    },
    {
      piecesRequired: totalSlots,
      bonus: { manaBonus: 5, damageBonus: 5, streakShield: 5, guildBoost: 5, lootBonus: 5 },
      label: "+5% Alt + Set Emote",
      isActive: equippedSetPieces >= totalSlots,
    },
  ];
}

export function compareItems(
  current: EquipmentStats | null,
  candidate: EquipmentStats | null
): { better: string[]; worse: string[]; equal: string[] } {
  const stats: (keyof EquipmentStats)[] = [
    "manaBonus", "damageBonus", "streakShield", "guildBoost", "lootBonus",
  ];

  const better: string[] = [];
  const worse: string[] = [];
  const equal: string[] = [];

  const labels: Record<keyof EquipmentStats, string> = {
    manaBonus: "Mana",
    damageBonus: "Damage",
    streakShield: "Streak",
    guildBoost: "Guild",
    lootBonus: "Loot",
  };

  for (const stat of stats) {
    const curVal = current?.[stat] ?? 0;
    const candVal = candidate?.[stat] ?? 0;

    if (candVal > curVal) better.push(`+${candVal - curVal}% ${labels[stat]}`);
    else if (candVal < curVal) worse.push(`-${curVal - candVal}% ${labels[stat]}`);
    else if (curVal > 0) equal.push(`${curVal}% ${labels[stat]}`);
  }

  return { better, worse, equal };
}

export function getEquipmentScore(stats: EquipmentStats | null): number {
  if (!stats) return 0;
  return (
    (stats.manaBonus ?? 0) +
    (stats.damageBonus ?? 0) +
    (stats.streakShield ?? 0) +
    (stats.guildBoost ?? 0) +
    (stats.lootBonus ?? 0)
  );
}

export function getRarityWeight(rarity: ItemRarity): number {
  switch (rarity) {
    case "common": return 1;
    case "uncommon": return 2;
    case "rare": return 3;
    case "epic": return 4;
    case "legendary": return 5;
  }
}
