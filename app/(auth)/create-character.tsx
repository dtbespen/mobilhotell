import { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { ClassPicker } from "@/components/wizard/ClassPicker";
import { AvatarEditor } from "@/components/wizard/AvatarEditor";
import { CharacterRenderer } from "@/components/wizard/CharacterRenderer";
import type { AvatarConfig, CharacterClass } from "@/lib/database.types";

type Step = "class" | "appearance" | "confirm";

const DEFAULT_AVATAR: AvatarConfig = {
  body_color: "light",
  hair_style: "plain",
  hair_color: "brown",
  hat: null,
  armor: null,
  cape: null,
  weapon: null,
  shield: null,
  familiar: null,
};

export default function CreateCharacterScreen() {
  const { profile } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<Step>("class");
  const [selectedClass, setSelectedClass] = useState<CharacterClass>("wizard");
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(DEFAULT_AVATAR);
  const [saving, setSaving] = useState(false);

  function handleClassSelect(cls: CharacterClass) {
    setSelectedClass(cls);
    setStep("appearance");
  }

  function handleAvatarChange(changes: Partial<AvatarConfig>) {
    setAvatarConfig((prev) => ({ ...prev, ...changes }));
  }

  async function handleConfirm() {
    if (!profile?.id) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        character_class: selectedClass,
        avatar_config: avatarConfig,
        wizard_rank: "apprentice",
      })
      .eq("id", profile.id);

    setSaving(false);

    if (error) {
      Alert.alert("Feil", "Kunne ikke lagre karakteren. Prov igjen.");
      return;
    }

    router.replace("/(tabs)");
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      {/* Progress dots */}
      <View className="flex-row justify-center gap-2 pt-4 pb-2">
        {(["class", "appearance", "confirm"] as const).map((s, i) => (
          <View
            key={s}
            className={`w-3 h-3 rounded-full ${
              step === s
                ? "bg-primary-500"
                : (["class", "appearance", "confirm"].indexOf(step) > i)
                ? "bg-primary-500/50"
                : "bg-dark-100"
            }`}
          />
        ))}
      </View>

      {/* ── STEP 1: Class ── */}
      {step === "class" && (
        <View className="flex-1 px-5 pt-4">
          <Text className="font-pixel text-lg text-white text-center mb-1">
            Lag din helt
          </Text>
          <Text className="text-white/30 text-center mb-6 text-sm">
            Steg 1: Velg klasse
          </Text>
          <ClassPicker
            currentClass={selectedClass}
            onSelect={handleClassSelect}
          />
        </View>
      )}

      {/* ── STEP 2: Appearance ── */}
      {step === "appearance" && (
        <View className="flex-1">
          <View className="px-5 pt-4 pb-2">
            <Text className="font-pixel text-lg text-white text-center mb-1">
              Tilpass utseende
            </Text>
            <Text className="text-white/30 text-center text-sm">
              Steg 2: Velg hudfarge, har og stil
            </Text>
          </View>
          <AvatarEditor
            config={avatarConfig}
            characterClass={selectedClass}
            level={1}
            onChange={handleAvatarChange}
          />
          <View className="px-5 pb-6 flex-row gap-3">
            <TouchableOpacity
              className="flex-1 rounded-lg bg-dark-100 border-2 border-dark-50 py-4"
              onPress={() => setStep("class")}
            >
              <Text className="text-center font-bold text-white/30">
                Tilbake
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 rounded-lg bg-primary-500 border-2 border-primary-700 py-4"
              onPress={() => setStep("confirm")}
            >
              <Text className="text-center font-pixel text-xs text-white">
                Neste
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── STEP 3: Confirm ── */}
      {step === "confirm" && (
        <View className="flex-1 items-center justify-center px-5">
          <Text className="font-pixel text-lg text-white mb-6">
            Din helt er klar!
          </Text>
          <CharacterRenderer
            config={avatarConfig}
            characterClass={selectedClass}
            level={1}
            size="xl"
            showClass
            showLevel
          />
          <Text className="text-white/30 text-center mt-6 mb-8 text-sm">
            Du kan endre alt dette seinere under Helten-fanen
          </Text>
          <View className="w-full flex-row gap-3">
            <TouchableOpacity
              className="flex-1 rounded-lg bg-dark-100 border-2 border-dark-50 py-4"
              onPress={() => setStep("appearance")}
            >
              <Text className="text-center font-bold text-white/30">
                Tilbake
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 rounded-lg bg-primary-500 border-2 border-primary-700 py-4"
              onPress={handleConfirm}
              disabled={saving}
            >
              <Text className="text-center font-pixel text-xs text-white">
                {saving ? "Lagrer..." : "Start eventyret!"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
