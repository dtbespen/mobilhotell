import { View, Text } from "react-native";

type StatColor = "primary" | "accent" | "danger" | "info";

interface StatBadgeProps {
  icon: string;
  value: string | number;
  label?: string;
  color?: StatColor;
}

const colorMap: Record<StatColor, { bg: string; text: string; border: string }> = {
  primary: {
    bg: "bg-primary-500/10",
    text: "text-primary-400",
    border: "border-primary-500/20",
  },
  accent: {
    bg: "bg-accent-500/10",
    text: "text-accent-400",
    border: "border-accent-500/20",
  },
  danger: {
    bg: "bg-danger-500/10",
    text: "text-danger-400",
    border: "border-danger-500/20",
  },
  info: {
    bg: "bg-info-500/10",
    text: "text-info-400",
    border: "border-info-500/20",
  },
};

export function StatBadge({
  icon,
  value,
  label,
  color = "primary",
}: StatBadgeProps) {
  const c = colorMap[color];

  return (
    <View className={`${c.bg} ${c.border} border rounded-lg px-3 py-2 items-center`}>
      <Text className="text-lg mb-1">{icon}</Text>
      <Text className={`font-pixel text-sm ${c.text}`}>{value}</Text>
      {label && (
        <Text className="text-[11px] text-white/40 mt-0.5">{label}</Text>
      )}
    </View>
  );
}
