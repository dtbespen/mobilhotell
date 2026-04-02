import type { CharacterClass } from "./database.types";

export type SkillBranch = "offense" | "support" | "special";

export type SkillEffectType =
  | "damage_boost"
  | "damage_flat"
  | "mana_boost"
  | "guild_boost"
  | "streak_shield"
  | "streak_restore"
  | "crit_chance"
  | "loot_bonus"
  | "cooldown_reduce"
  | "season_xp_boost"
  | "boss_weakness";

export interface SkillNode {
  id: string;
  name: string;
  nameNorwegian: string;
  description: string;
  branch: SkillBranch;
  characterClass: CharacterClass;
  requiredLevel: number;
  prerequisiteId: string | null;
  maxRank: number;
  costPerRank: number;
  effectType: SkillEffectType;
  effectValue: number;
  effectPerRank: number;
  icon: string;
}

export interface SkillAllocation {
  skillId: string;
  currentRank: number;
}

export function getSkillPoints(level: number): number {
  return Math.floor(level / 3);
}

export function getSpentPoints(allocations: SkillAllocation[]): number {
  return allocations.reduce((sum, a) => sum + a.currentRank, 0);
}

export function getAvailablePoints(level: number, allocations: SkillAllocation[]): number {
  return Math.max(getSkillPoints(level) - getSpentPoints(allocations), 0);
}

export function canAllocate(
  skill: SkillNode,
  currentRank: number,
  level: number,
  allocations: SkillAllocation[],
  allSkills: SkillNode[]
): boolean {
  if (currentRank >= skill.maxRank) return false;
  if (level < skill.requiredLevel) return false;
  if (getAvailablePoints(level, allocations) < skill.costPerRank) return false;

  if (skill.prerequisiteId) {
    const prereqAlloc = allocations.find((a) => a.skillId === skill.prerequisiteId);
    const prereqSkill = allSkills.find((s) => s.id === skill.prerequisiteId);
    if (!prereqAlloc || !prereqSkill || prereqAlloc.currentRank < prereqSkill.maxRank) {
      return false;
    }
  }

  return true;
}

export function getTotalEffectValue(
  skill: SkillNode,
  rank: number
): number {
  return skill.effectValue + skill.effectPerRank * (rank - 1);
}

