export interface LoginReward {
  day: number;
  mana: number;
  bonusType: "mana" | "item" | "title" | null;
  bonusLabel: string | null;
  bonusRarity: "common" | "uncommon" | "rare" | null;
}

const LOGIN_REWARDS: LoginReward[] = [
  { day: 1, mana: 10, bonusType: null, bonusLabel: null, bonusRarity: null },
  { day: 2, mana: 15, bonusType: null, bonusLabel: null, bonusRarity: null },
  { day: 3, mana: 20, bonusType: "item", bonusLabel: "Mysterie-gjenstand", bonusRarity: "common" },
  { day: 4, mana: 20, bonusType: null, bonusLabel: null, bonusRarity: null },
  { day: 5, mana: 50, bonusType: null, bonusLabel: null, bonusRarity: null },
  { day: 6, mana: 25, bonusType: null, bonusLabel: null, bonusRarity: null },
  { day: 7, mana: 100, bonusType: "item", bonusLabel: "Mysterie-gjenstand", bonusRarity: "uncommon" },
  { day: 8, mana: 25, bonusType: null, bonusLabel: null, bonusRarity: null },
  { day: 9, mana: 30, bonusType: null, bonusLabel: null, bonusRarity: null },
  { day: 10, mana: 35, bonusType: null, bonusLabel: null, bonusRarity: null },
  { day: 11, mana: 40, bonusType: null, bonusLabel: null, bonusRarity: null },
  { day: 12, mana: 45, bonusType: null, bonusLabel: null, bonusRarity: null },
  { day: 13, mana: 50, bonusType: null, bonusLabel: null, bonusRarity: null },
  { day: 14, mana: 200, bonusType: "item", bonusLabel: "Mysterie-gjenstand", bonusRarity: "rare" },
];

export function getLoginReward(consecutiveDays: number): LoginReward {
  const day = ((consecutiveDays - 1) % 14) + 1;
  return LOGIN_REWARDS[day - 1] ?? LOGIN_REWARDS[0];
}

export function getUpcomingRewards(currentDay: number, count: number = 7): LoginReward[] {
  const rewards: LoginReward[] = [];
  for (let i = 0; i < count; i++) {
    const day = ((currentDay + i) % 14) + 1;
    rewards.push({ ...LOGIN_REWARDS[day - 1], day: currentDay + i + 1 });
  }
  return rewards;
}

export function getMonthlyTitle(month: number, year: number): string {
  const monthNames = [
    "Januar", "Februar", "Mars", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Desember",
  ];
  return `${monthNames[month]}-veteranen ${year}`;
}

export const STREAK_FREEZE_EARN_INTERVAL = 7;
export const MAX_STREAK_FREEZES = 2;

export function getStreakFreezeEarned(totalStreakDays: number): number {
  return Math.min(
    Math.floor(totalStreakDays / STREAK_FREEZE_EARN_INTERVAL),
    10
  );
}
