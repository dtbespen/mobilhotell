import { useMemo } from "react";
import { View, Text } from "react-native";
import { Canvas, RoundedRect, Circle, Rect, Group, Shadow, vec, LinearGradient } from "@shopify/react-native-skia";
import type { AvatarConfig, CharacterClass, ItemRarity } from "@/lib/database.types";
import { CLASS_CONFIG, getLevel, getWizardRank } from "@/lib/wizard";
import { Rarity } from "@/constants/Colors";

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

const SIZE_MAP = {
  sm: { canvas: 56, body: 20, head: 14, hat: 10, weapon: 12, familiar: 10, font: 7 },
  md: { canvas: 88, body: 32, head: 22, hat: 16, weapon: 18, familiar: 14, font: 8 },
  lg: { canvas: 140, body: 50, head: 34, hat: 24, weapon: 28, familiar: 20, font: 9 },
  xl: { canvas: 192, body: 68, head: 46, hat: 32, weapon: 38, familiar: 26, font: 10 },
};

const BODY_COLORS: Record<string, string> = {
  light: "#f5d6b8", olive: "#c4a882", bronze: "#a0784a", brown: "#7a5232",
  lavender: "#c8b0ff", blue: "#6aa0ff", green: "#6aff8a", pink: "#ff8aaa",
  frost_blue: "#a0d8ff", ice_white: "#e8f0ff",
};

const HAIR_COLORS: Record<string, string> = {
  blonde: "#e8d06a", brown: "#8a5a2a", black: "#2a2a2a", red: "#cc4422",
  blue: "#4488ff", green: "#44cc44", purple: "#9944ff", pink: "#ff66aa",
};

const CLASS_PALETTE: Record<CharacterClass, { primary: string; secondary: string; accent: string }> = {
  wizard: { primary: "#7b61ff", secondary: "#4d36c4", accent: "#bfb0ff" },
  knight: { primary: "#ff5c4d", secondary: "#cc2015", accent: "#ffd4ce" },
  druid: { primary: "#00cc52", secondary: "#008537", accent: "#6bffaa" },
  rogue: { primary: "#ffba24", secondary: "#b88000", accent: "#ffe080" },
};

const HAT_SHAPES: Record<CharacterClass, "pointy" | "helm" | "crown" | "hood"> = {
  wizard: "pointy",
  knight: "helm",
  druid: "crown",
  rogue: "hood",
};

const WEAPON_EMOJI: Record<CharacterClass, string> = {
  wizard: "\u{1FA84}",
  knight: "\u{2694}\uFE0F",
  druid: "\u{1F33F}",
  rogue: "\u{1F5E1}\uFE0F",
};

const FAMILIAR_EMOJI: Record<string, string> = {
  cat: "\u{1F431}", owl: "\u{1F989}", baby_dragon: "\u{1F432}",
  phoenix: "\u{1F525}", ice_fox: "\u{1F98A}",
};

function getRarityGlow(rarity: ItemRarity | null): string | null {
  if (!rarity || rarity === "common") return null;
  return Rarity[rarity] ?? null;
}

function getTierAlpha(slug: string | null): number {
  if (!slug) return 0;
  if (slug.includes("tier5") || slug.includes("legendary") || slug.includes("frost_legendary")) return 1.0;
  if (slug.includes("tier4") || slug.includes("epic") || slug.includes("_3")) return 0.85;
  if (slug.includes("tier3") || slug.includes("rare") || slug.includes("_2")) return 0.7;
  if (slug.includes("tier2") || slug.includes("uncommon")) return 0.55;
  return 0.4;
}

