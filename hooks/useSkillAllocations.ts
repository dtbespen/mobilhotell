import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import type { SkillAllocation } from "@/lib/database.types";

export function useSkillAllocations() {
  const { profile } = useAuth();
  const [allocations, setAllocations] = useState<SkillAllocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllocations = useCallback(async () => {
    if (!profile?.id) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from("skill_allocations")
      .select("*")
      .eq("profile_id", profile.id);

    if (!error && data) {
      setAllocations(data as SkillAllocation[]);
    }
    setIsLoading(false);
  }, [profile?.id]);

  useEffect(() => {
    fetchAllocations();
  }, [fetchAllocations]);

  async function allocateSkill(skillId: string) {
    if (!profile?.id) return { error: "Not logged in" };

    const existing = allocations.find((a) => a.skill_id === skillId);

    if (existing) {
      const { error } = await supabase
        .from("skill_allocations")
        .update({ current_rank: existing.current_rank + 1 })
        .eq("id", existing.id);

      if (!error) {
        setAllocations((prev) =>
          prev.map((a) =>
            a.skill_id === skillId
              ? { ...a, current_rank: a.current_rank + 1 }
              : a
          )
        );
      }
      return { error };
    }

    const { data, error } = await supabase
      .from("skill_allocations")
      .insert({
        profile_id: profile.id,
        skill_id: skillId,
        current_rank: 1,
      })
      .select()
      .single();

    if (!error && data) {
      setAllocations((prev) => [...prev, data as SkillAllocation]);
    }
    return { error };
  }

  async function respec() {
    if (!profile?.id) return { error: "Not logged in" };

    const { error } = await supabase
      .from("skill_allocations")
      .delete()
      .eq("profile_id", profile.id);

    if (!error) {
      setAllocations([]);
      await supabase
        .from("profiles")
        .update({ last_respec: new Date().toISOString() })
        .eq("id", profile.id);
    }
    return { error };
  }

  const asSimpleAllocations = allocations.map((a) => ({
    skillId: a.skill_id,
    currentRank: a.current_rank,
  }));

  return {
    allocations,
    simpleAllocations: asSimpleAllocations,
    isLoading,
    allocateSkill,
    respec,
    refresh: fetchAllocations,
  };
}
