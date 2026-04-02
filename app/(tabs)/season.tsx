import { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PixelCard } from "@/components/ui/PixelCard";
import { ManaBar } from "@/components/ui/ManaBar";
import { RarityBorder } from "@/components/ui/RarityBorder";
import {
  buildSeasonTiers,
  getTierForXp,
  getXpToNextTier,
  getRewardEmoji,
  getRarityForReward,
  generateDailyQuests,
  generateWeeklyQuests,
} from "@/lib/seasonPass";

export default function SeasonScreen() {
  const [seasonXp, setSeasonXp] = useState(450);
  const tiers = useMemo(() => buildSeasonTiers(), []);
  const currentTier = getTierForXp(seasonXp, tiers);
  const xpProgress = getXpToNextTier(seasonXp, currentTier, tiers);

  const today = new Date();
  const dayOfWeek = today.getDay();
  const weekSeed = Math.floor(today.getTime() / (7 * 24 * 60 * 60 * 1000));
  const dailyQuests = generateDailyQuests(dayOfWeek, weekSeed);
  const weeklyQuests = generateWeeklyQuests(weekSeed);

  const [completedQuests, setCompletedQuests] = useState<string[]>([]);

  function toggleQuest(questType: string) {
    setCompletedQuests((prev) =>
      prev.includes(questType)
        ? prev.filter((q) => q !== questType)
        : [...prev, questType]
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      <ScrollView className="flex-1">
        <View className="px-5 pt-4">
          <Text className="font-pixel text-lg text-white text-center">
            {"\u2744\uFE0F"} Frostmagiernes Vinter
          </Text>
          <Text className="text-white/30 text-center text-xs mt-1">
            Season 1 - 3 uker igjen
          </Text>
        </View>

        {/* Season progress */}
        <PixelCard variant="glow" className="mx-5 mt-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="font-pixel text-xs text-accent-400">
              Tier {currentTier} / 30
            </Text>
            <Text className="font-pixel text-xs text-white/40">
              {seasonXp} XP
            </Text>
          </View>
          <ManaBar
            current={xpProgress.current}
            max={xpProgress.required || 1}
            showLabel={false}
            size="md"
          />
          <Text className="text-[10px] text-white/25 mt-1">
            {Math.max(0, xpProgress.required - xpProgress.current)} XP til Tier {currentTier + 1}
          </Text>
        </PixelCard>

        {/* Reward track */}
        <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mx-5 mt-5 mb-2">
          Belonningsbane
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-5"
        >
          {tiers.map((tier) => {
            const isUnlocked = tier.tier <= currentTier;
            const isCurrent = tier.tier === currentTier + 1;
            const rarity = getRarityForReward(tier.reward);
            const emoji = getRewardEmoji(tier.reward);

            return (
              <View key={tier.tier} className="mr-2 items-center" style={{ width: 72 }}>
                <RarityBorder rarity={isUnlocked ? rarity : "common"}>
                  <View
                    className={`w-16 h-16 items-center justify-center rounded-md ${
                      isUnlocked
                        ? "bg-dark-100"
                        : isCurrent
                          ? "bg-dark-200 border border-primary-500/30"
                          : "bg-dark-300"
                    } ${!isUnlocked && !isCurrent ? "opacity-40" : ""}`}
                  >
                    <Text className="text-xl">{isUnlocked ? emoji : "\uD83D\uDD12"}</Text>
                    <Text className="font-pixel text-[6px] text-white/40 mt-1">
                      T{tier.tier}
                    </Text>
                  </View>
                </RarityBorder>
                <Text
                  className="text-[8px] text-white/30 text-center mt-1"
                  numberOfLines={2}
                >
                  {isUnlocked || isCurrent ? tier.reward.label : "???"}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Daily quests */}
        <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mx-5 mt-5 mb-2">
          Dagens quests
        </Text>
        <View className="px-5 gap-2">
          {dailyQuests.map((quest) => {
            const isDone = completedQuests.includes(quest.questType);
            return (
              <TouchableOpacity
                key={quest.questType}
                onPress={() => toggleQuest(quest.questType)}
                activeOpacity={0.7}
              >
                <PixelCard
                  className={`flex-row items-center ${isDone ? "opacity-50" : ""}`}
                >
                  <View
                    className={`w-6 h-6 rounded-md border-2 items-center justify-center mr-3 ${
                      isDone
                        ? "bg-primary-500/30 border-primary-500/50"
                        : "border-dark-50"
                    }`}
                  >
                    {isDone && <Text className="text-xs text-primary-400">{"\u2713"}</Text>}
                  </View>
                  <View className="flex-1">
                    <Text className={`text-sm ${isDone ? "text-white/40 line-through" : "text-white"}`}>
                      {quest.description}
                    </Text>
                  </View>
                  <View className="bg-accent-500/15 rounded-md px-2 py-1">
                    <Text className="font-pixel text-[8px] text-accent-400">
                      +{quest.seasonXP} XP
                    </Text>
                  </View>
                </PixelCard>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Weekly quests */}
        <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mx-5 mt-5 mb-2">
          Ukentlige quests
        </Text>
        <View className="px-5 gap-2 pb-10">
          {weeklyQuests.map((quest) => {
            const isDone = completedQuests.includes(quest.questType);
            return (
              <TouchableOpacity
                key={quest.questType}
                onPress={() => toggleQuest(quest.questType)}
                activeOpacity={0.7}
              >
                <PixelCard
                  className={`flex-row items-center ${isDone ? "opacity-50" : ""}`}
                >
                  <View
                    className={`w-6 h-6 rounded-md border-2 items-center justify-center mr-3 ${
                      isDone
                        ? "bg-info-500/30 border-info-500/50"
                        : "border-dark-50"
                    }`}
                  >
                    {isDone && <Text className="text-xs text-info-400">{"\u2713"}</Text>}
                  </View>
                  <View className="flex-1">
                    <Text className={`text-sm ${isDone ? "text-white/40 line-through" : "text-white"}`}>
                      {quest.description}
                    </Text>
                  </View>
                  <View className="bg-info-500/15 rounded-md px-2 py-1">
                    <Text className="font-pixel text-[8px] text-info-400">
                      +{quest.seasonXP} XP
                    </Text>
                  </View>
                </PixelCard>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Completion message */}
        {completedQuests.length >= dailyQuests.length && (
          <PixelCard variant="glow" className="mx-5 mb-10 items-center py-6">
            <Text className="text-4xl mb-2">{"\uD83C\uDF89"}</Text>
            <Text className="font-pixel text-sm text-accent-400">
              Dagens quests fullfort!
            </Text>
            <Text className="text-white/30 text-sm mt-1">
              Kom tilbake i morgen for nye quests
            </Text>
          </PixelCard>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
