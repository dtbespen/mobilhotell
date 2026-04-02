import { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth";
import { useFamily } from "@/hooks/useFamily";
import { useGuildStars } from "@/hooks/useGuildStars";
import { useGuildRewards } from "@/hooks/useGuildRewards";
import { useDungeon } from "@/hooks/useDungeon";
import { usePoints } from "@/hooks/usePoints";
import { useGuildActivity } from "@/hooks/useGuildActivity";
import { supabase } from "@/lib/supabase";
import { getCategoryEmoji } from "@/lib/guildStars";
import { CLASS_CONFIG } from "@/lib/wizard";
import {
  calculateDungeonStars,
  shouldUnlockBonusDungeon,
} from "@/lib/guildStars";
import { Brand } from "@/constants/Colors";
import { PixelCard } from "@/components/ui/PixelCard";
import { HPBar } from "@/components/ui/HPBar";
import { CharacterRenderer } from "@/components/wizard/CharacterRenderer";
import { RarityBorder } from "@/components/ui/RarityBorder";
import type {
  AvatarConfig,
  CharacterClass,
  GuildReward,
  ItemRarity,
} from "@/lib/database.types";

type Section = "overview" | "dungeon" | "rewards";

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

type LeaderboardEntry = {
  profile_id: string;
  display_name: string;
  total_points: number;
  today_points: number;
  role: string;
  character_class: CharacterClass;
  avatar_config: AvatarConfig;
};

function getRewardRarity(cost: number): ItemRarity {
  if (cost >= 25) return "legendary";
  if (cost >= 15) return "epic";
  if (cost >= 10) return "rare";
  if (cost >= 5) return "uncommon";
  return "common";
}

const BOSS_EMOJI: Record<string, string> = {
  boss_skjermtrollet: "\u{1F9CC}",
  boss_data_dragen: "\u{1F409}",
  boss_wifi_varulven: "\u{1F43A}",
  boss_digitale_demonen: "\u{1F47F}",
};

const STATUS_LABELS: Record<
  string,
  { label: string; color: string; emoji: string }
> = {
  pending: { label: "Venter", color: "text-accent-400", emoji: "\u23F3" },
  approved: { label: "Godkjent", color: "text-primary-400", emoji: "\u2705" },
  fulfilled: {
    label: "Levert!",
    color: "text-accent-400",
    emoji: "\uD83C\uDF89",
  },
  rejected: { label: "Avslatt", color: "text-danger-400", emoji: "\u274C" },
};

export default function GuildScreen() {
  const { profile, family } = useAuth();
  const { members } = useFamily();
  const points = usePoints();
  const {
    currentStars,
    totalEarned,
    spendStars,
    myContributions,
    refresh: refreshStars,
  } = useGuildStars();
  const {
    rewards,
    claims,
    claimReward,
    refresh: refreshRewards,
  } = useGuildRewards();
  const {
    dungeon,
    remainingHp,
    totalDamage,
    myDamage,
    bossDefeated,
    daysRemaining,
    contributions,
    isLoading: dungeonLoading,
    contributeMana,
  } = useDungeon();

  const guildActivity = useGuildActivity();

  const [section, setSection] = useState<Section>("overview");
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState<"today" | "week" | "all">("week");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  const characterClass: CharacterClass =
    (profile as any)?.character_class ?? "wizard";
  const classInfo = CLASS_CONFIG[characterClass];

  const fetchLeaderboard = useCallback(async () => {
    if (!family || members.length === 0) return;
    const now = new Date();
    let fromDate: string | null = null;
    if (period === "today") {
      fromDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      ).toISOString();
    } else if (period === "week") {
      fromDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay() + 1
      ).toISOString();
    }
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).toISOString();
    const results: LeaderboardEntry[] = [];
    for (const member of members) {
      let query = supabase
        .from("activities")
        .select("points_earned")
        .eq("profile_id", member.id)
        .not("ended_at", "is", null);
      if (fromDate) query = query.gte("started_at", fromDate);
      const { data: periodData } = await query;
      const totalPoints =
        periodData?.reduce((sum, a) => sum + a.points_earned, 0) ?? 0;
      const { data: todayData } = await supabase
        .from("activities")
        .select("points_earned")
        .eq("profile_id", member.id)
        .gte("started_at", todayStart)
        .not("ended_at", "is", null);
      const todayPoints =
        todayData?.reduce((sum, a) => sum + a.points_earned, 0) ?? 0;
      results.push({
        profile_id: member.id,
        display_name: member.display_name,
        total_points: totalPoints,
        today_points: todayPoints,
        role: member.role,
        character_class: (member as any).character_class ?? "wizard",
        avatar_config: (member as any).avatar_config ?? DEFAULT_AVATAR,
      });
    }
    results.sort((a, b) => b.total_points - a.total_points);
    setEntries(results);
  }, [family, members, period]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchLeaderboard(), refreshStars(), refreshRewards()]);
    setRefreshing(false);
  }, [fetchLeaderboard, refreshStars, refreshRewards]);

  const MEDALS = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];
  const PERIOD_LABELS = { today: "I dag", week: "Uka", all: "Totalt" };

  const uniqueContributors = new Set(
    contributions.map((c) => c.profile_id)
  ).size;
  const starsForVictory = dungeon
    ? calculateDungeonStars(dungeon.difficulty, daysRemaining, uniqueContributors)
    : 0;

  async function handleContribute() {
    const manaToUse = Math.min(50, points.total);
    if (manaToUse <= 0) {
      Alert.alert("Ikke nok mana!", "Fullfoor quests for aa samle mana.");
      return;
    }
    const { error } = await contributeMana(manaToUse, characterClass);
    if (error) {
      Alert.alert("Feil", typeof error === "string" ? error : "Noe gikk galt");
    }
  }

  async function handleClaim(reward: GuildReward) {
    if (currentStars < reward.star_cost) {
      Alert.alert(
        "Ikke nok stjerner",
        `Koster ${reward.star_cost} stjerner. Guildet har ${currentStars}.`
      );
      return;
    }
    Alert.alert(
      `Krev ${reward.name}?`,
      `Koster ${reward.star_cost} Guild Stars.\n\n${reward.description ?? ""}`,
      [
        { text: "Avbryt", style: "cancel" },
        {
          text: `Krev (${reward.star_cost} \u2B50)`,
          onPress: async () => {
            const { error: spendError } = await spendStars(
              reward.star_cost,
              `Krevde: ${reward.name}`,
              reward.id
            );
            if (spendError) {
              Alert.alert(
                "Feil",
                typeof spendError === "string" ? spendError : "Noe gikk galt"
              );
              return;
            }
            const { error } = await claimReward(reward.id, reward.star_cost);
            if (error) {
              Alert.alert("Feil", "Kunne ikke kreve belonning");
            } else {
              Alert.alert(
                "\uD83C\uDF89 Belonning krevd!",
                "Venter pa godkjenning fra Guild Master."
              );
            }
          },
        },
      ]
    );
  }

  const myClaims = claims.filter((c) => c.claimed_by === profile?.id);
  const bossEmoji = dungeon
    ? BOSS_EMOJI[dungeon.boss_pixel_asset] ?? "\u{1F47E}"
    : "\u{1F47E}";

  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Brand.manaGreen}
          />
        }
      >
        <View className="px-6 pt-4 pb-2">
          <Text className="font-pixel text-lg text-white text-center">
            {"\uD83D\uDEE1\uFE0F"} {family?.name ?? "Guild"}
          </Text>
        </View>

        {/* Guild Stars banner */}
        <PixelCard variant="glow" className="mx-5 mt-2">
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
              <Text className="font-pixel text-sm text-white/40">
                {totalEarned}
              </Text>
              <Text className="text-[10px] text-white/15 mt-1">
                Ditt bidrag: {myContributions}
              </Text>
            </View>
          </View>
        </PixelCard>

        {/* Section tabs */}
        <View className="mx-5 mt-4 flex-row gap-1 rounded-lg bg-dark-100 border-2 border-dark-50 p-1">
          {(
            [
              { key: "overview", label: "Oversikt" },
              { key: "dungeon", label: "Dungeon" },
              { key: "rewards", label: "Rewards" },
            ] as const
          ).map((tab) => (
            <TouchableOpacity
              key={tab.key}
              className={`flex-1 rounded-md py-2.5 ${
                section === tab.key ? "bg-primary-500" : ""
              }`}
              onPress={() => setSection(tab.key)}
              activeOpacity={0.7}
            >
              <Text
                className={`text-center font-pixel text-[8px] ${
                  section === tab.key ? "text-white" : "text-white/25"
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── OVERVIEW: Leaderboard ── */}
        {section === "overview" && (
          <View className="mt-4">
            {/* Period picker */}
            <View className="mx-5 flex-row gap-1 rounded-lg bg-dark-100 border-2 border-dark-50 p-1">
              {(["today", "week", "all"] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  className={`flex-1 rounded-md py-2 ${
                    period === p ? "bg-primary-500" : ""
                  }`}
                  onPress={() => setPeriod(p)}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-center font-pixel text-[8px] ${
                      period === p ? "text-white" : "text-white/25"
                    }`}
                  >
                    {PERIOD_LABELS[p]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Podium */}
            {entries.length >= 2 && (
              <View className="mt-6 flex-row items-end justify-center gap-3 px-6">
                {entries.length >= 2 && (
                  <PodiumSpot
                    entry={entries[1]}
                    medal={MEDALS[1]}
                    height={72}
                    isMe={entries[1].profile_id === profile?.id}
                  />
                )}
                <PodiumSpot
                  entry={entries[0]}
                  medal={MEDALS[0]}
                  height={100}
                  isMe={entries[0].profile_id === profile?.id}
                />
                {entries.length >= 3 && (
                  <PodiumSpot
                    entry={entries[2]}
                    medal={MEDALS[2]}
                    height={56}
                    isMe={entries[2].profile_id === profile?.id}
                  />
                )}
              </View>
            )}

            {/* Guild activity log */}
            {guildActivity.activities.length > 0 && (
              <View className="mt-4 px-5">
                <Text className="font-pixel text-[10px] text-white/20 uppercase tracking-wider mb-2">
                  Guild-aktivitet
                </Text>
                <View className="gap-1.5 mb-4">
                  {guildActivity.activities.slice(0, 5).map((ga) => (
                    <PixelCard key={ga.id} className="flex-row items-center py-2">
                      <Text className="text-sm mr-2">
                        {ga.event_type === "quest_complete" ? "\uD83C\uDFAF" :
                         ga.event_type === "dungeon_attack" ? "\u2694\uFE0F" :
                         ga.event_type === "high_five" ? "\uD83D\uDE4C" :
                         ga.event_type === "level_up" ? "\u2B50" :
                         ga.event_type === "reward_claimed" ? "\uD83C\uDF81" : "\uD83D\uDCDD"}
                      </Text>
                      <Text className="flex-1 text-xs text-white/40">
                        <Text className="text-white/60 font-bold">
                          {(ga.profile as any)?.display_name ?? "Helt"}
                        </Text>
                        {" "}{ga.event_type.replace(/_/g, " ")}
                      </Text>
                    </PixelCard>
                  ))}
                </View>
              </View>
            )}

            {/* Full list */}
            <View className="mt-4 px-5 gap-3 pb-10">
              {entries.length === 0 ? (
                <PixelCard className="items-center py-8">
                  <Text className="text-4xl mb-2">{"\u{1F3C6}"}</Text>
                  <Text className="font-pixel text-xs text-white/50">
                    Ingen mana enna!
                  </Text>
                </PixelCard>
              ) : (
                entries.map((entry, index) => (
                  <PixelCard
                    key={entry.profile_id}
                    className={`flex-row items-center py-3 ${
                      entry.profile_id === profile?.id
                        ? "border-primary-500/30"
                        : ""
                    }`}
                  >
                    <Text className="w-8 text-center text-lg">
                      {index < 3 ? MEDALS[index] : `${index + 1}.`}
                    </Text>
                    <View className="mx-2">
                      <CharacterRenderer
                        config={entry.avatar_config}
                        characterClass={entry.character_class}
                        size="sm"
                      />
                    </View>
                    <View className="flex-1 ml-1">
                      <View className="flex-row items-center gap-1.5">
                        <Text className="font-bold text-white">
                          {entry.display_name}
                        </Text>
                        {entry.profile_id === profile?.id && (
                          <View className="rounded-sm bg-primary-500/20 px-1.5 py-0.5">
                            <Text className="text-[9px] font-bold text-primary-400">
                              deg
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-xs text-white/20">
                        +{entry.today_points} mana i dag
                      </Text>
                    </View>
                    <View className="rounded-md bg-accent-500/15 px-3 py-1.5">
                      <Text className="font-pixel text-xs text-accent-400">
                        {entry.total_points}
                      </Text>
                    </View>
                  </PixelCard>
                ))
              )}
            </View>
          </View>
        )}

        {/* ── DUNGEON ── */}
        {section === "dungeon" && (
          <View className="mt-4 px-5 pb-10">
            {!dungeon ? (
              <PixelCard className="items-center py-8">
                <Text className="text-5xl mb-4">{"\u{1F3F0}"}</Text>
                <Text className="font-pixel text-sm text-white text-center">
                  Ingen aktiv dungeon
                </Text>
                <Text className="text-white/30 text-center mt-2">
                  Ny boss dukker opp mandag!
                </Text>
              </PixelCard>
            ) : (
              <>
                <PixelCard
                  variant={bossDefeated ? "rarity" : "glow"}
                  rarity={bossDefeated ? "legendary" : "common"}
                  className="items-center"
                >
                  <Text className="text-[80px]">{bossEmoji}</Text>
                  <Text className="font-pixel text-sm text-danger-400 mt-2">
                    {dungeon.boss_name}
                  </Text>
                  <Text className="text-xs text-white/30 mb-3">
                    {dungeon.difficulty.toUpperCase()}
                  </Text>

                  {bossDefeated ? (
                    <View className="items-center py-4 w-full">
                      <Text className="font-pixel text-lg text-accent-400">
                        BOSS BESEIRET!
                      </Text>
                      <RarityBorder rarity="legendary" className="w-full mt-4">
                        <PixelCard variant="glow" className="items-center">
                          <Text className="text-3xl">{"\u2B50"}</Text>
                          <Text className="font-pixel text-xl text-accent-400 mt-2">
                            +{starsForVictory} Guild Stars
                          </Text>
                          <Text className="text-xs text-white/30 mt-1">
                            Delt mellom {uniqueContributors} helter
                          </Text>
                        </PixelCard>
                      </RarityBorder>
                    </View>
                  ) : (
                    <>
                      <HPBar
                        hp={remainingHp}
                        maxHp={dungeon.boss_hp}
                        size="lg"
                      />
                      <Text className="text-xs text-white/25 mt-2">
                        {daysRemaining}d igjen
                      </Text>
                      <View className="mt-3 bg-accent-500/10 border border-accent-500/20 rounded-lg px-4 py-2 w-full">
                        <Text className="font-pixel text-[9px] text-accent-400 text-center">
                          {"\u2B50"} Seier gir {starsForVictory} Guild Stars
                        </Text>
                      </View>
                    </>
                  )}
                </PixelCard>

                {!bossDefeated && (
                  <PixelCard className="mt-4">
                    <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-3">
                      Bidra til kampen
                    </Text>
                    <View className="flex-row items-center justify-between mb-4">
                      <View>
                        <Text className="text-white/50 text-xs">
                          Din damage
                        </Text>
                        <Text className="font-pixel text-lg text-danger-400">
                          {myDamage}
                        </Text>
                      </View>
                      <View className="items-center">
                        <Text className="text-white/50 text-xs">
                          Bidragsytere
                        </Text>
                        <Text className="font-pixel text-lg text-info-400">
                          {uniqueContributors}
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-white/50 text-xs">
                          Guild totalt
                        </Text>
                        <Text className="font-pixel text-lg text-accent-400">
                          {totalDamage}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      className="rounded-lg bg-danger-500 py-4 border-2 border-danger-700"
                      onPress={handleContribute}
                      activeOpacity={0.85}
                    >
                      <Text className="text-center font-pixel text-sm text-white">
                        {classInfo.emoji} Angrip! (50 Mana)
                      </Text>
                    </TouchableOpacity>
                  </PixelCard>
                )}

                {/* Recent contributions */}
                <Text className="font-pixel text-[10px] text-white/20 uppercase tracking-wider mt-5 mb-3">
                  Guild-bidrag
                </Text>
                {contributions.length === 0 ? (
                  <PixelCard className="items-center py-6">
                    <Text className="text-white/30 text-sm">
                      Ingen har angrepet ennaa.
                    </Text>
                  </PixelCard>
                ) : (
                  <View className="gap-2">
                    {contributions.slice(0, 10).map((c) => (
                      <PixelCard
                        key={c.id}
                        className="flex-row items-center py-2.5"
                      >
                        <CharacterRenderer
                          config={DEFAULT_AVATAR}
                          characterClass={characterClass}
                          size="sm"
                        />
                        <View className="flex-1 ml-3">
                          <Text className="text-sm font-bold text-white">
                            {(c.profile as any)?.display_name ?? "Helt"}
                          </Text>
                          <Text className="text-xs text-white/20">
                            {c.mana_contributed} mana brukt
                          </Text>
                        </View>
                        <Text className="font-pixel text-xs text-danger-400">
                          -{c.damage_dealt} HP
                        </Text>
                      </PixelCard>
                    ))}
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* ── REWARDS ── */}
        {section === "rewards" && (
          <View className="mt-4 px-5 pb-10">
            {/* Pending claims */}
            {myClaims.filter(
              (c) => c.status !== "fulfilled" && c.status !== "rejected"
            ).length > 0 && (
              <>
                <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
                  Dine krav
                </Text>
                <View className="gap-2 mb-4">
                  {myClaims
                    .filter(
                      (c) =>
                        c.status !== "fulfilled" && c.status !== "rejected"
                    )
                    .map((claim) => {
                      const statusInfo =
                        STATUS_LABELS[claim.status] ?? STATUS_LABELS.pending;
                      return (
                        <PixelCard
                          key={claim.id}
                          className="flex-row items-center"
                        >
                          <Text className="text-lg mr-3">
                            {statusInfo.emoji}
                          </Text>
                          <View className="flex-1">
                            <Text className="text-sm text-white">
                              {(claim.reward as any)?.name ?? "Belonning"}
                            </Text>
                            <Text
                              className={`font-pixel text-[8px] ${statusInfo.color}`}
                            >
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
            <Text className="font-pixel text-[10px] text-white/30 uppercase tracking-wider mb-2">
              Tilgjengelige belonninger
            </Text>
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
              <View className="gap-3">
                {rewards.map((reward) => {
                  const canAfford = currentStars >= reward.star_cost;
                  const rarity = getRewardRarity(reward.star_cost);
                  const isPersonal = (reward as any).is_personal;
                  return (
                    <TouchableOpacity
                      key={reward.id}
                      onPress={() => handleClaim(reward)}
                      activeOpacity={canAfford ? 0.7 : 1}
                    >
                      <RarityBorder rarity={rarity}>
                        <PixelCard
                          className={`${!canAfford ? "opacity-50" : ""}`}
                        >
                          <View className="flex-row items-start">
                            <Text className="text-3xl mr-4">
                              {reward.emoji}
                            </Text>
                            <View className="flex-1">
                              <View className="flex-row items-center gap-2">
                                <Text className="font-bold text-white text-base">
                                  {reward.name}
                                </Text>
                                <View
                                  className={`rounded px-1.5 py-0.5 ${
                                    isPersonal
                                      ? "bg-primary-500/20"
                                      : "bg-info-500/20"
                                  }`}
                                >
                                  <Text
                                    className={`text-[8px] font-bold ${
                                      isPersonal
                                        ? "text-primary-400"
                                        : "text-info-400"
                                    }`}
                                  >
                                    {isPersonal ? "Personlig" : "Familie"}
                                  </Text>
                                </View>
                              </View>
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
                                  {getCategoryEmoji(reward.category as any)}{" "}
                                  {reward.category}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </PixelCard>
                      </RarityBorder>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Guild Master button */}
            {profile?.role === "parent" && (
              <TouchableOpacity
                className="mt-6 rounded-md bg-primary-500/15 border border-primary-500/20 py-3"
                onPress={() => router.push("/(admin)/settings")}
                activeOpacity={0.7}
              >
                <Text className="text-center font-pixel text-[10px] text-primary-400">
                  Guild Master Settings
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function PodiumSpot({
  entry,
  medal,
  height,
  isMe,
}: {
  entry: LeaderboardEntry;
  medal: string;
  height: number;
  isMe: boolean;
}) {
  return (
    <View className="flex-1 items-center">
      <Text className="text-2xl mb-1">{medal}</Text>
      <CharacterRenderer
        config={entry.avatar_config}
        characterClass={entry.character_class}
        size="sm"
      />
      <Text className="text-sm font-bold text-white mt-1" numberOfLines={1}>
        {entry.display_name}
      </Text>
      <Text className="font-pixel text-[10px] text-accent-400 mb-2">
        {entry.total_points}
      </Text>
      <View
        className={`w-full rounded-t-lg ${
          isMe ? "bg-primary-500/30" : "bg-dark-100"
        } border-t-2 border-dark-50`}
        style={{ height }}
      />
    </View>
  );
}
