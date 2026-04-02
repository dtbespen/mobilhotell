import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { ClassAbility, CharacterClass } from "@/lib/database.types";

export function useClassAbilities(characterClass: CharacterClass, level: number) {
  const [abilities, setAbilities] = useState<ClassAbility[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAbilities();
  }, [characterClass]);

  async function fetchAbilities() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("class_abilities")
      .select("*")
      .eq("character_class", characterClass)
      .order("unlock_level", { ascending: true });

    if (!error && data) {
      setAbilities(data as ClassAbility[]);
    }
    setIsLoading(false);
  }

  const unlockedAbilities = abilities.filter((a) => a.unlock_level <= level);
  const lockedAbilities = abilities.filter((a) => a.unlock_level > level);

  return { abilities, unlockedAbilities, lockedAbilities, isLoading };
}
