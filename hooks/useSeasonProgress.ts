import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import type { SeasonProgress, Season, DailyQuest } from "@/lib/database.types";

export function useSeasonProgress() {
  const { profile } = useAuth();
  const [season, setSeason] = useState<Season | null>(null);
  const [progress, setProgress] = useState<SeasonProgress | null>(null);
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSeason = useCallback(async () => {
    if (!profile?.id) return;
    setIsLoading(true);

    const today = new Date().toISOString().split("T")[0];

    const { data: seasonData } = await supabase
      .from("seasons")
      .select("*")
      .lte("starts_at", today)
      .gte("ends_at", today)
      .order("starts_at", { ascending: false })
      .limit(1)
      .single();

    if (seasonData) {
      setSeason(seasonData as Season);

      const { data: progressData } = await supabase
        .from("season_progress")
        .select("*")
        .eq("profile_id", profile.id)
        .eq("season_id", seasonData.id)
        .single();

      if (progressData) {
        setProgress(progressData as SeasonProgress);
      } else {
        const { data: newProgress } = await supabase
          .from("season_progress")
          .insert({
            profile_id: profile.id,
            season_id: seasonData.id,
            current_xp: 0,
            current_tier: 0,
          })
          .select()
          .single();

        if (newProgress) setProgress(newProgress as SeasonProgress);
      }

      const { data: questData } = await supabase
        .from("daily_quests")
        .select("*")
        .eq("profile_id", profile.id)
        .eq("quest_date", today)
        .order("quest_type");

      if (questData) setDailyQuests(questData as DailyQuest[]);
    }

    setIsLoading(false);
  }, [profile?.id]);

  useEffect(() => {
    fetchSeason();
  }, [fetchSeason]);

  async function addSeasonXp(xp: number) {
    if (!progress || !profile?.id) return;

    const newXp = progress.current_xp + xp;
    const { error } = await supabase
      .from("season_progress")
      .update({ current_xp: newXp })
      .eq("id", progress.id);

    if (!error) {
      setProgress((prev) => prev ? { ...prev, current_xp: newXp } : prev);
    }
    return { error };
  }

  async function completeQuest(questId: string) {
    const { error } = await supabase
      .from("daily_quests")
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq("id", questId);

    if (!error) {
      setDailyQuests((prev) =>
        prev.map((q) => (q.id === questId ? { ...q, completed: true } : q))
      );
    }
    return { error };
  }

  return {
    season,
    progress,
    dailyQuests,
    isLoading,
    addSeasonXp,
    completeQuest,
    refresh: fetchSeason,
  };
}