const WIZARD_SKILLS: SkillNode[] = [
  // Offense branch
  { id: "wiz_arcane_blast", name: "Arcane Blast", nameNorwegian: "Arkan Eksplosjon", description: "+50% damage pa neste boss-bidrag", branch: "offense", characterClass: "wizard", requiredLevel: 5, prerequisiteId: null, maxRank: 3, costPerRank: 1, effectType: "damage_boost", effectValue: 1.5, effectPerRank: 0.25, icon: "arcane_blast" },
  { id: "wiz_firestorm", name: "Firestorm", nameNorwegian: "Ildstorm", description: "Ildmagi som treffer alle fiender", branch: "offense", characterClass: "wizard", requiredLevel: 12, prerequisiteId: "wiz_arcane_blast", maxRank: 2, costPerRank: 1, effectType: "damage_boost", effectValue: 2.0, effectPerRank: 0.5, icon: "firestorm" },
  { id: "wiz_meteor", name: "Meteor", nameNorwegian: "Meteor", description: "Massiv damage fra himmelen", branch: "offense", characterClass: "wizard", requiredLevel: 25, prerequisiteId: "wiz_firestorm", maxRank: 2, costPerRank: 2, effectType: "damage_boost", effectValue: 3.0, effectPerRank: 1.0, icon: "meteor" },
  { id: "wiz_cosmic", name: "Cosmic Annihilation", nameNorwegian: "Kosmisk Utslettelse", description: "Den ultimate destruksjonsmagi", branch: "offense", characterClass: "wizard", requiredLevel: 40, prerequisiteId: "wiz_meteor", maxRank: 1, costPerRank: 3, effectType: "damage_boost", effectValue: 5.0, effectPerRank: 0, icon: "cosmic" },

  // Support branch
  { id: "wiz_mana_surge", name: "Mana Surge", nameNorwegian: "Mana-bolge", description: "2x mana pa neste quest", branch: "support", characterClass: "wizard", requiredLevel: 5, prerequisiteId: null, maxRank: 3, costPerRank: 1, effectType: "mana_boost", effectValue: 2.0, effectPerRank: 0.5, icon: "mana_surge" },
  { id: "wiz_guild_shield", name: "Guild Shield", nameNorwegian: "Guildskjold", description: "Beskytter hele guildets streak", branch: "support", characterClass: "wizard", requiredLevel: 12, prerequisiteId: "wiz_mana_surge", maxRank: 2, costPerRank: 1, effectType: "streak_shield", effectValue: 0.25, effectPerRank: 0.15, icon: "guild_shield" },
  { id: "wiz_time_warp", name: "Time Warp", nameNorwegian: "Tidsvridning", description: "Dobbelt season XP i 1 time", branch: "support", characterClass: "wizard", requiredLevel: 25, prerequisiteId: "wiz_guild_shield", maxRank: 2, costPerRank: 2, effectType: "season_xp_boost", effectValue: 2.0, effectPerRank: 0.5, icon: "time_warp" },
  { id: "wiz_infinity", name: "Infinity Mana", nameNorwegian: "Uendelig Mana", description: "Alle i guildet far +25% mana", branch: "support", characterClass: "wizard", requiredLevel: 40, prerequisiteId: "wiz_time_warp", maxRank: 1, costPerRank: 3, effectType: "guild_boost", effectValue: 1.25, effectPerRank: 0, icon: "infinity" },

  // Special branch
  { id: "wiz_spell_echo", name: "Spell Echo", nameNorwegian: "Trolldomsekko", description: "30% sjanse for dobbel effekt", branch: "special", characterClass: "wizard", requiredLevel: 8, prerequisiteId: null, maxRank: 2, costPerRank: 1, effectType: "crit_chance", effectValue: 0.3, effectPerRank: 0.1, icon: "spell_echo" },
  { id: "wiz_mystic_vision", name: "Mystic Vision", nameNorwegian: "Mystisk Syn", description: "Se skjulte achievements og hemmeligheter", branch: "special", characterClass: "wizard", requiredLevel: 15, prerequisiteId: "wiz_spell_echo", maxRank: 1, costPerRank: 1, effectType: "loot_bonus", effectValue: 1.3, effectPerRank: 0, icon: "mystic_vision" },
  { id: "wiz_dimension_rift", name: "Dimension Rift", nameNorwegian: "Dimensjonssprekk", description: "Avdekk boss svakheter for hele guildet", branch: "special", characterClass: "wizard", requiredLevel: 30, prerequisiteId: "wiz_mystic_vision", maxRank: 2, costPerRank: 2, effectType: "boss_weakness", effectValue: 1.2, effectPerRank: 0.1, icon: "dimension_rift" },
  { id: "wiz_omnicast", name: "Omni-Cast", nameNorwegian: "Omni-Kast", description: "Alle evner har halv cooldown", branch: "special", characterClass: "wizard", requiredLevel: 45, prerequisiteId: "wiz_dimension_rift", maxRank: 1, costPerRank: 3, effectType: "cooldown_reduce", effectValue: 0.5, effectPerRank: 0, icon: "omnicast" },
];

