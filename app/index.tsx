import { Redirect } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import { useAuth } from "@/lib/auth";
import { Brand } from "@/constants/Colors";

export default function Index() {
  const { session, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-dark-300">
        <Text className="font-pixel text-xl text-primary-400 mb-4">Unplug</Text>
        <ActivityIndicator size="large" color={Brand.manaGreen} />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!profile?.family_id) {
    return <Redirect href="/(auth)/join" />;
  }

  return <Redirect href="/(tabs)" />;
}
