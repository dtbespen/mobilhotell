import { Text } from "react-native";

type CharacterClass = "wizard" | "knight" | "druid" | "rogue";

interface ClassIconProps {
  characterClass: CharacterClass;
  size?: "sm" | "md" | "lg";
}

const classEmoji: Record<CharacterClass, string> = {
  wizard: "\u{1F9D9}",
  knight: "\u{2694}\u{FE0F}",
  druid: "\u{1F33F}",
  rogue: "\u{1F5E1}\u{FE0F}",
};

const sizeMap = {
  sm: "text-base",
  md: "text-2xl",
  lg: "text-4xl",
};

export function ClassIcon({ characterClass, size = "md" }: ClassIconProps) {
  return (
    <Text className={sizeMap[size]}>
      {classEmoji[characterClass]}
    </Text>
  );
}
