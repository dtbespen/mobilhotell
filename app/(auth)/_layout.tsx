import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export default function AuthLayout() {
  const { session, profile, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (session) {
      if (profile?.family_id) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/join");
      }
    }
  }, [session, profile, isLoading]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#16191d" },
      }}
    />
  );
}
