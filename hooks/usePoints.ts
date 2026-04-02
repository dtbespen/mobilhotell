import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

type PointsSummary = {
  today: number;
  thisWeek: number;
  total: number;
  streak: number;
};

export function usePoints() {
  const { profile, family } = useAuth();
  const [summary, setSummary] = useState<PointsSummary>({
    today: 0,
    thisWeek: 0,
    total: 0,
    streak: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchPoints = useCallback(async () => {
    if (!profile) return;

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).toISOString();

    const weekStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay() + 1
    ).toISOString();

    const [todayRes, weekRes, totalRes] = await Promise.all([
      supabase
        .from("activities")
        .select("points_earned")
        .eq("profile_id", profile.id)
        .gte("started_at", todayStart)
        .not("ended_at", "is", null),
      supabase
        .from("activities")
        .select("points_earned")
        .eq("profile_id", profile.id)
        .gte("started_at", weekStart)
        .not("ended_at", "is", null),
      supabase
        .from("activities")
        .select("points_earned")
        .eq("profile_id", profile.id)
        .not("ended_at", "is", null),
    ]);

    const sumPoints = (data: { points_earned: number }[] | null) =>
      data?.reduce((acc, a) => acc + a.points_earned, 0) ?? 0;

    const streak = await calculateStreak(profile.id);

    setSummary({
      today: sumPoints(todayRes.data),
      thisWeek: sumPoints(weekRes.data),
      total: sumPoints(totalRes.data),
      streak,
    });
    setIsLoading(false);
  }, [profile]);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  useEffect(() => {
    if (!family) return;

    const channelName = `points-${family.id}`;
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
          fetchPoints();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [family?.id]);

  return { ...summary, isLoading, refresh: fetchPoints };
}

async function calculateStreak(profileId: string): Promise<number> {
  const { data } = await supabase
    .from("activities")
    .select("started_at")
    .eq("profile_id", profileId)
    .not("ended_at", "is", null)
    .order("started_at", { ascending: false });

  if (!data || data.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dates = new Set(
    data.map((a) => {
      const d = new Date(a.started_at);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  );

  const checkDate = new Date(today);

  if (!dates.has(checkDate.getTime())) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (dates.has(checkDate.getTime())) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}