const KNIGHT_SKILLS: SkillNode[] = [
  { id: "kni_power_strike", name: "Power Strike", nameNorwegian: "Krafthugg", description: "+300 flat damage", branch: "offense", characterClass: "knight", requiredLevel: 5, prerequisiteId: null, maxRank: 3, costPerRank: 1, effectType: "damage_flat", effectValue: 300, effectPerRank: 150, icon: "power_strike" },
  { id: "kni_whirlwind", name: "Whirlwind", nameNorwegian: "Virvelvind", description: "Treff bossen med virvlende sverd", branch: "offense", characterClass: "knight", requiredLevel: 12, prerequisiteId: "kni_power_strike", maxRank: 2, costPerRank: 1, effectType: "damage_boost", effectValue: 2.0, effectPerRank: 0.5, icon: "whirlwind" },
  { id: "kni_dragon_strike", name: "Dragon Strike", nameNorwegian: "Dragehugg", description: "Ildsverd som gjor ekstra damage", branch: "offense", characterClass: "knight", requiredLevel: 25, prerequisiteId: "kni_whirlwind", maxRank: 2, costPerRank: 2, effectType: "damage_boost", effectValue: 3.0, effectPerRank: 1.0, icon: "dragon_strike" },
  { id: "kni_ragnarok", name: "Ragnarok", nameNorwegian: "Ragnarok", description: "Den ultimate krigerevne", branch: "offense", characterClass: "knight", requiredLevel: 40, prerequisiteId: "kni_dragon_strike", maxRank: 1, costPerRank: 3, effectType: "damage_boost", effectValue: 5.0, effectPerRank: 0, icon: "ragnarok" },

  { id: "kni_shield_wall", name: "Shield Wall", nameNorwegian: "Skjoldmur", description: "Beskytter streaken din", branch: "support", characterClass: "knight", requiredLevel: 5, prerequisiteId: null, maxRank: 3, costPerRank: 1, effectType: "streak_shield", effectValue: 0.5, effectPerRank: 0.15, icon: "shield_wall" },
  { id: "kni_rally_cry", name: "Rally Cry", nameNorwegian: "Samlingsrop", description: "Hele guildet far +10% mana", branch: "support", characterClass: "knight", requiredLevel: 12, prerequisiteId: "kni_shield_wall", maxRank: 2, costPerRank: 1, effectType: "guild_boost", effectValue: 1.1, effectPerRank: 0.05, icon: "rally_cry" },
  { id: "kni_fortress", name: "Fortress", nameNorwegian: "Festning", description: "Guildets streak-beskyttelse fordobles", branch: "support", characterClass: "knight", requiredLevel: 25, prerequisiteId: "kni_rally_cry", maxRank: 2, costPerRank: 2, effectType: "streak_shield", effectValue: 1.0, effectPerRank: 0.25, icon: "fortress" },
  { id: "kni_immortal", name: "Immortal Guard", nameNorwegian: "Udodelig Vakt", description: "Streak kan aldri gaa under 3", branch: "support", characterClass: "knight", requiredLevel: 40, prerequisiteId: "kni_fortress", maxRank: 1, costPerRank: 3, effectType: "streak_shield", effectValue: 1.0, effectPerRank: 0, icon: "immortal" },

  { id: "kni_intimidate", name: "Intimidate", nameNorwegian: "Skremsel", description: "+20% boss damage for guildet", branch: "special", characterClass: "knight", requiredLevel: 8, prerequisiteId: null, maxRank: 2, costPerRank: 1, effectType: "boss_weakness", effectValue: 1.2, effectPerRank: 0.1, icon: "intimidate" },
  { id: "kni_treasure_sense", name: "Treasure Sense", nameNorwegian: "Skattesans", description: "Bedre loot fra bosser", branch: "special", characterClass: "knight", requiredLevel: 15, prerequisiteId: "kni_intimidate", maxRank: 1, costPerRank: 1, effectType: "loot_bonus", effectValue: 1.25, effectPerRank: 0, icon: "treasure_sense" },
  { id: "kni_challenge", name: "Challenge", nameNorwegian: "Utfordring", description: "Provoserer bossen for bonus XP", branch: "special", characterClass: "knight", requiredLevel: 30, prerequisiteId: "kni_treasure_sense", maxRank: 2, costPerRank: 2, effectType: "season_xp_boost", effectValue: 1.5, effectPerRank: 0.25, icon: "challenge" },
  { id: "kni_legend", name: "Living Legend", nameNorwegian: "Levende Legende", description: "Alle stats +10%", branch: "special", characterClass: "knight", requiredLevel: 45, prerequisiteId: "kni_challenge", maxRank: 1, costPerRank: 3, effectType: "damage_boost", effectValue: 1.1, effectPerRank: 0, icon: "legend" },
];

