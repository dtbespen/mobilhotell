import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { PixelCard } from "@/components/ui/PixelCard";
import { RarityBorder } from "@/components/ui/RarityBorder";
import {
  getSkillsForClass,
  getSkillsByBranch,
  getBranchLabel,
  canAllocate,
  getAvailablePoints,
  getTotalEffectValue,
  type SkillNode,
  type SkillAllocation,
  type SkillBranch,
} from "@/lib/skillTree";
import type { CharacterClass, ItemRarity } from "@/lib/database.types";

interface SkillTreeViewProps {
  characterClass: CharacterClass;
  level: number;
  allocations: SkillAllocation[];
  onAllocate: (skillId: string) => void;
  onRespec: () => void;
}

const BRANCH_ORDER: SkillBranch[] = ["offense", "support", "special"];

function getAllocRank(skillId: string, allocations: SkillAllocation[]): number {
  return allocations.find((a) => a.skillId === skillId)?.currentRank ?? 0;
}

function getSkillRarity(skill: SkillNode): ItemRarity {
  if (skill.requiredLevel >= 40) return "legendary";
  if (skill.requiredLevel >= 25) return "epic";
  if (skill.requiredLevel >= 12) return "rare";
  if (skill.requiredLevel >= 8) return "uncommon";
  return "common";
}

export function SkillTreeView({
  characterClass,
  level,
  allocations,
  onAllocate,
  onRespec,
}: SkillTreeViewProps) {
  const allSkills = getSkillsForClass(characterClass);
  const available = getAvailablePoints(level, allocations);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="font-pixel text-xs text-accent-400">
            Skill Points
          </Text>
          <Text className="font-pixel text-2xl text-accent-400">
            {available}
          </Text>
        </View>
        <TouchableOpacity
          className="bg-danger-500/15 border border-danger-500/20 rounded-lg px-4 py-2"
          onPress={onRespec}
        >
          <Text className="font-pixel text-[9px] text-danger-400">
            Respec
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row gap-2">
        {BRANCH_ORDER.map((branch) => {
          const branchSkills = getSkillsByBranch(characterClass, branch);
          const branchInfo = getBranchLabel(branch);

          return (
            <View key={branch} className="flex-1">
              <View className="items-center mb-3">
                <Text className="text-lg">{branchInfo.emoji}</Text>
                <Text className="font-pixel text-[7px] text-white/40 mt-1">
                  {branchInfo.name}
                </Text>
              </View>

              {branchSkills.map((skill) => {
                const rank = getAllocRank(skill.id, allocations);
                const isMaxed = rank >= skill.maxRank;
                const isUnlocked = rank > 0;
                const canAlloc = canAllocate(skill, rank, level, allocations, allSkills);
                const rarity = getSkillRarity(skill);
                const isLevelLocked = level < skill.requiredLevel;

                return (
                  <TouchableOpacity
                    key={skill.id}
                    onPress={() => {
                      if (canAlloc) {
                        onAllocate(skill.id);
                      } else if (isLevelLocked) {
                        Alert.alert("Laast", `Krever level ${skill.requiredLevel}`);
                      } else if (!available) {
                        Alert.alert("Ingen poeng", "Du trenger flere skill points");
                      }
                    }}
                    activeOpacity={canAlloc ? 0.7 : 1}
                    className="mb-2"
                  >
                    <RarityBorder rarity={isUnlocked ? rarity : "common"}>
                      <View
                        className={`p-2 rounded-md ${
                          isUnlocked
                            ? "bg-dark-100"
                            : canAlloc
                              ? "bg-dark-200 border border-primary-500/30"
                              : "bg-dark-300"
                        } ${isLevelLocked ? "opacity-40" : ""}`}
                      >
                        <Text className="font-pixel text-[7px] text-white/80 mb-1" numberOfLines={1}>
                          {skill.nameNorwegian}
                        </Text>
                        <Text className="text-[9px] text-white/30 mb-1" numberOfLines={2}>
                          {skill.description}
                        </Text>
                        <View className="flex-row justify-between items-center">
                          <Text className="font-pixel text-[6px] text-white/20">
                            Lv {skill.requiredLevel}
                          </Text>
                          <Text
                            className={`font-pixel text-[7px] ${
                              isMaxed ? "text-accent-400" : isUnlocked ? "text-primary-400" : "text-white/25"
                            }`}
                          >
                            {rank}/{skill.maxRank}
                          </Text>
                        </View>
                        {canAlloc && (
                          <View className="bg-primary-500/20 rounded mt-1 py-0.5">
                            <Text className="font-pixel text-[6px] text-primary-400 text-center">
                              + Las opp
                            </Text>
                          </View>
                        )}
                      </View>
                    </RarityBorder>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
