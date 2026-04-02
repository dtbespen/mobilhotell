import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert } from "react-native";
import { useState, useCallback, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth";
import { usePoints } from "@/hooks/usePoints";
import { useActivities } from "@/hooks/useActivities";
import { useDailyLogin } from "@/hooks/useDailyLogin";
import { useDungeon } from "@/hooks/useDungeon";
import { formatDuration } from "@/lib/points";
import { getLevel, getManaForNextLevel, getWizardRank, CLASS_CONFIG, getUnlocksForLevel } from "@/lib/wizard";
import { buildSeasonTiers, getTierForXp } from "@/lib/seasonPass";
import { getStreakFlameEmoji, isManaCapped, DAILY_MANA_CAP } from "@/lib/streakManager";
import { useGuildStars } from "@/hooks/useGuildStars";
import { Brand } from "@/constants/Colors";
import { PixelCard } from "@/components/ui/PixelCard";
import { ManaBar } from "@/components/ui/ManaBar";
import { StatBadge } from "@/components/ui/StatBadge";
import { HPBar } from "@/components/ui/HPBar";
import { CharacterRenderer } from "@/components/wizard/CharacterRenderer";
import type { CharacterClass, AvatarConfig } from "@/lib/database.types";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 10) return "God morgen";
  if (h < 18) return "Hei";
  return "God kveld";
}

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

