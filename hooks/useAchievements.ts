import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import type { Achievement } from "@/lib/database.types";

export function useAchievements() {
  const { profile } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAchievements = useCallback(async () => {
    if (!profile?.id) return;
    setIsLoading(true);

    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("profile_id", profile.id)
      .order("unlocked_at", { ascending: false });

    if (!error && data) {
      setAchievements(data as Achievement[]);
    }
    setIsLoading(false);
  }, [profile?.id]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const unlockedSlugs = achievements.map((a) => a.achievement_slug);

  async function unlockAchievement(achievementSlug: string) {
    if (!profile?.id) return;
    if (unlockedSlugs.includes(achievementSlug)) return;

    const { data, error } = await supabase
      .from("achievements")
      .insert({
        profile_id: profile.id,
        achievement_slug: achievementSlug,
      })
      .select()
      .single();

    if (!error && data) {
      setAchievements((prev) => [data as Achievement, ...prev]);
    }
  }

  return {
    achievements,
    unlockedSlugs,
    isLoading,
    unlockAchievement,
    refresh: fetchAchievements,
  };
}
