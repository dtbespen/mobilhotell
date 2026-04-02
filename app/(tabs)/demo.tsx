import { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PixelCard } from "@/components/ui/PixelCard";
import { ManaBar } from "@/components/ui/ManaBar";
import { HPBar } from "@/components/ui/HPBar";
import { StatBadge } from "@/components/ui/StatBadge";
import { RarityBorder } from "@/components/ui/RarityBorder";
import { CharacterRenderer } from "@/components/wizard/CharacterRenderer";
import { SkillTreeView } from "@/components/wizard/SkillTreeView";
import {
  CLASS_CONFIG,
  RANKS,
  getLevel,
  getWizardRank,
  getManaForNextLevel,
  getUnlocksForLevel,
  type CharacterClass,
} from "@/lib/wizard";
import { buildSeasonTiers, getRewardEmoji, getRarityForReward } from "@/lib/seasonPass";
import { getAllAchievements } from "@/lib/achievements";
import type { AvatarConfig, ItemRarity } from "@/lib/database.types";
import type { SkillAllocation } from "@/lib/skillTree";

const CLASSES: CharacterClass[] = ["wizard", "knight", "druid", "rogue"];
const BODY_COLORS = ["light", "olive", "bronze", "blue", "lavender", "green", "pink"];
const DEMO_MANA_LEVELS = [0, 100, 500, 1500, 4000, 10000, 25000, 50000];

const EQUIPMENT_PRESETS: { label: string; config: Partial<AvatarConfig> }[] = [
  { label: "Naken", config: { hat: null, armor: null, cape: null, weapon: null, familiar: null } },
  { label: "Starter", config: { hat: "tier1", armor: "tier1", weapon: "tier1", cape: null, familiar: null } },
  { label: "Tier 2", config: { hat: "tier2", armor: "tier2", weapon: "tier2", cape: null, familiar: "cat" } },
  { label: "Tier 3", config: { hat: "tier3", armor: "tier3", weapon: "tier3", cape: "tier2", familiar: "owl" } },
  { label: "Epic", config: { hat: "tier4", armor: "tier4", weapon: "tier4", cape: "tier3", familiar: "baby_dragon" } },
  { label: "Legendary", config: { hat: "tier5_legendary", armor: "tier5_legendary", weapon: "tier5_legendary", cape: "tier4", familiar: "phoenix" } },
];

