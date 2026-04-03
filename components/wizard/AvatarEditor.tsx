import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { CharacterRenderer, HeadPreview, ShapePreview } from "./CharacterRenderer";
import { ClassPicker } from "./ClassPicker";
import {
  BODY_COLORS,
  BODY_SHAPES,
  EYE_COLOR_OPTIONS,
  HAIR_STYLES,
  HAIR_COLORS,
  GENDER_OPTIONS,
  FACE_VARIANTS,
} from "@/lib/spriteResolver";
import { CLASS_CONFIG } from "@/lib/wizard";
import type { AvatarConfig, CharacterClass } from "@/lib/database.types";

interface AvatarEditorProps {
  config: AvatarConfig;
  characterClass: CharacterClass;
  level: number;
  onChange: (config: Partial<AvatarConfig>) => void;
  onClassChange?: (cls: CharacterClass) => void;
}

type EditTab = "body" | "face" | "hair" | "class";

function Label({ children }: { children: string }) {
  return (
    <Text className="font-pixel text-[9px] text-white/30 uppercase tracking-wider mb-2 mt-4">
      {children}
    </Text>
  );
}

function Swatch({ hex, label, selected, onPress }: { hex: string; label: string; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-lg border-2 p-1.5 items-center w-16 ${selected ? "border-primary-400 bg-primary-500/10" : "border-dark-50"}`}
    >
      <View className="w-7 h-7 rounded-full mb-0.5 border border-white/10" style={{ backgroundColor: hex }} />
      <Text className="text-[9px] text-white/50" numberOfLines={1}>{label}</Text>
    </TouchableOpacity>
  );
}

export function AvatarEditor({ config, characterClass, level, onChange, onClassChange }: AvatarEditorProps) {
  const [activeTab, setActiveTab] = useState<EditTab>("body");
  const [showClassPicker, setShowClassPicker] = useState(false);

  const currentShape = (config as any).body_shape ?? "normal";
  const currentEye = (config as any).eye_color ?? "dark";
  const currentGender = (config as any).gender ?? "male";
  const currentFace = (config as any).face_variant ?? "standard";

  if (showClassPicker && onClassChange) {
    return (
      <View className="flex-1 px-4">
        <ClassPicker currentClass={characterClass} onSelect={(cls) => { onClassChange(cls); setShowClassPicker(false); }} />
        <TouchableOpacity className="mt-2 rounded-lg bg-dark-100 border-2 border-dark-50 py-3" onPress={() => setShowClassPicker(false)}>
          <Text className="text-center font-bold text-white/30">Tilbake</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* Live preview */}
      <View className="items-center py-3">
        <CharacterRenderer config={config} characterClass={characterClass} level={level} size="xl" showClass />
      </View>

      {/* Tabs */}
      <View className="flex-row gap-1 mx-4 mb-2 bg-dark-100 rounded-lg border-2 border-dark-50 p-1">
        {([{ key: "body", label: "Kropp" }, { key: "face", label: "Ansikt" }, { key: "hair", label: "Hår" }, { key: "class", label: "Klasse" }] as const).map((tab) => (
          <TouchableOpacity
            key={tab.key}
            className={`flex-1 rounded-md py-2 ${activeTab === tab.key ? "bg-primary-500" : ""}`}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text className={`text-center font-pixel text-[8px] ${activeTab === tab.key ? "text-white" : "text-white/25"}`}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {activeTab === "body" && (
          <View className="pb-8">
            {/* Body shape - silhouette thumbnails */}
            <Label>Kroppsform</Label>
            <View className="flex-row gap-2">
              {BODY_SHAPES.map((shape) => (
                <TouchableOpacity
                  key={shape.slug}
                  onPress={() => onChange({ body_shape: shape.slug } as any)}
                  className={`flex-1 rounded-lg border-2 p-2 items-center ${currentShape === shape.slug ? "border-primary-400 bg-primary-500/10" : "border-dark-50"}`}
                >
                  <ShapePreview shape={shape.slug as any} size={48} />
                  <Text className="text-[9px] text-white/50 mt-1">{shape.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Skin color */}
            <Label>Hudfarge</Label>
            <View className="flex-row flex-wrap gap-2">
              {BODY_COLORS.map((c) => (
                <Swatch key={c.slug} hex={c.hex} label={c.label} selected={config.body_color === c.slug} onPress={() => onChange({ body_color: c.slug })} />
              ))}
            </View>

            {/* Eye color */}
            <Label>Oyefarge</Label>
            <View className="flex-row flex-wrap gap-2">
              {EYE_COLOR_OPTIONS.map((e) => (
                <Swatch key={e.slug} hex={e.hex} label={e.label} selected={currentEye === e.slug} onPress={() => onChange({ eye_color: e.slug } as any)} />
              ))}
            </View>
          </View>
        )}

        {activeTab === "face" && (
          <View className="pb-8">
            {/* Gender */}
            <Label>Kjønn</Label>
            <View className="flex-row gap-3">
              {GENDER_OPTIONS.map((g) => (
                <TouchableOpacity
                  key={g.slug}
                  onPress={() => onChange({ gender: g.slug } as any)}
                  className={`flex-1 rounded-lg border-2 py-3 items-center ${currentGender === g.slug ? "border-primary-400 bg-primary-500/10" : "border-dark-50"}`}
                >
                  <Text className="text-2xl mb-1">{g.emoji}</Text>
                  <Text className={`font-pixel text-[9px] ${currentGender === g.slug ? "text-primary-300" : "text-white/40"}`}>{g.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Face variants with head previews */}
            <Label>Ansiktstype</Label>
            <View className="flex-row flex-wrap gap-2">
              {FACE_VARIANTS.map((fv) => (
                <TouchableOpacity
                  key={fv.slug}
                  onPress={() => onChange({ face_variant: fv.slug } as any)}
                  className={`rounded-lg border-2 p-2 items-center w-[72px] ${currentFace === fv.slug ? "border-primary-400 bg-primary-500/10" : "border-dark-50"}`}
                >
                  <HeadPreview
                    config={{ ...config, face_variant: fv.slug, hair_style: null } as any}
                    characterClass={characterClass}
                    size={48}
                  />
                  <Text className="text-[9px] text-white/50 mt-1">{fv.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {activeTab === "hair" && (
          <View className="pb-8">
            {/* Hair style - head-only thumbnails */}
            <Label>Harstil</Label>
            <View className="flex-row flex-wrap gap-2">
              <TouchableOpacity
                onPress={() => onChange({ hair_style: null })}
                className={`rounded-lg border-2 p-2 items-center w-[72px] ${!config.hair_style ? "border-primary-400 bg-primary-500/10" : "border-dark-50"}`}
              >
                <HeadPreview config={{ ...config, hair_style: null }} characterClass={characterClass} size={48} />
                <Text className="text-[9px] text-white/50 mt-1">Ingen</Text>
              </TouchableOpacity>
              {HAIR_STYLES.map((style) => (
                <TouchableOpacity
                  key={style.slug}
                  onPress={() => onChange({ hair_style: style.slug, hair_color: config.hair_color ?? "brown" })}
                  className={`rounded-lg border-2 p-2 items-center w-[72px] ${config.hair_style === style.slug ? "border-primary-400 bg-primary-500/10" : "border-dark-50"}`}
                >
                  <HeadPreview config={{ ...config, hair_style: style.slug, hair_color: config.hair_color ?? "brown" }} characterClass={characterClass} size={48} />
                  <Text className="text-[9px] text-white/50 mt-1">{style.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {config.hair_style && (
              <>
                <Label>Harfarge</Label>
                <View className="flex-row flex-wrap gap-2">
                  {HAIR_COLORS.map((c) => (
                    <Swatch key={c.slug} hex={c.hex} label={c.label} selected={config.hair_color === c.slug} onPress={() => onChange({ hair_color: c.slug })} />
                  ))}
                </View>
              </>
            )}
          </View>
        )}

        {activeTab === "class" && (
          <View className="pb-8">
            <Label>Navaerende klasse</Label>
            <View className="bg-dark-100 rounded-lg p-4 border-2 border-dark-50 mb-4">
              <View className="flex-row items-center">
                <Text className="text-3xl mr-3">{CLASS_CONFIG[characterClass].emoji}</Text>
                <View className="flex-1">
                  <Text className="font-bold text-white text-base">{CLASS_CONFIG[characterClass].nameNorwegian}</Text>
                  <Text className="text-sm text-white/40 mt-0.5">{CLASS_CONFIG[characterClass].description}</Text>
                </View>
              </View>
            </View>
            {onClassChange ? (
              <TouchableOpacity className="rounded-lg bg-primary-500 py-3 border-2 border-primary-700" onPress={() => setShowClassPicker(true)}>
                <Text className="text-center font-pixel text-[10px] text-white">Bytt klasse</Text>
              </TouchableOpacity>
            ) : (
              <Text className="text-xs text-white/25 text-center">Klasse kan endres fra Helten-skjermen</Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
