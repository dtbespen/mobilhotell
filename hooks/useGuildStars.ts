import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import type {
  GuildStarBalance,
  GuildStarTransaction,
  GuildStarContribution,
} from "@/lib/database.types";

export function useGuildStars() {
  const { profile } = useAuth();
  const familyId = profile?.family_id;

  const [balance, setBalance] = useState<GuildStarBalance | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<GuildStarTransaction[]>([]);
  const [myContributions, setMyContributions] = useState<GuildStarContribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBalance = useCallback(async () => {
    if (!familyId) return;
    setIsLoading(true);

    const { data: balanceData } = await supabase
      .from("guild_star_balance")
      .select("*")
      .eq("family_id", familyId)
      .single();

    if (balanceData) {
      setBalance(balanceData as GuildStarBalance);
    } else {
      const { data: newBalance } = await supabase
        .from("guild_star_balance")
        .insert({ family_id: familyId, current_stars: 0, total_earned: 0, total_spent: 0 })
        .select()
        .single();
      if (newBalance) setBalance(newBalance as GuildStarBalance);
    }

    const { data: txData } = await supabase
      .from("guild_star_transactions")
      .select("*")
      .eq("family_id", familyId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (txData) setRecentTransactions(txData as GuildStarTransaction[]);

    if (profile?.id) {
      const { data: contribData } = await supabase
        .from("guild_star_contributions")
        .select("*")
        .eq("profile_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (contribData) setMyContributions(contribData as GuildStarContribution[]);
    }

    setIsLoading(false);
  }, [familyId, profile?.id]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  useEffect(() => {
    if (!familyId) return;

    const channelName = `guild-stars-${familyId}`;
    const existing = supabase.getChannels().find((ch) => ch.topic === `realtime:${channelName}`);
    if (existing) supabase.removeChannel(existing);

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "guild_star_balance",
          filter: `family_id=eq.${familyId}`,
        },
        (payload) => {
          if (payload.new) setBalance(payload.new as GuildStarBalance);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [familyId]);

  async function awardDungeonStars(
    dungeonId: string,
    payouts: Array<{ profileId: string; starsEarned: number; bonusStars: number; contributionPercent: number }>,
    totalStars: number
  ) {
    if (!familyId) return { error: "No family" };

    for (const payout of payouts) {
      await supabase.from("guild_star_contributions").insert({
        family_id: familyId,
        profile_id: payout.profileId,
        dungeon_id: dungeonId,
        stars_earned: payout.starsEarned,
        bonus_stars: payout.bonusStars,
        contribution_percent: payout.contributionPercent,
      });
    }

    await supabase.from("guild_star_transactions").insert({
      family_id: familyId,
      amount: totalStars,
      transaction_type: "dungeon_victory",
      description: "Boss beseiret!",
      reference_id: dungeonId,
    });

    const currentBalance = balance?.current_stars ?? 0;
    const totalEarned = balance?.total_earned ?? 0;

    const { error } = await supabase
      .from("guild_star_balance")
      .upsert({
        family_id: familyId,
        current_stars: currentBalance + totalStars,
        total_earned: totalEarned + totalStars,
        total_spent: balance?.total_spent ?? 0,
      }, { onConflict: "family_id" });

    if (!error) {
      setBalance((prev) =>
        prev
          ? { ...prev, current_stars: prev.current_stars + totalStars, total_earned: prev.total_earned + totalStars }
          : prev
      );
    }

    return { error };
  }

  async function spendStars(amount: number, description: string, rewardId?: string) {
    if (!familyId || !balance) return { error: "Not ready" };
    if (balance.current_stars < amount) return { error: "Ikke nok stjerner" };

    await supabase.from("guild_star_transactions").insert({
      family_id: familyId,
      profile_id: profile?.id,
      amount: -amount,
      transaction_type: "reward_claim",
      description,
      reference_id: rewardId,
    });

    const { error } = await supabase
      .from("guild_star_balance")
      .update({
        current_stars: balance.current_stars - amount,
        total_spent: balance.total_spent + amount,
      })
      .eq("family_id", familyId);

    if (!error) {
      setBalance((prev) =>
        prev
          ? { ...prev, current_stars: prev.current_stars - amount, total_spent: prev.total_spent + amount }
          : prev
      );
    }

    return { error };
  }

  return {
    balance,
    currentStars: balance?.current_stars ?? 0,
    totalEarned: balance?.total_earned ?? 0,
    recentTransactions,
    myContributions,
    isLoading,
    awardDungeonStars,
    spendStars,
    refresh: fetchBalance,
  };
}
