import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { calculatePoints } from "@/lib/points";
import type { Activity, ActivityType } from "@/lib/database.types";

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
    const pointsPerMinute =
      activeActivity.activity_type?.points_per_minute ?? 1;
    const pointsEarned = calculatePoints(durationMinutes, pointsPerMinute);

    const { error } = await supabase
      .from("activities")
      .update({
        ended_at: endedAt.toISOString(),
        duration_minutes: durationMinutes,
        points_earned: pointsEarned,
      })
      .eq("id", activeActivity.id);

    if (error) return { error: new Error(error.message) };
    setActiveActivity(null);
    await fetchActivities();
    return { error: null, pointsEarned };
  }

  async function logManualActivity(
    activityType: ActivityType,
    durationMinutes: number
  ) {
    if (!profile) return { error: new Error("Ingen profil") };

    const pointsEarned = calculatePoints(
      durationMinutes,
      activityType.points_per_minute
    );
    const now = new Date();
    const startedAt = new Date(now.getTime() - durationMinutes * 60000);

    const { error } = await supabase.from("activities").insert({
      profile_id: profile.id,
      activity_type_id: activityType.id,
      started_at: startedAt.toISOString(),
      ended_at: now.toISOString(),
      duration_minutes: durationMinutes,
      points_earned: pointsEarned,
      source: "manual",
    });

    if (error) return { error: new Error(error.message) };
    await fetchActivities();
    return { error: null, pointsEarned };
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
