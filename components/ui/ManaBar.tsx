import { View, Text } from "react-native";

interface ManaBarProps {
  current: number;
  max: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ManaBar({
  current,
  max,
  showLabel = true,
  size = "md",
}: ManaBarProps) {
  const pct = Math.min((current / max) * 100, 100);

  const heightClass = size === "sm" ? "h-2" : size === "lg" ? "h-5" : "h-3";

  return (
    <View className="w-full">
      {showLabel && (
        <View className="flex-row justify-between mb-1">
          <Text className="font-pixel text-[10px] text-primary-400">MANA</Text>
          <Text className="font-pixel text-[10px] text-white/60">
            {current} / {max}
          </Text>
        </View>
      )}
      <View
        className={`${heightClass} w-full bg-dark-100 rounded-sm border border-dark-50 overflow-hidden`}
      >
        <View
          className="h-full bg-primary-500 rounded-sm"
          style={{ width: `${pct}%` }}
        />
      </View>
    </View>
  );
}
