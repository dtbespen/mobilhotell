/**
 * Fair Mana Engine
 *
 * Solves: "9 timer lydbok = 3 levels up" problemet.
 *
 * Design principles:
 * 1. DIMINISHING RETURNS - First minutes are worth most. You can't farm.
 * 2. SESSION CAPS - Each activity type has an optimal session length.
 *    Beyond that, mana tapers off sharply.
 * 3. VARIETY BONUS - Doing different things the same day gives a multiplier.
 * 4. QUALITY > QUANTITY - Active activities (creating, sports) earn more
 *    per minute than passive ones (audiobook).
 * 5. TRANSPARENCY - Every calculation includes a breakdown the kid can see.
 * 6. ANTI-GAMING - Unreasonably long sessions get flagged; repeated identical
 *    sessions same day get reduced returns.
 */

import type { ActivityCategory } from "./database.types";

export interface ManaBreakdown {
  baseMana: number;
  diminishingMana: number;
  varietyBonus: number;
  streakBonus: number;
  equipmentBonus: number;
  totalMana: number;
  sessionEfficiency: number;
  explanation: string[];
  warnings: string[];
}

export interface SessionContext {
  durationMinutes: number;
  category: ActivityCategory;
  todaySessions: Array<{ category: ActivityCategory; durationMinutes: number }>;
  currentStreak: number;
  equipmentManaBonus: number;
}

/**
 * Activity tier config:
 * - sweetSpotMinutes: Where mana/minute is highest
 * - maxEffectiveMinutes: Beyond this, mana gain is minimal
 * - baseRate: Mana per minute at peak
 * - passiveMultiplier: Reduction for passive activities within this category
 */
interface CategoryConfig {
  sweetSpotMinutes: number;
  maxEffectiveMinutes: number;
  baseRate: number;
  label: string;
  labelNorwegian: string;
}

const CATEGORY_CONFIG: Record<ActivityCategory, CategoryConfig> = {
  screen_free: {
    sweetSpotMinutes: 60,
    maxEffectiveMinutes: 180,
    baseRate: 2.5,
    label: "Screen-free time",
    labelNorwegian: "Skjermfri tid",
  },
  reading: {
    sweetSpotMinutes: 45,
    maxEffectiveMinutes: 120,
    baseRate: 3.5,
    label: "Reading / Audiobook",
    labelNorwegian: "Lesing / Lydbok",
  },
  creating: {
    sweetSpotMinutes: 60,
    maxEffectiveMinutes: 180,
    baseRate: 5.0,
    label: "Creating / Making",
    labelNorwegian: "Lage ting / Skape",
  },
  custom: {
    sweetSpotMinutes: 60,
    maxEffectiveMinutes: 150,
    baseRate: 3.0,
    label: "Custom activity",
    labelNorwegian: "Egendefinert",
  },
};

/**
 * Calculates mana with diminishing returns using a logarithmic-ish curve.
 *
 * The curve works like this:
 * - Minutes 1-sweetSpot: Full rate (slightly increasing, peaks at sweetSpot)
 * - Minutes sweetSpot-maxEffective: Tapering off (square root falloff)
 * - Minutes beyond maxEffective: Minimal gain (1/10 rate)
 *
 * Example for "reading" (sweetSpot=40, max=90, rate=1.5):
 *   10 min = ~15 mana (full rate)
 *   30 min = ~45 mana (full rate)
 *   40 min = ~60 mana (peak)
 *   60 min = ~73 mana (tapering)
 *   90 min = ~82 mana (near cap)
 *   540 min (9h) = ~127 mana (almost all wasted, not 1080!)
 */
export function calculateSessionMana(
  durationMinutes: number,
  category: ActivityCategory
): { mana: number; efficiency: number } {
  const config = CATEGORY_CONFIG[category];
  const dur = Math.max(0, Math.round(durationMinutes));

  if (dur === 0) return { mana: 0, efficiency: 0 };

  let mana = 0;

  if (dur <= config.sweetSpotMinutes) {
    mana = dur * config.baseRate;
  } else if (dur <= config.maxEffectiveMinutes) {
    const fullPart = config.sweetSpotMinutes * config.baseRate;
    const overMinutes = dur - config.sweetSpotMinutes;
    const maxOverMinutes = config.maxEffectiveMinutes - config.sweetSpotMinutes;
    const taperFraction = Math.sqrt(overMinutes / maxOverMinutes);
    const taperCap = config.sweetSpotMinutes * config.baseRate * 0.4;
    mana = fullPart + taperCap * taperFraction;
  } else {
    const fullPart = config.sweetSpotMinutes * config.baseRate;
    const taperCap = config.sweetSpotMinutes * config.baseRate * 0.4;
    const overMinutes = dur - config.maxEffectiveMinutes;
    const trickle = Math.min(overMinutes * config.baseRate * 0.05, taperCap * 0.5);
    mana = fullPart + taperCap + trickle;
  }

  mana = Math.round(mana);
  const efficiency = dur > 0 ? Math.round((mana / dur) * 100) / 100 : 0;

  return { mana, efficiency };
}

/**
 * Variety bonus: doing different categories in one day is rewarded.
 * 1 category = 1.0x
 * 2 categories = 1.15x
 * 3 categories = 1.3x
 * 4 categories = 1.5x
 */
function getVarietyMultiplier(uniqueCategoriesToday: number): number {
  if (uniqueCategoriesToday >= 4) return 1.5;
  if (uniqueCategoriesToday >= 3) return 1.3;
  if (uniqueCategoriesToday >= 2) return 1.15;
  return 1.0;
}

