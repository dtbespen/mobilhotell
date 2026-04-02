import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import type { AvatarConfig, CharacterClass, WizardRank } from "@/lib/database.types";

interface WizardProfile {
  characterClass: CharacterClass;
  wizardRank: WizardRank;
  avatarConfig: AvatarConfig;
  activeTitle: string | null;
  equippedEmotes: string[];
  activeLoadout: number;
  skillPointsSpent: number;
  streakFreezes: number;
  loginStreak: number;
}

const DEFAULT_AVATAR: AvatarConfig = {
  body_color: "blue",
  hair_style: null,
  hair_color: null,
  hat: null,
  armor: null,
  cape: null,
  weapon: null,
  shield: null,
  familiar: null,
};

export function useWizardProfile() {
  const { profile } = useAuth();
  const [wizardProfile, setWizardProfile] = useState<WizardProfile>({
    characterClass: "wizard",
    wizardRank: "apprentice",
    avatarConfig: DEFAULT_AVATAR,
    activeTitle: null,
    equippedEmotes: [],
    activeLoadout: 1,
    skillPointsSpent: 0,
    streakFreezes: 0,
    loginStreak: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!profile?.id) return;

    const p = profile as any;
    setWizardProfile({
      characterClass: p.character_class ?? "wizard",
      wizardRank: p.wizard_rank ?? "apprentice",
      avatarConfig: p.avatar_config ?? DEFAULT_AVATAR,
      activeTitle: p.active_title ?? null,
      equippedEmotes: p.equipped_emotes ?? [],
      activeLoadout: p.active_loadout ?? 1,
      skillPointsSpent: p.skill_points_spent ?? 0,
      streakFreezes: p.streak_freezes ?? 0,
      loginStreak: p.login_streak ?? 0,
    });
    setIsLoading(false);
  }, [profile]);

  async function updateClass(newClass: CharacterClass) {
    if (!profile?.id) return;
    const { error } = await supabase
      .from("profiles")
      .update({ character_class: newClass })
      .eq("id", profile.id);
    if (!error) {
      setWizardProfile((prev) => ({ ...prev, characterClass: newClass }));
    }
    return { error };
  }

  async function updateAvatar(config: Partial<AvatarConfig>) {
    if (!profile?.id) return;
    const newConfig = { ...wizardProfile.avatarConfig, ...config };
    const { error } = await supabase
      .from("profiles")
      .update({ avatar_config: newConfig })
      .eq("id", profile.id);
    if (!error) {
      setWizardProfile((prev) => ({ ...prev, avatarConfig: newConfig }));
    }
    return { error };
  }

  async function updateRank(rank: WizardRank) {
    if (!profile?.id) return;
    const { error } = await supabase
      .from("profiles")
      .update({ wizard_rank: rank })
      .eq("id", profile.id);
    if (!error) {
      setWizardProfile((prev) => ({ ...prev, wizardRank: rank }));
    }
    return { error };
  }

  async function updateTitle(titleSlug: string | null) {
    if (!profile?.id) return;
    const { error } = await supabase
      .from("profiles")
      .update({ active_title: titleSlug })
      .eq("id", profile.id);
    if (!error) {
      setWizardProfile((prev) => ({ ...prev, activeTitle: titleSlug }));
    }
    return { error };
  }

  async function updateEquippedEmotes(emotes: string[]) {
    if (!profile?.id) return;
    const { error } = await supabase
      .from("profiles")
      .update({ equipped_emotes: emotes })
      .eq("id", profile.id);
    if (!error) {
      setWizardProfile((prev) => ({ ...prev, equippedEmotes: emotes }));
    }
    return { error };
  }

  return {
    ...wizardProfile,
    isLoading,
    updateClass,
    updateAvatar,
    updateRank,
    updateTitle,
    updateEquippedEmotes,
  };
}
