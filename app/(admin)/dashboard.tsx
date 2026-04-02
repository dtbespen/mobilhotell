import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth";
import { useFamily } from "@/hooks/useFamily";
import { usePoints } from "@/hooks/usePoints";
import { getLevel, getWizardRank, CLASS_CONFIG } from "@/lib/wizard";
import { CharacterRenderer } from "@/components/wizard/CharacterRenderer";
import { PixelCard } from "@/components/ui/PixelCard";
import { ManaBar } from "@/components/ui/ManaBar";
import { StatBadge } from "@/components/ui/StatBadge";
import { useGuildStars } from "@/hooks/useGuildStars";
import { useGuildRewards } from "@/hooks/useGuildRewards";
import type { AvatarConfig, CharacterClass } from "@/lib/database.types";

const DEFAULT_AVATAR: AvatarConfig = {
  body_color: "blue",
  hair_style: null,
  hair_color: null,
  hat: null,
  armor: null,
  cape: null,
  weapon: null,
  shield: null,
  familiar: null,
};

export default function GuildMasterDashboard() {
  const { family } = useAuth();
  const { members } = useFamily();
  const points = usePoints();

  const { currentStars, totalEarned } = useGuildStars();
  const { pendingClaims } = useGuildRewards();
  const childMembers = members.filter((m) => m.role === "child");

  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      <ScrollView className="flex-1 px-5">
        <View className="flex-row items-center gap-3 pt-4 mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-2xl text-primary-400">{"\u2190"}</Text>
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="font-pixel text-sm text-white">
              {"\uD83D\uDEE1\uFE0F"} Guild Master
            </Text>
            <Text className="text-xs text-white/30">{family?.name}</Text>
          </View>
        </View>

        {/* Weekly summary */}
        <PixelCard variant="glow" className="mb-4">
          <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-3">
            Denne uken
          </Text>
          <View className="flex-row gap-3 flex-wrap">
            <StatBadge icon={"\u26A1"} value={points.thisWeek} label="Mana" color="primary" />
            <StatBadge icon={"\uD83D\uDD25"} value={points.streak} label="Streak" color="danger" />
            <StatBadge icon={"\u2B50"} value={currentStars} label="Stars" color="accent" />
            <StatBadge icon={"\uD83D\uDC64"} value={members.length} label="Medlemmer" color="info" />
          </View>
          {pendingClaims.length > 0 && (
            <TouchableOpacity
              className="mt-3 bg-accent-500/15 border border-accent-500/30 rounded-lg px-4 py-2"
              onPress={() => router.push("/(admin)/manage-rewards")}
            >
              <Text className="font-pixel text-[9px] text-accent-400 text-center">
                {"\u23F3"} {pendingClaims.length} belonning{pendingClaims.length !== 1 ? "er" : ""} venter pa godkjenning
              </Text>
            </TouchableOpacity>
          )}
        </PixelCard>

        {/* Family characters */}
        <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-3">
          Guildets helter
        </Text>
        <View className="gap-3 mb-6">
          {childMembers.length === 0 ? (
            <PixelCard className="items-center py-6">
              <Text className="text-white/40">Ingen barn i guildet enna</Text>
            </PixelCard>
          ) : (
            childMembers.map((member) => {
              const memberClass: CharacterClass =
                (member as any).character_class ?? "wizard";
              const memberAvatar: AvatarConfig =
                (member as any).avatar_config ?? DEFAULT_AVATAR;
              const classInfo = CLASS_CONFIG[memberClass];

              return (
                <PixelCard key={member.id} className="flex-row items-center">
                  <CharacterRenderer
                    config={memberAvatar}
                    characterClass={memberClass}
                    size="md"
                  />
                  <View className="flex-1 ml-4">
                    <Text className="font-bold text-white text-base">
                      {member.display_name}
                    </Text>
                    <Text className="text-xs text-white/40">
                      {classInfo.emoji} {classInfo.nameNorwegian}
                    </Text>
                    <View className="flex-row items-center gap-2 mt-1">
                      <View className="bg-primary-500/15 rounded px-2 py-0.5">
                        <Text className="font-pixel text-[7px] text-primary-400">
                          Aktiv
                        </Text>
                      </View>
                    </View>
                  </View>
                </PixelCard>
              );
            })
          )}
        </View>

        {/* Guild invite */}
        <PixelCard className="mb-4">
          <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
            Invitasjonskode
          </Text>
          <Text className="font-pixel text-xl tracking-[6px] text-accent-400 text-center">
            {family?.invite_code}
          </Text>
          <Text className="mt-2 text-xs text-white/25 text-center">
            Del denne koden for a invitere nye medlemmer
          </Text>
        </PixelCard>

        {/* Quick actions */}
        <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-3">
          Handlinger
        </Text>
        <View className="gap-2 pb-10">
          <TouchableOpacity
            className="rounded-lg bg-accent-500/15 border-2 border-accent-500/20 py-4"
            onPress={() => router.push("/(admin)/manage-rewards")}
            activeOpacity={0.7}
          >
            <Text className="text-center font-pixel text-[10px] text-accent-400">
              {"\uD83C\uDF81"} Administrer belonninger
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded-lg bg-primary-500/15 border-2 border-primary-500/20 py-4"
            onPress={() => router.push("/(admin)/activity-types")}
            activeOpacity={0.7}
          >
            <Text className="text-center font-pixel text-[10px] text-primary-400">
              {"\uD83D\uDCDC"} Quest Types
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded-lg bg-info-500/15 border-2 border-info-500/20 py-4"
            onPress={() => router.push("/(admin)/settings")}
            activeOpacity={0.7}
          >
            <Text className="text-center font-pixel text-[10px] text-info-400">
              {"\u2699\uFE0F"} Guild-innstillinger
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
