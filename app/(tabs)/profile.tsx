import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { usePoints } from "@/hooks/usePoints";
import { getLevel, getWizardRank, getManaForNextLevel, CLASS_CONFIG } from "@/lib/wizard";
import { getTitleBySlug } from "@/lib/titles";
import { CharacterRenderer } from "@/components/wizard/CharacterRenderer";
import { PixelCard } from "@/components/ui/PixelCard";
import { ManaBar } from "@/components/ui/ManaBar";
import { StatBadge } from "@/components/ui/StatBadge";
import { RarityBorder } from "@/components/ui/RarityBorder";
import type { CharacterClass, AvatarConfig, ItemRarity } from "@/lib/database.types";

const DEFAULT_AVATAR: AvatarConfig = {
  body_color: "blue",
  hair_style: null,
  hair_color: null,
  hat: null,
  armor: null,
  cape: null,
  weapon: null,
  shield: null,
  familiar: null,
};

type SlotType = "hat" | "armor" | "cape" | "weapon" | "shield" | "familiar";

const EQUIPMENT_SLOTS: { key: SlotType; label: string; emoji: string; side: "left" | "right" }[] = [
  { key: "hat", label: "Hodeplagg", emoji: "\uD83C\uDFA9", side: "left" },
  { key: "weapon", label: "Vapen", emoji: "\uD83D\uDDE1\uFE0F", side: "right" },
  { key: "armor", label: "Rustning", emoji: "\uD83E\uDDE5", side: "left" },
  { key: "shield", label: "Skjold", emoji: "\uD83D\uDEE1\uFE0F", side: "right" },
  { key: "cape", label: "Kappe", emoji: "\uD83E\uDDE3", side: "left" },
  { key: "familiar", label: "Familiar", emoji: "\uD83D\uDC3E", side: "right" },
];

function getRankRarity(level: number): ItemRarity {
  if (level >= 41) return "legendary";
  if (level >= 31) return "epic";
  if (level >= 21) return "rare";
  if (level >= 11) return "uncommon";
  return "common";
}

