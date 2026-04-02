import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth";
import { usePoints } from "@/hooks/usePoints";
import { formatPoints } from "@/lib/points";

export default function ProfileScreen() {
  const { profile, family, signOut } = useAuth();
  const points = usePoints();

  function handleSignOut() {
    Alert.alert("Logg ut", "Er du sikker på at du vil logge ut?", [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Logg ut",
        style: "destructive",
        onPress: signOut,
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 px-6 pt-4">
        <Text className="text-2xl font-bold text-gray-900">Min profil</Text>

        <View className="mt-6 items-center rounded-2xl bg-white p-6 shadow-sm">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-primary-100">
            <Text className="text-3xl">
              {profile?.display_name?.charAt(0)?.toUpperCase() ?? "?"}
            </Text>
          </View>
          <Text className="mt-3 text-xl font-bold text-gray-900">
            {profile?.display_name}
          </Text>
          <View className="mt-1 rounded-full bg-gray-100 px-3 py-1">
            <Text className="text-xs text-gray-500">
              {profile?.role === "parent" ? "Forelder" : "Barn"}
            </Text>
          </View>
        </View>

        <View className="mt-4 flex-row gap-3">
          <View className="flex-1 items-center rounded-2xl bg-white p-4 shadow-sm">
            <Text className="text-2xl font-bold text-primary-600">
              {formatPoints(points.total)}
            </Text>
            <Text className="text-xs text-gray-500">Totalt</Text>
          </View>
          <View className="flex-1 items-center rounded-2xl bg-white p-4 shadow-sm">
            <Text className="text-2xl font-bold text-accent-600">
              {points.streak}🔥
            </Text>
            <Text className="text-xs text-gray-500">Streak</Text>
          </View>
        </View>

        <View className="mt-6 rounded-2xl bg-white shadow-sm">
          <View className="border-b border-gray-100 px-4 py-4">
            <Text className="text-sm text-gray-500">Familie</Text>
            <Text className="mt-0.5 font-semibold text-gray-900">
              {family?.name}
            </Text>
          </View>
          <View className="border-b border-gray-100 px-4 py-4">
            <Text className="text-sm text-gray-500">Invitasjonskode</Text>
            <Text className="mt-0.5 font-mono text-lg font-bold tracking-widest text-primary-600">
              {family?.invite_code}
            </Text>
          </View>

          {profile?.role === "parent" && (
            <TouchableOpacity
              className="px-4 py-4"
              onPress={() => router.push("/(admin)/settings")}
              activeOpacity={0.7}
            >
              <Text className="font-semibold text-primary-600">
                Familieinnstillinger →
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          className="mt-6 rounded-xl border border-red-200 bg-red-50 py-3"
          onPress={handleSignOut}
          activeOpacity={0.7}
        >
          <Text className="text-center font-semibold text-red-600">
            Logg ut
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
