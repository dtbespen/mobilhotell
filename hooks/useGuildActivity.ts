import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import type { GuildActivity } from "@/lib/database.types";

export function useGuildActivity() {
  const { profile } = useAuth();
  const familyId = profile?.family_id;
  const [activities, setActivities] = useState<GuildActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    if (!familyId) return;
    setIsLoading(true);

    const { data, error } = await supabase
      .from("guild_activity")
      .select("*, profile:profiles(display_name, character_class)")
      .eq("family_id", familyId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      setActivities(data as GuildActivity[]);
    }
    setIsLoading(false);
  }, [familyId]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  useEffect(() => {
    if (!familyId) return;

    const channel = supabase
      .channel(`guild-activity-${familyId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "guild_activity",
          filter: `family_id=eq.${familyId}`,
        },
        (payload) => {
          setActivities((prev) => [payload.new as GuildActivity, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [familyId]);

  async function logActivity(
    eventType: string,
    eventData?: Record<string, unknown>
  ) {
    if (!profile?.id || !familyId) return;

    await supabase.from("guild_activity").insert({
      family_id: familyId,
      profile_id: profile.id,
      event_type: eventType,
      event_data: eventData ?? null,
    });
  }

  async function highFive(activityId: string) {
    if (!profile?.id) return;
    logActivity("high_five", { target_activity_id: activityId });
  }

  return {
    activities,
    isLoading,
    logActivity,
    highFive,
    refresh: fetchActivities,
  };
}
