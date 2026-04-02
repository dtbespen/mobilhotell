import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import {
  generateDailyQuests,
  generateWeeklyQuests,
  type DailyQuestTemplate,
  type WeeklyQuestTemplate,
} from "@/lib/seasonPass";

export interface QuestWithProgress {
  questType: string;
  description: string;
  seasonXP: number;
  current: number;
  target: number;
  completed: boolean;
  period: "daily" | "weekly";
}

function getWeekNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
}

function getDaySeed(): number {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

export function useSeasonQuests() {
  const { profile } = useAuth();
  const [quests, setQuests] = useState<QuestWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!profile?.id) return;
    setIsLoading(true);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const dayOfWeek = now.getDay();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek + 1).toISOString();

    const dailyTemplates = generateDailyQuests(dayOfWeek, getDaySeed());
    const weeklyTemplates = generateWeeklyQuests(getWeekNumber());

    // Fetch today's data
    const [todayActivities, weekActivities, todayDungeon, weekDungeon] = await Promise.all([
      supabase
        .from("activities")
        .select("duration_minutes, points_earned")
        .eq("profile_id", profile.id)
        .gte("started_at", todayStart)
        .not("ended_at", "is", null),
      supabase
        .from("activities")
        .select("duration_minutes, points_earned")
        .eq("profile_id", profile.id)
        .gte("started_at", weekStart)
        .not("ended_at", "is", null),
      supabase
        .from("dungeon_contributions")
        .select("id")
        .eq("profile_id", profile.id)
        .gte("created_at", todayStart),
      supabase
        .from("dungeon_contributions")
        .select("id")
        .eq("profile_id", profile.id)
        .gte("created_at", weekStart),
    ]);

    const todayMana = todayActivities.data?.reduce((s, a) => s + a.points_earned, 0) ?? 0;
    const todayMinutes = todayActivities.data?.reduce((s, a) => s + a.duration_minutes, 0) ?? 0;
    const todayQuestCount = todayActivities.data?.length ?? 0;
    const todayDungeonCount = todayDungeon.data?.length ?? 0;

    const weekMana = weekActivities.data?.reduce((s, a) => s + a.points_earned, 0) ?? 0;
    const weekQuestCount = weekActivities.data?.length ?? 0;
    const weekDungeonCount = weekDungeon.data?.length ?? 0;
    const streak = (profile as any)?.login_streak ?? 0;

    function getProgress(type: string, target: number, period: "daily" | "weekly"): number {
      const isWeek = period === "weekly";
      switch (type) {
        case "unplug_minutes": return isWeek ? todayMinutes : todayMinutes; // daily only
        case "complete_quest": return isWeek ? weekQuestCount : todayQuestCount;
        case "contribute_dungeon": return isWeek ? weekDungeonCount : todayDungeonCount;
        case "earn_mana": return isWeek ? weekMana : todayMana;
        case "streak_days": return streak;
        case "family_quest": return 0; // complex, skip for now
        default: return 0;
      }
    }

    const result: QuestWithProgress[] = [];

    for (const t of dailyTemplates) {
      const current = getProgress(t.requirement.type, t.requirement.target, "daily");
      result.push({
        questType: t.questType,
        description: t.description,
        seasonXP: t.seasonXP,
        current: Math.min(current, t.requirement.target),
        target: t.requirement.target,
        completed: current >= t.requirement.target,
        period: "daily",
      });
    }

    for (const t of weeklyTemplates) {
      const current = getProgress(t.requirement.type, t.requirement.target, "weekly");
      result.push({
        questType: t.questType,
        description: t.description,
        seasonXP: t.seasonXP,
        current: Math.min(current, t.requirement.target),
        target: t.requirement.target,
        completed: current >= t.requirement.target,
        period: "weekly",
      });
    }

    setQuests(result);
    setIsLoading(false);
  }, [profile?.id]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const totalXpEarned = quests.filter((q) => q.completed).reduce((s, q) => s + q.seasonXP, 0);
  const totalXpAvailable = quests.reduce((s, q) => s + q.seasonXP, 0);

  return { quests, isLoading, totalXpEarned, totalXpAvailable, refresh: fetchProgress };
}
