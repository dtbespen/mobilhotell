import { useState, useEffect } from "react";
import { View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/lib/auth";
import { usePoints } from "@/hooks/usePoints";
import { getLevel, CLASS_CONFIG } from "@/lib/wizard";
import { SkillTreeView } from "@/components/wizard/SkillTreeView";
import type { CharacterClass } from "@/lib/database.types";
import type { SkillAllocation } from "@/lib/skillTree";

export default function SkillsScreen() {
  const { profile } = useAuth();
  const points = usePoints();
  const level = getLevel(points.total);

  const characterClass: CharacterClass =
    (profile as any)?.character_class ?? "wizard";
  const classInfo = CLASS_CONFIG[characterClass];

  const [allocations, setAllocations] = useState<SkillAllocation[]>([]);

  function handleAllocate(skillId: string) {
    setAllocations((prev) => {
      const existing = prev.find((a) => a.skillId === skillId);
      if (existing) {
        return prev.map((a) =>
          a.skillId === skillId
            ? { ...a, currentRank: a.currentRank + 1 }
            : a
        );
      }
      return [...prev, { skillId, currentRank: 1 }];
    });
  }

  function handleRespec() {
    Alert.alert(
      "Tilbakestill Skills",
      "Vil du tilbakestille alle skill points? Du kan gjore dette gratis 1 gang per uke.",
      [
        { text: "Avbryt", style: "cancel" },
        {
          text: "Tilbakestill",
          style: "destructive",
          onPress: () => setAllocations([]),
        },
      ]
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      <View className="flex-1 px-4">
        <View className="items-center pt-4 pb-3">
          <Text className="font-pixel text-lg text-white">
            {classInfo.emoji} Skill Tree
          </Text>
          <Text className="text-white/30 text-xs mt-1">
            {classInfo.nameNorwegian} - Level {level}
          </Text>
        </View>

        <SkillTreeView
          characterClass={characterClass}
          level={level}
          allocations={allocations}
          onAllocate={handleAllocate}
          onRespec={handleRespec}
        />
      </View>
    </SafeAreaView>
  );
}