const DRUID_SKILLS: SkillNode[] = [
  { id: "dru_natures_wrath", name: "Nature's Wrath", nameNorwegian: "Naturens Vrede", description: "Naturmagi som gjor damage over tid", branch: "offense", characterClass: "druid", requiredLevel: 5, prerequisiteId: null, maxRank: 3, costPerRank: 1, effectType: "damage_boost", effectValue: 1.3, effectPerRank: 0.2, icon: "natures_wrath" },
  { id: "dru_entangle", name: "Entangle", nameNorwegian: "Innfiltring", description: "Roetter holder bossen nede", branch: "offense", characterClass: "druid", requiredLevel: 12, prerequisiteId: "dru_natures_wrath", maxRank: 2, costPerRank: 1, effectType: "boss_weakness", effectValue: 1.3, effectPerRank: 0.15, icon: "entangle" },
  { id: "dru_storm_call", name: "Storm Call", nameNorwegian: "Stormkall", description: "Kall paa naturens krefter", branch: "offense", characterClass: "druid", requiredLevel: 25, prerequisiteId: "dru_entangle", maxRank: 2, costPerRank: 2, effectType: "damage_boost", effectValue: 2.5, effectPerRank: 0.75, icon: "storm_call" },
  { id: "dru_world_tree", name: "World Tree", nameNorwegian: "Verdenstre", description: "Hele guildet gjor dobbel damage", branch: "offense", characterClass: "druid", requiredLevel: 40, prerequisiteId: "dru_storm_call", maxRank: 1, costPerRank: 3, effectType: "guild_boost", effectValue: 2.0, effectPerRank: 0, icon: "world_tree" },

  { id: "dru_natures_gift", name: "Nature's Gift", nameNorwegian: "Naturens Gave", description: "Guild far +15% mana", branch: "support", characterClass: "druid", requiredLevel: 5, prerequisiteId: null, maxRank: 3, costPerRank: 1, effectType: "guild_boost", effectValue: 1.15, effectPerRank: 0.05, icon: "natures_gift" },
  { id: "dru_regrowth", name: "Regrowth", nameNorwegian: "Gjenvekst", description: "Gjenopprett tapt streak", branch: "support", characterClass: "druid", requiredLevel: 12, prerequisiteId: "dru_natures_gift", maxRank: 2, costPerRank: 1, effectType: "streak_restore", effectValue: 1, effectPerRank: 1, icon: "regrowth" },
  { id: "dru_life_bloom", name: "Life Bloom", nameNorwegian: "Livsblomst", description: "Hele guildet far streak-beskyttelse", branch: "support", characterClass: "druid", requiredLevel: 25, prerequisiteId: "dru_regrowth", maxRank: 2, costPerRank: 2, effectType: "streak_shield", effectValue: 0.5, effectPerRank: 0.2, icon: "life_bloom" },
  { id: "dru_eternal_spring", name: "Eternal Spring", nameNorwegian: "Evig Var", description: "+30% mana for alle, alltid", branch: "support", characterClass: "druid", requiredLevel: 40, prerequisiteId: "dru_life_bloom", maxRank: 1, costPerRank: 3, effectType: "guild_boost", effectValue: 1.3, effectPerRank: 0, icon: "eternal_spring" },

  { id: "dru_keen_eye", name: "Keen Eye", nameNorwegian: "Skarpt Oye", description: "Finn skjulte items lettere", branch: "special", characterClass: "druid", requiredLevel: 8, prerequisiteId: null, maxRank: 2, costPerRank: 1, effectType: "loot_bonus", effectValue: 1.3, effectPerRank: 0.15, icon: "keen_eye" },
  { id: "dru_animal_bond", name: "Animal Bond", nameNorwegian: "Dyrband", description: "Familiars gir bonus stats", branch: "special", characterClass: "druid", requiredLevel: 15, prerequisiteId: "dru_keen_eye", maxRank: 1, costPerRank: 1, effectType: "mana_boost", effectValue: 1.15, effectPerRank: 0, icon: "animal_bond" },
  { id: "dru_wild_shape", name: "Wild Shape", nameNorwegian: "Vill Form", description: "Forvandle deg for bonus season XP", branch: "special", characterClass: "druid", requiredLevel: 30, prerequisiteId: "dru_animal_bond", maxRank: 2, costPerRank: 2, effectType: "season_xp_boost", effectValue: 1.5, effectPerRank: 0.25, icon: "wild_shape" },
  { id: "dru_avatar_nature", name: "Avatar of Nature", nameNorwegian: "Naturens Avatar", description: "Alle evner koster ingen mana", branch: "special", characterClass: "druid", requiredLevel: 45, prerequisiteId: "dru_wild_shape", maxRank: 1, costPerRank: 3, effectType: "cooldown_reduce", effectValue: 0.5, effectPerRank: 0, icon: "avatar_nature" },
];

