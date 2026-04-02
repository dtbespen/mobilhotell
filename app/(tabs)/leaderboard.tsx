import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/lib/auth";
import { useFamily } from "@/hooks/useFamily";
import { supabase } from "@/lib/supabase";
import { Brand } from "@/constants/Colors";
import { PixelCard } from "@/components/ui/PixelCard";
import { WizardAvatar } from "@/components/wizard/WizardAvatar";
import { ClassIcon } from "@/components/ui/ClassIcon";
import type { AvatarConfig, CharacterClass } from "@/lib/database.types";

type LeaderboardEntry = {
  profile_id: string;
  display_name: string;
  total_points: number;
  today_points: number;
  role: string;
  character_class: CharacterClass;
  avatar_config: AvatarConfig;
};

const DEFAULT_AVATAR: AvatarConfig = {
  body_color: "blue",
  hat: null,
  robe: null,
  staff: null,
  familiar: null,
};

export default function GuildHallScreen() {
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

      if (fromDate) query = query.gte("started_at", fromDate);

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
        character_class: (member as any).character_class ?? "wizard",
        avatar_config: (member as any).avatar_config ?? DEFAULT_AVATAR,
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

  const MEDALS = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];
  const PERIOD_LABELS = { today: "I dag", week: "Uka", all: "Totalt" };

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
          <Text className="font-pixel text-lg text-white">Guild Hall</Text>
          <Text className="mt-1 text-sm text-white/20">
            {"\u{1F6E1}\u{FE0F}"} {family?.name}
          </Text>
        </View>

        {/* Period picker */}
        <View className="mx-6 mt-4 flex-row gap-1 rounded-lg bg-dark-100 border-2 border-dark-50 p-1">
          {(["today", "week", "all"] as const).map((p) => (
            <TouchableOpacity
              key={p}
              className={`flex-1 rounded-md py-2.5 ${
                period === p ? "bg-primary-500" : ""
              }`}
              onPress={() => setPeriod(p)}
              activeOpacity={0.7}
            >
              <Text
                className={`text-center font-pixel text-[9px] ${
                  period === p ? "text-white" : "text-white/25"
                }`}
              >
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
                entry={entries[1]}
                medal={MEDALS[1]}
                height={72}
                isMe={entries[1].profile_id === profile?.id}
              />
            )}
            <PodiumSpot
              entry={entries[0]}
              medal={MEDALS[0]}
              height={100}
              isMe={entries[0].profile_id === profile?.id}
            />
            {entries.length >= 3 && (
              <PodiumSpot
                entry={entries[2]}
                medal={MEDALS[2]}
                height={56}
                isMe={entries[2].profile_id === profile?.id}
              />
            )}
          </View>
        )}

        {/* Full list */}
        <View className="mt-6 px-6 pb-10">
          {entries.length === 0 ? (
            <PixelCard className="items-center py-8">
              <Text className="text-4xl mb-2">{"\u{1F3C6}"}</Text>
              <Text className="font-pixel text-xs text-white/50">
                Ingen mana enn\u00e5!
              </Text>
              <Text className="text-sm text-white/20 mt-1">
                Hvem blir f\u00f8rst?
              </Text>
            </PixelCard>
          ) : (
            <View className="gap-3">
              {entries.map((entry, index) => (
                <PixelCard
                  key={entry.profile_id}
                  className={`flex-row items-center py-3 ${
                    entry.profile_id === profile?.id
                      ? "border-primary-500/30"
                      : ""
                  }`}
                >
                  <Text className="w-8 text-center text-lg">
                    {index < 3 ? MEDALS[index] : `${index + 1}.`}
                  </Text>
                  <View className="mx-2">
                    <WizardAvatar
                      config={entry.avatar_config}
                      characterClass={entry.character_class}
                      size="sm"
                    />
                  </View>
                  <View className="flex-1 ml-1">
                    <View className="flex-row items-center gap-1.5">
                      <Text className="font-bold text-white">
                        {entry.display_name}
                      </Text>
                      {entry.profile_id === profile?.id && (
                        <View className="rounded-sm bg-primary-500/20 px-1.5 py-0.5">
                          <Text className="text-[9px] font-bold text-primary-400">
                            deg
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-xs text-white/20">
                      +{entry.today_points} mana i dag
                    </Text>
                  </View>
                  <View className="rounded-md bg-accent-500/15 px-3 py-1.5">
                    <Text className="font-pixel text-xs text-accent-400">
                      {entry.total_points}
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

function PodiumSpot({
  entry,
  medal,
  height,
  isMe,
}: {
  entry: LeaderboardEntry;
  medal: string;
  height: number;
  isMe: boolean;
}) {
  return (
    <View className="flex-1 items-center">
      <Text className="text-2xl mb-1">{medal}</Text>
      <WizardAvatar
        config={entry.avatar_config}
        characterClass={entry.character_class}
        size="sm"
      />
      <Text
        className="text-sm font-bold text-white mt-1"
        numberOfLines={1}
      >
        {entry.display_name}
      </Text>
      <Text className="font-pixel text-[10px] text-accent-400 mb-2">
        {entry.total_points}
      </Text>
      <View
        className={`w-full rounded-t-lg ${
          isMe ? "bg-primary-500/30" : "bg-dark-100"
        } border-t-2 border-dark-50`}
        style={{ height }}
      />
    </View>
  );
}
