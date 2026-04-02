import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { AvatarItem, CharacterClass } from "@/lib/database.types";

export function useAvatarItems(characterClass: CharacterClass) {
  const [items, setItems] = useState<AvatarItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, [characterClass]);

  async function fetchItems() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("avatar_items")
      .select("*")
      .or(`class_restriction.is.null,class_restriction.eq.${characterClass}`)
      .order("unlock_level", { ascending: true });

    if (!error && data) {
      setItems(data as AvatarItem[]);
    }
    setIsLoading(false);
  }

  function getItemsByType(type: AvatarItem["type"]) {
    return items.filter((item) => item.type === type);
  }

  function getUnlockedItems(level: number) {
    return items.filter(
      (item) => item.unlock_level <= level && !item.is_boss_drop
    );
  }

  return { items, isLoading, getItemsByType, getUnlockedItems };
}
