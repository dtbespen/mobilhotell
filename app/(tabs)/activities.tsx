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
      Alert.alert("Bra jobba! 🎉", `Du fikk ${result.pointsEarned} poeng!`);
    }
  }

  async function handleManualLog() {
    if (!selectedType || !manualMinutes) return;
    const mins = parseInt(manualMinutes, 10);
    if (isNaN(mins) || mins <= 0) {
      Alert.alert("Feil", "Vennligst oppgi et gyldig antall minutter");
      return;
    }
    const result = await logManualActivity(selectedType, mins);
    if (result.error) {
      Alert.alert("Feil", result.error.message);
    } else {
      Alert.alert("Registrert! ✅", `Du fikk ${result.pointsEarned} poeng!`);
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

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="px-6 pt-4 pb-2">
          <Text className="text-2xl font-bold text-gray-900">Aktiviteter</Text>
          <Text className="mt-1 text-gray-500">
            Start en timer eller logg manuelt
          </Text>
        </View>

        {activeActivity && (
          <View className="mx-6 mt-4 rounded-2xl bg-green-50 border border-green-200 p-6">
            <View className="items-center">
              <View className="flex-row items-center gap-2 mb-2">
                <View className="h-3 w-3 rounded-full bg-green-500" />
                <Text className="text-sm font-medium text-green-700">
                  Pågår nå
                </Text>
              </View>
              <Text className="text-xl font-semibold text-green-900">
                {activeActivity.activity_type?.name}
              </Text>
              <Text className="mt-3 text-5xl font-bold text-green-800 font-mono">
                {formatTimer(elapsed)}
              </Text>
              <Text className="mt-2 text-sm text-green-600">
                ~{Math.round(elapsed / 60 * (activeActivity.activity_type?.points_per_minute ?? 1))} poeng så langt
              </Text>
            </View>
            <TouchableOpacity
              className="mt-6 rounded-xl bg-red-500 py-4"
              onPress={handleStop}
              activeOpacity={0.8}
            >
              <Text className="text-center text-lg font-semibold text-white">
                Stopp aktivitet
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!activeActivity && (
          <>
            <View className="mt-6 px-6">
              <Text className="mb-3 text-lg font-semibold text-gray-900">
                Start timer
              </Text>
              <View className="gap-3">
                {activityTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    className="flex-row items-center justify-between rounded-xl bg-white px-4 py-4 shadow-sm"
                    onPress={() => handleStart(type)}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center gap-3">
                      <Text className="text-2xl">
                        {CATEGORY_EMOJI[type.category] ?? "⭐"}
                      </Text>
                      <View>
                        <Text className="font-semibold text-gray-900">
                          {type.name}
                        </Text>
                        <Text className="text-xs text-gray-400">
                          {type.points_per_minute} poeng/min
                        </Text>
                      </View>
                    </View>
                    <View className="rounded-lg bg-primary-50 px-3 py-1.5">
                      <Text className="text-sm font-medium text-primary-700">
                        Start
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mt-8 px-6 pb-8">
              <Text className="mb-3 text-lg font-semibold text-gray-900">
                Logg manuelt
              </Text>
              <View className="gap-3">
                {activityTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    className="flex-row items-center justify-between rounded-xl bg-white px-4 py-4 shadow-sm"
                    onPress={() => {
                      setSelectedType(type);
                      setShowManual(true);
                    }}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center gap-3">
                      <Text className="text-2xl">
                        {CATEGORY_EMOJI[type.category] ?? "⭐"}
                      </Text>
                      <View>
                        <Text className="font-semibold text-gray-900">
                          {type.name}
                        </Text>
                        <Text className="text-xs text-gray-400">
                          {type.points_per_minute} poeng/min
                        </Text>
                      </View>
                    </View>
                    <View className="rounded-lg bg-gray-100 px-3 py-1.5">
                      <Text className="text-sm font-medium text-gray-600">
                        Legg til
                      </Text>
                    </View>
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
        <View className="flex-1 justify-end bg-black/40">
          <View className="rounded-t-3xl bg-white px-6 pb-10 pt-6">
            <Text className="text-xl font-bold text-gray-900">
              {selectedType?.name}
            </Text>
            <Text className="mt-1 text-gray-500">
              Hvor mange minutter varte aktiviteten?
            </Text>
            <TextInput
              className="mt-4 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-center text-2xl font-bold"
              placeholder="30"
              value={manualMinutes}
              onChangeText={setManualMinutes}
              keyboardType="number-pad"
              autoFocus
            />
            {manualMinutes && selectedType && (
              <Text className="mt-2 text-center text-sm text-primary-600">
                = {Math.round(parseInt(manualMinutes, 10) * selectedType.points_per_minute)} poeng
              </Text>
            )}
            <View className="mt-6 flex-row gap-3">
              <TouchableOpacity
                className="flex-1 rounded-xl border border-gray-300 py-3"
                onPress={() => {
                  setShowManual(false);
                  setManualMinutes("");
                }}
              >
                <Text className="text-center font-semibold text-gray-600">
                  Avbryt
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 rounded-xl bg-primary-600 py-3"
                onPress={handleManualLog}
              >
                <Text className="text-center font-semibold text-white">
                  Registrer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
