import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth";
import { useFamily } from "@/hooks/useFamily";

export default function SettingsScreen() {
  const { family } = useAuth();
  const { members } = useFamily();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 px-6 pt-4">
        <View className="flex-row items-center gap-3 mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-2xl text-primary-600">←</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900">
            Innstillinger
          </Text>
        </View>

        <View className="rounded-2xl bg-white shadow-sm">
          <View className="border-b border-gray-100 px-4 py-4">
            <Text className="text-sm text-gray-500">Familienavn</Text>
            <Text className="mt-0.5 text-lg font-semibold text-gray-900">
              {family?.name}
            </Text>
          </View>
          <View className="border-b border-gray-100 px-4 py-4">
            <Text className="text-sm text-gray-500">Invitasjonskode</Text>
            <Text className="mt-0.5 font-mono text-2xl font-bold tracking-widest text-primary-600">
              {family?.invite_code}
            </Text>
            <Text className="mt-1 text-xs text-gray-400">
              Del denne koden med familiemedlemmer
            </Text>
          </View>
        </View>

        <Text className="mt-6 mb-3 text-lg font-semibold text-gray-900">
          Familiemedlemmer ({members.length})
        </Text>
        <View className="rounded-2xl bg-white shadow-sm">
          {members.map((member, index) => (
            <View
              key={member.id}
              className={`flex-row items-center px-4 py-3 ${
                index < members.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                <Text className="font-bold text-primary-700">
                  {member.display_name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View className="ml-3 flex-1">
                <Text className="font-medium text-gray-900">
                  {member.display_name}
                </Text>
                <Text className="text-xs text-gray-400">
                  {member.role === "parent" ? "Forelder" : "Barn"}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          className="mt-6 rounded-xl bg-primary-50 border border-primary-200 py-4"
          onPress={() => router.push("/(admin)/activity-types")}
          activeOpacity={0.7}
        >
          <Text className="text-center font-semibold text-primary-700">
            Administrer aktivitetstyper →
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
