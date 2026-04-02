import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useActivities } from "@/hooks/useActivities";
import { useActivityTypes } from "@/hooks/useActivityTypes";
import { formatDuration } from "@/lib/points";
import type { ActivityType } from "@/lib/database.types";

const CATEGORY_EMOJI: Record<string, string> = {
  screen_free: "📵",
  reading: "📚",
  creating: "🎨",
  custom: "⭐",
};

export default function ActivitiesScreen() {
  const { activeActivity, startActivity, stopActivity, logManualActivity } =
    useActivities();
  const { activityTypes } = useActivityTypes();
  const [elapsed, setElapsed] = useState(0);
  const [showManual, setShowManual] = useState(false);
  const [selectedType, setSelectedType] = useState<ActivityType | null>(null);
  const [manualMinutes, setManualMinutes] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (activeActivity) {
      const updateElapsed = () => {
        const start = new Date(activeActivity.started_at).getTime();
        setElapsed(Math.floor((Date.now() - start) / 1000));
      };
      updateElapsed();
      intervalRef.current = setInterval(updateElapsed, 1000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else {
      setElapsed(0);
    }
  }, [activeActivity]);

  async function handleStart(type: ActivityType) {
    const { error } = await startActivity(type);
    if (error) Alert.alert("Feil", error.message);
  }

  async function handleStop() {
    const result = await stopActivity();
    if (result.error) {
      Alert.alert("Feil", result.error.message);
    } else {
      Alert.alert("Bra jobba! 🎉", `Du fikk ${result.pointsEarned} Plugs! Helt sjukt bra.`);
    }
  }

  async function handleManualLog() {
    if (!selectedType || !manualMinutes) return;
    const mins = parseInt(manualMinutes, 10);
    if (isNaN(mins) || mins <= 0) {
      Alert.alert("Hm", "Skriv inn hvor mange minutter det varte");
      return;
    }
    const result = await logManualActivity(selectedType, mins);
    if (result.error) {
      Alert.alert("Feil", result.error.message);
    } else {
      Alert.alert("Registrert! 💪", `${result.pointsEarned} Plugs i lomma!`);
    }
    setShowManual(false);
    setSelectedType(null);
    setManualMinutes("");
  }

  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  };

  const currentPlugs = Math.round(
    (elapsed / 60) * (activeActivity?.activity_type?.points_per_minute ?? 1)
  );

  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      <ScrollView className="flex-1">
        {/* Active timer */}
        {activeActivity && (
          <View className="bg-primary-500/15 border-b border-primary-500/20 px-6 pt-8 pb-10">
            <View className="flex-row items-center gap-2 mb-3">
              <View className="h-3 w-3 rounded-full bg-primary-400" />
              <Text className="text-sm font-semibold text-primary-400 uppercase tracking-wider">
                Pågår nå
              </Text>
            </View>

            <Text className="text-lg font-bold text-white">
              {activeActivity.activity_type?.name}
            </Text>

            <Text className="mt-4 text-6xl font-bold text-primary-400 text-center" style={{ fontVariant: ["tabular-nums"] }}>
              {formatTimer(elapsed)}
            </Text>

            <View className="mt-4 items-center">
              <View className="rounded-2xl bg-accent-500/15 border border-accent-500/20 px-6 py-3">
                <Text className="text-xl font-bold text-accent-400">
                  ~{currentPlugs} Plugs 🔌
                </Text>
              </View>
            </View>

            <TouchableOpacity
              className="mt-6 rounded-2xl bg-danger-500 py-5"
              onPress={handleStop}
              activeOpacity={0.85}
            >
              <Text className="text-center text-lg font-bold text-white">
                Stopp og hent Plugs ✋
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Header */}
        {!activeActivity && (
          <View className="px-6 pt-4 pb-2">
            <Text className="text-2xl font-bold text-white">
              Hva gjør du? ⚡
            </Text>
            <Text className="mt-1 text-sm text-white/25">
              Velg aktivitet og start timeren
            </Text>
          </View>
        )}

        {/* Activity types */}
        {!activeActivity && (
          <>
            <View className="mt-4 px-6">
              <Text className="mb-3 text-sm font-bold text-white/20 uppercase tracking-wider">
                Start timer
              </Text>
              <View className="gap-3">
                {activityTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    className="flex-row items-center rounded-2xl bg-dark-100 px-5 py-5"
                    onPress={() => handleStart(type)}
                    activeOpacity={0.7}
                  >
                    <Text className="text-2xl mr-4">
                      {CATEGORY_EMOJI[type.category] ?? "⭐"}
                    </Text>
                    <View className="flex-1">
                      <Text className="text-base font-bold text-white">
                        {type.name}
                      </Text>
                      <Text className="text-sm text-accent-400 font-medium">
                        {type.points_per_minute} Plugs/min
                      </Text>
                    </View>
                    <View className="rounded-xl bg-primary-500/15 px-4 py-2">
                      <Text className="text-sm font-bold text-primary-400">Go!</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mt-8 px-6 pb-10">
              <Text className="mb-3 text-sm font-bold text-white/20 uppercase tracking-wider">
                Logg i etterkant
              </Text>
              <View className="gap-3">
                {activityTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    className="flex-row items-center rounded-2xl bg-dark-100 px-5 py-4"
                    onPress={() => {
                      setSelectedType(type);
                      setShowManual(true);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text className="text-xl mr-4">
                      {CATEGORY_EMOJI[type.category] ?? "⭐"}
                    </Text>
                    <View className="flex-1">
                      <Text className="font-semibold text-white">
                        {type.name}
                      </Text>
                      <Text className="text-xs text-white/20">
                        {type.points_per_minute} Plugs/min
                      </Text>
                    </View>
                    <Text className="text-sm font-medium text-white/25">
                      + Legg til
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <Modal
        visible={showManual}
        animationType="slide"
        transparent
        onRequestClose={() => setShowManual(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="rounded-t-[32px] bg-dark-200 px-8 pb-10 pt-8">
            <Text className="text-xl font-bold text-white">
              {selectedType?.name}
            </Text>
            <Text className="mt-1 text-white/30">
              Hvor mange minutter holdt du ut?
            </Text>
            <TextInput
              className="mt-6 rounded-2xl bg-dark-50 px-5 py-5 text-center text-4xl font-bold text-white"
              placeholder="30"
              placeholderTextColor="#555a62"
              value={manualMinutes}
              onChangeText={setManualMinutes}
              keyboardType="number-pad"
              autoFocus
            />
            {manualMinutes && selectedType && (
              <View className="mt-3 items-center">
                <View className="rounded-xl bg-accent-500/15 px-5 py-2">
                  <Text className="text-base font-bold text-accent-400">
                    = {Math.round(parseInt(manualMinutes, 10) * selectedType.points_per_minute)} Plugs 🔌
                  </Text>
                </View>
              </View>
            )}
            <View className="mt-8 flex-row gap-3">
              <TouchableOpacity
                className="flex-1 rounded-2xl bg-dark-50 py-4"
                onPress={() => { setShowManual(false); setManualMinutes(""); }}
              >
                <Text className="text-center font-bold text-white/30">Avbryt</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 rounded-2xl bg-primary-500 py-4"
                onPress={handleManualLog}
              >
                <Text className="text-center font-bold text-white">
                  Hent Plugs! 💰
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
