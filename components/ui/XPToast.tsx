import { useEffect } from "react";
import { Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
} from "react-native-reanimated";

interface XPToastProps {
  amount: number;
  type?: "mana" | "damage" | "xp";
  onComplete?: () => void;
}

const typeConfig = {
  mana: { prefix: "+", suffix: " Mana", color: "text-primary-400" },
  damage: { prefix: "", suffix: " dmg", color: "text-danger-400" },
  xp: { prefix: "+", suffix: " XP", color: "text-accent-400" },
};

export function XPToast({ amount, type = "mana", onComplete }: XPToastProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);

  const config = typeConfig[type];

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 200 });
    translateY.value = withTiming(-40, { duration: 1200 });
    opacity.value = withDelay(
      800,
      withTiming(0, { duration: 400 }, (finished) => {
        if (finished && onComplete) {
          runOnJS(onComplete)();
        }
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className="absolute self-center top-0 z-50"
    >
      <Text className={`font-pixel text-base ${config.color}`}>
        {config.prefix}
        {amount}
        {config.suffix}
      </Text>
    </Animated.View>
  );
}
