import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/lib/auth";
import { useGuildStars } from "@/hooks/useGuildStars";
import { useGuildRewards } from "@/hooks/useGuildRewards";
import { getCategoryEmoji } from "@/lib/guildStars";
import { PixelCard } from "@/components/ui/PixelCard";
import { RarityBorder } from "@/components/ui/RarityBorder";
import { StatBadge } from "@/components/ui/StatBadge";
import { Brand } from "@/constants/Colors";
import type { GuildReward, ItemRarity } from "@/lib/database.types";

function getRewardRarity(cost: number): ItemRarity {
  if (cost >= 25) return "legendary";
  if (cost >= 15) return "epic";
  if (cost >= 10) return "rare";
  if (cost >= 5) return "uncommon";
  return "common";
}

const STATUS_LABELS: Record<string, { label: string; color: string; emoji: string }> = {
  pending: { label: "Venter", color: "text-accent-400", emoji: "\u23F3" },
  approved: { label: "Godkjent", color: "text-primary-400", emoji: "\u2705" },
  fulfilled: { label: "Levert!", color: "text-accent-400", emoji: "\uD83C\uDF89" },
  rejected: { label: "Avslatt", color: "text-danger-400", emoji: "\u274C" },
};

export default function RewardsScreen() {
  const { profile } = useAuth();
  const { currentStars, totalEarned, myContributions, refresh: refreshStars } = useGuildStars();
  const {
    rewards,
    claims,
    pendingClaims,
    claimReward,
    refresh: refreshRewards,
  } = useGuildRewards();
  const stars = useGuildStars();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refreshStars(), refreshRewards()]);
    setRefreshing(false);
  }, [refreshStars, refreshRewards]);

  const myClaims = claims.filter((c) => c.claimed_by === profile?.id);

  async function handleClaim(reward: GuildReward) {
    if (currentStars < reward.star_cost) {
      Alert.alert(
        "Ikke nok stjerner",
        `Denne belonningen koster ${reward.star_cost} stjerner. Guildet har ${currentStars}. Fullfoor flere dungeons!`
      );
      return;
    }

    Alert.alert(
      `Krev ${reward.name}?`,
      `Dette koster ${reward.star_cost} Guild Stars. Guildet har ${currentStars} stjerner.\n\n${reward.description ?? ""}`,
      [
        { text: "Avbryt", style: "cancel" },
        {
          text: `Krev (${reward.star_cost} \u2B50)`,
          onPress: async () => {
            const { error: spendError } = await stars.spendStars(
              reward.star_cost,
              `Krevde: ${reward.name}`,
              reward.id
            );
            if (spendError) {
              Alert.alert("Feil", typeof spendError === "string" ? spendError : "Noe gikk galt");
              return;
            }
            const { error } = await claimReward(reward.id, reward.star_cost);
            if (error) {
              Alert.alert("Feil", "Kunne ikke kreve belonning");
            } else {
              Alert.alert("\uD83C\uDF89 Belonning krevd!", "Venter pa godkjenning fra Guild Master.");
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Brand.manaGreen} />
        }
      >
        <View className="px-5 pt-4">
          <Text className="font-pixel text-lg text-white text-center">
            {"\u2B50"} Guild Rewards
          </Text>
          <Text className="text-white/30 text-center text-xs mt-1">
            Bruk Guild Stars pa belonninger!
          </Text>
        </View>

        {/* Star balance */}
        <PixelCard variant="glow" className="mx-5 mt-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider">
                Guild Stars
              </Text>
              <Text className="font-pixel text-3xl text-accent-400 mt-1">
                {"\u2B50"} {currentStars}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-[10px] text-white/25">Totalt tjent</Text>
              <Text className="font-pixel text-sm text-white/40">{totalEarned}</Text>
            </View>
          </View>
        </PixelCard>

        {/* How it works */}
        <PixelCard className="mx-5 mt-3">
          <Text className="font-pixel text-[9px] text-white/30 uppercase tracking-wider mb-2">
            Hvordan fungerer det?
          </Text>
          <View className="gap-1">
            <Text className="text-xs text-white/40">
              {"\uD83D\uDCDC"} Fullfoor quests for a tjene mana
            </Text>
            <Text className="text-xs text-white/40">
              {"\uD83D\uDC09"} Bruk mana for a angripe dungeon-bossen
            </Text>
            <Text className="text-xs text-white/40">
              {"\u2B50"} Beseiret boss = Guild Stars til alle!
            </Text>
            <Text className="text-xs text-white/40">
              {"\uD83C\uDF81"} Bruk stjerner pa belonninger
            </Text>
          </View>
        </PixelCard>

        {/* Pending claims */}
        {myClaims.filter((c) => c.status !== "fulfilled" && c.status !== "rejected").length > 0 && (
          <>
            <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mx-5 mt-5 mb-2">
              Dine krav
            </Text>
            <View className="px-5 gap-2">
              {myClaims
                .filter((c) => c.status !== "fulfilled" && c.status !== "rejected")
                .map((claim) => {
                  const statusInfo = STATUS_LABELS[claim.status] ?? STATUS_LABELS.pending;
                  return (
                    <PixelCard key={claim.id} className="flex-row items-center">
                      <Text className="text-lg mr-3">{statusInfo.emoji}</Text>
                      <View className="flex-1">
                        <Text className="text-sm text-white">
                          {(claim.reward as any)?.name ?? "Belonning"}
                        </Text>
                        <Text className={`font-pixel text-[8px] ${statusInfo.color}`}>
                          {statusInfo.label}
                        </Text>
                      </View>
                      <Text className="font-pixel text-xs text-accent-400">
                        {claim.stars_spent} {"\u2B50"}
                      </Text>
                    </PixelCard>
                  );
                })}
            </View>
          </>
        )}

        {/* Available rewards */}
        <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mx-5 mt-5 mb-2">
          Tilgjengelige belonninger
        </Text>
        <View className="px-5 gap-3 pb-10">
          {rewards.length === 0 ? (
            <PixelCard className="items-center py-8">
              <Text className="text-4xl mb-2">{"\uD83C\uDF81"}</Text>
              <Text className="font-pixel text-xs text-white/50">
                Ingen belonninger enna
              </Text>
              <Text className="text-sm text-white/25 mt-1">
                Guild Master ma legge til belonninger!
              </Text>
            </PixelCard>
          ) : (
            rewards.map((reward) => {
              const canAfford = currentStars >= reward.star_cost;
              const rarity = getRewardRarity(reward.star_cost);

              return (
                <TouchableOpacity
                  key={reward.id}
                  onPress={() => handleClaim(reward)}
                  activeOpacity={canAfford ? 0.7 : 1}
                >
                  <RarityBorder rarity={rarity}>
                    <PixelCard className={`${!canAfford ? "opacity-50" : ""}`}>
                      <View className="flex-row items-start">
                        <Text className="text-3xl mr-4">{reward.emoji}</Text>
                        <View className="flex-1">
                          <Text className="font-bold text-white text-base">
                            {reward.name}
                          </Text>
                          {reward.description && (
                            <Text className="text-sm text-white/40 mt-0.5">
                              {reward.description}
                            </Text>
                          )}
                          <View className="flex-row items-center mt-2 gap-2">
                            <View className="bg-accent-500/15 rounded-md px-2.5 py-1">
                              <Text className="font-pixel text-xs text-accent-400">
                                {reward.star_cost} {"\u2B50"}
                              </Text>
                            </View>
                            <Text className="text-[10px] text-white/20">
                              {getCategoryEmoji(reward.category as any)} {reward.category}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </PixelCard>
                  </RarityBorder>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
