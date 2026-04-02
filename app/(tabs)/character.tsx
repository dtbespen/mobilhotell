import { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/lib/auth";
import { usePoints } from "@/hooks/usePoints";
import { useWizardProfile } from "@/hooks/useWizardProfile";
import { useSkillAllocations } from "@/hooks/useSkillAllocations";
import { useClassAbilities } from "@/hooks/useClassAbilities";
import { useAvatarItems } from "@/hooks/useAvatarItems";
import { useAchievements } from "@/hooks/useAchievements";
import {
  getLevel,
  getWizardRank,
  getManaForNextLevel,
  CLASS_CONFIG,
  getUnlocksForLevel,
} from "@/lib/wizard";
import { getAvailablePoints } from "@/lib/skillTree";
import { ACHIEVEMENT_DEFS } from "@/lib/achievements";
import { CharacterRenderer } from "@/components/wizard/CharacterRenderer";
import { AvatarEditor } from "@/components/wizard/AvatarEditor";
import { SkillTreeView } from "@/components/wizard/SkillTreeView";
import { ClassPicker } from "@/components/wizard/ClassPicker";
import { PixelCard } from "@/components/ui/PixelCard";
import { ManaBar } from "@/components/ui/ManaBar";
import { StatBadge } from "@/components/ui/StatBadge";
import { RarityBorder } from "@/components/ui/RarityBorder";
import {
  buildSeasonTiers,
  getTierForXp,
  getXpToNextTier,
  getRewardEmoji,
  getRarityForReward,
} from "@/lib/seasonPass";
import type {
  CharacterClass,
  AvatarConfig,
  ItemRarity,
} from "@/lib/database.types";

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

const EQUIPMENT_SLOTS: {
  key: SlotType;
  label: string;
  emoji: string;
  side: "left" | "right";
}[] = [
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

type HeroSection = "overview" | "skills" | "wardrobe" | "season";

export default function CharacterScreen() {
  const { profile, family, signOut } = useAuth();
  const points = usePoints();
  const wizard = useWizardProfile();
  const [section, setSection] = useState<HeroSection>("overview");
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [showClassPicker, setShowClassPicker] = useState(false);

  const level = getLevel(points.total);
  const rank = getWizardRank(level);
  const nextMana = getManaForNextLevel(level);
  const unlocks = getUnlocksForLevel(level);

  const characterClass = wizard.characterClass;
  const avatarConfig = wizard.avatarConfig ?? DEFAULT_AVATAR;
  const classInfo = CLASS_CONFIG[characterClass];

  const skillAlloc = useSkillAllocations();
  const classAbilities = useClassAbilities(characterClass, level);
  const avatarItems = useAvatarItems(characterClass);
  const achievements = useAchievements();

  const availableSkillPoints = getAvailablePoints(level, skillAlloc.simpleAllocations);

  const leftSlots = EQUIPMENT_SLOTS.filter((s) => s.side === "left");
  const rightSlots = EQUIPMENT_SLOTS.filter((s) => s.side === "right");

  async function handleAllocate(skillId: string) {
    const result = await skillAlloc.allocateSkill(skillId);
    if (result?.error) {
      Alert.alert("Feil", "Kunne ikke tildele skill point");
    }
  }

  async function handleRespec() {
    Alert.alert(
      "Tilbakestill Skills",
      "Vil du tilbakestille alle skill points?",
      [
        { text: "Avbryt", style: "cancel" },
        {
          text: "Tilbakestill",
          style: "destructive",
          onPress: async () => {
            const result = await skillAlloc.respec();
            if (result?.error) {
              Alert.alert("Feil", "Kunne ikke tilbakestille");
            }
          },
        },
      ]
    );
  }

  function handleSlotPress(slot: SlotType) {
    const unlockedItems = avatarItems.getUnlockedItems(level);
    const slotItems = unlockedItems.filter((item) => item.type === slot);
    const equipped = avatarConfig[slot as keyof AvatarConfig];

    if (slotItems.length === 0) {
      Alert.alert(
        slot,
        equipped
          ? `Equipped: ${equipped}`
          : "Ingen utstyr tilgjengelig for denne slotten enna."
      );
      return;
    }

    const options = slotItems.map((item) => ({
      text: `${item.name} (${item.rarity})`,
      onPress: () => {
        wizard.updateAvatar({ [slot]: item.slug });
      },
    }));
    options.unshift({
      text: "Fjern utstyr",
      onPress: () => wizard.updateAvatar({ [slot]: null }),
    });

    Alert.alert(`Velg ${slot}`, `${slotItems.length} items tilgjengelig`, [
      { text: "Avbryt", style: "cancel" },
      ...options,
    ]);
  }

  async function handleClassChange(newClass: CharacterClass) {
    const result = await wizard.updateClass(newClass);
    if (result?.error) {
      Alert.alert("Feil", "Kunne ikke bytte klasse");
    }
    setShowClassPicker(false);
  }

  async function handleAvatarChange(changes: Partial<AvatarConfig>) {
    await wizard.updateAvatar(changes);
  }

  async function handleTitleChange(slug: string | null) {
    await wizard.updateTitle(slug);
  }

  function handleSignOut() {
    Alert.alert("Logg ut", "Forlate tarnet?", [
      { text: "Nei", style: "cancel" },
      { text: "Ja, logg ut", style: "destructive", onPress: signOut },
    ]);
  }

  const titleDef = wizard.activeTitle
    ? require("@/lib/titles").getTitleBySlug(wizard.activeTitle)
    : null;

  // Season data driven by total Mana
  const seasonTiers = useMemo(() => buildSeasonTiers(), []);
  const currentTier = getTierForXp(points.total, seasonTiers);
  const xpProgress = getXpToNextTier(points.total, currentTier, seasonTiers);

  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      <ScrollView className="flex-1">
        <View className="px-5 pt-4 pb-2">
          <Text className="font-pixel text-lg text-white text-center">
            Helten
          </Text>
        </View>

        {/* Character with equipment slots */}
        <View className="flex-row items-start justify-center px-4 mt-2">
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
                      <Text className="text-lg">
                        {equipped ? slot.emoji : "\u2795"}
                      </Text>
                      <Text className="font-pixel text-[5px] text-white/30 mt-0.5">
                        {slot.label}
                      </Text>
                    </View>
                  </RarityBorder>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            className="items-center mx-3"
            onPress={() => setShowAvatarEditor(true)}
            activeOpacity={0.8}
          >
            <CharacterRenderer
              config={avatarConfig}
              characterClass={characterClass}
              level={level}
              size="xl"
              glowRarity={getRankRarity(level)}
            />
            <Text className="font-pixel text-[7px] text-white/20 mt-1">
              Trykk for aa redigere
            </Text>
          </TouchableOpacity>

          <View className="gap-3 pt-4">
            {rightSlots.map((slot) => {
              const equipped = avatarConfig[slot.key as keyof AvatarConfig];
              const isShield =
                slot.key === "shield" && characterClass !== "knight";
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
                      <Text className="text-lg">
                        {equipped
                          ? slot.emoji
                          : isShield
                          ? "\uD83D\uDEAB"
                          : "\u2795"}
                      </Text>
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

        {/* Mana overview */}
        <PixelCard className="mx-5 mt-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="font-pixel text-[10px] text-accent-400/70">
              Mana
            </Text>
            <Text className="font-pixel text-xl text-accent-400">
              {points.total}
            </Text>
          </View>
          <ManaBar current={points.total} max={nextMana} />
          <Text className="text-[10px] text-white/25 mt-1">
            {Math.max(0, nextMana - points.total)} til level {level + 1}
          </Text>
        </PixelCard>

        {/* Stats */}
        <View className="flex-row gap-3 px-5 mt-3 flex-wrap">
          <StatBadge icon={"\u2728"} value={points.total} label="Mana" color="accent" />
          <StatBadge icon={"\uD83D\uDD25"} value={points.streak} label="Streak" color="danger" />
          <StatBadge icon={"\uD83C\uDFAF"} value={level} label="Level" color="primary" />
          {availableSkillPoints > 0 && (
            <StatBadge icon={"\u2B50"} value={availableSkillPoints} label="Skill pts" color="info" />
          )}
        </View>

        {/* Section tabs */}
        <View className="mx-5 mt-4 flex-row gap-1 rounded-lg bg-dark-100 border-2 border-dark-50 p-1">
          {(
            [
              { key: "overview", label: "Info" },
              { key: "skills", label: `Skills${availableSkillPoints > 0 ? ` (${availableSkillPoints})` : ""}` },
              { key: "wardrobe", label: "Wardrobe" },
              { key: "season", label: "Season" },
            ] as const
          ).map((tab) => (
            <TouchableOpacity
              key={tab.key}
              className={`flex-1 rounded-md py-2 ${
                section === tab.key ? "bg-primary-500" : ""
              }`}
              onPress={() => setSection(tab.key)}
              activeOpacity={0.7}
            >
              <Text
                className={`text-center font-pixel text-[7px] ${
                  section === tab.key ? "text-white" : "text-white/25"
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── OVERVIEW ── */}
        {section === "overview" && (
          <View className="px-5 mt-4 pb-10 gap-4">
            {/* Level unlocks */}
            {unlocks.length > 0 && (
              <PixelCard className="border-accent-500/30">
                <Text className="font-pixel text-[9px] text-accent-400 mb-2">
                  {"\uD83C\uDF1F"} Ulast pa level {level}:
                </Text>
                {unlocks.map((u) => (
                  <Text key={u.slug} className="text-xs text-white/50 mb-0.5">
                    {u.type === "rank" ? "\uD83D\uDC51" : u.type === "ability" ? "\uD83E\uDE84" : "\uD83C\uDFC6"}{" "}
                    {u.name}
                  </Text>
                ))}
              </PixelCard>
            )}

            {/* Class abilities */}
            <PixelCard>
              <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
                Klasseevner
              </Text>
              {classAbilities.unlockedAbilities.length === 0 ? (
                <Text className="text-xs text-white/30">
                  Ingen evner ulast enna
                </Text>
              ) : (
                classAbilities.unlockedAbilities.map((ability) => (
                  <View key={ability.id} className="flex-row items-center mb-2">
                    <Text className="text-lg mr-2">{(ability as any).emoji ?? "\uD83E\uDE84"}</Text>
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-white">{ability.name}</Text>
                      <Text className="text-xs text-white/30">{ability.description}</Text>
                    </View>
                  </View>
                ))
              )}
              {classAbilities.lockedAbilities.length > 0 && (
                <Text className="text-[10px] text-white/15 mt-2">
                  {classAbilities.lockedAbilities.length} evner laast (neste: level {classAbilities.lockedAbilities[0]?.unlock_level})
                </Text>
              )}
            </PixelCard>

            {/* Achievements */}
            <PixelCard>
              <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
                Achievements ({achievements.achievements.length})
              </Text>
              {achievements.achievements.length === 0 ? (
                <Text className="text-xs text-white/30">
                  Ingen achievements ulast enna
                </Text>
              ) : (
                achievements.achievements.slice(0, 5).map((a) => {
                  const def = ACHIEVEMENT_DEFS.find((d) => d.slug === a.achievement_slug);
                  return (
                    <View key={a.id} className="flex-row items-center mb-1.5">
                      <Text className="text-lg mr-2">{def?.emoji ?? "\uD83C\uDFC6"}</Text>
                      <View className="flex-1">
                        <Text className="text-sm text-white">{def?.name ?? a.achievement_slug}</Text>
                        <Text className="text-[10px] text-white/20">{def?.description ?? ""}</Text>
                      </View>
                    </View>
                  );
                })
              )}
            </PixelCard>

            {/* Class info + change class */}
            <PixelCard>
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
              <TouchableOpacity
                className="mt-3 rounded-md bg-primary-500/15 border border-primary-500/20 py-2"
                onPress={() => setShowClassPicker(true)}
                activeOpacity={0.7}
              >
                <Text className="text-center font-pixel text-[9px] text-primary-400">
                  Bytt klasse
                </Text>
              </TouchableOpacity>
            </PixelCard>

            {/* Guild info */}
            <PixelCard>
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
            </PixelCard>

            {/* Sign out */}
            <TouchableOpacity
              className="rounded-lg bg-danger-500/10 border-2 border-danger-500/15 py-4"
              onPress={handleSignOut}
              activeOpacity={0.7}
            >
              <Text className="text-center font-bold text-danger-500">Logg ut</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── SKILLS ── */}
        {section === "skills" && (
          <View className="flex-1 px-4 mt-4 pb-10">
            <SkillTreeView
              characterClass={characterClass}
              level={level}
              allocations={skillAlloc.simpleAllocations}
              onAllocate={handleAllocate}
              onRespec={handleRespec}
            />
          </View>
        )}

        {/* ── WARDROBE ── */}
        {section === "wardrobe" && (
          <View className="px-5 mt-4 pb-10">
            {avatarItems.isLoading ? (
              <PixelCard className="items-center py-8">
                <Text className="text-white/30">Laster utstyr...</Text>
              </PixelCard>
            ) : (
              <>
                {(["hat", "armor", "cape", "weapon", "shield", "familiar"] as const).map((itemType) => {
                  const typeItems = avatarItems.getItemsByType(itemType);
                  if (typeItems.length === 0) return null;
                  const slotInfo = EQUIPMENT_SLOTS.find((s) => s.key === itemType);
                  return (
                    <View key={itemType} className="mb-4">
                      <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
                        {slotInfo?.emoji} {slotInfo?.label ?? itemType} ({typeItems.length})
                      </Text>
                      <View className="flex-row flex-wrap gap-2">
                        {typeItems.map((item) => {
                          const isUnlocked = item.unlock_level <= level && !item.is_boss_drop;
                          const isEquipped = avatarConfig[itemType as keyof AvatarConfig] === item.slug;
                          return (
                            <TouchableOpacity
                              key={item.id}
                              onPress={() => {
                                if (!isUnlocked) {
                                  Alert.alert("Laast", `Krever level ${item.unlock_level}`);
                                  return;
                                }
                                if (isEquipped) {
                                  wizard.updateAvatar({ [itemType]: null });
                                } else {
                                  wizard.updateAvatar({ [itemType]: item.slug });
                                }
                              }}
                              activeOpacity={0.7}
                            >
                              <RarityBorder rarity={isUnlocked ? (item.rarity as ItemRarity) : "common"}>
                                <View
                                  className={`w-20 h-20 items-center justify-center rounded-md ${
                                    isEquipped ? "bg-primary-500/20 border border-primary-500/40" : "bg-dark-200"
                                  } ${!isUnlocked ? "opacity-30" : ""}`}
                                >
                                  <Text className="text-2xl">{slotInfo?.emoji ?? "\u2728"}</Text>
                                  <Text className="font-pixel text-[6px] text-white/50 mt-1" numberOfLines={1}>
                                    {item.name}
                                  </Text>
                                  {!isUnlocked && (
                                    <Text className="font-pixel text-[5px] text-white/20">
                                      Lv {item.unlock_level}
                                    </Text>
                                  )}
                                  {isEquipped && (
                                    <View className="absolute top-1 right-1 bg-primary-500 rounded-full w-3 h-3 items-center justify-center">
                                      <Text className="text-[6px] text-white">{"\u2713"}</Text>
                                    </View>
                                  )}
                                </View>
                              </RarityBorder>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  );
                })}
              </>
            )}
          </View>
        )}

        {/* ── SEASON ── */}
        {section === "season" && (
          <View className="mt-4 pb-10">
            <PixelCard variant="glow" className="mx-5">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-pixel text-xs text-accent-400">
                  Tier {currentTier} / 30
                </Text>
                <Text className="font-pixel text-xs text-white/40">
                  {points.total} Mana
                </Text>
              </View>
              <ManaBar
                current={xpProgress.current}
                max={xpProgress.required || 1}
                showLabel={false}
                size="md"
              />
              <Text className="text-[10px] text-white/25 mt-1">
                {Math.max(0, xpProgress.required - xpProgress.current)} Mana til Tier {currentTier + 1}
              </Text>
            </PixelCard>

            <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mx-5 mt-4 mb-2">
              Belonningsbane
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5">
              {seasonTiers.map((tier) => {
                const isUnlocked = tier.tier <= currentTier;
                const isCurrent = tier.tier === currentTier + 1;
                const rarity = getRarityForReward(tier.reward);
                const emoji = getRewardEmoji(tier.reward);
                return (
                  <View key={tier.tier} className="mr-2 items-center" style={{ width: 72 }}>
                    <RarityBorder rarity={isUnlocked ? rarity : "common"}>
                      <View
                        className={`w-16 h-16 items-center justify-center rounded-md ${
                          isUnlocked
                            ? "bg-dark-100"
                            : isCurrent
                            ? "bg-dark-200 border border-primary-500/30"
                            : "bg-dark-300"
                        } ${!isUnlocked && !isCurrent ? "opacity-40" : ""}`}
                      >
                        <Text className="text-xl">{isUnlocked ? emoji : "\uD83D\uDD12"}</Text>
                        <Text className="font-pixel text-[6px] text-white/40 mt-1">T{tier.tier}</Text>
                      </View>
                    </RarityBorder>
                    <Text className="text-[8px] text-white/30 text-center mt-1" numberOfLines={2}>
                      {isUnlocked || isCurrent ? tier.reward.label : "???"}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Avatar Editor Modal */}
      <Modal
        visible={showAvatarEditor}
        animationType="slide"
        onRequestClose={() => setShowAvatarEditor(false)}
      >
        <SafeAreaView className="flex-1 bg-dark-300">
          <View className="flex-row items-center justify-between px-5 pt-2 pb-3">
            <Text className="font-pixel text-sm text-white">Rediger utseende</Text>
            <TouchableOpacity
              onPress={() => setShowAvatarEditor(false)}
              className="bg-dark-100 rounded-lg px-4 py-2 border border-dark-50"
            >
              <Text className="font-pixel text-[9px] text-white/50">Ferdig</Text>
            </TouchableOpacity>
          </View>
          <AvatarEditor
            config={avatarConfig}
            characterClass={characterClass}
            level={level}
            onChange={handleAvatarChange}
          />
        </SafeAreaView>
      </Modal>

      {/* Class Picker Modal */}
      <Modal
        visible={showClassPicker}
        animationType="slide"
        transparent
        onRequestClose={() => setShowClassPicker(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="rounded-t-[24px] bg-dark-200 px-6 pb-10 pt-6 border-t-2 border-dark-50">
            <Text className="font-pixel text-sm text-white mb-4">Velg klasse</Text>
            <ClassPicker
              currentClass={characterClass}
              onSelect={handleClassChange}
            />
            <TouchableOpacity
              className="mt-4 rounded-lg bg-dark-100 border-2 border-dark-50 py-3"
              onPress={() => setShowClassPicker(false)}
            >
              <Text className="text-center font-bold text-white/30">Avbryt</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
