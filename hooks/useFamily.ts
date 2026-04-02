import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import type { Profile } from "@/lib/database.types";

export function useFamily() {
  const { family } = useAuth();
  const [members, setMembers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    if (!family) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("family_id", family.id)
      .order("display_name");

    if (data) setMembers(data);
    setIsLoading(false);
  }, [family]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  useEffect(() => {
    if (!family) return;

    const channelName = `family-profiles-${family.id}`;
    const existing = supabase.getChannels().find((ch) => ch.topic === `realtime:${channelName}`);
    if (existing) supabase.removeChannel(existing);

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `family_id=eq.${family.id}`,
        },
        () => {
          fetchMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [family?.id, fetchMembers]);

  return {
    members,
    isLoading,
    refresh: fetchMembers,
  };
}
