import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { WizardAvatar } from "./WizardAvatar";
import { PixelCard } from "@/components/ui/PixelCard";
import { RarityBorder } from "@/components/ui/RarityBorder";
import type { AvatarConfig, AvatarItem, CharacterClass, ItemType } from "@/lib/database.types";

interface AvatarEditorProps {
  currentConfig: AvatarConfig;
  characterClass: CharacterClass;
  items: AvatarItem[];
  level: number;
  onSave: (config: AvatarConfig) => void;
}

const ITEM_CATEGORIES: { type: ItemType; label: string; emoji: string }[] = [
  { type: "body_color", label: "Farge", emoji: "\u{1F3A8}" },
  { type: "hat", label: "Hodeplagg", emoji: "\u{1F3A9}" },
  { type: "robe", label: "Rustning", emoji: "\u{1F9E5}" },
  { type: "staff", label: "V\u00e5pen", emoji: "\u{1FA84}" },
  { type: "familiar", label: "Familiar", emoji: "\u{1F43E}" },
];

export function AvatarEditor({
  currentConfig,
  characterClass,
  items,
  level,
  onSave,
}: AvatarEditorProps) {
  const [config, setConfig] = useState<AvatarConfig>({ ...currentConfig });

  function selectItem(type: ItemType, slug: string) {
    setConfig((prev) => ({ ...prev, [type]: slug }));
  }

  function isUnlocked(item: AvatarItem): boolean {
    if (item.is_boss_drop) return false;
    return item.unlock_level <= level;
  }

  return (
    <View className="flex-1">
      <View className="items-center py-6">
        <WizardAvatar
          config={config}
          characterClass={characterClass}
          size="xl"
          showClass
        />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {ITEM_CATEGORIES.map((cat) => {
          const categoryItems = items.filter((i) => i.type === cat.type);
          if (categoryItems.length === 0) return null;

          return (
            <View key={cat.type} className="mb-5">
              <Text className="font-pixel text-xs text-white/60 mb-2 px-1">
                {cat.emoji} {cat.label}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categoryItems.map((item) => {
                  const unlocked = isUnlocked(item);
                  const isSelected =
                    config[cat.type as keyof AvatarConfig] === item.slug;

                  return (
                    <TouchableOpacity
                      key={item.slug}
                      onPress={() =>
                        unlocked && selectItem(cat.type, item.slug)
                      }
                      activeOpacity={unlocked ? 0.7 : 1}
                      className="mr-2"
                    >
                      <RarityBorder
                        rarity={isSelected ? item.rarity : "common"}
                      >
                        <View
                          className={`w-16 h-16 items-center justify-center rounded-md ${
                            isSelected ? "bg-dark-100" : "bg-dark-200"
                          } ${!unlocked ? "opacity-40" : ""}`}
                        >
                          <Text className="text-xl">
                            {getItemEmoji(item)}
                          </Text>
                          {!unlocked && (
                            <Text className="font-pixel text-[7px] text-white/50 mt-1">
                              Lv {item.unlock_level}
                            </Text>
                          )}
                        </View>
                      </RarityBorder>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        className="bg-primary-500 rounded-lg py-4 mt-4 items-center border-2 border-primary-700"
        onPress={() => onSave(config)}
      >
        <Text className="font-pixel text-sm text-white">Lagre</Text>
      </TouchableOpacity>
    </View>
  );
}

function getItemEmoji(item: AvatarItem): string {
  const typeEmoji: Record<string, string> = {
    body_color: "\u{1F534}",
    hat: "\u{1F3A9}",
    robe: "\u{1F9E5}",
    staff: "\u{1FA84}",
    familiar: "\u{1F43E}",
  };
  return typeEmoji[item.type] ?? "\u{2753}";
}
