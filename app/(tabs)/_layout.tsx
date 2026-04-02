import { Tabs, Redirect } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import { useAuth } from "@/lib/auth";

export default function TabLayout() {
  const { session, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!session) return <Redirect href="/(auth)/login" />;
  if (!profile?.family_id) return <Redirect href="/(auth)/join" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#f3f4f6",
          paddingBottom: 4,
          height: 88,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Hjem",
          tabBarIcon: ({ color }) => <TabIcon emoji="🏠" color={color} />,
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: "Aktiviteter",
          tabBarIcon: ({ color }) => <TabIcon emoji="⚡" color={color} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Poengtavle",
          tabBarIcon: ({ color }) => <TabIcon emoji="🏆" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => <TabIcon emoji="👤" color={color} />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ emoji, color }: { emoji: string; color: string }) {
  return (
    <Text
      style={{
        fontSize: 22,
        opacity: color === "#3b82f6" ? 1 : 0.5,
      }}
    >
      {emoji}
    </Text>
  );
}
