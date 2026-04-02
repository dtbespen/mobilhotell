import { View, Text } from "react-native";

interface HPBarProps {
  hp: number;
  maxHp: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function HPBar({
  hp,
  maxHp,
  showLabel = true,
  size = "md",
}: HPBarProps) {
  const pct = Math.max(Math.min((hp / maxHp) * 100, 100), 0);

  const heightClass = size === "sm" ? "h-2" : size === "lg" ? "h-6" : "h-4";
  const barColor =
    pct > 50 ? "bg-danger-500" : pct > 25 ? "bg-accent-500" : "bg-danger-700";

  return (
    <View className="w-full">
      {showLabel && (
        <View className="flex-row justify-between mb-1">
          <Text className="font-pixel text-[10px] text-danger-400">HP</Text>
          <Text className="font-pixel text-[10px] text-white/60">
            {hp} / {maxHp}
          </Text>
        </View>
      )}
      <View
        className={`${heightClass} w-full bg-dark-100 rounded-sm border border-danger-700/30 overflow-hidden`}
      >
        <View
          className={`h-full ${barColor} rounded-sm`}
          style={{ width: `${pct}%` }}
        />
      </View>
    </View>
  );
}
