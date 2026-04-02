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
import type { ActivityType } from "@/lib/database.types";
import { PixelCard } from "@/components/ui/PixelCard";
import { QuestTimer } from "@/components/ui/QuestTimer";

const CATEGORY_EMOJI: Record<string, string> = {
  screen_free: "\u{1F4F5}",
  reading: "\u{1F4DA}",
  creating: "\u{1F3A8}",
  custom: "\u2B50",
};

export default function QuestBoardScreen() {
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
      Alert.alert(
        "Quest fullf\u00f8rt! \u2728",
        `+${result.pointsEarned} Mana! Magien din vokser.`
      );
    }
  }

  async function handleManualLog() {
    if (!selectedType || !manualMinutes) return;
    const mins = parseInt(manualMinutes, 10);
    if (isNaN(mins) || mins <= 0) {
      Alert.alert("Hm", "Skriv inn antall minutter");
      return;
    }
    const result = await logManualActivity(selectedType, mins);
    if (result.error) {
      Alert.alert("Feil", result.error.message);
    } else {
      Alert.alert(
        "Quest registrert! \u{1FA84}",
        `+${result.pointsEarned} Mana!`
      );
    }
    setShowManual(false);
    setSelectedType(null);
    setManualMinutes("");
  }

  const currentMana = Math.round(
    (elapsed / 60) * (activeActivity?.activity_type?.points_per_minute ?? 1)
  );

  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      <ScrollView className="flex-1">
        {/* Active quest timer */}
        {activeActivity && (
          <PixelCard variant="glow" className="mx-5 mt-4 border-primary-500/30">
            <View className="flex-row items-center gap-2 mb-1">
              <View className="h-2.5 w-2.5 rounded-full bg-primary-400" />
              <Text className="font-pixel text-[10px] text-primary-400 uppercase">
                Quest aktiv
              </Text>
            </View>
            <Text className="text-base font-bold text-white">
              {activeActivity.activity_type?.name}
            </Text>

            <QuestTimer
              elapsed={elapsed}
              pointsPerMinute={
                activeActivity.activity_type?.points_per_minute ?? 1
              }
              isActive={true}
            />

            <TouchableOpacity
              className="rounded-lg bg-danger-500 py-4 border-2 border-danger-700"
              onPress={handleStop}
              activeOpacity={0.85}
            >
              <Text className="text-center font-pixel text-sm text-white">
                Avslutt Quest
              </Text>
            </TouchableOpacity>
          </PixelCard>
        )}

        {/* Header */}
        {!activeActivity && (
          <View className="px-6 pt-4 pb-2">
            <Text className="font-pixel text-lg text-white">
              Quest Board
            </Text>
            <Text className="mt-1 text-sm text-white/25">
              Velg en quest og start timeren
            </Text>
          </View>
        )}

        {/* Quest types - Start timer */}
        {!activeActivity && (
          <>
            <View className="mt-4 px-5">
              <Text className="font-pixel text-[10px] text-white/20 uppercase tracking-wider mb-3">
                Start Quest
              </Text>
              <View className="gap-3">
                {activityTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    onPress={() => handleStart(type)}
                    activeOpacity={0.7}
                  >
                    <PixelCard className="flex-row items-center">
                      <Text className="text-2xl mr-4">
                        {CATEGORY_EMOJI[type.category] ?? "\u2B50"}
                      </Text>
                      <View className="flex-1">
                        <Text className="text-base font-bold text-white">
                          {type.name}
                        </Text>
                        <Text className="text-sm text-accent-400">
                          {type.points_per_minute} Mana/min
                        </Text>
                      </View>
                      <View className="rounded-md bg-primary-500/15 px-4 py-2 border border-primary-500/20">
                        <Text className="font-pixel text-xs text-primary-400">
                          Go!
                        </Text>
                      </View>
                    </PixelCard>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mt-8 px-5 pb-10">
              <Text className="font-pixel text-[10px] text-white/20 uppercase tracking-wider mb-3">
                Logg quest i etterkant
              </Text>
              <View className="gap-3">
                {activityTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    onPress={() => {
                      setSelectedType(type);
                      setShowManual(true);
                    }}
                    activeOpacity={0.7}
                  >
                    <PixelCard className="flex-row items-center py-3">
                      <Text className="text-xl mr-3">
                        {CATEGORY_EMOJI[type.category] ?? "\u2B50"}
                      </Text>
                      <View className="flex-1">
                        <Text className="font-semibold text-white">
                          {type.name}
                        </Text>
                        <Text className="text-xs text-white/20">
                          {type.points_per_minute} Mana/min
                        </Text>
                      </View>
                      <Text className="text-sm text-white/25">+ Logg</Text>
                    </PixelCard>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Manual log modal */}
      <Modal
        visible={showManual}
        animationType="slide"
        transparent
        onRequestClose={() => setShowManual(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="rounded-t-[24px] bg-dark-200 px-6 pb-10 pt-6 border-t-2 border-dark-50">
            <Text className="font-pixel text-sm text-white">
              {selectedType?.name}
            </Text>
            <Text className="mt-1 text-white/30 text-sm">
              Hvor mange minutter varte questen?
            </Text>
            <TextInput
              className="mt-4 rounded-lg bg-dark-100 border-2 border-dark-50 px-5 py-4 text-center text-3xl font-bold text-white"
              placeholder="30"
              placeholderTextColor="#555a62"
              value={manualMinutes}
              onChangeText={setManualMinutes}
              keyboardType="number-pad"
              autoFocus
            />
            {manualMinutes && selectedType && (
              <View className="mt-3 items-center">
                <View className="rounded-md bg-accent-500/15 border border-accent-500/20 px-4 py-2">
                  <Text className="font-pixel text-xs text-accent-400">
                    ={" "}
                    {Math.round(
                      parseInt(manualMinutes, 10) *
                        selectedType.points_per_minute
                    )}{" "}
                    Mana
                  </Text>
                </View>
              </View>
            )}
            <View className="mt-6 flex-row gap-3">
              <TouchableOpacity
                className="flex-1 rounded-lg bg-dark-100 border-2 border-dark-50 py-4"
                onPress={() => {
                  setShowManual(false);
                  setManualMinutes("");
                }}
              >
                <Text className="text-center font-bold text-white/30">
                  Avbryt
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 rounded-lg bg-primary-500 border-2 border-primary-700 py-4"
                onPress={handleManualLog}
              >
                <Text className="text-center font-pixel text-xs text-white">
                  Logg Quest
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
