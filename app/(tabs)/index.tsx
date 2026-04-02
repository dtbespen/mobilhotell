import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/lib/auth";
import { usePoints } from "@/hooks/usePoints";
import { useActivities } from "@/hooks/useActivities";
import { formatDuration } from "@/lib/points";
import { getLevel, getManaForNextLevel, getWizardRank, CLASS_CONFIG } from "@/lib/wizard";
import { Brand } from "@/constants/Colors";
import { PixelCard } from "@/components/ui/PixelCard";
import { ManaBar } from "@/components/ui/ManaBar";
import { StatBadge } from "@/components/ui/StatBadge";
import { WizardAvatar } from "@/components/wizard/WizardAvatar";
import type { CharacterClass, AvatarConfig } from "@/lib/database.types";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 10) return "God morgen";
  if (h < 18) return "Hei";
  return "God kveld";
}

const DEFAULT_AVATAR: AvatarConfig = {
  body_color: "blue",
  hat: null,
  robe: null,
  staff: null,
  familiar: null,
};

export default function WizardTowerScreen() {
  const { profile, family } = useAuth();
  const points = usePoints();
  const { activities, activeActivity } = useActivities();
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
  const currentLevelMana = points.total;

  const characterClass: CharacterClass =
    (profile as any)?.character_class ?? "wizard";
  const avatarConfig: AvatarConfig =
    (profile as any)?.avatar_config ?? DEFAULT_AVATAR;
  const classInfo = CLASS_CONFIG[characterClass];

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
            {family?.name ? `\u{1F6E1}\u{FE0F} ${family.name}` : ""}
          </Text>
          <Text className="text-lg text-white mt-0.5">
            {getGreeting()},{" "}
            <Text className="font-bold">{profile?.display_name}</Text>
          </Text>
        </View>

        {/* Hero: Avatar + Rank */}
        <View className="items-center py-6">
          <WizardAvatar
            config={avatarConfig}
            characterClass={characterClass}
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
            <Text className="font-pixel text-xs text-accent-400/70">
              Mana
            </Text>
            <Text className="font-pixel text-2xl text-accent-400">
              {points.total}
            </Text>
          </View>
          <ManaBar current={currentLevelMana} max={nextLevelMana} size="md" />
          <Text className="text-[11px] text-white/25 mt-2">
            {Math.max(0, nextLevelMana - currentLevelMana)} til level{" "}
            {level + 1}
          </Text>
        </PixelCard>

        {/* Active quest */}
        {activeActivity && (
          <PixelCard className="mx-6 mt-4 border-primary-500/30">
            <View className="flex-row items-center gap-2">
              <View className="h-2.5 w-2.5 rounded-full bg-primary-400" />
              <Text className="font-pixel text-xs text-primary-400">
                Quest aktiv
              </Text>
            </View>
            <Text className="mt-1 text-base font-bold text-white">
              {activeActivity.activity_type?.name ?? "Quest"}
            </Text>
            <Text className="mt-1 text-sm text-white/30">
              Mana stroemmer inn...
            </Text>
          </PixelCard>
        )}

        {/* Stats */}
        <View className="mt-5 flex-row gap-3 px-6">
          <StatBadge
            icon={"\u26A1"}
            value={points.today}
            label="I dag"
            color="primary"
          />
          <StatBadge
            icon={"\u{1F4C5}"}
            value={points.thisWeek}
            label="Uka"
            color="info"
          />
          <StatBadge
            icon={"\u{1F525}"}
            value={points.streak}
            label="Streak"
            color="danger"
          />
        </View>

        {/* Recent quests */}
        <View className="mt-6 px-6 pb-10">
          <Text className="font-pixel text-[10px] text-white/20 uppercase tracking-wider mb-3">
            Siste quests
          </Text>
          {recentActivities.length === 0 ? (
            <PixelCard className="items-center py-8">
              <Text className="text-4xl mb-2">{"\u{1F3AF}"}</Text>
              <Text className="font-pixel text-xs text-white/50">
                Ingen quests enn\u00e5!
              </Text>
              <Text className="text-sm text-white/20 mt-1">
                Legg bort telefonen og start din f\u00f8rste quest
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