/**
 * Repeated same-category penalty: doing the same thing multiple times
 * in one day gives reduced returns on sessions 2+.
 * Session 1: 1.0x
 * Session 2: 0.7x
 * Session 3: 0.5x
 * Session 4+: 0.3x
 */
function getRepeatPenalty(sameCategorySessionsToday: number): number {
  if (sameCategorySessionsToday <= 1) return 1.0;
  if (sameCategorySessionsToday === 2) return 0.7;
  if (sameCategorySessionsToday === 3) return 0.5;
  return 0.3;
}

/**
 * Streak bonus: consecutive day streak gives small mana boost.
 * Encourages consistency without being game-breaking.
 */
function getStreakMultiplier(streak: number): number {
  if (streak >= 30) return 1.15;
  if (streak >= 14) return 1.1;
  if (streak >= 7) return 1.05;
  return 1.0;
}

/**
 * Full mana calculation with all factors and a transparent breakdown.
 */
export function calculateMana(context: SessionContext): ManaBreakdown {
  const { durationMinutes, category, todaySessions, currentStreak, equipmentManaBonus } = context;
  const config = CATEGORY_CONFIG[category];

  const { mana: baseMana, efficiency } = calculateSessionMana(durationMinutes, category);

  const sameCategorySessions = todaySessions.filter((s) => s.category === category).length + 1;
  const repeatPenalty = getRepeatPenalty(sameCategorySessions);
  const diminishingMana = Math.round(baseMana * repeatPenalty);

  const allCategoriesToday = new Set([
    ...todaySessions.map((s) => s.category),
    category,
  ]);
  const varietyMultiplier = getVarietyMultiplier(allCategoriesToday.size);
  const varietyBonus = Math.round(diminishingMana * (varietyMultiplier - 1));

  const streakMultiplier = getStreakMultiplier(currentStreak);
  const streakBonus = Math.round((diminishingMana + varietyBonus) * (streakMultiplier - 1));

  const subtotal = diminishingMana + varietyBonus + streakBonus;
  const equipBonus = Math.round(subtotal * (equipmentManaBonus / 100));

  const totalMana = subtotal + equipBonus;

  const explanation: string[] = [];
  const warnings: string[] = [];

  explanation.push(`${config.labelNorwegian}: ${durationMinutes} min`);

  if (durationMinutes <= config.sweetSpotMinutes) {
    explanation.push(`Full rate: ${baseMana} mana`);
  } else if (durationMinutes <= config.maxEffectiveMinutes) {
    explanation.push(`${config.sweetSpotMinutes} min full rate + avtagende: ${baseMana} mana`);
  } else {
    explanation.push(
      `Maks effektiv tid er ${config.maxEffectiveMinutes} min. Du fikk ${baseMana} mana.`
    );
    warnings.push(
      `Etter ${config.maxEffectiveMinutes} minutter gir ${config.labelNorwegian.toLowerCase()} veldig lite ekstra mana. Prøv noe annet!`
    );
  }

  if (repeatPenalty < 1) {
    explanation.push(
      `Sesjon ${sameCategorySessions} i dag (${Math.round(repeatPenalty * 100)}% rate): ${diminishingMana} mana`
    );
    if (sameCategorySessions >= 3) {
      warnings.push("Prøv en annen aktivitet for å få mer mana!");
    }
  }

  if (varietyBonus > 0) {
    explanation.push(
      `Variasjon (${allCategoriesToday.size} typer i dag): +${varietyBonus} mana`
    );
  }

  if (streakBonus > 0) {
    explanation.push(`${currentStreak}-dagers streak bonus: +${streakBonus} mana`);
  }

  if (equipBonus > 0) {
    explanation.push(`Utstyrsbonus (+${equipmentManaBonus}%): +${equipBonus} mana`);
  }

  if (durationMinutes > config.maxEffectiveMinutes * 3) {
    warnings.push(
      "Veldig lang sesjon registrert. Er dette riktig?"
    );
  }

  return {
    baseMana,
    diminishingMana,
    varietyBonus,
    streakBonus,
    equipmentBonus: equipBonus,
    totalMana,
    sessionEfficiency: efficiency,
    explanation,
    warnings,
  };
}

/**
 * Quick calculation for display/preview (without full context).
 */
export function estimateMana(durationMinutes: number, category: ActivityCategory): number {
  return calculateSessionMana(durationMinutes, category).mana;
}

/**
 * Get the optimal session length label for display.
 */
export function getOptimalSessionLabel(category: ActivityCategory): string {
  const config = CATEGORY_CONFIG[category];
  return `${config.sweetSpotMinutes}-${config.maxEffectiveMinutes} min`;
}

/**
 * Get category config for display.
 */
export function getCategoryConfig(category: ActivityCategory): CategoryConfig {
  return CATEGORY_CONFIG[category];
}

/**
 * Compare old (linear) vs new (fair) to show the difference.
 * Useful for testing/demo.
 */
export function compareOldVsNew(
  durationMinutes: number,
  category: ActivityCategory,
  oldPointsPerMinute: number
): { oldMana: number; newMana: number; fairnessRatio: number } {
  const oldMana = Math.round(durationMinutes * oldPointsPerMinute);
  const newMana = calculateSessionMana(durationMinutes, category).mana;
  return {
    oldMana,
    newMana,
    fairnessRatio: oldMana > 0 ? Math.round((newMana / oldMana) * 100) : 100,
  };
}
