import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/lib/auth";
import { usePoints } from "@/hooks/usePoints";
import { useActivities } from "@/hooks/useActivities";
import { formatDuration, formatPoints } from "@/lib/points";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 10) return "God morgen";
  if (h < 18) return "Hei";
  return "God kveld";
}

function getLevel(total: number): { level: number; name: string; emoji: string; next: number } {
  if (total >= 5000) return { level: 5, name: "Legend", emoji: "👑", next: 99999 };
  if (total >= 2500) return { level: 4, name: "Master", emoji: "💎", next: 5000 };
  if (total >= 1000) return { level: 3, name: "Pro", emoji: "🔥", next: 2500 };
  if (total >= 300) return { level: 2, name: "Rising", emoji: "⚡", next: 1000 };
  return { level: 1, name: "Nybegynner", emoji: "🌱", next: 300 };
}

export default function DashboardScreen() {
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
  const prevThreshold = level.level === 1 ? 0 : level.level === 2 ? 300 : level.level === 3 ? 1000 : level.level === 4 ? 2500 : 5000;
  const progressToNext = Math.min(
    ((points.total - prevThreshold) / (level.next - prevThreshold)) * 100,
    100
  );

  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00cc52" />
        }
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-2">
          <Text className="text-sm text-white/30 font-medium">{family?.name}</Text>
          <Text className="text-2xl font-bold text-white">
            {getGreeting()}, {profile?.display_name} 🔌
          </Text>
        </View>

        {/* Plugs card */}
        <View className="mx-6 mt-4 rounded-3xl bg-accent-500/15 border border-accent-500/20 p-6">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-semibold text-accent-400/70">
                Dine Plugs
              </Text>
              <Text className="text-5xl font-bold text-accent-400 mt-1">
                {formatPoints(points.total)}
              </Text>
            </View>
            <Text style={{ fontSize: 44 }}>🔌</Text>
          </View>
          <View className="mt-4 flex-row items-center gap-3">
            <View className="flex-1 h-3 rounded-full bg-white/10">
              <View
                className="h-3 rounded-full bg-accent-400"
                style={{ width: `${progressToNext}%` }}
              />
            </View>
            <Text className="text-xs font-bold text-accent-400/50">
              {level.emoji} Lvl {level.level}
            </Text>
          </View>
          <Text className="mt-1 text-xs text-white/25">
            {level.name} — {Math.max(0, level.next - points.total)} til neste nivå
          </Text>
        </View>

        {/* Active session */}
        {activeActivity && (
          <View className="mx-6 mt-4 rounded-3xl bg-primary-500/15 border border-primary-500/25 p-5">
            <View className="flex-row items-center gap-2">
              <View className="h-2.5 w-2.5 rounded-full bg-primary-400" />
              <Text className="text-sm font-semibold text-primary-400">
                Pågår nå
              </Text>
            </View>
            <Text className="mt-1 text-lg font-bold text-white">
              {activeActivity.activity_type?.name ?? "Aktivitet"}
            </Text>
            <Text className="mt-1 text-sm text-white/30">
              Plugs tikker inn... 💰
            </Text>
          </View>
        )}

        {/* Stats */}
        <View className="mt-5 flex-row gap-3 px-6">
          <StatCard emoji="⚡" value={formatPoints(points.today)} label="I dag" color="primary" />
          <StatCard emoji="📅" value={formatPoints(points.thisWeek)} label="Denne uka" color="info" />
          <StatCard emoji="🔥" value={`${points.streak}`} label="Streak" color="danger" />
        </View>

        {/* Recent */}
        <View className="mt-6 px-6 pb-10">
          <Text className="mb-3 text-sm font-bold text-white/20 uppercase tracking-wider">
            Siste aktiviteter
          </Text>
          {recentActivities.length === 0 ? (
            <View className="items-center rounded-3xl bg-dark-100 p-10">
              <Text style={{ fontSize: 44 }}>🎯</Text>
              <Text className="mt-3 text-center text-base font-bold text-white/50">
                Ingenting her ennå!
              </Text>
              <Text className="mt-1 text-center text-sm text-white/20">
                Legg vekk telefonen og start å samle Plugs
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {recentActivities.map((activity) => (
                <View
                  key={activity.id}
                  className="flex-row items-center justify-between rounded-2xl bg-dark-100 px-5 py-4"
                >
                  <View className="flex-1">
                    <Text className="font-semibold text-white">
                      {activity.activity_type?.name}
                    </Text>
                    <Text className="text-xs text-white/20">
                      {formatDuration(activity.duration_minutes)}
                    </Text>
                  </View>
                  <View className="rounded-xl bg-accent-500/15 px-3 py-1.5">
                    <Text className="text-sm font-bold text-accent-400">
                      +{activity.points_earned} 🔌
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ emoji, value, label, color }: { emoji: string; value: string; label: string; color: string }) {
  const bgMap: Record<string, string> = {
    primary: "bg-primary-500/10",
    info: "bg-info-500/10",
    danger: "bg-danger-500/10",
  };
  const textMap: Record<string, string> = {
    primary: "text-primary-400",
    info: "text-info-500",
    danger: "text-danger-500",
  };
  return (
    <View className={`flex-1 items-center rounded-2xl ${bgMap[color]} p-4`}>
      <Text className="text-base">{emoji}</Text>
      <Text className={`text-xl font-bold ${textMap[color]} mt-1`}>{value}</Text>
      <Text className="text-[10px] font-bold uppercase tracking-wider text-white/20 mt-1">
        {label}
      </Text>
    </View>
  );
}
