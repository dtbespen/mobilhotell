import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useGuildRewards } from "@/hooks/useGuildRewards";
import { useGuildStars } from "@/hooks/useGuildStars";
import { SUGGESTED_REWARDS, REWARD_CATEGORIES, type GuildRewardCategory } from "@/lib/guildStars";
import { PixelCard } from "@/components/ui/PixelCard";
import { RarityBorder } from "@/components/ui/RarityBorder";
import type { ItemRarity } from "@/lib/database.types";

function getRewardRarity(cost: number): ItemRarity {
  if (cost >= 25) return "legendary";
  if (cost >= 15) return "epic";
  if (cost >= 10) return "rare";
  if (cost >= 5) return "uncommon";
  return "common";
}

export default function ManageRewardsScreen() {
  const { currentStars } = useGuildStars();
  const {
    rewards,
    pendingClaims,
    createReward,
    updateReward,
    approveOrRejectClaim,
  } = useGuildRewards();

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCost, setNewCost] = useState("10");
  const [newCategory, setNewCategory] = useState<GuildRewardCategory>("custom");
  const [newEmoji, setNewEmoji] = useState("\u2728");

  async function handleCreate() {
    if (!newName.trim()) {
      Alert.alert("Feil", "Belonningen trenger et navn");
      return;
    }

    const { error } = await createReward({
      name: newName.trim(),
      description: newDescription.trim(),
      starCost: parseInt(newCost) || 10,
      category: newCategory,
      emoji: newEmoji,
      isRepeatable: true,
    });

    if (error) {
      Alert.alert("Feil", "Kunne ikke opprette belonning");
    } else {
      setShowCreate(false);
      setNewName("");
      setNewDescription("");
      setNewCost("10");
      Alert.alert("\u2705", "Belonning opprettet!");
    }
  }

  async function handleApprove(claimId: string) {
    const { error } = await approveOrRejectClaim(claimId, "fulfilled");
    if (!error) Alert.alert("\uD83C\uDF89", "Belonning godkjent og levert!");
  }

  async function handleReject(claimId: string) {
    Alert.alert("Avslaa?", "Stjernene vil bli tilbakefort.", [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Ja, avslaa",
        style: "destructive",
        onPress: async () => {
          await approveOrRejectClaim(claimId, "rejected");
        },
      },
    ]);
  }

  async function handleToggleReward(rewardId: string, isActive: boolean) {
    await updateReward(rewardId, { is_active: !isActive });
  }

  function addSuggested(suggestion: typeof SUGGESTED_REWARDS[0]) {
    setNewName(suggestion.name);
    setNewDescription(suggestion.description);
    setNewCost(String(suggestion.stars));
    setNewCategory(suggestion.category);
    setNewEmoji(suggestion.emoji);
    setShowCreate(true);
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      <ScrollView className="flex-1 px-5">
        {/* Header */}
        <View className="flex-row items-center gap-3 pt-4 mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-2xl text-primary-400">{"\u2190"}</Text>
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="font-pixel text-sm text-white">
              {"\uD83C\uDF81"} Administrer belonninger
            </Text>
          </View>
          <View className="bg-accent-500/15 rounded-lg px-3 py-1.5">
            <Text className="font-pixel text-xs text-accent-400">
              {"\u2B50"} {currentStars}
            </Text>
          </View>
        </View>

        {/* Pending claims */}
        {pendingClaims.length > 0 && (
          <>
            <Text className="font-pixel text-[10px] text-danger-400 uppercase tracking-wider mb-2">
              Venter pa godkjenning ({pendingClaims.length})
            </Text>
            <View className="gap-2 mb-5">
              {pendingClaims.map((claim) => (
                <PixelCard key={claim.id} className="border-accent-500/30">
                  <View className="flex-row items-center mb-2">
                    <Text className="text-lg mr-2">{"\u23F3"}</Text>
                    <View className="flex-1">
                      <Text className="font-bold text-white">
                        {(claim.claimant as any)?.display_name ?? "Ukjent"} vil ha:
                      </Text>
                      <Text className="text-sm text-accent-400">
                        {(claim.reward as any)?.name ?? "Belonning"} ({claim.stars_spent} {"\u2B50"})
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      className="flex-1 bg-primary-500 rounded-lg py-3"
                      onPress={() => handleApprove(claim.id)}
                    >
                      <Text className="text-center font-pixel text-[10px] text-white">
                        {"\u2705"} Godkjenn & Lever
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 bg-danger-500/20 border border-danger-500/30 rounded-lg py-3"
                      onPress={() => handleReject(claim.id)}
                    >
                      <Text className="text-center font-pixel text-[10px] text-danger-400">
                        {"\u274C"} Avslaa
                      </Text>
                    </TouchableOpacity>
                  </View>
                </PixelCard>
              ))}
            </View>
          </>
        )}

        {/* Existing rewards */}
        <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
          Aktive belonninger
        </Text>
        <View className="gap-2 mb-5">
          {rewards.length === 0 ? (
            <PixelCard className="items-center py-6">
              <Text className="text-white/40">Ingen belonninger opprettet enna</Text>
            </PixelCard>
          ) : (
            rewards.map((reward) => (
              <PixelCard key={reward.id} className="flex-row items-center">
                <Text className="text-2xl mr-3">{reward.emoji}</Text>
                <View className="flex-1">
                  <Text className="font-bold text-white">{reward.name}</Text>
                  <Text className="text-xs text-white/30">{reward.star_cost} {"\u2B50"}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleToggleReward(reward.id, reward.is_active)}
                  className="bg-danger-500/15 rounded-md px-3 py-1.5"
                >
                  <Text className="font-pixel text-[7px] text-danger-400">Fjern</Text>
                </TouchableOpacity>
              </PixelCard>
            ))
          )}
        </View>

        {/* Add new reward */}
        <TouchableOpacity
          className="rounded-lg bg-primary-500 py-4 mb-5"
          onPress={() => setShowCreate(true)}
        >
          <Text className="text-center font-pixel text-sm text-white">
            + Legg til belonning
          </Text>
        </TouchableOpacity>

        {/* Suggestions */}
        <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
          Forslag
        </Text>
        <View className="gap-2 pb-10">
          {SUGGESTED_REWARDS.map((suggestion, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => addSuggested(suggestion)}
              activeOpacity={0.7}
            >
              <RarityBorder rarity={getRewardRarity(suggestion.stars)}>
                <PixelCard className="flex-row items-center py-2.5">
                  <Text className="text-2xl mr-3">{suggestion.emoji}</Text>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-white">{suggestion.name}</Text>
                    <Text className="text-xs text-white/30">{suggestion.description}</Text>
                  </View>
                  <View className="bg-accent-500/15 rounded-md px-2 py-1">
                    <Text className="font-pixel text-[8px] text-accent-400">
                      {suggestion.stars} {"\u2B50"}
                    </Text>
                  </View>
                </PixelCard>
              </RarityBorder>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Create reward modal */}
      <Modal visible={showCreate} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-dark-300 rounded-t-2xl px-5 pt-6 pb-10">
            <Text className="font-pixel text-sm text-white text-center mb-5">
              Ny belonning
            </Text>

            <Text className="text-xs text-white/30 mb-1">Emoji</Text>
            <TextInput
              value={newEmoji}
              onChangeText={setNewEmoji}
              className="bg-dark-200 border-2 border-dark-50 rounded-lg px-4 py-3 text-white text-2xl text-center mb-3"
              placeholderTextColor="rgba(255,255,255,0.2)"
            />

            <Text className="text-xs text-white/30 mb-1">Navn</Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="f.eks. Pizzakveld"
              className="bg-dark-200 border-2 border-dark-50 rounded-lg px-4 py-3 text-white mb-3"
              placeholderTextColor="rgba(255,255,255,0.2)"
            />

            <Text className="text-xs text-white/30 mb-1">Beskrivelse</Text>
            <TextInput
              value={newDescription}
              onChangeText={setNewDescription}
              placeholder="Hva far man?"
              className="bg-dark-200 border-2 border-dark-50 rounded-lg px-4 py-3 text-white mb-3"
              placeholderTextColor="rgba(255,255,255,0.2)"
            />

            <Text className="text-xs text-white/30 mb-1">Pris (Guild Stars)</Text>
            <TextInput
              value={newCost}
              onChangeText={setNewCost}
              keyboardType="numeric"
              className="bg-dark-200 border-2 border-dark-50 rounded-lg px-4 py-3 text-white font-pixel mb-3"
              placeholderTextColor="rgba(255,255,255,0.2)"
            />

            <Text className="text-xs text-white/30 mb-2">Kategori</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              {REWARD_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  onPress={() => setNewCategory(cat.key)}
                  className={`mr-2 rounded-lg border-2 px-3 py-2 items-center ${
                    newCategory === cat.key
                      ? "bg-primary-500/15 border-primary-500/40"
                      : "bg-dark-200 border-dark-50"
                  }`}
                >
                  <Text className="text-sm">{cat.emoji}</Text>
                  <Text className="font-pixel text-[6px] text-white/50 mt-0.5">{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-dark-100 border-2 border-dark-50 rounded-lg py-4"
                onPress={() => setShowCreate(false)}
              >
                <Text className="text-center text-white/50">Avbryt</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-primary-500 rounded-lg py-4"
                onPress={handleCreate}
              >
                <Text className="text-center font-pixel text-sm text-white">Opprett</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
