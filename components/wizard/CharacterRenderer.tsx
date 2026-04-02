import { useMemo } from "react";
import { View, Text } from "react-native";
import { Canvas, Rect, Circle, Shadow, Group } from "@shopify/react-native-skia";
import type { AvatarConfig, CharacterClass, ItemRarity } from "@/lib/database.types";
import { CLASS_CONFIG } from "@/lib/wizard";
import { Rarity } from "@/constants/Colors";
import {
  BODY_BASE,
  HAIR_PATTERNS,
  OUTFIT_PATTERNS,
  HAT_PATTERNS,
  WEAPON_PATTERNS,
  SHIELD_BASE,
  CAPE_BASE,
  FAMILIAR_PATTERNS,
  SKIN_COLORS,
  HAIR_HEX,
  CLASS_PALETTES,
  resolveColor,
  type PixelGrid,
  type ColorRole,
} from "@/lib/pixelPatterns";

interface CharacterRendererProps {
  config: AvatarConfig;
  characterClass: CharacterClass;
  level?: number;
  size?: "sm" | "md" | "lg" | "xl";
  showClass?: boolean;
  showLevel?: boolean;
  glowRarity?: ItemRarity | null;
  animated?: boolean;
}

const GRID_SIZE = 16;

const CANVAS_SIZES: Record<string, number> = {
  sm: 56,
  md: 88,
  lg: 140,
  xl: 192,
};

const FONT_SIZES: Record<string, number> = {
  sm: 7,
  md: 8,
  lg: 9,
  xl: 10,
};

function getRarityGlow(rarity: ItemRarity | null): string | null {
  if (!rarity || rarity === "common") return null;
  return Rarity[rarity] ?? null;
}

function PixelLayer({
  grid,
  pixelSize,
  skinMain,
  skinShadow,
  hairMain,
  hairShadow,
  primary,
  secondary,
  accent,
}: {
  grid: PixelGrid;
  pixelSize: number;
  skinMain: string;
  skinShadow: string;
  hairMain: string;
  hairShadow: string;
  primary: string;
  secondary: string;
  accent: string;
}) {
  const rects = useMemo(() => {
    const result: Array<{ x: number; y: number; color: string }> = [];
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const val = grid[row][col] as ColorRole;
        if (val === 0) continue;
        const color = resolveColor(
          val, skinMain, skinShadow, hairMain, hairShadow,
          primary, secondary, accent
        );
        if (color) {
          result.push({ x: col * pixelSize, y: row * pixelSize, color });
        }
      }
    }
    return result;
  }, [grid, pixelSize, skinMain, skinShadow, hairMain, hairShadow, primary, secondary, accent]);

  return (
    <Group>
      {rects.map((r, i) => (
        <Rect
          key={i}
          x={r.x}
          y={r.y}
          width={pixelSize}
          height={pixelSize}
          color={r.color}
        />
      ))}
    </Group>
  );
}

export function CharacterRenderer({
  config,
  characterClass,
  level = 1,
  size = "md",
  showClass = false,
  showLevel = false,
  glowRarity = null,
}: CharacterRendererProps) {
  const canvasSize = CANVAS_SIZES[size];
  const pixelSize = canvasSize / GRID_SIZE;
  const cx = canvasSize / 2;
  const fontSize = FONT_SIZES[size];

  const skin = SKIN_COLORS[config.body_color] ?? SKIN_COLORS.light;
  const hair = HAIR_HEX[config.hair_color ?? "brown"];
  const palette = CLASS_PALETTES[characterClass];
  const classInfo = CLASS_CONFIG[characterClass];
  const glowColor = getRarityGlow(glowRarity);

  const hairGrid = config.hair_style ? HAIR_PATTERNS[config.hair_style] : null;
  const outfitGrid = OUTFIT_PATTERNS[characterClass];
  const hatGrid = config.hat ? HAT_PATTERNS[characterClass] : null;
  const weaponGrid = config.weapon ? WEAPON_PATTERNS[characterClass] : null;
  const shieldGrid = config.shield && characterClass === "knight" ? SHIELD_BASE : null;
  const capeGrid = config.cape ? CAPE_BASE : null;
  const familiarGrid = config.familiar ? FAMILIAR_PATTERNS[config.familiar] ?? null : null;

  const commonProps = {
    pixelSize,
    skinMain: skin.main,
    skinShadow: skin.shadow,
    hairMain: hair.main,
    hairShadow: hair.shadow,
    primary: palette.primary,
    secondary: palette.secondary,
    accent: palette.accent,
  };

  return (
    <View className="items-center">
      <Canvas style={{ width: canvasSize, height: canvasSize }}>
        {glowColor && (
          <Circle cx={cx} cy={cx} r={cx - 2} color={glowColor} opacity={0.15}>
            <Shadow dx={0} dy={0} blur={8} color={glowColor} />
          </Circle>
        )}

        {capeGrid && <PixelLayer grid={capeGrid} {...commonProps} />}
        <PixelLayer grid={BODY_BASE} {...commonProps} />
        <PixelLayer grid={outfitGrid} {...commonProps} />
        {hairGrid && <PixelLayer grid={hairGrid} {...commonProps} />}
        {hatGrid && <PixelLayer grid={hatGrid} {...commonProps} />}
        {shieldGrid && <PixelLayer grid={shieldGrid} {...commonProps} />}
        {weaponGrid && <PixelLayer grid={weaponGrid} {...commonProps} />}
        {familiarGrid && <PixelLayer grid={familiarGrid} {...commonProps} />}
      </Canvas>

      {showClass && (
        <Text className="font-pixel text-white/50 mt-1" style={{ fontSize }}>
          {classInfo.nameNorwegian}
        </Text>
      )}
      {showLevel && (
        <Text className="font-pixel text-white/30 mt-0.5" style={{ fontSize: fontSize - 1 }}>
          Lv {level}
        </Text>
      )}
    </View>
  );
}
