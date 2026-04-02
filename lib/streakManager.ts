import { MAX_STREAK_FREEZES, STREAK_FREEZE_EARN_INTERVAL } from "./dailyLogin";

export interface StreakState {
  currentStreak: number;
  freezesAvailable: number;
  isProtected: boolean;
  lastActivityDate: string | null;
}

export function shouldBreakStreak(
  lastActivityDate: string | null,
  today: string
): boolean {
  if (!lastActivityDate) return false;

  const last = new Date(lastActivityDate);
  const now = new Date(today);
  last.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays > 1;
}

export function canUseFreeze(freezesAvailable: number): boolean {
  return freezesAvailable > 0;
}

export function getStreakFlameLevel(streak: number): "none" | "small" | "medium" | "large" | "inferno" {
  if (streak >= 30) return "inferno";
  if (streak >= 14) return "large";
  if (streak >= 7) return "medium";
  if (streak >= 3) return "small";
  return "none";
}

export function getStreakFlameEmoji(streak: number): string {
  const level = getStreakFlameLevel(streak);
  switch (level) {
    case "inferno": return "\uD83C\uDF1F\uD83D\uDD25";
    case "large": return "\uD83D\uDD25\uD83D\uDD25";
    case "medium": return "\uD83D\uDD25";
    case "small": return "\uD83E\uDD6A";
    default: return "\u2744\uFE0F";
  }
}

export function getStreakMilestones(): Array<{ days: number; reward: string; emoji: string }> {
  return [
    { days: 3, reward: "50 bonus mana", emoji: "\uD83D\uDD25" },
    { days: 7, reward: "Tittel: Ukekjemper", emoji: "\uD83C\uDFC5" },
    { days: 14, reward: "200 bonus mana", emoji: "\uD83C\uDF1F" },
    { days: 30, reward: "Emote: Streakflamme + Tittel", emoji: "\uD83C\uDFC6" },
    { days: 100, reward: "Tittel: Ubrytelig", emoji: "\uD83D\uDC8E" },
  ];
}

export const RECOVERY_QUEST_DURATION_MINUTES = 60;

export function isRecoveryQuestEligible(
  currentStreak: number,
  lastStreakBrokenDate: string | null
): boolean {
  if (currentStreak > 0) return false;
  if (!lastStreakBrokenDate) return false;

  const broken = new Date(lastStreakBrokenDate);
  const now = new Date();
  const diffHours = (now.getTime() - broken.getTime()) / (1000 * 60 * 60);

  return diffHours <= 48;
}

export const DAILY_MANA_CAP = 500;
export const DAILY_QUEST_CAP = 6;
export const DAILY_DUNGEON_CAP = 1;

export function isManaCapped(todayMana: number): boolean {
  return todayMana >= DAILY_MANA_CAP;
}

export function isDailyComplete(completedQuests: number): boolean {
  return completedQuests >= DAILY_QUEST_CAP;
}
