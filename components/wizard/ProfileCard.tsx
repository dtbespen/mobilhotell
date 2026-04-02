import { View, Text } from "react-native";
import { CharacterRenderer } from "./CharacterRenderer";
import { PixelCard } from "@/components/ui/PixelCard";
import { RarityBorder } from "@/components/ui/RarityBorder";
import { getWizardRank, CLASS_CONFIG } from "@/lib/wizard";
import { getTitleBySlug } from "@/lib/titles";
import type { AvatarConfig, CharacterClass, ItemRarity } from "@/lib/database.types";

interface ProfileCardProps {
  displayName: string;
  config: AvatarConfig;
  characterClass: CharacterClass;
  level: number;
  activeTitle: string | null;
  stats: { streak: number; bossKills: number; totalMana: number };
  compact?: boolean;
}

function getRankRarity(level: number): ItemRarity {
  if (level >= 41) return "legendary";
  if (level >= 31) return "epic";
  if (level >= 21) return "rare";
  if (level >= 11) return "uncommon";
  return "common";
}

export function ProfileCard({
  displayName,
  config,
  characterClass,
  level,
  activeTitle,
  stats,
  compact = false,
}: ProfileCardProps) {
  const rank = getWizardRank(level);
  const classInfo = CLASS_CONFIG[characterClass];
  const titleDef = activeTitle ? getTitleBySlug(activeTitle) : null;
  const rarity = getRankRarity(level);

  return (
    <RarityBorder rarity={rarity}>
      <PixelCard variant="glow" className="items-center">
        <CharacterRenderer
          config={config}
          characterClass={characterClass}
          level={level}
          size={compact ? "lg" : "xl"}
          glowRarity={rarity}
        />

        <Text className="font-bold text-white text-lg mt-3">
          {displayName}
        </Text>

        {titleDef && (
          <Text className={`font-pixel text-[9px] mt-0.5 text-rarity-${titleDef.rarity}`}>
            {titleDef.name}
          </Text>
        )}

        <Text className="font-pixel text-sm text-accent-400 mt-1">
          {rank.name}
        </Text>

        <View className="flex-row items-center gap-2 mt-0.5">
          <Text className="text-sm text-white/30">Level {level}</Text>
          <Text className="text-sm">{classInfo.emoji}</Text>
          <Text className="text-sm text-white/30">{classInfo.nameNorwegian}</Text>
        </View>

        {!compact && (
          <View className="flex-row gap-4 mt-4 pt-3 border-t border-dark-50 w-full justify-center">
            <View className="items-center">
              <Text className="font-pixel text-xs text-danger-400">{stats.streak}</Text>
              <Text className="text-[10px] text-white/30">Streak</Text>
            </View>
            <View className="items-center">
              <Text className="font-pixel text-xs text-accent-400">{stats.totalMana}</Text>
              <Text className="text-[10px] text-white/30">Mana</Text>
            </View>
            <View className="items-center">
              <Text className="font-pixel text-xs text-info-400">{stats.bossKills}</Text>
              <Text className="text-[10px] text-white/30">Bosser</Text>
            </View>
          </View>
        )}
      </PixelCard>
    </RarityBorder>
  );
}
