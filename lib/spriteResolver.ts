import type { CharacterClass } from "./database.types";

export type SpriteLayer =
  | "body"
  | "hair"
  | "armor"
  | "hat"
  | "cape"
  | "weapon"
  | "shield"
  | "familiar";

export type AnimationType = "idle" | "walk" | "cast" | "slash" | "hurt";

export interface SpriteFrame {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayerDefinition {
  layer: SpriteLayer;
  zIndex: number;
  assetKey: string | null;
}

const LAYER_Z_ORDER: Record<SpriteLayer, number> = {
  body: 0,
  hair: 1,
  armor: 2,
  hat: 3,
  cape: 4,
  weapon: 5,
  shield: 6,
  familiar: 7,
};

export const FRAME_SIZE = 64;
export const IDLE_FRAMES = 4;
export const WALK_FRAMES = 8;
export const CAST_FRAMES = 7;
export const SLASH_FRAMES = 6;

const ANIMATION_ROWS: Record<AnimationType, number> = {
  idle: 0,
  walk: 1,
  cast: 2,
  slash: 3,
  hurt: 4,
};

export interface AvatarConfigExtended {
  body_color: string;
  hair_style: string | null;
  hair_color: string | null;
  hat: string | null;
  armor: string | null;
  cape: string | null;
  weapon: string | null;
  shield: string | null;
  familiar: string | null;
}

export function resolveSpriteLayers(
  config: AvatarConfigExtended,
  characterClass: CharacterClass
): LayerDefinition[] {
  const layers: LayerDefinition[] = [
    { layer: "body", zIndex: LAYER_Z_ORDER.body, assetKey: config.body_color ? `body_${config.body_color}` : "body_light" },
    { layer: "hair", zIndex: LAYER_Z_ORDER.hair, assetKey: config.hair_style ? `hair_${config.hair_style}_${config.hair_color ?? "brown"}` : null },
    { layer: "armor", zIndex: LAYER_Z_ORDER.armor, assetKey: config.armor ? `${characterClass}_armor_${config.armor}` : null },
    { layer: "hat", zIndex: LAYER_Z_ORDER.hat, assetKey: config.hat ? `${characterClass}_hat_${config.hat}` : null },
    { layer: "cape", zIndex: LAYER_Z_ORDER.cape, assetKey: config.cape ? `${characterClass}_cape_${config.cape}` : null },
    { layer: "weapon", zIndex: LAYER_Z_ORDER.weapon, assetKey: config.weapon ? `${characterClass}_weapon_${config.weapon}` : null },
    { layer: "shield", zIndex: LAYER_Z_ORDER.shield, assetKey: characterClass === "knight" && config.shield ? `knight_shield_${config.shield}` : null },
    { layer: "familiar", zIndex: LAYER_Z_ORDER.familiar, assetKey: config.familiar ? `familiar_${config.familiar}` : null },
  ];

  return layers
    .filter((l) => l.assetKey !== null)
    .sort((a, b) => a.zIndex - b.zIndex);
}

export function getFrameRect(
  animation: AnimationType,
  frameIndex: number
): SpriteFrame {
  const row = ANIMATION_ROWS[animation] ?? 0;
  return {
    x: frameIndex * FRAME_SIZE,
    y: row * FRAME_SIZE,
    width: FRAME_SIZE,
    height: FRAME_SIZE,
  };
}

export function getFrameCount(animation: AnimationType): number {
  switch (animation) {
    case "idle": return IDLE_FRAMES;
    case "walk": return WALK_FRAMES;
    case "cast": return CAST_FRAMES;
    case "slash": return SLASH_FRAMES;
    case "hurt": return 3;
    default: return IDLE_FRAMES;
  }
}

const CLASS_BODY_TINT: Record<CharacterClass, string> = {
  wizard: "#7b61ff",
  knight: "#ff5c4d",
  druid: "#00cc52",
  rogue: "#ffba24",
};

export function getClassTint(characterClass: CharacterClass): string {
  return CLASS_BODY_TINT[characterClass];
}

export const BODY_COLORS = [
  { slug: "light", label: "Lys", hex: "#f5d6b8" },
  { slug: "olive", label: "Oliven", hex: "#c4a882" },
  { slug: "bronze", label: "Bronse", hex: "#a0784a" },
  { slug: "brown", label: "Brun", hex: "#7a5232" },
  { slug: "lavender", label: "Lavendel", hex: "#c8b0ff" },
  { slug: "blue", label: "Bla", hex: "#6aa0ff" },
  { slug: "green", label: "Gronn", hex: "#6aff8a" },
  { slug: "pink", label: "Rosa", hex: "#ff8aaa" },
] as const;

export const HAIR_STYLES = [
  { slug: "plain", label: "Enkel" },
  { slug: "long", label: "Langt" },
  { slug: "mohawk", label: "Mohawk" },
  { slug: "messy", label: "Rufset" },
  { slug: "ponytail", label: "Hestehale" },
  { slug: "braids", label: "Fletter" },
] as const;

export const HAIR_COLORS = [
  { slug: "blonde", label: "Blond", hex: "#e8d06a" },
  { slug: "brown", label: "Brun", hex: "#8a5a2a" },
  { slug: "black", label: "Svart", hex: "#2a2a2a" },
  { slug: "red", label: "Rod", hex: "#cc4422" },
  { slug: "blue", label: "Bla", hex: "#4488ff" },
  { slug: "green", label: "Gronn", hex: "#44cc44" },
  { slug: "purple", label: "Lilla", hex: "#9944ff" },
  { slug: "pink", label: "Rosa", hex: "#ff66aa" },
] as const;
