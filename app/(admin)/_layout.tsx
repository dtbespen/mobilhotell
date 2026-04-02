import { Stack, Redirect } from "expo-router";
import { useAuth } from "@/lib/auth";

export default function AdminLayout() {
  const { profile } = useAuth();

  if (profile?.role !== "parent") {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#ffffff" },
        headerTintColor: "#111827",
        headerTitleStyle: { fontWeight: "600" },
      }}
    />
  );
}