export default function CharacterSheetScreen() {
  const { profile, family, signOut } = useAuth();
  const points = usePoints();

  const level = getLevel(points.total);
  const rank = getWizardRank(level);
  const nextMana = getManaForNextLevel(level);
  const characterClass: CharacterClass =
    (profile as any)?.character_class ?? "wizard";
  const avatarConfig: AvatarConfig =
    (profile as any)?.avatar_config ?? DEFAULT_AVATAR;
  const classInfo = CLASS_CONFIG[characterClass];
  const activeTitle: string | null = (profile as any)?.active_title ?? null;
  const titleDef = activeTitle ? getTitleBySlug(activeTitle) : null;

  const leftSlots = EQUIPMENT_SLOTS.filter((s) => s.side === "left");
  const rightSlots = EQUIPMENT_SLOTS.filter((s) => s.side === "right");

  function handleSignOut() {
    Alert.alert("Logg ut", "Forlate tarnet?", [
      { text: "Nei", style: "cancel" },
      { text: "Ja, logg ut", style: "destructive", onPress: signOut },
    ]);
  }

  function handleSlotPress(slot: SlotType) {
    const equipped = avatarConfig[slot as keyof AvatarConfig];
    if (equipped) {
      Alert.alert(slot, `Equipped: ${equipped}\n\nWardrobe kommer snart!`);
    } else {
      Alert.alert(slot, "Tom slot - Wardrobe kommer snart!");
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      <ScrollView className="flex-1">
        <View className="px-5 pt-4 pb-2">
          <Text className="font-pixel text-lg text-white text-center">
            Karakter
          </Text>
        </View>

        {/* Character with equipment slots */}
        <View className="flex-row items-start justify-center px-4 mt-2">
          {/* Left equipment slots */}
          <View className="gap-3 pt-4">
            {leftSlots.map((slot) => {
              const equipped = avatarConfig[slot.key as keyof AvatarConfig];
              return (
                <TouchableOpacity
                  key={slot.key}
                  onPress={() => handleSlotPress(slot.key)}
                  activeOpacity={0.7}
                >
                  <RarityBorder rarity={equipped ? "uncommon" : "common"}>
                    <View className="w-14 h-14 items-center justify-center bg-dark-200 rounded-md">
                      <Text className="text-lg">{equipped ? slot.emoji : "\u2795"}</Text>
                      <Text className="font-pixel text-[5px] text-white/30 mt-0.5">
                        {slot.label}
                      </Text>
                    </View>
                  </RarityBorder>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Character */}
          <View className="items-center mx-3">
            <CharacterRenderer
              config={avatarConfig}
              characterClass={characterClass}
              level={level}
              size="xl"
              glowRarity={getRankRarity(level)}
            />
          </View>

          {/* Right equipment slots */}
          <View className="gap-3 pt-4">
            {rightSlots.map((slot) => {
              const equipped = avatarConfig[slot.key as keyof AvatarConfig];
              const isShield = slot.key === "shield" && characterClass !== "knight";
              return (
                <TouchableOpacity
                  key={slot.key}
                  onPress={() => !isShield && handleSlotPress(slot.key)}
                  activeOpacity={isShield ? 1 : 0.7}
                  disabled={isShield}
                >
                  <RarityBorder rarity={equipped ? "uncommon" : "common"}>
                    <View
                      className={`w-14 h-14 items-center justify-center bg-dark-200 rounded-md ${
                        isShield ? "opacity-20" : ""
                      }`}
                    >
                      <Text className="text-lg">{equipped ? slot.emoji : isShield ? "\uD83D\uDEAB" : "\u2795"}</Text>
                      <Text className="font-pixel text-[5px] text-white/30 mt-0.5">
                        {slot.label}
                      </Text>
                    </View>
                  </RarityBorder>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Name and title */}
        <View className="items-center mt-3">
          <Text className="text-xl font-bold text-white">
            {profile?.display_name}
          </Text>
          {titleDef ? (
            <Text className="font-pixel text-[9px] text-accent-400 mt-0.5">
              {titleDef.name}
            </Text>
          ) : (
            <Text className="font-pixel text-[9px] text-white/30 mt-0.5">
              {rank.name}
            </Text>
          )}
          <Text className="text-sm text-white/30 mt-0.5">
            Level {level} {classInfo.emoji} {classInfo.nameNorwegian}
          </Text>
        </View>

        {/* Mana bar */}
        <PixelCard className="mx-5 mt-4">
          <ManaBar current={points.total} max={nextMana} />
        </PixelCard>

        {/* Stats */}
        <View className="flex-row gap-3 px-5 mt-4">
          <StatBadge icon={"\u2728"} value={points.total} label="Mana" color="accent" />
          <StatBadge icon={"\uD83D\uDD25"} value={points.streak} label="Streak" color="danger" />
          <StatBadge icon={"\uD83C\uDFAF"} value={level} label="Level" color="primary" />
        </View>

        {/* Class info */}
        <PixelCard className="mx-5 mt-4">
          <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
            Klasse
          </Text>
          <View className="flex-row items-center">
            <Text className="text-3xl mr-3">{classInfo.emoji}</Text>
            <View className="flex-1">
              <Text className="font-bold text-white">{classInfo.nameNorwegian}</Text>
              <Text className="text-sm text-white/40 mt-0.5">{classInfo.description}</Text>
              <Text className="text-xs text-white/25 mt-0.5">Damage: {classInfo.damageMult}x</Text>
            </View>
          </View>
        </PixelCard>

        {/* Guild info */}
        <PixelCard className="mx-5 mt-4">
          <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
            Guild
          </Text>
          <Text className="text-base font-bold text-white">
            {"\uD83D\uDEE1\uFE0F"} {family?.name}
          </Text>
          <View className="flex-row items-center mt-2">
            <Text className="text-xs text-white/30 mr-2">Guild Code:</Text>
            <Text className="font-pixel text-sm tracking-[4px] text-accent-400">
              {family?.invite_code}
            </Text>
          </View>

          {profile?.role === "parent" && (
            <TouchableOpacity
              className="mt-3 rounded-md bg-primary-500/15 border border-primary-500/20 py-3"
              onPress={() => router.push("/(admin)/settings")}
              activeOpacity={0.7}
            >
              <Text className="text-center font-pixel text-[10px] text-primary-400">
                Guild Master Settings
              </Text>
            </TouchableOpacity>
          )}
        </PixelCard>

        {/* Sign out */}
        <View className="px-5 mt-8 pb-10">
          <TouchableOpacity
            className="rounded-lg bg-danger-500/10 border-2 border-danger-500/15 py-4"
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <Text className="text-center font-bold text-danger-500">Logg ut</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
