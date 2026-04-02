import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/lib/auth";
import { usePoints } from "@/hooks/usePoints";
import { useActivities } from "@/hooks/useActivities";
import { formatDuration, formatPoints } from "@/lib/points";

export default function DashboardScreen() {
  const { profile, family } = useAuth();
  const points = usePoints();
  const { activities, activeActivity } = useActivities();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([points.refresh(), ]);
    setRefreshing(false);
  }, [points]);

  const recentActivities = activities
    .filter((a) => a.ended_at)
    .slice(0, 5);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="px-6 pt-4 pb-2">
          <Text className="text-2xl font-bold text-gray-900">
            Hei, {profile?.display_name}! 👋
          </Text>
          <Text className="mt-1 text-gray-500">{family?.name}</Text>
        </View>

        {activeActivity && (
          <View className="mx-6 mt-4 rounded-2xl bg-green-50 border border-green-200 p-4">
            <View className="flex-row items-center gap-2">
              <View className="h-3 w-3 rounded-full bg-green-500" />
              <Text className="text-sm font-medium text-green-700">
                Aktiv nå
              </Text>
            </View>
            <Text className="mt-2 text-lg font-semibold text-green-900">
              {activeActivity.activity_type?.name ?? "Aktivitet"}
            </Text>
          </View>
        )}

        <View className="mt-6 flex-row gap-3 px-6">
          <PointCard
            label="I dag"
            value={formatPoints(points.today)}
            color="bg-primary-50"
            textColor="text-primary-700"
          />
          <PointCard
            label="Denne uken"
            value={formatPoints(points.thisWeek)}
            color="bg-accent-50"
            textColor="text-accent-700"
          />
          <PointCard
            label="Streak"
            value={`${points.streak}🔥`}
            color="bg-warning-50"
            textColor="text-warning-700"
          />
        </View>

        <View className="mx-6 mt-6 rounded-2xl bg-white p-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900">
            Totalt: {formatPoints(points.total)} poeng
          </Text>
          <View className="mt-3 h-3 rounded-full bg-gray-100">
            <View
              className="h-3 rounded-full bg-primary-500"
              style={{
                width: `${Math.min((points.total / 1000) * 100, 100)}%`,
              }}
            />
          </View>
          <Text className="mt-1 text-xs text-gray-400">
            {Math.max(0, 1000 - points.total)} poeng til neste nivå
          </Text>
        </View>

        <View className="mt-6 px-6 pb-8">
          <Text className="mb-3 text-lg font-semibold text-gray-900">
            Siste aktiviteter
          </Text>
          {recentActivities.length === 0 ? (
            <View className="items-center rounded-2xl bg-white p-8 shadow-sm">
              <Text className="text-3xl">🎯</Text>
              <Text className="mt-2 text-center text-gray-500">
                Ingen aktiviteter ennå.{"\n"}Start med å logge din første!
              </Text>
            </View>
          ) : (
            <View className="gap-2">
              {recentActivities.map((activity) => (
                <View
                  key={activity.id}
                  className="flex-row items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm"
                >
                  <View className="flex-1">
                    <Text className="font-medium text-gray-900">
                      {activity.activity_type?.name}
                    </Text>
                    <Text className="text-xs text-gray-400">
                      {formatDuration(activity.duration_minutes)}
                    </Text>
                  </View>
                  <Text className="font-bold text-primary-600">
                    +{activity.points_earned}
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

function PointCard({
  label,
  value,
  color,
  textColor,
}: {
  label: string;
  value: string;
  color: string;
  textColor: string;
}) {
  return (
    <View className={`flex-1 items-center rounded-2xl ${color} p-4`}>
      <Text className={`text-2xl font-bold ${textColor}`}>{value}</Text>
      <Text className="mt-1 text-xs text-gray-500">{label}</Text>
    </View>
  );
}
