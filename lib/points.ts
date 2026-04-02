export const DEFAULT_ACTIVITY_TYPES = [
  {
    name: "Skjermfri tid",
    category: "screen_free" as const,
    points_per_minute: 1,
    icon: "smartphone-off",
  },
  {
    name: "Lese bok",
    category: "reading" as const,
    points_per_minute: 2,
    icon: "book-open",
  },
  {
    name: "Lydbok",
    category: "reading" as const,
    points_per_minute: 2,
    icon: "headphones",
  },
  {
    name: "Lage ting",
    category: "creating" as const,
    points_per_minute: 2,
    icon: "palette",
  },
  {
    name: "Mobilhotell",
    category: "screen_free" as const,
    points_per_minute: 1.5,
    icon: "hotel",
  },
];

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