export default function DemoScreen() {
  const [selectedClass, setSelectedClass] = useState<CharacterClass>("wizard");
  const [selectedMana, setSelectedMana] = useState(0);
  const [selectedColor, setSelectedColor] = useState("light");
  const [equipPreset, setEquipPreset] = useState(0);
  const [bossHp, setBossHp] = useState(3000);
  const [showSkillTree, setShowSkillTree] = useState(false);
  const [skillAllocations, setSkillAllocations] = useState<SkillAllocation[]>([]);

  const level = getLevel(selectedMana);
  const rank = getWizardRank(level);
  const nextMana = getManaForNextLevel(level);
  const unlocks = getUnlocksForLevel(level);
  const classInfo = CLASS_CONFIG[selectedClass];
  const preset = EQUIPMENT_PRESETS[equipPreset];

  const avatar: AvatarConfig = {
    body_color: selectedColor,
    hair_style: "plain",
    hair_color: "brown",
    hat: preset.config.hat ?? null,
    armor: preset.config.armor ?? null,
    cape: preset.config.cape ?? null,
    weapon: preset.config.weapon ?? null,
    shield: selectedClass === "knight" ? (preset.config.armor ? "tier1" : null) : null,
    familiar: preset.config.familiar ?? null,
  };

  const seasonTiers = useMemo(() => buildSeasonTiers(), []);
  const achievements = useMemo(() => getAllAchievements().slice(0, 6), []);

  function getRarityForPreset(): ItemRarity {
    if (equipPreset >= 5) return "legendary";
    if (equipPreset >= 4) return "epic";
    if (equipPreset >= 3) return "rare";
    if (equipPreset >= 2) return "uncommon";
    return "common";
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      <ScrollView className="flex-1 px-5">
        <Text className="font-pixel text-lg text-accent-400 text-center mt-4 mb-1">
          Demo Showroom
        </Text>
        <Text className="text-white/30 text-center text-xs mb-4">
          Utforsk det komplette karaktersystemet
        </Text>

        {/* Class selector */}
        <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
          Klasse
        </Text>
        <View className="flex-row gap-2 mb-4">
          {CLASSES.map((cls) => (
            <TouchableOpacity
              key={cls}
              onPress={() => setSelectedClass(cls)}
              className={`flex-1 rounded-lg border-2 py-2 items-center ${
                selectedClass === cls
                  ? "bg-primary-500/15 border-primary-500/40"
                  : "bg-dark-200 border-dark-50"
              }`}
            >
              <Text className="text-lg">{CLASS_CONFIG[cls].emoji}</Text>
              <Text className="font-pixel text-[7px] text-white/60 mt-1">
                {CLASS_CONFIG[cls].nameNorwegian}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Body color */}
        <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
          Kroppsfarge
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {BODY_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => setSelectedColor(color)}
              className={`mr-2 rounded-lg border-2 px-3 py-2 items-center ${
                selectedColor === color ? "border-white/40" : "border-dark-50"
              }`}
            >
              <Text className="text-xs text-white/50">{color}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Equipment preset */}
        <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
          Utstyr
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {EQUIPMENT_PRESETS.map((p, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setEquipPreset(i)}
              className={`mr-2 rounded-lg border-2 px-3 py-2 items-center ${
                equipPreset === i
                  ? "bg-accent-500/15 border-accent-500/40"
                  : "bg-dark-200 border-dark-50"
              }`}
            >
              <Text className="font-pixel text-[8px] text-white/60">{p.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Mana / level selector */}
        <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
          Mana (level)
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {DEMO_MANA_LEVELS.map((mana) => {
            const lvl = getLevel(mana);
            const rnk = getWizardRank(lvl);
            return (
              <TouchableOpacity
                key={mana}
                onPress={() => setSelectedMana(mana)}
                className={`mr-2 rounded-lg border-2 px-3 py-2 items-center ${
                  selectedMana === mana
                    ? "bg-accent-500/15 border-accent-500/40"
                    : "bg-dark-200 border-dark-50"
                }`}
              >
                <Text className="font-pixel text-[9px] text-accent-400">{mana}</Text>
                <Text className="text-[10px] text-white/40">Lv{lvl} {rnk.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Character preview */}
        <PixelCard variant="glow" className="items-center mb-4">
          <CharacterRenderer
            config={avatar}
            characterClass={selectedClass}
            level={level}
            size="xl"
            showClass
            showLevel
            glowRarity={getRarityForPreset()}
          />
          <Text className="font-pixel text-base text-accent-400 mt-3">{rank.name}</Text>
          <Text className="text-white/40 text-sm mt-0.5">
            {classInfo.emoji} {classInfo.nameNorwegian} - Damage: {classInfo.damageMult}x
          </Text>

          <View className="w-full mt-4">
            <ManaBar current={selectedMana} max={nextMana} />
          </View>

          {unlocks.length > 0 && (
            <View className="mt-3 w-full">
              <Text className="font-pixel text-[9px] text-primary-400 mb-1">
                Unlocks ved level {level}:
              </Text>
              {unlocks.map((u) => (
                <Text key={u.slug} className="text-xs text-white/40">
                  {u.type === "rank" ? "\uD83D\uDC51" : u.type === "ability" ? "\uD83E\uDE84" : "\uD83C\uDFC6"} {u.name}
                </Text>
              ))}
            </View>
          )}
        </PixelCard>

        {/* All 4 classes side by side */}
        <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
          Alle klasser
        </Text>
        <View className="flex-row gap-2 mb-4">
          {CLASSES.map((cls) => (
            <PixelCard key={cls} className="flex-1 items-center py-3">
              <CharacterRenderer
                config={avatar}
                characterClass={cls}
                size="md"
              />
              <Text className="font-pixel text-[7px] text-white/50 mt-2">
                {CLASS_CONFIG[cls].nameNorwegian}
              </Text>
            </PixelCard>
          ))}
        </View>

        {/* Skill Tree toggle */}
        <TouchableOpacity
          className="rounded-lg bg-info-500/15 border-2 border-info-500/20 py-3 mb-4"
          onPress={() => setShowSkillTree(!showSkillTree)}
        >
          <Text className="text-center font-pixel text-[10px] text-info-400">
            {showSkillTree ? "Skjul" : "Vis"} Skill Tree {"\u2728"}
          </Text>
        </TouchableOpacity>

        {showSkillTree && (
          <PixelCard className="mb-4">
            <SkillTreeView
              characterClass={selectedClass}
              level={level}
              allocations={skillAllocations}
              onAllocate={(skillId) => {
                setSkillAllocations((prev) => {
                  const existing = prev.find((a) => a.skillId === skillId);
                  if (existing) {
                    return prev.map((a) =>
                      a.skillId === skillId ? { ...a, currentRank: a.currentRank + 1 } : a
                    );
                  }
                  return [...prev, { skillId, currentRank: 1 }];
                });
              }}
              onRespec={() => setSkillAllocations([])}
            />
          </PixelCard>
        )}

        {/* Season Pass preview */}
        <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
          Season Pass preview
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {seasonTiers.slice(0, 10).map((tier) => {
            const rarity = getRarityForReward(tier.reward);
            const emoji = getRewardEmoji(tier.reward);
            return (
              <View key={tier.tier} className="mr-2 items-center" style={{ width: 64 }}>
                <RarityBorder rarity={rarity}>
                  <View className="w-14 h-14 items-center justify-center bg-dark-200 rounded-md">
                    <Text className="text-lg">{emoji}</Text>
                    <Text className="font-pixel text-[6px] text-white/40 mt-0.5">T{tier.tier}</Text>
                  </View>
                </RarityBorder>
                <Text className="text-[7px] text-white/25 mt-1 text-center" numberOfLines={1}>
                  {tier.reward.label}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Achievements preview */}
        <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
          Achievements
        </Text>
        <View className="flex-row flex-wrap gap-2 mb-4">
          {achievements.map((a) => (
            <PixelCard key={a.slug} className="items-center py-2 px-3">
              <Text className="text-lg">{a.icon}</Text>
              <Text className="font-pixel text-[7px] text-white/50 mt-1">{a.nameNorwegian}</Text>
            </PixelCard>
          ))}
        </View>

        {/* Rank progression */}
        <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
          Alle ranks
        </Text>
        <PixelCard className="mb-4">
          {RANKS.map((r) => {
            const isActive = rank.rank === r.rank;
            return (
              <View
                key={r.rank}
                className={`flex-row items-center py-2 ${
                  isActive ? "bg-primary-500/10 -mx-4 px-4 rounded-md" : ""
                }`}
              >
                <Text className="w-14 font-pixel text-[8px] text-white/40">Lv {r.minLevel}-{r.maxLevel}</Text>
                <Text className={`flex-1 font-pixel text-[10px] ${isActive ? "text-primary-400" : "text-white/50"}`}>
                  {r.name}
                </Text>
                <Text className="text-[10px] text-white/25">{r.minMana === 0 ? "0" : r.minMana}+ mana</Text>
              </View>
            );
          })}
        </PixelCard>

        {/* Item rarities */}
        <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
          Item rarities
        </Text>
        <View className="flex-row gap-2 mb-4">
          {(["common", "uncommon", "rare", "epic", "legendary"] as const).map((r) => (
            <RarityBorder key={r} rarity={r} className="flex-1">
              <View className="items-center py-3">
                <Text className="text-xl">{"\uD83C\uDFA9"}</Text>
                <Text className="font-pixel text-[7px] text-white/50 mt-1 capitalize">{r}</Text>
              </View>
            </RarityBorder>
          ))}
        </View>

        {/* Boss HP demo */}
        <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
          Boss HP-bar
        </Text>
        <PixelCard className="mb-10 items-center">
          <Text className="text-5xl mb-2">{"\uD83E\uDDCC"}</Text>
          <Text className="font-pixel text-xs text-danger-400 mb-3">Skjermtrollet</Text>
          <HPBar hp={bossHp} maxHp={3000} size="lg" />
          <View className="flex-row gap-2 mt-3">
            <TouchableOpacity
              className="rounded-md bg-danger-500/20 border border-danger-500/30 px-4 py-2"
              onPress={() => setBossHp((h) => Math.max(h - 500, 0))}
            >
              <Text className="font-pixel text-[9px] text-danger-400">-500 HP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded-md bg-primary-500/20 border border-primary-500/30 px-4 py-2"
              onPress={() => setBossHp(3000)}
            >
              <Text className="font-pixel text-[9px] text-primary-400">Reset</Text>
            </TouchableOpacity>
          </View>
          {bossHp === 0 && (
            <Text className="font-pixel text-sm text-accent-400 mt-3">BOSS BESEIRET!</Text>
          )}
        </PixelCard>
      </ScrollView>
    </SafeAreaView>
  );
}
