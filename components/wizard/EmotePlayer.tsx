import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from "react-native-reanimated";
import { getEmoteBySlug } from "@/lib/emotes";

interface EmotePlayerProps {
  emoteSlug: string;
  onComplete?: () => void;
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = {
  sm: { fontSize: 24, container: 40 },
  md: { fontSize: 36, container: 56 },
  lg: { fontSize: 52, container: 72 },
};

export function EmotePlayer({ emoteSlug, onComplete, size = "md" }: EmotePlayerProps) {
  const emote = getEmoteBySlug(emoteSlug);
  const s = SIZE_MAP[size];

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.3, { duration: 200 }),
      withTiming(1.0, { duration: 150 })
    );
    opacity.value = withTiming(1, { duration: 200 });
    rotation.value = withSequence(
      withTiming(-5, { duration: 100 }),
      withTiming(5, { duration: 200 }),
      withTiming(-3, { duration: 150 }),
      withTiming(0, { duration: 100 })
    );

    const duration = emote?.duration ?? 1500;
    opacity.value = withDelay(
      duration - 400,
      withTiming(0, { duration: 400 }, (finished) => {
        if (finished && onComplete) {
          runOnJS(onComplete)();
        }
      })
    );
  }, [emoteSlug]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  if (!emote) return null;

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: s.container,
          height: s.container,
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      <Text style={{ fontSize: s.fontSize }}>{emote.icon}</Text>
    </Animated.View>
  );
}