export default function WizardTowerScreen() {
  const { profile, family } = useAuth();
  const points = usePoints();
  const { activities, activeActivity } = useActivities();
  const dailyLogin = useDailyLogin();
  const { dungeon, remainingHp, daysRemaining } = useDungeon();
  const { currentStars } = useGuildStars();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([points.refresh()]);
    setRefreshing(false);
  }, [points]);

  const recentActivities = activities.filter((a) => a.ended_at).slice(0, 5);

  const level = getLevel(points.total);
  const rank = getWizardRank(level);
  const nextLevelMana = getManaForNextLevel(level);
  const unlocks = getUnlocksForLevel(level);

  const characterClass: CharacterClass =
    (profile as any)?.character_class ?? "wizard";
  const avatarConfig: AvatarConfig =
    (profile as any)?.avatar_config ?? DEFAULT_AVATAR;
  const classInfo = CLASS_CONFIG[characterClass];

  const loginStreak = (profile as any)?.login_streak ?? points.streak;

  const seasonTiers = useMemo(() => buildSeasonTiers(), []);
  const seasonTier = getTierForXp(points.total, seasonTiers);

  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Brand.manaGreen}
          />
        }
      >
        <View className="px-6 pt-4 pb-2">
          <Text className="text-sm text-white/30">
            {family?.name ? `\uD83D\uDEE1\uFE0F ${family.name}` : ""}
          </Text>
          <Text className="text-lg text-white mt-0.5">
            {getGreeting()},{" "}
            <Text className="font-bold">{profile?.display_name}</Text>
          </Text>
        </View>

        {/* Hero: Character + Rank */}
        <View className="items-center py-4">
          <CharacterRenderer
            config={avatarConfig}
            characterClass={characterClass}
            level={level}
            size="xl"
          />
          <Text className="font-pixel text-sm text-accent-400 mt-3">
            {rank.name}
          </Text>
          <Text className="text-white/40 text-xs mt-0.5">
            Level {level} {classInfo.emoji} {classInfo.nameNorwegian}
          </Text>
        </View>

        {/* Mana card */}
        <PixelCard variant="glow" className="mx-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="font-pixel text-xs text-accent-400/70">Mana</Text>
            <Text className="font-pixel text-2xl text-accent-400">
              {points.total}
            </Text>
          </View>
          <ManaBar current={points.total} max={nextLevelMana} size="md" />
          <Text className="text-[11px] text-white/25 mt-2">
            {Math.max(0, nextLevelMana - points.total)} til level {level + 1}
          </Text>
        </PixelCard>

        {/* Level unlocks */}
        {unlocks.length > 0 && (
          <PixelCard className="mx-6 mt-3 border-accent-500/30">
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

        {/* Daily login reward */}
        <TouchableOpacity
          onPress={async () => {
            if (dailyLogin.isClaimed) return;
            const result = await dailyLogin.claimReward();
            if (result.error) {
              Alert.alert("Feil", typeof result.error === "string" ? result.error : "Noe gikk galt");
            } else {
              Alert.alert("\uD83C\uDF81 Daglig belonning!", `+${result.mana} Mana!`);
            }
          }}
          activeOpacity={dailyLogin.isClaimed ? 1 : 0.7}
        >
          <PixelCard className="mx-6 mt-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-lg mr-2">{"\uD83C\uDF81"}</Text>
                <View>
                  <Text className="font-pixel text-[9px] text-primary-400">
                    Daglig belonning
                  </Text>
                  <Text className="text-xs text-white/30">
                    Dag {loginStreak || 1}: +{dailyLogin.reward?.mana ?? 0} mana
                    {dailyLogin.reward?.bonusType === "item" ? ` + ${dailyLogin.reward.bonusLabel}` : ""}
                  </Text>
                </View>
              </View>
              <View className={`rounded-lg px-3 py-1.5 ${
                dailyLogin.isClaimed
                  ? "bg-primary-500/10 border border-primary-500/10"
                  : "bg-primary-500/20 border border-primary-500/30"
              }`}>
                <Text className={`font-pixel text-[8px] ${
                  dailyLogin.isClaimed ? "text-primary-400/30" : "text-primary-400"
                }`}>
                  {dailyLogin.isClaimed ? "\u2713 Hentet" : "Hent"}
                </Text>
              </View>
            </View>
          </PixelCard>
        </TouchableOpacity>

        {/* Dungeon mini */}
        {dungeon && (
          <TouchableOpacity onPress={() => router.push("/(tabs)/guild")} activeOpacity={0.7}>
            <PixelCard className="mx-6 mt-3">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                  <Text className="text-lg mr-2">{"\uD83D\uDC09"}</Text>
                  <View>
                    <Text className="font-pixel text-[9px] text-danger-400">
                      {dungeon.boss_name}
                    </Text>
                    <Text className="text-xs text-white/30">
                      {daysRemaining}d igjen
                    </Text>
                  </View>
                </View>
                <Text className="text-white/20">{"\u2192"}</Text>
              </View>
              <HPBar hp={remainingHp} maxHp={dungeon.boss_hp} size="sm" />
            </PixelCard>
          </TouchableOpacity>
        )}

        {/* Season progress mini */}
        <TouchableOpacity onPress={() => router.push("/(tabs)/character")} activeOpacity={0.7}>
          <PixelCard className="mx-6 mt-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-lg mr-2">{"\u2744\uFE0F"}</Text>
                <View>
                  <Text className="font-pixel text-[9px] text-info-400">
                    Frostmagiernes Vinter
                  </Text>
                  <Text className="text-xs text-white/30">
                    Tier {seasonTier} / 30
                  </Text>
                </View>
              </View>
              <Text className="text-white/20">{"\u2192"}</Text>
            </View>
          </PixelCard>
        </TouchableOpacity>

        {/* Active quest */}
        {activeActivity && (
          <PixelCard className="mx-6 mt-3 border-primary-500/30">
            <View className="flex-row items-center gap-2">
              <View className="h-2.5 w-2.5 rounded-full bg-primary-400" />
              <Text className="font-pixel text-xs text-primary-400">Quest aktiv</Text>
            </View>
            <Text className="mt-1 text-base font-bold text-white">
              {activeActivity.activity_type?.name ?? "Quest"}
            </Text>
            <Text className="mt-1 text-sm text-white/30">
              Mana strommer inn...
            </Text>
          </PixelCard>
        )}

        {/* Mana cap warning */}
        {isManaCapped(points.today) && (
          <PixelCard variant="glow" className="mx-6 mt-3 items-center py-4 border-accent-500/40">
            <Text className="text-3xl mb-1">{"\uD83C\uDF89"}</Text>
            <Text className="font-pixel text-xs text-accent-400">
              Dagens mana-grense nadd!
            </Text>
            <Text className="text-xs text-white/30 mt-1">
              {DAILY_MANA_CAP} mana - Kom tilbake i morgen!
            </Text>
          </PixelCard>
        )}

        {/* Guild Stars shortcut */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/guild")}
          activeOpacity={0.7}
        >
          <PixelCard className="mx-6 mt-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-lg mr-2">{"\u2B50"}</Text>
                <View>
                  <Text className="font-pixel text-[9px] text-accent-400">
                    Guild Stars
                  </Text>
                  <Text className="text-xs text-white/30">
                    {currentStars} stjerner - se belonninger!
                  </Text>
                </View>
              </View>
              <Text className="text-white/20">{"\u2192"}</Text>
            </View>
          </PixelCard>
        </TouchableOpacity>

        {/* Stats */}
        <View className="mt-4 flex-row gap-3 px-6 flex-wrap">
          <StatBadge icon={"\u26A1"} value={`${points.today}/${DAILY_MANA_CAP}`} label="I dag" color="primary" />
          <StatBadge icon={"\uD83D\uDCC5"} value={points.thisWeek} label="Uka" color="info" />
          <StatBadge icon={getStreakFlameEmoji(points.streak)} value={points.streak} label="Streak" color="danger" />
          <StatBadge icon={"\u2B50"} value={currentStars} label="Stars" color="accent" />
        </View>

        {/* Recent quests */}
        <View className="mt-6 px-6 pb-10">
          <Text className="font-pixel text-[10px] text-white/20 uppercase tracking-wider mb-3">
            Siste quests
          </Text>
          {recentActivities.length === 0 ? (
            <PixelCard className="items-center py-8">
              <Text className="text-4xl mb-2">{"\uD83C\uDFAF"}</Text>
              <Text className="font-pixel text-xs text-white/50">
                Ingen quests enna!
              </Text>
              <Text className="text-sm text-white/20 mt-1">
                Legg bort telefonen og start din forste quest
              </Text>
            </PixelCard>
          ) : (
            <View className="gap-3">
              {recentActivities.map((activity) => (
                <PixelCard
                  key={activity.id}
                  className="flex-row items-center justify-between py-3"
                >
                  <View className="flex-1">
                    <Text className="font-semibold text-white">
                      {activity.activity_type?.name}
                    </Text>
                    <Text className="text-xs text-white/20">
                      {formatDuration(activity.duration_minutes)}
                    </Text>
                  </View>
                  <View className="rounded-md bg-accent-500/15 px-3 py-1.5">
                    <Text className="font-pixel text-xs text-accent-400">
                      +{activity.points_earned}
                    </Text>
                  </View>
                </PixelCard>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
