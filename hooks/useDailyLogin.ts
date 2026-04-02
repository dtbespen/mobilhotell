import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { getLoginReward, type LoginReward } from "@/lib/dailyLogin";
import type { DailyLogin } from "@/lib/database.types";

export function useDailyLogin() {
  const { profile } = useAuth();
  const [todayLogin, setTodayLogin] = useState<DailyLogin | null>(null);
  const [reward, setReward] = useState<LoginReward | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodayLogin = useCallback(async () => {
    if (!profile?.id) return;
    setIsLoading(true);

    const today = new Date().toISOString().split("T")[0];
    const loginStreak = (profile as any).login_streak ?? 1;

    const { data } = await supabase
      .from("daily_logins")
      .select("*")
      .eq("profile_id", profile.id)
      .eq("login_date", today)
      .single();

    if (data) {
      setTodayLogin(data as DailyLogin);
    }

    setReward(getLoginReward(loginStreak));
    setIsLoading(false);
  }, [profile?.id]);

  useEffect(() => {
    fetchTodayLogin();
  }, [fetchTodayLogin]);

  async function claimReward() {
    if (!profile?.id || !reward) return { error: "Not ready" };
    if (todayLogin?.reward_claimed) return { error: "Already claimed" };

    const today = new Date().toISOString().split("T")[0];

    if (!todayLogin) {
      const { data, error } = await supabase
        .from("daily_logins")
        .insert({
          profile_id: profile.id,
          login_date: today,
          bonus_mana: reward.mana,
          reward_claimed: true,
        })
        .select()
        .single();

      if (!error && data) {
        setTodayLogin(data as DailyLogin);
      }

      const loginStreak = ((profile as any).login_streak ?? 0) + 1;
      await supabase
        .from("profiles")
        .update({ login_streak: loginStreak })
        .eq("id", profile.id);

      return { error, mana: reward.mana };
    }

    const { error } = await supabase
      .from("daily_logins")
      .update({ reward_claimed: true })
      .eq("id", todayLogin.id);

    if (!error) {
      setTodayLogin((prev) => (prev ? { ...prev, reward_claimed: true } : prev));
    }

    return { error, mana: reward.mana };
  }

  return {
    todayLogin,
    reward,
    isClaimed: todayLogin?.reward_claimed ?? false,
    isLoading,
    claimReward,
    refresh: fetchTodayLogin,
  };
}
