import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import type { Dungeon, DungeonContribution } from "@/lib/database.types";
import { calculateDamage, type CharacterClass } from "@/lib/wizard";

export function useDungeon() {
  const { profile } = useAuth();
  const familyId = profile?.family_id;

  const [dungeon, setDungeon] = useState<Dungeon | null>(null);
  const [contributions, setContributions] = useState<DungeonContribution[]>([]);
  const [remainingHp, setRemainingHp] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!familyId) return;
    fetchActiveDungeon();
  }, [familyId]);

  useEffect(() => {
    if (!dungeon || !familyId) return;

    const channel = supabase
      .channel(`dungeon-${dungeon.id}-${familyId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "dungeon_contributions",
          filter: `dungeon_id=eq.${dungeon.id}`,
        },
        (payload) => {
          const newContrib = payload.new as DungeonContribution;
          if (newContrib.family_id === familyId) {
            setContributions((prev) => [newContrib, ...prev]);
            setRemainingHp((prev) =>
              Math.max(prev - newContrib.damage_dealt, 0)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dungeon?.id, familyId]);

  async function fetchActiveDungeon() {
    setIsLoading(true);
    const today = new Date().toISOString().split("T")[0];

    const { data: dungeonData } = await supabase
      .from("dungeons")
      .select("*")
      .lte("week_start", today)
      .gte("week_end", today)
      .order("week_start", { ascending: false })
      .limit(1)
      .single();

    if (!dungeonData) {
      setIsLoading(false);
      return;
    }

    setDungeon(dungeonData as Dungeon);

    const { data: contribData } = await supabase
      .from("dungeon_contributions")
      .select("*, profile:profiles(display_name)")
      .eq("dungeon_id", dungeonData.id)
      .eq("family_id", familyId!)
      .order("created_at", { ascending: false });

    const contribs = (contribData ?? []) as DungeonContribution[];
    setContributions(contribs);

    const totalDamage = contribs.reduce((sum, c) => sum + c.damage_dealt, 0);
    setRemainingHp(Math.max(dungeonData.boss_hp - totalDamage, 0));
    setIsLoading(false);
  }

  async function contributeMana(
    manaAmount: number,
    characterClass: CharacterClass,
    abilitySlug?: string
  ) {
    if (!profile?.id || !familyId || !dungeon) return { error: "Not ready" };

    const abilityMultiplier = abilitySlug ? 1.5 : 1.0;
    const damage = calculateDamage(manaAmount, characterClass, abilityMultiplier);

    const { data, error } = await supabase
      .from("dungeon_contributions")
      .insert({
        dungeon_id: dungeon.id,
        family_id: familyId,
        profile_id: profile.id,
        mana_contributed: manaAmount,
        damage_dealt: damage,
        ability_used: abilitySlug ?? null,
      })
      .select()
      .single();

    return { data, error };
  }

  const totalDamage = dungeon
    ? dungeon.boss_hp - remainingHp
    : 0;

  const myDamage = contributions
    .filter((c) => c.profile_id === profile?.id)
    .reduce((sum, c) => sum + c.damage_dealt, 0);

  const bossDefeated = dungeon ? remainingHp <= 0 : false;

  const daysRemaining = dungeon
    ? Math.max(
        Math.ceil(
          (new Date(dungeon.week_end).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        ),
        0
      )
    : 0;

  return {
    dungeon,
    contributions,
    remainingHp,
    totalDamage,
    myDamage,
    bossDefeated,
    daysRemaining,
    isLoading,
    contributeMana,
    refresh: fetchActiveDungeon,
  };
}
