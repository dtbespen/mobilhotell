import { Tabs, Redirect } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import { useAuth } from "@/lib/auth";
import { Colors, Brand } from "@/constants/Colors";

export default function TabLayout() {
  const { session, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-dark-300">
        <Text className="font-pixel text-2xl text-primary-400 mb-4">
          Unplug
        </Text>
        <ActivityIndicator size="large" color={Brand.manaGreen} />
      </View>
    );
  }

  if (!session) return <Redirect href="/(auth)/login" />;
  if (!profile?.family_id) return <Redirect href="/(auth)/join" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Brand.manaGreen,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Brand.dungeonDark,
          borderTopColor: "#22252b",
          paddingBottom: 4,
          height: 88,
        },
        tabBarLabelStyle: {
          fontFamily: "PressStart2P",
          fontSize: 7,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Hjem",
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji={"\u{1F3F0}"} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: "Quests",
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji={"\u{1F4DC}"} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="guild"
        options={{
          title: "Guild",
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji={"\u{1F6E1}\u{FE0F}"} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="character"
        options={{
          title: "Helten",
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji={"\u{2694}\u{FE0F}"} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.35 }}>{emoji}</Text>
  );
}
