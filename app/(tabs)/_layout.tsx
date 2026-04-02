import { Tabs, Redirect } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import { useAuth } from "@/lib/auth";

export default function TabLayout() {
  const { session, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-dark-300">
        <Text style={{ fontSize: 44 }}>🔌</Text>
        <ActivityIndicator size="large" color="#00cc52" className="mt-4" />
      </View>
    );
  }

  if (!session) return <Redirect href="/(auth)/login" />;
  if (!profile?.family_id) return <Redirect href="/(auth)/join" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#00cc52",
        tabBarInactiveTintColor: "#555a62",
        tabBarStyle: {
          backgroundColor: "#16191d",
          borderTopColor: "#22252b",
          paddingBottom: 4,
          height: 88,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Hjem",
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔌" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: "Go!",
          tabBarIcon: ({ focused }) => <TabIcon emoji="⚡" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Topp",
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏆" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Meg",
          tabBarIcon: ({ focused }) => <TabIcon emoji="😊" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.35 }}>
      {emoji}
    </Text>
  );
}
