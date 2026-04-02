import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import type { GuildReward, RewardClaim } from "@/lib/database.types";

export function useGuildRewards() {
  const { profile } = useAuth();
  const familyId = profile?.family_id;

  const [rewards, setRewards] = useState<GuildReward[]>([]);
  const [claims, setClaims] = useState<RewardClaim[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRewards = useCallback(async () => {
    if (!familyId) return;
    setIsLoading(true);

    const { data: rewardData } = await supabase
      .from("guild_rewards")
      .select("*")
      .eq("family_id", familyId)
      .eq("is_active", true)
      .order("star_cost", { ascending: true });

    if (rewardData) setRewards(rewardData as GuildReward[]);

    const { data: claimData } = await supabase
      .from("reward_claims")
      .select("*, reward:guild_rewards(*), claimant:profiles(display_name)")
      .eq("family_id", familyId)
      .order("claimed_at", { ascending: false })
      .limit(30);

    if (claimData) setClaims(claimData as RewardClaim[]);

    setIsLoading(false);
  }, [familyId]);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  useEffect(() => {
    if (!familyId) return;

    const channelName = `reward-claims-${familyId}`;
    const existing = supabase.getChannels().find((ch) => ch.topic === `realtime:${channelName}`);
    if (existing) supabase.removeChannel(existing);

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reward_claims",
          filter: `family_id=eq.${familyId}`,
        },
        () => fetchRewards()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [familyId]);

  async function createReward(reward: {
    name: string;
    description: string;
    starCost: number;
    category: string;
    emoji: string;
    isRepeatable: boolean;
    isPersonal?: boolean;
  }) {
    if (!familyId || !profile?.id) return { error: "Not ready" };

    const { data, error } = await supabase
      .from("guild_rewards")
      .insert({
        family_id: familyId,
        name: reward.name,
        description: reward.description,
        star_cost: reward.starCost,
        category: reward.category,
        emoji: reward.emoji,
        is_repeatable: reward.isRepeatable,
        is_personal: reward.isPersonal ?? false,
        created_by: profile.id,
      })
      .select()
      .single();

    if (!error && data) {
      setRewards((prev) => [...prev, data as GuildReward]);
    }
    return { data, error };
  }

  async function updateReward(
    rewardId: string,
    updates: Partial<Pick<GuildReward, "name" | "description" | "star_cost" | "category" | "emoji" | "is_repeatable" | "is_active">>
  ) {
    const { error } = await supabase
      .from("guild_rewards")
      .update(updates)
      .eq("id", rewardId);

    if (!error) {
      setRewards((prev) =>
        prev.map((r) => (r.id === rewardId ? { ...r, ...updates } : r))
      );
    }
    return { error };
  }

  async function claimReward(rewardId: string, starCost: number) {
    if (!familyId || !profile?.id) return { error: "Not ready" };

    const { data, error } = await supabase
      .from("reward_claims")
      .insert({
        family_id: familyId,
        reward_id: rewardId,
        claimed_by: profile.id,
        stars_spent: starCost,
        status: "pending",
      })
      .select()
      .single();

    if (!error && data) {
      setClaims((prev) => [data as RewardClaim, ...prev]);
    }
    return { data, error };
  }

  async function approveOrRejectClaim(claimId: string, status: "approved" | "fulfilled" | "rejected") {
    if (!profile?.id) return { error: "Not ready" };

    const updates: Record<string, unknown> = {
      status,
      approved_by: profile.id,
    };
    if (status === "fulfilled") {
      updates.fulfilled_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("reward_claims")
      .update(updates)
      .eq("id", claimId);

    if (!error) {
      setClaims((prev) =>
        prev.map((c) => (c.id === claimId ? { ...c, ...updates } as RewardClaim : c))
      );
    }
    return { error };
  }

  const pendingClaims = claims.filter((c) => c.status === "pending");
  const recentFulfilled = claims.filter((c) => c.status === "fulfilled").slice(0, 10);

  return {
    rewards,
    claims,
    pendingClaims,
    recentFulfilled,
    isLoading,
    createReward,
    updateReward,
    claimReward,
    approveOrRejectClaim,
    refresh: fetchRewards,
  };
}
