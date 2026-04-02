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
      fromDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      ).toISOString();
    } else if (period === "week") {
      fromDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay() + 1
      ).toISOString();
    }

    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).toISOString();

    const results: LeaderboardEntry[] = [];

    for (const member of members) {
      let query = supabase
        .from("activities")
        .select("points_earned")
        .eq("profile_id", member.id)
        .not("ended_at", "is", null);

      if (fromDate) {
        query = query.gte("started_at", fromDate);
      }

      const { data: periodData } = await query;
      const totalPoints =
        periodData?.reduce((sum, a) => sum + a.points_earned, 0) ?? 0;

      const { data: todayData } = await supabase
        .from("activities")
        .select("points_earned")
        .eq("profile_id", member.id)
        .gte("started_at", todayStart)
        .not("ended_at", "is", null);

      const todayPoints =
        todayData?.reduce((sum, a) => sum + a.points_earned, 0) ?? 0;

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
  const PERIOD_LABELS = {
    today: "I dag",
    week: "Denne uken",
    all: "Totalt",
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="px-6 pt-4 pb-2">
          <Text className="text-2xl font-bold text-gray-900">Poengtavle</Text>
          <Text className="mt-1 text-gray-500">{family?.name}</Text>
        </View>

        <View className="mx-6 mt-4 flex-row gap-2">
          {(["today", "week", "all"] as const).map((p) => (
            <TouchablePeriod
              key={p}
              label={PERIOD_LABELS[p]}
              isActive={period === p}
              onPress={() => setPeriod(p)}
            />
          ))}
        </View>

        <View className="mt-6 px-6 pb-8">
          {entries.length === 0 ? (
            <View className="items-center rounded-2xl bg-white p-8 shadow-sm">
              <Text className="text-3xl">🏆</Text>
              <Text className="mt-2 text-center text-gray-500">
                Ingen poeng ennå.{"\n"}Kom i gang med å logge aktiviteter!
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {entries.map((entry, index) => (
                <View
                  key={entry.profile_id}
                  className={`flex-row items-center rounded-2xl px-4 py-4 shadow-sm ${
                    entry.profile_id === profile?.id
                      ? "bg-primary-50 border border-primary-200"
                      : "bg-white"
                  }`}
                >
                  <Text className="w-10 text-center text-2xl">
                    {index < 3 ? MEDALS[index] : `${index + 1}.`}
                  </Text>
                  <View className="flex-1 ml-2">
                    <View className="flex-row items-center gap-2">
                      <Text className="font-semibold text-gray-900">
                        {entry.display_name}
                      </Text>
                      {entry.profile_id === profile?.id && (
                        <View className="rounded-full bg-primary-100 px-2 py-0.5">
                          <Text className="text-xs text-primary-700">Deg</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-xs text-gray-400">
                      +{entry.today_points} poeng i dag
                    </Text>
                  </View>
                  <Text className="text-xl font-bold text-primary-600">
                    {formatPoints(entry.total_points)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TouchablePeriod({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className={`flex-1 rounded-xl py-2.5 ${
        isActive ? "bg-primary-600" : "bg-white"
      }`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        className={`text-center text-sm font-semibold ${
          isActive ? "text-white" : "text-gray-600"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
