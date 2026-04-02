import { useMemo } from "react";
import { View, Text } from "react-native";
import { Canvas, Rect, Circle, Shadow, Group } from "@shopify/react-native-skia";
import type { AvatarConfig, CharacterClass, ItemRarity } from "@/lib/database.types";
import { CLASS_CONFIG } from "@/lib/wizard";
import { Rarity } from "@/constants/Colors";
import { renderCharacter, renderHead, renderSilhouette, GRID, type PixelData, type BodyShape } from "@/lib/pixelPatterns";

interface Props {
  config: AvatarConfig;
  characterClass: CharacterClass;
  level?: number;
  size?: "sm" | "md" | "lg" | "xl";
  showClass?: boolean;
  showLevel?: boolean;
  glowRarity?: ItemRarity | null;
}

const CANVAS_SIZES: Record<string, number> = { sm: 64, md: 96, lg: 160, xl: 224 };
const FONT_SIZES: Record<string, number> = { sm: 7, md: 8, lg: 9, xl: 10 };

function pixelsFromGrid(grid: PixelData, pixelSize: number) {
  const result: Array<{ x: number; y: number; color: string }> = [];
  for (let row = 0; row < grid.length; row++)
    for (let col = 0; col < grid[row].length; col++) {
      const color = grid[row][col];
      if (color) result.push({ x: col * pixelSize, y: row * pixelSize, color });
    }
  return result;
}

function PixelCanvas({ grid, canvasSize }: { grid: PixelData; canvasSize: number }) {
  const gridSize = grid.length;
  const pixelSize = canvasSize / gridSize;
  const pixels = useMemo(() => pixelsFromGrid(grid, pixelSize), [grid, pixelSize]);

  return (
    <View pointerEvents="none">
      <Canvas style={{ width: canvasSize, height: canvasSize }}>
        <Group>
          {pixels.map((p, i) => (
            <Rect key={i} x={p.x} y={p.y} width={pixelSize} height={pixelSize} color={p.color} />
          ))}
        </Group>
      </Canvas>
    </View>
  );
}

export function CharacterRenderer({ config, characterClass, level = 1, size = "md", showClass, showLevel, glowRarity = null }: Props) {
  const canvasSize = CANVAS_SIZES[size];
  const pixelSize = canvasSize / GRID;
  const cx = canvasSize / 2;
  const fontSize = FONT_SIZES[size];
  const classInfo = CLASS_CONFIG[characterClass];
  const glowColor = (!glowRarity || glowRarity === "common") ? null : (Rarity[glowRarity] ?? null);

  const pixels = useMemo(() => {
    const pd = renderCharacter(config, characterClass);
    return pixelsFromGrid(pd, pixelSize);
  }, [
    config.body_color, (config as any).body_shape, (config as any).eye_color,
    config.hair_style, config.hair_color, config.hat, config.armor,
    config.cape, config.weapon, config.shield, config.familiar,
    characterClass, pixelSize,
  ]);

  return (
    <View className="items-center">
      <View pointerEvents="none">
        <Canvas style={{ width: canvasSize, height: canvasSize }}>
          {glowColor && (
            <Circle cx={cx} cy={cx} r={cx - 2} color={glowColor} opacity={0.15}>
              <Shadow dx={0} dy={0} blur={8} color={glowColor} />
            </Circle>
          )}
          <Group>
            {pixels.map((p, i) => (
              <Rect key={i} x={p.x} y={p.y} width={pixelSize} height={pixelSize} color={p.color} />
            ))}
          </Group>
        </Canvas>
      </View>
      {showClass && (
        <Text className="font-pixel text-white/50 mt-1" style={{ fontSize }}>{classInfo.nameNorwegian}</Text>
      )}
      {showLevel && (
        <Text className="font-pixel text-white/30 mt-0.5" style={{ fontSize: fontSize - 1 }}>Lv {level}</Text>
      )}
    </View>
  );
}

/** Small head-only preview for hair/face thumbnails */
export function HeadPreview({ config, characterClass, size = 48 }: { config: AvatarConfig; characterClass: CharacterClass; size?: number }) {
  const grid = useMemo(() => renderHead(config, characterClass), [
    config.body_color, (config as any).body_shape, (config as any).eye_color,
    config.hair_style, config.hair_color, config.hat, characterClass,
  ]);
  return <PixelCanvas grid={grid} canvasSize={size} />;
}

/** Body silhouette preview for shape thumbnails */
export function ShapePreview({ shape, size = 48 }: { shape: BodyShape; size?: number }) {
  const grid = useMemo(() => renderSilhouette(shape), [shape]);
  return <PixelCanvas grid={grid} canvasSize={size} />;
}
