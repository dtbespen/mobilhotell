import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth";
import { useFamily } from "@/hooks/useFamily";
import { PixelCard } from "@/components/ui/PixelCard";
import { CharacterRenderer } from "@/components/wizard/CharacterRenderer";
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

export default function GuildMasterScreen() {
  const { family } = useAuth();
  const { members } = useFamily();

  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      <View className="flex-1 px-5 pt-4">
        <View className="flex-row items-center gap-3 mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-2xl text-primary-400">
              {"\u2190"}
            </Text>
          </TouchableOpacity>
          <Text className="font-pixel text-sm text-white">
            Guild Master
          </Text>
        </View>

        <PixelCard className="mb-4">
          <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
            Guild-navn
          </Text>
          <Text className="text-lg font-bold text-white">
            {"\u{1F6E1}\u{FE0F}"} {family?.name}
          </Text>
        </PixelCard>

        <PixelCard className="mb-4">
          <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
            Guild Code
          </Text>
          <Text className="font-pixel text-xl tracking-[6px] text-accent-400">
            {family?.invite_code}
          </Text>
          <Text className="mt-1 text-xs text-white/25">
            Del denne koden for \u00e5 invitere nye medlemmer
          </Text>
        </PixelCard>

        <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mt-4 mb-3">
          Medlemmer ({members.length})
        </Text>
        <PixelCard>
          {members.map((member, index) => (
            <View
              key={member.id}
              className={`flex-row items-center py-3 ${
                index < members.length - 1
                  ? "border-b border-dark-50"
                  : ""
              }`}
            >
              <CharacterRenderer
                config={(member as any).avatar_config ?? DEFAULT_AVATAR}
                characterClass={
                  ((member as any).character_class as CharacterClass) ?? "wizard"
                }
                size="sm"
              />
              <View className="ml-3 flex-1">
                <Text className="font-bold text-white">
                  {member.display_name}
                </Text>
                <Text className="text-xs text-white/30">
                  {member.role === "parent"
                    ? "Guild Master"
                    : "Medlem"}
                </Text>
              </View>
            </View>
          ))}
        </PixelCard>

        <TouchableOpacity
          className="mt-6 rounded-lg bg-primary-500/15 border-2 border-primary-500/20 py-4"
          onPress={() => router.push("/(admin)/activity-types")}
          activeOpacity={0.7}
        >
          <Text className="text-center font-pixel text-[10px] text-primary-400">
            Quest Types {"\u2192"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
