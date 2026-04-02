import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import type { AvatarConfig, CharacterClass, WizardRank } from "@/lib/database.types";

interface WizardProfile {
  characterClass: CharacterClass;
  wizardRank: WizardRank;
  avatarConfig: AvatarConfig;
}

const DEFAULT_AVATAR: AvatarConfig = {
  body_color: "blue",
  hat: null,
  robe: null,
  staff: null,
  familiar: null,
};

export function useWizardProfile() {
  const { profile } = useAuth();
  const [wizardProfile, setWizardProfile] = useState<WizardProfile>({
    characterClass: "wizard",
    wizardRank: "apprentice",
    avatarConfig: DEFAULT_AVATAR,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!profile?.id) return;

    setWizardProfile({
      characterClass: (profile as any).character_class ?? "wizard",
      wizardRank: (profile as any).wizard_rank ?? "apprentice",
      avatarConfig: (profile as any).avatar_config ?? DEFAULT_AVATAR,
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

  return {
    ...wizardProfile,
    isLoading,
    updateClass,
    updateAvatar,
    updateRank,
  };
}
