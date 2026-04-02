import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { PixelCard } from "@/components/ui/PixelCard";
import { CLASS_CONFIG, type CharacterClass } from "@/lib/wizard";

interface ClassPickerProps {
  onSelect: (characterClass: CharacterClass) => void;
  initialClass?: CharacterClass;
}

const classes: CharacterClass[] = ["wizard", "knight", "druid", "rogue"];

const classBorderColor: Record<CharacterClass, string> = {
  wizard: "border-info-500",
  knight: "border-danger-500",
  druid: "border-primary-500",
  rogue: "border-accent-500",
};

const classBgColor: Record<CharacterClass, string> = {
  wizard: "bg-info-500/10",
  knight: "bg-danger-500/10",
  druid: "bg-primary-500/10",
  rogue: "bg-accent-500/10",
};

export function ClassPicker({ onSelect, initialClass }: ClassPickerProps) {
  const [selected, setSelected] = useState<CharacterClass | null>(
    initialClass ?? null
  );

  function handleSelect(cls: CharacterClass) {
    setSelected(cls);
  }

  return (
    <View className="flex-1">
      <Text className="font-pixel text-lg text-white text-center mb-2">
        Velg din klasse
      </Text>
      <Text className="text-white/50 text-center mb-6">
        Hver klasse har unike styrker i dungeon-kamper
      </Text>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {classes.map((cls) => {
          const config = CLASS_CONFIG[cls];
          const isSelected = selected === cls;
          return (
            <TouchableOpacity
              key={cls}
              onPress={() => handleSelect(cls)}
              activeOpacity={0.7}
            >
              <PixelCard
                className={`mb-3 ${isSelected ? `${classBorderColor[cls]} ${classBgColor[cls]}` : ""}`}
              >
                <View className="flex-row items-center">
                  <Text className="text-4xl mr-4">{config.emoji}</Text>
                  <View className="flex-1">
                    <Text className="font-pixel text-sm text-white">
                      {config.nameNorwegian}
                    </Text>
                    <Text className="text-white/50 text-sm mt-1">
                      {config.description}
                    </Text>
                    <Text className="text-white/30 text-xs mt-1">
                      Damage: {config.damageMult}x
                    </Text>
                  </View>
                  {isSelected && (
                    <Text className="font-pixel text-xs text-primary-400">
                      {"\u2713"}
                    </Text>
                  )}
                </View>
              </PixelCard>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {selected && (
        <TouchableOpacity
          className="bg-primary-500 rounded-lg py-4 mt-4 items-center border-2 border-primary-700"
          onPress={() => onSelect(selected)}
        >
          <Text className="font-pixel text-sm text-white">
            Velg {CLASS_CONFIG[selected].nameNorwegian}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
