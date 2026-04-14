import { Pressable, type PressableProps, StyleSheet, View, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { useTheme } from "@/src/shared/lib/useTheme";

type ToggleProps = Omit<PressableProps, "onPress"> & {
  isActive: boolean;
  onPress: () => void;
  size?: number;
};

export function Toggle({ isActive, onPress, size = 64, ...props }: ToggleProps) {
  const theme = useTheme();
  const anim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: isActive ? 1 : 0,
      useNativeDriver: false,
      tension: 60,
      friction: 8,
    }).start();
  }, [isActive, anim]);

  const trackWidth = size * 1.75;
  const thumbSize = size - 8;
  const thumbTranslate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, trackWidth - thumbSize - 4],
  });
  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.surfaceAlt, theme.colors.primary.default],
  });

  return (
    <Pressable onPress={onPress} {...props}>
      <Animated.View
        style={[
          styles.track,
          {
            width: trackWidth,
            height: size,
            borderRadius: size / 2,
            backgroundColor: trackColor,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              transform: [{ translateX: thumbTranslate }],
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    justifyContent: "center",
  },
  thumb: {
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
