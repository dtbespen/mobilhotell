export const DEFAULT_QUEST_TYPES = [
  {
    name: "Skjermfri tid",
    category: "screen_free" as const,
    points_per_minute: 1,
    icon: "smartphone-off",
    emoji: "\u{1F4F5}",
  },
  {
    name: "Lese bok",
    category: "reading" as const,
    points_per_minute: 2,
    icon: "book-open",
    emoji: "\u{1F4D6}",
  },
  {
    name: "Lydbok",
    category: "reading" as const,
    points_per_minute: 2,
    icon: "headphones",
    emoji: "\u{1F3A7}",
  },
  {
    name: "Lage ting",
    category: "creating" as const,
    points_per_minute: 2,
    icon: "palette",
    emoji: "\u{1F3A8}",
  },
  {
    name: "Mobilhotell",
    category: "screen_free" as const,
    points_per_minute: 1.5,
    icon: "hotel",
    emoji: "\u{1F3F0}",
  },
];

/** @deprecated Use DEFAULT_QUEST_TYPES */
export const DEFAULT_ACTIVITY_TYPES = DEFAULT_QUEST_TYPES;

export function calculatePoints(
  durationMinutes: number,
  pointsPerMinute: number
): number {
  return Math.round(durationMinutes * pointsPerMinute);
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}t`;
  return `${hours}t ${mins}m`;
}

export function formatPoints(points: number): string {
  if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}k`;
  }
  return points.toString();
}

export function formatMana(mana: number): string {
  return formatPoints(mana);
}
