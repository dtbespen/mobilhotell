import { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from "react-native-reanimated";

interface LevelUpAnimationProps {
  level: number;
  onComplete?: () => void;
}

export function LevelUpAnimation({ level, onComplete }: LevelUpAnimationProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const starScale = useSharedValue(0);
  const labelOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.5, { duration: 300 }),
      withTiming(1.0, { duration: 200 })
    );
    opacity.value = withTiming(1, { duration: 200 });

    starScale.value = withDelay(200, withSequence(
      withTiming(1.3, { duration: 200 }),
      withTiming(1.0, { duration: 150 })
    ));

    labelOpacity.value = withDelay(400, withTiming(1, { duration: 300 }));

    opacity.value = withDelay(
      2000,
      withTiming(0, { duration: 500 }, (finished) => {
        if (finished && onComplete) {
          runOnJS(onComplete)();
        }
      })
    );
  }, [level]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const numberStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const starStyle = useAnimatedStyle(() => ({
    transform: [{ scale: starScale.value }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
  }));

  return (
    <Animated.View
      style={containerStyle}
      className="absolute inset-0 items-center justify-center z-50 bg-dark-300/80"
    >
      <Animated.View style={starStyle}>
        <Text className="text-5xl">{"\u2B50"}</Text>
      </Animated.View>

      <Animated.View style={numberStyle} className="mt-2">
        <Text className="font-pixel text-4xl text-accent-400">
          {level}
        </Text>
      </Animated.View>

      <Animated.View style={labelStyle} className="mt-3">
        <Text className="font-pixel text-sm text-white">
          LEVEL UP!
        </Text>
      </Animated.View>
    </Animated.View>
  );
}
