import { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth";
import { usePoints } from "@/hooks/usePoints";
import { getLevel, CLASS_CONFIG } from "@/lib/wizard";
import { CharacterRenderer } from "@/components/wizard/CharacterRenderer";
import { PixelCard } from "@/components/ui/PixelCard";
import { RarityBorder } from "@/components/ui/RarityBorder";
import type { AvatarConfig, CharacterClass, ItemRarity, ItemType } from "@/lib/database.types";

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

type WardrobeSlot = "hat" | "armor" | "cape" | "weapon" | "shield" | "familiar";

interface MockItem {
  slug: string;
  name: string;
  slot: WardrobeSlot;
  rarity: ItemRarity;
  unlockLevel: number;
  stats: { manaBonus?: number; damageBonus?: number; streakShield?: number; guildBoost?: number; lootBonus?: number };
  emoji: string;
}

const MOCK_ITEMS: MockItem[] = [
  // Hats
  { slug: "hat_common", name: "Enkel hatt", slot: "hat", rarity: "common", unlockLevel: 1, stats: { manaBonus: 5 }, emoji: "\uD83C\uDFA9" },
  { slug: "hat_uncommon", name: "Fin hatt", slot: "hat", rarity: "uncommon", unlockLevel: 5, stats: { manaBonus: 10, damageBonus: 5 }, emoji: "\uD83C\uDFA9" },
  { slug: "hat_rare", name: "Sjelden hatt", slot: "hat", rarity: "rare", unlockLevel: 10, stats: { manaBonus: 15, damageBonus: 10 }, emoji: "\uD83C\uDFA9" },
  { slug: "hat_epic", name: "Episk krone", slot: "hat", rarity: "epic", unlockLevel: 20, stats: { manaBonus: 20, damageBonus: 15, lootBonus: 5 }, emoji: "\uD83D\uDC51" },
  { slug: "hat_legendary", name: "Legendarisk helm", slot: "hat", rarity: "legendary", unlockLevel: 35, stats: { manaBonus: 30, damageBonus: 25, lootBonus: 10 }, emoji: "\uD83D\uDC51" },
  // Armor
  { slug: "armor_common", name: "Enkel drakt", slot: "armor", rarity: "common", unlockLevel: 1, stats: { streakShield: 5 }, emoji: "\uD83E\uDDE5" },
  { slug: "armor_uncommon", name: "Rustning", slot: "armor", rarity: "uncommon", unlockLevel: 5, stats: { streakShield: 10, damageBonus: 5 }, emoji: "\uD83E\uDDE5" },
  { slug: "armor_rare", name: "Sjelden rustning", slot: "armor", rarity: "rare", unlockLevel: 12, stats: { streakShield: 15, damageBonus: 10 }, emoji: "\uD83E\uDDE5" },
  { slug: "armor_epic", name: "Episk plate", slot: "armor", rarity: "epic", unlockLevel: 22, stats: { streakShield: 20, damageBonus: 15, guildBoost: 5 }, emoji: "\uD83E\uDDE5" },
  // Weapons
  { slug: "weapon_common", name: "Trestav", slot: "weapon", rarity: "common", unlockLevel: 1, stats: { damageBonus: 10 }, emoji: "\uD83E\uDE84" },
  { slug: "weapon_uncommon", name: "Jernsverd", slot: "weapon", rarity: "uncommon", unlockLevel: 6, stats: { damageBonus: 20 }, emoji: "\u2694\uFE0F" },
  { slug: "weapon_rare", name: "Magisk stav", slot: "weapon", rarity: "rare", unlockLevel: 15, stats: { damageBonus: 35, manaBonus: 5 }, emoji: "\uD83E\uDE84" },
  { slug: "weapon_epic", name: "Drageflamme", slot: "weapon", rarity: "epic", unlockLevel: 25, stats: { damageBonus: 50, manaBonus: 10, lootBonus: 5 }, emoji: "\uD83D\uDD25" },
  // Capes
  { slug: "cape_uncommon", name: "Enkel kappe", slot: "cape", rarity: "uncommon", unlockLevel: 8, stats: { guildBoost: 5 }, emoji: "\uD83E\uDDE3" },
  { slug: "cape_rare", name: "Sjelden kappe", slot: "cape", rarity: "rare", unlockLevel: 18, stats: { guildBoost: 10, manaBonus: 5 }, emoji: "\uD83E\uDDE3" },
  // Familiars
  { slug: "cat", name: "Katt", slot: "familiar", rarity: "common", unlockLevel: 3, stats: { manaBonus: 5 }, emoji: "\uD83D\uDC31" },
  { slug: "owl", name: "Ugle", slot: "familiar", rarity: "uncommon", unlockLevel: 10, stats: { lootBonus: 10 }, emoji: "\uD83E\uDD89" },
  { slug: "baby_dragon", name: "Babydrage", slot: "familiar", rarity: "rare", unlockLevel: 20, stats: { damageBonus: 15, manaBonus: 5 }, emoji: "\uD83D\uDC32" },
  { slug: "phoenix", name: "Foniks", slot: "familiar", rarity: "epic", unlockLevel: 35, stats: { damageBonus: 20, streakShield: 15 }, emoji: "\uD83D\uDD25" },
];

const SLOT_LABELS: Record<WardrobeSlot, { label: string; emoji: string }> = {
  hat: { label: "Hodeplagg", emoji: "\uD83C\uDFA9" },
  armor: { label: "Rustning", emoji: "\uD83E\uDDE5" },
  cape: { label: "Kappe", emoji: "\uD83E\uDDE3" },
  weapon: { label: "Vapen", emoji: "\uD83D\uDDE1\uFE0F" },
  shield: { label: "Skjold", emoji: "\uD83D\uDEE1\uFE0F" },
  familiar: { label: "Familiar", emoji: "\uD83D\uDC3E" },
};

export default function WardrobeScreen() {
  const { profile } = useAuth();
  const points = usePoints();
  const level = getLevel(points.total);
  const characterClass: CharacterClass = (profile as any)?.character_class ?? "wizard";

  const [activeSlot, setActiveSlot] = useState<WardrobeSlot>("hat");
  const [equippedItems, setEquippedItems] = useState<Record<WardrobeSlot, string | null>>({
    hat: null, armor: null, cape: null, weapon: null, shield: null, familiar: null,
  });

  const avatarConfig: AvatarConfig = {
    ...DEFAULT_AVATAR,
    body_color: (profile as any)?.avatar_config?.body_color ?? "blue",
    hat: equippedItems.hat,
    armor: equippedItems.armor,
    cape: equippedItems.cape,
    weapon: equippedItems.weapon,
    shield: equippedItems.shield,
    familiar: equippedItems.familiar,
  };

  const slotItems = useMemo(() =>
    MOCK_ITEMS.filter((i) => i.slot === activeSlot),
  [activeSlot]);

  function equipItem(item: MockItem) {
    if (item.unlockLevel > level) {
      Alert.alert("Laast", `Krever level ${item.unlockLevel} (du er ${level})`);
      return;
    }
    setEquippedItems((prev) => ({ ...prev, [item.slot]: item.slug }));
  }

  function unequipSlot(slot: WardrobeSlot) {
    setEquippedItems((prev) => ({ ...prev, [slot]: null }));
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center gap-3 px-5 pt-4 mb-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-2xl text-primary-400">{"\u2190"}</Text>
          </TouchableOpacity>
          <Text className="font-pixel text-sm text-white">Wardrobe</Text>
        </View>

        {/* Character preview */}
        <View className="items-center py-2">
          <CharacterRenderer
            config={avatarConfig}
            characterClass={characterClass}
            level={level}
            size="xl"
            showClass
          />
        </View>

        {/* Equipment stats summary */}
        <PixelCard className="mx-5 mb-3">
          <Text className="font-pixel text-[9px] text-white/30 uppercase tracking-wider mb-1">
            Utstyr-stats
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {["manaBonus", "damageBonus", "streakShield", "guildBoost", "lootBonus"].map((stat) => {
              const total = Object.values(equippedItems)
                .filter(Boolean)
                .reduce((sum, slug) => {
                  const item = MOCK_ITEMS.find((i) => i.slug === slug);
                  return sum + ((item?.stats as any)?.[stat] ?? 0);
                }, 0);
              if (total === 0) return null;
              const labels: Record<string, string> = {
                manaBonus: "Mana", damageBonus: "Damage",
                streakShield: "Streak", guildBoost: "Guild", lootBonus: "Loot",
              };
              return (
                <View key={stat} className="bg-dark-200 rounded-md px-2 py-1">
                  <Text className="font-pixel text-[7px] text-primary-400">
                    +{total}% {labels[stat]}
                  </Text>
                </View>
              );
            })}
          </View>
        </PixelCard>

        {/* Slot tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 mb-3">
          {(Object.keys(SLOT_LABELS) as WardrobeSlot[]).map((slot) => (
            <TouchableOpacity
              key={slot}
              onPress={() => setActiveSlot(slot)}
              className={`mr-2 rounded-lg border-2 px-3 py-2 items-center ${
                activeSlot === slot
                  ? "bg-primary-500/15 border-primary-500/40"
                  : "bg-dark-200 border-dark-50"
              }`}
            >
              <Text className="text-sm">{SLOT_LABELS[slot].emoji}</Text>
              <Text className="font-pixel text-[7px] text-white/50 mt-0.5">
                {SLOT_LABELS[slot].label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Items grid */}
        <View className="px-5 pb-10">
          {/* Unequip button */}
          {equippedItems[activeSlot] && (
            <TouchableOpacity
              onPress={() => unequipSlot(activeSlot)}
              className="mb-2"
            >
              <PixelCard className="flex-row items-center py-2 border-danger-500/30">
                <Text className="text-lg mr-3">{"\u274C"}</Text>
                <Text className="text-sm text-danger-400">Fjern {SLOT_LABELS[activeSlot].label}</Text>
              </PixelCard>
            </TouchableOpacity>
          )}

          <View className="gap-2">
            {slotItems.map((item) => {
              const isEquipped = equippedItems[item.slot] === item.slug;
              const isLocked = item.unlockLevel > level;

              return (
                <TouchableOpacity
                  key={item.slug}
                  onPress={() => equipItem(item)}
                  activeOpacity={isLocked ? 1 : 0.7}
                >
                  <RarityBorder rarity={item.rarity}>
                    <PixelCard
                      className={`flex-row items-center ${
                        isEquipped ? "bg-primary-500/10" : ""
                      } ${isLocked ? "opacity-40" : ""}`}
                    >
                      <Text className="text-2xl mr-3">{item.emoji}</Text>
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2">
                          <Text className="font-bold text-white">{item.name}</Text>
                          {isEquipped && (
                            <View className="bg-primary-500/20 rounded px-1.5 py-0.5">
                              <Text className="font-pixel text-[6px] text-primary-400">EQUIPPED</Text>
                            </View>
                          )}
                          {isLocked && (
                            <Text className="text-[10px] text-white/30">Lv {item.unlockLevel}</Text>
                          )}
                        </View>
                        <View className="flex-row flex-wrap gap-1 mt-1">
                          {Object.entries(item.stats).map(([key, val]) => {
                            if (!val) return null;
                            const labels: Record<string, string> = {
                              manaBonus: "Mana", damageBonus: "Dmg",
                              streakShield: "Streak", guildBoost: "Guild", lootBonus: "Loot",
                            };
                            return (
                              <Text key={key} className="text-[10px] text-accent-400">
                                +{val}% {labels[key]}
                              </Text>
                            );
                          })}
                        </View>
                      </View>
                    </PixelCard>
                  </RarityBorder>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
