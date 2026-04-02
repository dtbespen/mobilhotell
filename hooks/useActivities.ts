import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { calculateMana, type ManaBreakdown, type SessionContext } from "@/lib/manaEngine";
import type { Activity, ActivityType, ActivityCategory } from "@/lib/database.types";

export function useActivities() {
  const { profile, family } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    if (!profile) return;

    const { data } = await supabase
      .from("activities")
      .select("*, activity_type:activity_types(*)")
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (data) {
      setActivities(data);
      const active = data.find((a: Activity) => !a.ended_at);
      setActiveActivity(active || null);
    }
    setIsLoading(false);
  }, [profile]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  useEffect(() => {
    if (!family) return;

    const channelName = `activities-${family.id}`;
    supabase.channel(channelName).unsubscribe();

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "activities",
        },
        () => {
          fetchActivities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [family?.id]);

  async function startActivity(activityType: ActivityType) {
    if (!profile) return { error: new Error("Ingen profil") };

    const { data, error } = await supabase
      .from("activities")
      .insert({
        profile_id: profile.id,
        activity_type_id: activityType.id,
        started_at: new Date().toISOString(),
        duration_minutes: 0,
        points_earned: 0,
        source: "manual",
      })
      .select("*, activity_type:activity_types(*)")
      .single();

    if (error) return { error: new Error(error.message) };
    setActiveActivity(data);
    return { error: null, activity: data };
  }

  async function stopActivity() {
    if (!activeActivity) return { error: new Error("Ingen aktiv aktivitet") };

    const endedAt = new Date();
    const startedAt = new Date(activeActivity.started_at);
    const durationMinutes = Math.round(
      (endedAt.getTime() - startedAt.getTime()) / 60000
    );

    const todaySessions = getTodaySessions(activities, activeActivity.id);
    const category: ActivityCategory = activeActivity.activity_type?.category ?? "screen_free";
    const breakdown = calculateMana({
      durationMinutes,
      category,
      todaySessions,
      currentStreak: 0,
      equipmentManaBonus: 0,
    });

    const { error } = await supabase
      .from("activities")
      .update({
        ended_at: endedAt.toISOString(),
        duration_minutes: durationMinutes,
        points_earned: breakdown.totalMana,
        metadata: {
          mana_breakdown: breakdown,
          engine_version: 2,
        },
      })
      .eq("id", activeActivity.id);

    if (error) return { error: new Error(error.message) };
    setActiveActivity(null);
    await fetchActivities();
    return { error: null, pointsEarned: breakdown.totalMana, breakdown };
  }

  async function logManualActivity(
    activityType: ActivityType,
    durationMinutes: number
  ) {
    if (!profile) return { error: new Error("Ingen profil") };

    const todaySessions = getTodaySessions(activities);
    const breakdown = calculateMana({
      durationMinutes,
      category: activityType.category,
      todaySessions,
      currentStreak: 0,
      equipmentManaBonus: 0,
    });

    const now = new Date();
    const startedAt = new Date(now.getTime() - durationMinutes * 60000);

    const { error } = await supabase.from("activities").insert({
      profile_id: profile.id,
      activity_type_id: activityType.id,
      started_at: startedAt.toISOString(),
      ended_at: now.toISOString(),
      duration_minutes: durationMinutes,
      points_earned: breakdown.totalMana,
      source: "manual",
      metadata: {
        mana_breakdown: breakdown,
        engine_version: 2,
      },
    });

    if (error) return { error: new Error(error.message) };
    await fetchActivities();
    return { error: null, pointsEarned: breakdown.totalMana, breakdown };
  }

  return {
    activities,
    activeActivity,
    isLoading,
    startActivity,
    stopActivity,
    logManualActivity,
    refresh: fetchActivities,
  };
}

function getTodaySessions(
  activities: Activity[],
  excludeId?: string
): Array<{ category: ActivityCategory; durationMinutes: number }> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  return activities
    .filter((a) => {
      if (!a.ended_at) return false;
      if (a.id === excludeId) return false;
      return new Date(a.started_at) >= todayStart;
    })
    .map((a) => ({
      category: (a.activity_type?.category ?? "screen_free") as ActivityCategory,
      durationMinutes: a.duration_minutes,
    }));
}
