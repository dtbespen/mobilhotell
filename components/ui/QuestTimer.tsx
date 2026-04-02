import { View, Text } from "react-native";
import { estimateMana, getCategoryConfig } from "@/lib/manaEngine";
import type { ActivityCategory } from "@/lib/database.types";

interface QuestTimerProps {
  elapsed: number;
  pointsPerMinute: number;
  isActive: boolean;
  category?: ActivityCategory;
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
  isActive,
  category = "screen_free",
}: QuestTimerProps) {
  const minutes = Math.round(elapsed / 60);
  const earnedMana = estimateMana(minutes, category);
  const config = getCategoryConfig(category);

  const isPastSweet = minutes > config.sweetSpotMinutes;
  const isPastMax = minutes > config.maxEffectiveMinutes;

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
        <>
          <View className="flex-row items-center mt-3 bg-accent-500/10 border border-accent-500/20 rounded-md px-3 py-1.5">
            <Text className="font-pixel text-xs text-accent-400">
              +{earnedMana} Mana
            </Text>
          </View>

          {isPastMax ? (
            <Text className="text-[10px] text-danger-400 mt-2">
              {"\uD83D\uDCA1"} Du far veldig lite ekstra mana na. Prøv noe annet!
            </Text>
          ) : isPastSweet ? (
            <Text className="text-[10px] text-accent-400/60 mt-2">
              Mana-raten avtar. Sweet spot: {config.sweetSpotMinutes} min
            </Text>
          ) : null}
        </>
      )}
    </View>
  );
}
