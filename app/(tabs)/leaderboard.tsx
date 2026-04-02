import { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/lib/auth";
import { useFamily } from "@/hooks/useFamily";
import { supabase } from "@/lib/supabase";
import { formatPoints } from "@/lib/points";

type LeaderboardEntry = {
  profile_id: string;
  display_name: string;
  total_points: number;
  today_points: number;
  role: string;
};

export default function LeaderboardScreen() {
  const { profile, family } = useAuth();
  const { members } = useFamily();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState<"today" | "week" | "all">("week");

  const fetchLeaderboard = useCallback(async () => {
    if (!family || members.length === 0) return;

    const now = new Date();
    let fromDate: string | null = null;

    if (period === "today") {
      fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    } else if (period === "week") {
      fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1).toISOString();
    }

    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const results: LeaderboardEntry[] = [];

    for (const member of members) {
      let query = supabase
        .from("activities")
        .select("points_earned")
        .eq("profile_id", member.id)
        .not("ended_at", "is", null);

      if (fromDate) query = query.gte("started_at", fromDate);

      const { data: periodData } = await query;
      const totalPoints = periodData?.reduce((sum, a) => sum + a.points_earned, 0) ?? 0;

      const { data: todayData } = await supabase
        .from("activities")
        .select("points_earned")
        .eq("profile_id", member.id)
        .gte("started_at", todayStart)
        .not("ended_at", "is", null);

      const todayPoints = todayData?.reduce((sum, a) => sum + a.points_earned, 0) ?? 0;

      results.push({
        profile_id: member.id,
        display_name: member.display_name,
        total_points: totalPoints,
        today_points: todayPoints,
        role: member.role,
      });
    }

    results.sort((a, b) => b.total_points - a.total_points);
    setEntries(results);
  }, [family, members, period]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchLeaderboard();
    setRefreshing(false);
  }, [fetchLeaderboard]);

  const MEDALS = ["🥇", "🥈", "🥉"];
  const PERIOD_LABELS = { today: "I dag", week: "Denne uka", all: "Totalt" };
  const PODIUM_COLORS = ["bg-accent-500/20", "bg-primary-500/20", "bg-info-500/20"];

  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00cc52" />
        }
      >
        <View className="px-6 pt-4 pb-2">
          <Text className="text-2xl font-bold text-white">Hvem leder? 🏆</Text>
          <Text className="mt-1 text-sm text-white/20">{family?.name}</Text>
        </View>

        {/* Period picker */}
        <View className="mx-6 mt-4 flex-row gap-2 rounded-2xl bg-dark-100 p-1.5">
          {(["today", "week", "all"] as const).map((p) => (
            <TouchableOpacity
              key={p}
              className={`flex-1 rounded-xl py-3 ${period === p ? "bg-primary-500" : ""}`}
              onPress={() => setPeriod(p)}
              activeOpacity={0.7}
            >
              <Text className={`text-center text-sm font-bold ${period === p ? "text-white" : "text-white/25"}`}>
                {PERIOD_LABELS[p]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Podium */}
        {entries.length >= 2 && (
          <View className="mt-8 flex-row items-end justify-center gap-3 px-6">
            {entries.length >= 2 && (
              <PodiumSpot
                name={entries[1].display_name}
                plugs={entries[1].total_points}
                medal="🥈"
                height={72}
                bg={PODIUM_COLORS[1]}
                isMe={entries[1].profile_id === profile?.id}
              />
            )}
            <PodiumSpot
              name={entries[0].display_name}
              plugs={entries[0].total_points}
              medal="🥇"
              height={100}
              bg={PODIUM_COLORS[0]}
              isMe={entries[0].profile_id === profile?.id}
            />
            {entries.length >= 3 && (
              <PodiumSpot
                name={entries[2].display_name}
                plugs={entries[2].total_points}
                medal="🥉"
                height={56}
                bg={PODIUM_COLORS[2]}
                isMe={entries[2].profile_id === profile?.id}
              />
            )}
          </View>
        )}

        {/* Full list */}
        <View className="mt-6 px-6 pb-10">
          {entries.length === 0 ? (
            <View className="items-center rounded-3xl bg-dark-100 p-10">
              <Text style={{ fontSize: 44 }}>🏆</Text>
              <Text className="mt-3 text-base font-bold text-white/50 text-center">
                Ingen Plugs ennå!
              </Text>
              <Text className="mt-1 text-sm text-white/20 text-center">
                Hvem blir først?
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {entries.map((entry, index) => (
                <View
                  key={entry.profile_id}
                  className={`flex-row items-center rounded-2xl px-5 py-4 ${
                    entry.profile_id === profile?.id
                      ? "bg-primary-500/10 border border-primary-500/20"
                      : "bg-dark-100"
                  }`}
                >
                  <Text className="w-10 text-center text-xl">
                    {index < 3 ? MEDALS[index] : `${index + 1}.`}
                  </Text>
                  <View className="flex-1 ml-2">
                    <View className="flex-row items-center gap-2">
                      <Text className="font-bold text-white">
                        {entry.display_name}
                      </Text>
                      {entry.profile_id === profile?.id && (
                        <View className="rounded-full bg-primary-500/20 px-2 py-0.5">
                          <Text className="text-[10px] font-bold text-primary-400">deg</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-xs text-white/20">
                      +{entry.today_points} Plugs i dag
                    </Text>
                  </View>
                  <View className="rounded-xl bg-accent-500/15 px-3 py-1.5">
                    <Text className="text-sm font-bold text-accent-400">
                      {formatPoints(entry.total_points)} 🔌
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

function PodiumSpot({
  name, plugs, medal, height, bg, isMe,
}: {
  name: string; plugs: number; medal: string; height: number; bg: string; isMe: boolean;
}) {
  return (
    <View className="flex-1 items-center">
      <Text className="text-2xl mb-1">{medal}</Text>
      <Text className="text-sm font-bold text-white mb-1" numberOfLines={1}>
        {name}
      </Text>
      <Text className="text-xs font-semibold text-accent-400 mb-2">
        {formatPoints(plugs)}
      </Text>
      <View
        className={`w-full rounded-t-2xl ${isMe ? "bg-primary-500/30" : bg}`}
        style={{ height }}
      />
    </View>
  );
}
