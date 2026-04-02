import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDungeon } from "@/hooks/useDungeon";
import { useAuth } from "@/lib/auth";
import { usePoints } from "@/hooks/usePoints";
import { CLASS_CONFIG } from "@/lib/wizard";
import { PixelCard } from "@/components/ui/PixelCard";
import { HPBar } from "@/components/ui/HPBar";
import { WizardAvatar } from "@/components/wizard/WizardAvatar";
import type { CharacterClass, AvatarConfig } from "@/lib/database.types";

const BOSS_EMOJI: Record<string, string> = {
  boss_skjermtrollet: "\u{1F9CC}",
  boss_data_dragen: "\u{1F409}",
  boss_wifi_varulven: "\u{1F43A}",
  boss_digitale_demonen: "\u{1F47F}",
};

const DEFAULT_AVATAR: AvatarConfig = {
  body_color: "blue",
  hat: null,
  robe: null,
  staff: null,
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

  const characterClass: CharacterClass =
    (profile as any)?.character_class ?? "wizard";
  const classInfo = CLASS_CONFIG[characterClass];

  async function handleContribute() {
    const manaToUse = Math.min(50, points.total);
    if (manaToUse <= 0) {
      Alert.alert("Ikke nok mana!", "Fullf\u00f8r quests for \u00e5 samle mana.");
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

  const bossEmoji =
    BOSS_EMOJI[dungeon.boss_pixel_asset] ?? "\u{1F47E}";

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
          </Text>

          {bossDefeated ? (
            <View className="items-center py-4">
              <Text className="font-pixel text-lg text-accent-400">
                BOSS BESEIRET!
              </Text>
              <Text className="text-white/40 mt-1">
                Sjekk din loot-kiste!
              </Text>
            </View>
          ) : (
            <>
              <HPBar hp={remainingHp} maxHp={dungeon.boss_hp} size="lg" />
              <Text className="text-xs text-white/25 mt-2">
                {daysRemaining}d igjen
              </Text>
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
            </Text>
          </PixelCard>
        )}

        {/* Recent contributions */}
        <View className="mt-5 px-5 pb-10">
          <Text className="font-pixel text-[10px] text-white/20 uppercase tracking-wider mb-3">
            Guild-bidrag
          </Text>
          {contributions.length === 0 ? (
            <PixelCard className="items-center py-6">
              <Text className="text-white/30 text-sm">
                Ingen har angrepet enn\u00e5. V\u00e6r den f\u00f8rste!
              </Text>
            </PixelCard>
          ) : (
            <View className="gap-2">
              {contributions.slice(0, 10).map((c) => (
                <PixelCard
                  key={c.id}
                  className="flex-row items-center py-2.5"
                >
                  <WizardAvatar
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
