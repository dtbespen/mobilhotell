import { View, type ViewProps } from "react-native";

type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

interface RarityBorderProps extends ViewProps {
  rarity: Rarity;
}

const rarityStyles: Record<Rarity, string> = {
  common: "border-rarity-common/30",
  uncommon: "border-rarity-uncommon/40",
  rare: "border-rarity-rare/50",
  epic: "border-rarity-epic/60",
  legendary: "border-rarity-legendary/70",
};

export function RarityBorder({
  rarity,
  className = "",
  children,
  ...props
}: RarityBorderProps) {
  return (
    <View
      className={`border-2 rounded-lg ${rarityStyles[rarity]} ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
