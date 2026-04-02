import { View, type ViewProps } from "react-native";

type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

interface PixelCardProps extends ViewProps {
  variant?: "default" | "glow" | "rarity";
  rarity?: Rarity;
}

const rarityBorderColor: Record<Rarity, string> = {
  common: "border-rarity-common/30",
  uncommon: "border-rarity-uncommon/40",
  rare: "border-rarity-rare/50",
  epic: "border-rarity-epic/50",
  legendary: "border-rarity-legendary/60",
};

export function PixelCard({
  variant = "default",
  rarity = "common",
  className = "",
  children,
  ...props
}: PixelCardProps) {
  const base = "bg-dark-200 rounded-lg border-2 p-4";

  const variantClass =
    variant === "glow"
      ? "border-primary-500/30"
      : variant === "rarity"
        ? rarityBorderColor[rarity]
        : "border-dark-50";

  return (
    <View className={`${base} ${variantClass} ${className}`} {...props}>
      {children}
    </View>
  );
}
