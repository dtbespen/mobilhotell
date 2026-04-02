import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth";
import { usePoints } from "@/hooks/usePoints";
import { getLevel, getWizardRank, CLASS_CONFIG } from "@/lib/wizard";
import { PixelCard } from "@/components/ui/PixelCard";
import { StatBadge } from "@/components/ui/StatBadge";
import { WizardAvatar } from "@/components/wizard/WizardAvatar";
import type { CharacterClass, AvatarConfig } from "@/lib/database.types";

const DEFAULT_AVATAR: AvatarConfig = {
  body_color: "blue",
  hat: null,
  robe: null,
  staff: null,
  familiar: null,
};

export default function CharacterSheetScreen() {
  const { profile, family, signOut } = useAuth();
  const points = usePoints();

  const level = getLevel(points.total);
  const rank = getWizardRank(level);
  const characterClass: CharacterClass =
    (profile as any)?.character_class ?? "wizard";
  const avatarConfig: AvatarConfig =
    (profile as any)?.avatar_config ?? DEFAULT_AVATAR;
  const classInfo = CLASS_CONFIG[characterClass];

  function handleSignOut() {
    Alert.alert("Logg ut", "Forlate t\u00e5rnet?", [
      { text: "Nei", style: "cancel" },
      { text: "Ja, logg ut", style: "destructive", onPress: signOut },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      <ScrollView className="flex-1">
        {/* Hero */}
        <View className="items-center px-6 pt-6 pb-4">
          <WizardAvatar
            config={avatarConfig}
            characterClass={characterClass}
            size="xl"
          />
          <Text className="mt-4 text-2xl font-bold text-white">
            {profile?.display_name}
          </Text>
          <Text className="font-pixel text-sm text-accent-400 mt-1">
            {rank.name}
          </Text>
          <View className="flex-row items-center gap-2 mt-1">
            <Text className="text-sm text-white/30">
              Level {level}
            </Text>
            <Text className="text-sm">
              {classInfo.emoji}
            </Text>
            <Text className="text-sm text-white/30">
              {classInfo.nameNorwegian}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row gap-3 px-6 mt-2">
          <StatBadge
            icon={"\u2728"}
            value={points.total}
            label="Mana"
            color="accent"
          />
          <StatBadge
            icon={"\u{1F525}"}
            value={points.streak}
            label="Streak"
            color="danger"
          />
          <StatBadge
            icon={"\u{1F3AF}"}
            value={level}
            label="Level"
            color="primary"
          />
        </View>

        {/* Class info */}
        <PixelCard className="mx-6 mt-5">
          <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
            Klasse
          </Text>
          <View className="flex-row items-center">
            <Text className="text-3xl mr-3">{classInfo.emoji}</Text>
            <View className="flex-1">
              <Text className="font-bold text-white">
                {classInfo.nameNorwegian}
              </Text>
              <Text className="text-sm text-white/40 mt-0.5">
                {classInfo.description}
              </Text>
              <Text className="text-xs text-white/25 mt-0.5">
                Damage: {classInfo.damageMult}x
              </Text>
            </View>
          </View>
        </PixelCard>

        {/* Guild info */}
        <PixelCard className="mx-6 mt-4">
          <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
            Guild
          </Text>
          <Text className="text-base font-bold text-white">
            {"\u{1F6E1}\u{FE0F}"} {family?.name}
          </Text>
          <View className="flex-row items-center mt-2">
            <Text className="text-xs text-white/30 mr-2">Guild Code:</Text>
            <Text className="font-pixel text-sm tracking-[4px] text-accent-400">
              {family?.invite_code}
            </Text>
          </View>

          {profile?.role === "parent" && (
            <TouchableOpacity
              className="mt-3 rounded-md bg-primary-500/15 border border-primary-500/20 py-3"
              onPress={() => router.push("/(admin)/settings")}
              activeOpacity={0.7}
            >
              <Text className="text-center font-pixel text-[10px] text-primary-400">
                Guild Master Settings
              </Text>
            </TouchableOpacity>
          )}
        </PixelCard>

        {/* Sign out */}
        <View className="px-6 mt-8 pb-10">
          <TouchableOpacity
            className="rounded-lg bg-danger-500/10 border-2 border-danger-500/15 py-4"
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
