import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth";
import { usePoints } from "@/hooks/usePoints";
import { formatPoints } from "@/lib/points";

function getLevel(total: number): { level: number; name: string; emoji: string } {
  if (total >= 5000) return { level: 5, name: "Legend", emoji: "👑" };
  if (total >= 2500) return { level: 4, name: "Master", emoji: "💎" };
  if (total >= 1000) return { level: 3, name: "Pro", emoji: "🔥" };
  if (total >= 300) return { level: 2, name: "Rising", emoji: "⚡" };
  return { level: 1, name: "Rookie", emoji: "🌱" };
}

export default function ProfileScreen() {
  const { profile, family, signOut } = useAuth();
  const points = usePoints();
  const level = getLevel(points.total);

  function handleSignOut() {
    Alert.alert("Logg ut", "Sikker på at du vil stikke?", [
      { text: "Nei", style: "cancel" },
      { text: "Ja, logg ut", style: "destructive", onPress: signOut },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      <ScrollView className="flex-1">
        {/* Hero */}
        <View className="items-center px-6 pt-6 pb-6">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-primary-500/20 border-2 border-primary-500/30">
            <Text className="text-4xl font-bold text-primary-400">
              {profile?.display_name?.charAt(0)?.toUpperCase() ?? "?"}
            </Text>
          </View>
          <Text className="mt-4 text-2xl font-bold text-white">
            {profile?.display_name}
          </Text>
          <View className="mt-2 rounded-full bg-dark-100 px-4 py-1.5">
            <Text className="text-sm text-white/30">
              {profile?.role === "parent" ? "Forelder" : "Barn"}
            </Text>
          </View>

          {/* Level badge */}
          <View className="mt-5 rounded-2xl bg-accent-500/15 border border-accent-500/20 px-8 py-4 items-center">
            <Text style={{ fontSize: 32 }}>{level.emoji}</Text>
            <Text className="mt-1 text-base font-bold text-accent-400">
              Level {level.level} — {level.name}
            </Text>
            <Text className="text-sm text-white/25">
              {formatPoints(points.total)} Plugs totalt
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row gap-3 px-6">
          <View className="flex-1 items-center rounded-2xl bg-primary-500/10 p-5">
            <Text className="text-2xl font-bold text-primary-400">
              {formatPoints(points.total)}
            </Text>
            <Text className="text-[10px] font-bold text-white/20 uppercase tracking-wider mt-1">
              Plugs
            </Text>
          </View>
          <View className="flex-1 items-center rounded-2xl bg-danger-500/10 p-5">
            <Text className="text-2xl font-bold text-danger-500">
              {points.streak}🔥
            </Text>
            <Text className="text-[10px] font-bold text-white/20 uppercase tracking-wider mt-1">
              Streak
            </Text>
          </View>
        </View>

        {/* Family info */}
        <View className="mt-6 mx-6 rounded-2xl bg-dark-100 overflow-hidden">
          <View className="border-b border-dark-50 px-5 py-4">
            <Text className="text-[10px] font-bold text-white/20 uppercase tracking-wider">
              Team
            </Text>
            <Text className="mt-1 text-base font-bold text-white">
              {family?.name}
            </Text>
          </View>
          <View className="border-b border-dark-50 px-5 py-4">
            <Text className="text-[10px] font-bold text-white/20 uppercase tracking-wider">
              Invitasjonskode
            </Text>
            <Text className="mt-1 text-xl font-bold tracking-[6px] text-accent-400">
              {family?.invite_code}
            </Text>
          </View>

          {profile?.role === "parent" && (
            <TouchableOpacity
              className="px-5 py-4"
              onPress={() => router.push("/(admin)/settings")}
              activeOpacity={0.7}
            >
              <Text className="font-bold text-primary-400 text-base">
                Familieinnstillinger →
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Sign out */}
        <View className="px-6 mt-8 pb-10">
          <TouchableOpacity
            className="rounded-2xl bg-danger-500/10 border border-danger-500/15 py-4"
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <Text className="text-center font-bold text-danger-500">
              Logg ut
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
