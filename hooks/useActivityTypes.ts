import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import type { ActivityType } from "@/lib/database.types";

export function useActivityTypes() {
  const { family } = useAuth();
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTypes = useCallback(async () => {
    if (!family) return;

    const { data } = await supabase
      .from("activity_types")
      .select("*")
      .eq("family_id", family.id)
      .order("name");

    if (data) setActivityTypes(data);
    setIsLoading(false);
  }, [family]);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  async function addActivityType(params: {
    name: string;
    category: string;
    points_per_minute: number;
    icon: string;
  }) {
    if (!family) return { error: new Error("Ingen familie") };

    const { error } = await supabase.from("activity_types").insert({
      family_id: family.id,
      ...params,
      is_default: false,
    });

    if (error) return { error: new Error(error.message) };
    await fetchTypes();
    return { error: null };
  }

  async function updateActivityType(
    id: string,
    params: Partial<{
      name: string;
      points_per_minute: number;
      icon: string;
    }>
  ) {
    const { error } = await supabase
      .from("activity_types")
      .update(params)
      .eq("id", id);

    if (error) return { error: new Error(error.message) };
    await fetchTypes();
    return { error: null };
  }

  async function deleteActivityType(id: string) {
    const { error } = await supabase
      .from("activity_types")
      .delete()
      .eq("id", id);

    if (error) return { error: new Error(error.message) };
    await fetchTypes();
    return { error: null };
  }

  return {
    activityTypes,
    isLoading,
    addActivityType,
    updateActivityType,
    deleteActivityType,
    refresh: fetchTypes,
  };
}