export function CharacterRenderer({
  config,
  characterClass,
  level = 1,
  size = "md",
  showClass = false,
  showLevel = false,
  glowRarity = null,
  animated = false,
}: CharacterRendererProps) {
  const s = SIZE_MAP[size];
  const cx = s.canvas / 2;
  const palette = CLASS_PALETTE[characterClass];
  const bodyColor = BODY_COLORS[config.body_color] ?? BODY_COLORS.light;
  const hairColor = HAIR_COLORS[config.hair_color ?? "brown"];
  const classInfo = CLASS_CONFIG[characterClass];
  const glowColor = getRarityGlow(glowRarity);

  const armorAlpha = getTierAlpha(config.armor);
  const hatAlpha = getTierAlpha(config.hat);

  const bodyTop = s.canvas * 0.42;
  const headCenter = s.canvas * 0.3;

  return (
    <View className="items-center">
      <Canvas style={{ width: s.canvas, height: s.canvas }}>
        {/* Glow ring for rarity */}
        {glowColor && (
          <Circle cx={cx} cy={cx} r={cx - 2} color={glowColor} opacity={0.2}>
            <Shadow dx={0} dy={0} blur={8} color={glowColor} />
          </Circle>
        )}

        {/* Cape (behind body) */}
        {config.cape && (
          <Group opacity={0.8}>
            <RoundedRect
              x={cx - s.body * 0.55}
              y={bodyTop - s.body * 0.05}
              width={s.body * 1.1}
              height={s.body * 1.15}
              r={s.body * 0.15}
              color={palette.secondary}
              opacity={0.7}
            />
          </Group>
        )}

        {/* Body */}
        <RoundedRect
          x={cx - s.body * 0.4}
          y={bodyTop}
          width={s.body * 0.8}
          height={s.body * 0.9}
          r={s.body * 0.12}
          color={bodyColor}
        />

        {/* Armor overlay */}
        {config.armor && (
          <RoundedRect
            x={cx - s.body * 0.42}
            y={bodyTop + s.body * 0.05}
            width={s.body * 0.84}
            height={s.body * 0.8}
            r={s.body * 0.1}
            color={palette.primary}
            opacity={armorAlpha}
          >
            <LinearGradient
              start={vec(cx, bodyTop)}
              end={vec(cx, bodyTop + s.body * 0.85)}
              colors={[palette.primary, palette.secondary]}
            />
          </RoundedRect>
        )}

        {/* Shield (knight only, left side) */}
        {config.shield && characterClass === "knight" && (
          <RoundedRect
            x={cx - s.body * 0.7}
            y={bodyTop + s.body * 0.1}
            width={s.body * 0.3}
            height={s.body * 0.45}
            r={s.body * 0.06}
            color={palette.accent}
            opacity={0.8}
          />
        )}

        {/* Head */}
        <Circle cx={cx} cy={headCenter} r={s.head * 0.5} color={bodyColor} />

        {/* Eyes */}
        <Circle cx={cx - s.head * 0.18} cy={headCenter - s.head * 0.02} r={s.head * 0.06} color="#1a1a2e" />
        <Circle cx={cx + s.head * 0.18} cy={headCenter - s.head * 0.02} r={s.head * 0.06} color="#1a1a2e" />
        <Circle cx={cx - s.head * 0.16} cy={headCenter - s.head * 0.04} r={s.head * 0.025} color="#ffffff" />
        <Circle cx={cx + s.head * 0.2} cy={headCenter - s.head * 0.04} r={s.head * 0.025} color="#ffffff" />

        {/* Hair */}
        {config.hair_style && (
          <Group>
            <Circle
              cx={cx}
              cy={headCenter - s.head * 0.15}
              r={s.head * 0.52}
              color={hairColor}
            />
            {config.hair_style === "long" && (
              <RoundedRect
                x={cx - s.head * 0.5}
                y={headCenter}
                width={s.head}
                height={s.head * 0.6}
                r={s.head * 0.1}
                color={hairColor}
                opacity={0.9}
              />
            )}
          </Group>
        )}

        {/* Hat */}
        {config.hat && (
          <Group>
            {HAT_SHAPES[characterClass] === "pointy" && (
              <>
                <Circle
                  cx={cx}
                  cy={headCenter - s.head * 0.45}
                  r={s.hat * 0.4}
                  color={palette.primary}
                  opacity={hatAlpha}
                />
                <RoundedRect
                  x={cx - s.hat * 0.55}
                  y={headCenter - s.head * 0.55}
                  width={s.hat * 1.1}
                  height={s.hat * 0.35}
                  r={s.hat * 0.1}
                  color={palette.primary}
                  opacity={hatAlpha}
                />
              </>
            )}
            {HAT_SHAPES[characterClass] === "helm" && (
              <RoundedRect
                x={cx - s.hat * 0.5}
                y={headCenter - s.head * 0.55}
                width={s.hat}
                height={s.hat * 0.65}
                r={s.hat * 0.15}
                color={palette.primary}
                opacity={hatAlpha}
              />
            )}
            {HAT_SHAPES[characterClass] === "crown" && (
              <>
                <Rect
                  x={cx - s.hat * 0.45}
                  y={headCenter - s.head * 0.5}
                  width={s.hat * 0.9}
                  height={s.hat * 0.15}
                  color={palette.primary}
                  opacity={hatAlpha}
                />
                <Circle cx={cx - s.hat * 0.25} cy={headCenter - s.head * 0.55} r={s.hat * 0.1} color={palette.accent} opacity={hatAlpha} />
                <Circle cx={cx} cy={headCenter - s.head * 0.58} r={s.hat * 0.12} color={palette.accent} opacity={hatAlpha} />
                <Circle cx={cx + s.hat * 0.25} cy={headCenter - s.head * 0.55} r={s.hat * 0.1} color={palette.accent} opacity={hatAlpha} />
              </>
            )}
            {HAT_SHAPES[characterClass] === "hood" && (
              <Circle
                cx={cx}
                cy={headCenter - s.head * 0.2}
                r={s.head * 0.55}
                color={palette.secondary}
                opacity={hatAlpha * 0.85}
              />
            )}
          </Group>
        )}

        {/* Arms (simple rectangles) */}
        <RoundedRect
          x={cx - s.body * 0.55}
          y={bodyTop + s.body * 0.1}
          width={s.body * 0.15}
          height={s.body * 0.5}
          r={s.body * 0.05}
          color={bodyColor}
        />
        <RoundedRect
          x={cx + s.body * 0.4}
          y={bodyTop + s.body * 0.1}
          width={s.body * 0.15}
          height={s.body * 0.5}
          r={s.body * 0.05}
          color={bodyColor}
        />

        {/* Feet */}
        <RoundedRect
          x={cx - s.body * 0.3}
          y={bodyTop + s.body * 0.82}
          width={s.body * 0.22}
          height={s.body * 0.15}
          r={s.body * 0.04}
          color={palette.secondary}
          opacity={0.7}
        />
        <RoundedRect
          x={cx + s.body * 0.08}
          y={bodyTop + s.body * 0.82}
          width={s.body * 0.22}
          height={s.body * 0.15}
          r={s.body * 0.04}
          color={palette.secondary}
          opacity={0.7}
        />
      </Canvas>

      {/* Weapon (rendered as emoji overlay for now) */}
      {config.weapon && (
        <View
          style={{
            position: "absolute",
            right: size === "sm" ? 2 : size === "md" ? 6 : size === "lg" ? 12 : 18,
            top: size === "sm" ? "35%" : "32%",
          }}
        >
          <Text style={{ fontSize: s.weapon }}>{WEAPON_EMOJI[characterClass]}</Text>
        </View>
      )}

      {/* Familiar */}
      {config.familiar && (
        <View
          style={{
            position: "absolute",
            right: -2,
            bottom: size === "sm" ? -2 : 0,
          }}
        >
          <Text style={{ fontSize: s.familiar }}>
            {FAMILIAR_EMOJI[config.familiar] ?? "\uD83D\uDC3E"}
          </Text>
        </View>
      )}

      {/* Labels */}
      {showClass && (
        <Text className="font-pixel text-white/50 mt-1" style={{ fontSize: s.font }}>
          {classInfo.nameNorwegian}
        </Text>
      )}
      {showLevel && (
        <Text className="font-pixel text-white/30 mt-0.5" style={{ fontSize: s.font - 1 }}>
          Lv {level}
        </Text>
      )}
    </View>
  );
}