const ROGUE_SKILLS: SkillNode[] = [
  { id: "rog_lucky_strike", name: "Lucky Strike", nameNorwegian: "Heldig Treff", description: "30% sjanse for 3x damage", branch: "offense", characterClass: "rogue", requiredLevel: 5, prerequisiteId: null, maxRank: 3, costPerRank: 1, effectType: "crit_chance", effectValue: 0.3, effectPerRank: 0.1, icon: "lucky_strike" },
  { id: "rog_backstab", name: "Backstab", nameNorwegian: "Ryggdolk", description: "Massiv damage fra skyggen", branch: "offense", characterClass: "rogue", requiredLevel: 12, prerequisiteId: "rog_lucky_strike", maxRank: 2, costPerRank: 1, effectType: "damage_boost", effectValue: 2.5, effectPerRank: 0.75, icon: "backstab" },
  { id: "rog_assassinate", name: "Assassinate", nameNorwegian: "Snikmord", description: "Ekstra damage naar boss er under 25% HP", branch: "offense", characterClass: "rogue", requiredLevel: 25, prerequisiteId: "rog_backstab", maxRank: 2, costPerRank: 2, effectType: "damage_boost", effectValue: 3.0, effectPerRank: 1.0, icon: "assassinate" },
  { id: "rog_shadow_death", name: "Shadow of Death", nameNorwegian: "Skyggedor", description: "Garantert kritisk treff", branch: "offense", characterClass: "rogue", requiredLevel: 40, prerequisiteId: "rog_assassinate", maxRank: 1, costPerRank: 3, effectType: "crit_chance", effectValue: 1.0, effectPerRank: 0, icon: "shadow_death" },

  { id: "rog_evasion", name: "Evasion", nameNorwegian: "Unnvikelse", description: "Beskytt streaken med smidighet", branch: "support", characterClass: "rogue", requiredLevel: 5, prerequisiteId: null, maxRank: 3, costPerRank: 1, effectType: "streak_shield", effectValue: 0.35, effectPerRank: 0.1, icon: "evasion" },
  { id: "rog_smoke_bomb", name: "Smoke Bomb", nameNorwegian: "Roykbombe", description: "Hele guildet far streak-beskyttelse", branch: "support", characterClass: "rogue", requiredLevel: 12, prerequisiteId: "rog_evasion", maxRank: 2, costPerRank: 1, effectType: "streak_shield", effectValue: 0.3, effectPerRank: 0.15, icon: "smoke_bomb" },
  { id: "rog_shadow_cloak", name: "Shadow Cloak", nameNorwegian: "Skyggekappe", description: "+Season XP fra alle quests", branch: "support", characterClass: "rogue", requiredLevel: 25, prerequisiteId: "rog_smoke_bomb", maxRank: 2, costPerRank: 2, effectType: "season_xp_boost", effectValue: 1.3, effectPerRank: 0.2, icon: "shadow_cloak" },
  { id: "rog_phantom", name: "Phantom", nameNorwegian: "Fantom", description: "Dobbel daily login bonus", branch: "support", characterClass: "rogue", requiredLevel: 40, prerequisiteId: "rog_shadow_cloak", maxRank: 1, costPerRank: 3, effectType: "mana_boost", effectValue: 2.0, effectPerRank: 0, icon: "phantom" },

  { id: "rog_treasure_hunter", name: "Treasure Hunter", nameNorwegian: "Skattejeger", description: "+50% sjanse for sjeldnere loot", branch: "special", characterClass: "rogue", requiredLevel: 8, prerequisiteId: null, maxRank: 2, costPerRank: 1, effectType: "loot_bonus", effectValue: 1.5, effectPerRank: 0.25, icon: "treasure_hunter" },
  { id: "rog_lockpick", name: "Lockpick", nameNorwegian: "Dirk", description: "Aapne mysteriekister automatisk", branch: "special", characterClass: "rogue", requiredLevel: 15, prerequisiteId: "rog_treasure_hunter", maxRank: 1, costPerRank: 1, effectType: "loot_bonus", effectValue: 1.3, effectPerRank: 0, icon: "lockpick" },
  { id: "rog_fortune", name: "Fortune's Favor", nameNorwegian: "Skjebnens Gunst", description: "Sjeldne items dropper oftere", branch: "special", characterClass: "rogue", requiredLevel: 30, prerequisiteId: "rog_lockpick", maxRank: 2, costPerRank: 2, effectType: "loot_bonus", effectValue: 1.5, effectPerRank: 0.25, icon: "fortune" },
  { id: "rog_midas", name: "Midas Touch", nameNorwegian: "Midas-beoring", description: "Alt du gjor gir bonus mana", branch: "special", characterClass: "rogue", requiredLevel: 45, prerequisiteId: "rog_fortune", maxRank: 1, costPerRank: 3, effectType: "mana_boost", effectValue: 1.5, effectPerRank: 0, icon: "midas" },
];

const ALL_SKILLS: SkillNode[] = [
  ...WIZARD_SKILLS,
  ...KNIGHT_SKILLS,
  ...DRUID_SKILLS,
  ...ROGUE_SKILLS,
];

export function getSkillsForClass(characterClass: CharacterClass): SkillNode[] {
  return ALL_SKILLS.filter((s) => s.characterClass === characterClass);
}

export function getSkillById(id: string): SkillNode | undefined {
  return ALL_SKILLS.find((s) => s.id === id);
}

export function getSkillsByBranch(
  characterClass: CharacterClass,
  branch: SkillBranch
): SkillNode[] {
  return ALL_SKILLS.filter(
    (s) => s.characterClass === characterClass && s.branch === branch
  );
}

export function getBranchLabel(branch: SkillBranch): { name: string; emoji: string } {
  switch (branch) {
    case "offense": return { name: "Angrep", emoji: "\u2694\uFE0F" };
    case "support": return { name: "Stotte", emoji: "\uD83D\uDEE1\uFE0F" };
    case "special": return { name: "Spesial", emoji: "\u2728" };
  }
}
