import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDungeon } from "@/hooks/useDungeon";
import { useAuth } from "@/lib/auth";
import { usePoints } from "@/hooks/usePoints";
import { useGuildStars } from "@/hooks/useGuildStars";
import { CLASS_CONFIG } from "@/lib/wizard";
import {
  calculateDungeonStars,
  distributeDungeonStars,
  shouldUnlockBonusDungeon,
} from "@/lib/guildStars";
import { PixelCard } from "@/components/ui/PixelCard";
import { HPBar } from "@/components/ui/HPBar";
import { CharacterRenderer } from "@/components/wizard/CharacterRenderer";
import { RarityBorder } from "@/components/ui/RarityBorder";
import type { CharacterClass, AvatarConfig } from "@/lib/database.types";

const BOSS_EMOJI: Record<string, string> = {
  boss_skjermtrollet: "\u{1F9CC}",
  boss_data_dragen: "\u{1F409}",
  boss_wifi_varulven: "\u{1F43A}",
  boss_digitale_demonen: "\u{1F47F}",
};

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

export default function DungeonScreen() {
  const { profile } = useAuth();
  const points = usePoints();
  const {
    dungeon,
    remainingHp,
    totalDamage,
    myDamage,
    bossDefeated,
    daysRemaining,
    contributions,
    isLoading,
    contributeMana,
  } = useDungeon();
  const { currentStars, totalEarned } = useGuildStars();

  const characterClass: CharacterClass =
    (profile as any)?.character_class ?? "wizard";
  const classInfo = CLASS_CONFIG[characterClass];

  const uniqueContributors = new Set(contributions.map((c) => c.profile_id)).size;

  const starsForVictory = dungeon
    ? calculateDungeonStars(dungeon.difficulty, daysRemaining, uniqueContributors)
    : 0;

  const bonusDungeonPossible = dungeon
    ? shouldUnlockBonusDungeon(dungeon.boss_hp, totalDamage, 7 - daysRemaining, 7)
    : false;

  async function handleContribute() {
    const manaToUse = Math.min(50, points.total);
    if (manaToUse <= 0) {
      Alert.alert("Ikke nok mana!", "Fullfoor quests for aa samle mana.");
      return;
    }

    const { error } = await contributeMana(manaToUse, characterClass);
    if (error) {
      Alert.alert("Feil", typeof error === "string" ? error : "Noe gikk galt");
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-dark-300 items-center justify-center">
        <Text className="font-pixel text-sm text-white/40">
          Laster dungeon...
        </Text>
      </SafeAreaView>
    );
  }

  if (!dungeon) {
    return (
      <SafeAreaView className="flex-1 bg-dark-300 items-center justify-center px-8">
        <Text className="text-5xl mb-4">{"\u{1F3F0}"}</Text>
        <Text className="font-pixel text-sm text-white text-center">
          Ingen aktiv dungeon
        </Text>
        <Text className="text-white/30 text-center mt-2">
          Ny boss dukker opp mandag!
        </Text>
      </SafeAreaView>
    );
  }

  const bossEmoji = BOSS_EMOJI[dungeon.boss_pixel_asset] ?? "\u{1F47E}";

  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      <ScrollView className="flex-1">
        <View className="px-5 pt-4">
          <Text className="font-pixel text-lg text-white text-center">
            Dungeon
          </Text>
          <Text className="text-center text-white/30 text-xs mt-1">
            {dungeon.name}
          </Text>
        </View>

        {/* Guild Stars mini-display */}
        <View className="flex-row justify-center mt-2">
          <View className="bg-accent-500/15 rounded-lg px-4 py-1.5 flex-row items-center">
            <Text className="font-pixel text-xs text-accent-400">
              {"\u2B50"} {currentStars} Guild Stars
            </Text>
          </View>
        </View>

        {/* Boss */}
        <PixelCard
          variant={bossDefeated ? "rarity" : "glow"}
          rarity={bossDefeated ? "legendary" : "common"}
          className="mx-5 mt-4 items-center"
        >
          <Text className="text-[80px]">{bossEmoji}</Text>
          <Text className="font-pixel text-sm text-danger-400 mt-2">
            {dungeon.boss_name}
          </Text>
          <Text className="text-xs text-white/30 mb-3">
            {dungeon.difficulty.toUpperCase()}
            {(dungeon as any).is_bonus ? " (BONUS)" : ""}
          </Text>

          {bossDefeated ? (
            <View className="items-center py-4 w-full">
              <Text className="font-pixel text-lg text-accent-400">
                BOSS BESEIRET!
              </Text>

              {/* Star payout */}
              <RarityBorder rarity="legendary" className="w-full mt-4">
                <PixelCard variant="glow" className="items-center">
                  <Text className="text-3xl">{"\u2B50"}</Text>
                  <Text className="font-pixel text-xl text-accent-400 mt-2">
                    +{starsForVictory} Guild Stars
                  </Text>
                  <Text className="text-xs text-white/30 mt-1">
                    Delt mellom {uniqueContributors} helter
                  </Text>
                  {bonusDungeonPossible && (
                    <View className="mt-3 bg-info-500/15 border border-info-500/30 rounded-lg px-4 py-2">
                      <Text className="font-pixel text-[9px] text-info-400 text-center">
                        {"\uD83C\uDF1F"} Bonus-dungeon laast opp!
                      </Text>
                      <Text className="text-[10px] text-white/30 text-center mt-0.5">
                        Tappre helter far en vanskeligere boss
                      </Text>
                    </View>
                  )}
                </PixelCard>
              </RarityBorder>

              {/* Loot preview */}
              <PixelCard className="w-full mt-3 items-center">
                <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
                  Loot
                </Text>
                <Text className="text-white/40 text-xs">
                  Sjekk din loot i Wardrobe!
                </Text>
              </PixelCard>
            </View>
          ) : (
            <>
              <HPBar hp={remainingHp} maxHp={dungeon.boss_hp} size="lg" />
              <Text className="text-xs text-white/25 mt-2">
                {daysRemaining}d igjen
              </Text>

              {/* Reward preview */}
              <View className="mt-3 bg-accent-500/10 border border-accent-500/20 rounded-lg px-4 py-2 w-full">
                <Text className="font-pixel text-[9px] text-accent-400 text-center">
                  {"\u2B50"} Seier gir {starsForVictory} Guild Stars
                </Text>
              </View>
            </>
          )}
        </PixelCard>

        {/* Contribute */}
        {!bossDefeated && (
          <PixelCard className="mx-5 mt-4">
            <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-3">
              Bidra til kampen
            </Text>
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-white/50 text-xs">Din damage</Text>
                <Text className="font-pixel text-lg text-danger-400">
                  {myDamage}
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-white/50 text-xs">Bidragsytere</Text>
                <Text className="font-pixel text-lg text-info-400">
                  {uniqueContributors}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-white/50 text-xs">Guild totalt</Text>
                <Text className="font-pixel text-lg text-accent-400">
                  {totalDamage}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              className="rounded-lg bg-danger-500 py-4 border-2 border-danger-700"
              onPress={handleContribute}
              activeOpacity={0.85}
            >
              <Text className="text-center font-pixel text-sm text-white">
                {classInfo.emoji} Angrip! (50 Mana)
              </Text>
            </TouchableOpacity>
            <Text className="text-[10px] text-white/20 text-center mt-2">
              {classInfo.damageMult}x {classInfo.nameNorwegian} damage
              {" \u2022 "} Alle i familien bidrar!
            </Text>
          </PixelCard>
        )}

        {/* Pipeline reminder */}
        <PixelCard className="mx-5 mt-4">
          <Text className="font-pixel text-[9px] text-white/25 uppercase tracking-wider mb-2">
            Belonningspipeline
          </Text>
          <View className="flex-row items-center justify-between">
            <View className="items-center flex-1">
              <Text className="text-lg">{"\uD83D\uDCDC"}</Text>
              <Text className="text-[8px] text-white/30">Quests</Text>
            </View>
            <Text className="text-white/15">{"\u2192"}</Text>
            <View className="items-center flex-1">
              <Text className="text-lg">{"\u26A1"}</Text>
              <Text className="text-[8px] text-white/30">Mana</Text>
            </View>
            <Text className="text-white/15">{"\u2192"}</Text>
            <View className="items-center flex-1">
              <Text className="text-lg">{"\uD83D\uDC09"}</Text>
              <Text className="text-[8px] text-white/30">Dungeon</Text>
            </View>
            <Text className="text-white/15">{"\u2192"}</Text>
            <View className="items-center flex-1">
              <Text className="text-lg">{"\u2B50"}</Text>
              <Text className="text-[8px] text-accent-400">Stars</Text>
            </View>
            <Text className="text-white/15">{"\u2192"}</Text>
            <View className="items-center flex-1">
              <Text className="text-lg">{"\uD83C\uDF81"}</Text>
              <Text className="text-[8px] text-accent-400">Rewards</Text>
            </View>
          </View>
        </PixelCard>

        {/* Recent contributions */}
        <View className="mt-5 px-5 pb-10">
          <Text className="font-pixel text-[10px] text-white/20 uppercase tracking-wider mb-3">
            Guild-bidrag
          </Text>
          {contributions.length === 0 ? (
            <PixelCard className="items-center py-6">
              <Text className="text-white/30 text-sm">
                Ingen har angrepet ennaa. Vaer den forste!
              </Text>
            </PixelCard>
          ) : (
            <View className="gap-2">
              {contributions.slice(0, 10).map((c) => (
                <PixelCard
                  key={c.id}
                  className="flex-row items-center py-2.5"
                >
                  <CharacterRenderer
                    config={DEFAULT_AVATAR}
                    characterClass={characterClass}
                    size="sm"
                  />
                  <View className="flex-1 ml-3">
                    <Text className="text-sm font-bold text-white">
                      {(c.profile as any)?.display_name ?? "Helt"}
                    </Text>
                    <Text className="text-xs text-white/20">
                      {c.mana_contributed} mana brukt
                    </Text>
                  </View>
                  <Text className="font-pixel text-xs text-danger-400">
                    -{c.damage_dealt} HP
                  </Text>
                </PixelCard>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
