import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { CharacterRenderer } from "./CharacterRenderer";
import { PixelCard } from "@/components/ui/PixelCard";
import { BODY_COLORS, HAIR_STYLES, HAIR_COLORS } from "@/lib/spriteResolver";
import { CLASS_CONFIG } from "@/lib/wizard";
import type { AvatarConfig, CharacterClass } from "@/lib/database.types";

interface AvatarEditorProps {
  config: AvatarConfig;
  characterClass: CharacterClass;
  level: number;
  onChange: (config: Partial<AvatarConfig>) => void;
}

type EditTab = "body" | "hair" | "equipment";

export function AvatarEditor({
  config,
  characterClass,
  level,
  onChange,
}: AvatarEditorProps) {
  const [activeTab, setActiveTab] = useState<EditTab>("body");

  return (
    <View className="flex-1">
      {/* Live preview */}
      <View className="items-center py-4">
        <CharacterRenderer
          config={config}
          characterClass={characterClass}
          level={level}
          size="xl"
          showClass
        />
      </View>

      {/* Tab bar */}
      <View className="flex-row gap-1 mx-4 mb-3 bg-dark-100 rounded-lg border-2 border-dark-50 p-1">
        {(["body", "hair", "equipment"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            className={`flex-1 rounded-md py-2 ${
              activeTab === tab ? "bg-primary-500" : ""
            }`}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              className={`text-center font-pixel text-[8px] ${
                activeTab === tab ? "text-white" : "text-white/25"
              }`}
            >
              {tab === "body" ? "Kropp" : tab === "hair" ? "Har" : "Utstyr"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-4">
        {activeTab === "body" && (
          <View>
            <Text className="font-pixel text-[9px] text-white/30 uppercase tracking-wider mb-2">
              Kroppsfarge
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {BODY_COLORS.map((color) => (
                <TouchableOpacity
                  key={color.slug}
                  onPress={() => onChange({ body_color: color.slug })}
                  className={`rounded-lg border-2 p-2 items-center w-20 ${
                    config.body_color === color.slug
                      ? "border-primary-400"
                      : "border-dark-50"
                  }`}
                >
                  <View
                    className="w-8 h-8 rounded-full mb-1"
                    style={{ backgroundColor: color.hex }}
                  />
                  <Text className="text-[10px] text-white/50">{color.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {activeTab === "hair" && (
          <View>
            <Text className="font-pixel text-[9px] text-white/30 uppercase tracking-wider mb-2">
              Harstil
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              <TouchableOpacity
                onPress={() => onChange({ hair_style: null })}
                className={`rounded-lg border-2 p-2 items-center w-20 ${
                  !config.hair_style ? "border-primary-400" : "border-dark-50"
                }`}
              >
                <Text className="text-lg">{"\uD83E\uDDB2"}</Text>
                <Text className="text-[10px] text-white/50">Ingen</Text>
              </TouchableOpacity>
              {HAIR_STYLES.map((style) => (
                <TouchableOpacity
                  key={style.slug}
                  onPress={() => onChange({ hair_style: style.slug })}
                  className={`rounded-lg border-2 p-2 items-center w-20 ${
                    config.hair_style === style.slug
                      ? "border-primary-400"
                      : "border-dark-50"
                  }`}
                >
                  <Text className="text-lg">{"\uD83D\uDC87"}</Text>
                  <Text className="text-[10px] text-white/50">{style.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="font-pixel text-[9px] text-white/30 uppercase tracking-wider mb-2">
              Harfarge
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {HAIR_COLORS.map((color) => (
                <TouchableOpacity
                  key={color.slug}
                  onPress={() => onChange({ hair_color: color.slug })}
                  className={`rounded-lg border-2 p-2 items-center w-20 ${
                    config.hair_color === color.slug
                      ? "border-primary-400"
                      : "border-dark-50"
                  }`}
                >
                  <View
                    className="w-8 h-8 rounded-full mb-1"
                    style={{ backgroundColor: color.hex }}
                  />
                  <Text className="text-[10px] text-white/50">{color.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {activeTab === "equipment" && (
          <View>
            <PixelCard className="items-center py-6 mb-4">
              <Text className="text-3xl mb-2">{"\uD83D\uDC5C"}</Text>
              <Text className="font-pixel text-xs text-white/50">
                Wardrobe
              </Text>
              <Text className="text-sm text-white/25 mt-1">
                Utstyr administreres i Wardrobe-skjermen
              </Text>
            </PixelCard>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
