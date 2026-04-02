import { View, Text } from "react-native";
import type { AvatarConfig, CharacterClass } from "@/lib/database.types";
import { CLASS_CONFIG } from "@/lib/wizard";

interface WizardAvatarProps {
  config: AvatarConfig;
  characterClass: CharacterClass;
  size?: "sm" | "md" | "lg" | "xl";
  showClass?: boolean;
}

const sizeMap = {
  sm: { container: "w-12 h-12", emoji: "text-2xl", badge: "text-xs" },
  md: { container: "w-20 h-20", emoji: "text-4xl", badge: "text-sm" },
  lg: { container: "w-32 h-32", emoji: "text-6xl", badge: "text-lg" },
  xl: { container: "w-44 h-44", emoji: "text-[80px]", badge: "text-xl" },
};

const bodyColorMap: Record<string, string> = {
  blue: "bg-info-500/20 border-info-500/40",
  green: "bg-primary-500/20 border-primary-500/40",
  purple: "bg-info-500/20 border-info-500/40",
  red: "bg-danger-500/20 border-danger-500/40",
  yellow: "bg-accent-500/20 border-accent-500/40",
  pink: "bg-danger-300/20 border-danger-300/40",
};

/**
 * Pixel-art wizard avatar. MVP renders class emoji with color ring.
 * Will be replaced with Skia sprite-sheet rendering in a future phase.
 */
export function WizardAvatar({
  config,
  characterClass,
  size = "md",
  showClass = false,
}: WizardAvatarProps) {
  const s = sizeMap[size];
  const classConfig = CLASS_CONFIG[characterClass];
  const bodyColor =
    bodyColorMap[config.body_color] ?? bodyColorMap.blue;

  return (
    <View className="items-center">
      <View
        className={`${s.container} rounded-full border-2 ${bodyColor} items-center justify-center`}
      >
        <Text className={s.emoji}>{classConfig.emoji}</Text>
      </View>

      {config.familiar && (
        <Text className={`${s.badge} absolute -bottom-1 -right-1`}>
          {getFamiliarEmoji(config.familiar)}
        </Text>
      )}

      {showClass && (
        <Text className="font-pixel text-[8px] text-white/50 mt-1">
          {classConfig.nameNorwegian}
        </Text>
      )}
    </View>
  );
}

function getFamiliarEmoji(familiar: string): string {
  const map: Record<string, string> = {
    cat: "\u{1F431}",
    owl: "\u{1F989}",
    baby_dragon: "\u{1F432}",
    phoenix: "\u{1F525}",
  };
  return map[familiar] ?? "";
}
