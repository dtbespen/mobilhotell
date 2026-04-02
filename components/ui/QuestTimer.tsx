import { View, Text } from "react-native";

interface QuestTimerProps {
  elapsed: number;
  pointsPerMinute: number;
  isActive: boolean;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");

  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

export function QuestTimer({
  elapsed,
  pointsPerMinute,
  isActive,
}: QuestTimerProps) {
  const earnedMana = Math.floor((elapsed / 60) * pointsPerMinute);

  return (
    <View className="items-center py-6">
      <Text
        className={`font-pixel text-[32px] tracking-wider ${
          isActive ? "text-primary-400" : "text-white/40"
        }`}
      >
        {formatTime(elapsed)}
      </Text>

      {isActive && (
        <View className="flex-row items-center mt-3 bg-accent-500/10 border border-accent-500/20 rounded-md px-3 py-1.5">
          <Text className="font-pixel text-xs text-accent-400">
            +{earnedMana} Mana
          </Text>
        </View>
      )}
    </View>
  );
}
