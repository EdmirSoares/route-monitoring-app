import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePathname } from "expo-router";
import { Text } from "@/src/shared/ui/Text/Text";
import { useToastStore } from "@/src/shared/store/toastStore";
import { useTheme } from "@/src/shared/lib/useTheme";

const AUTO_HIDE_MS = 3000;

export function Toast() {
  const theme = useTheme();
  const { visible, message, type, hide } = useToastStore();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-120)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (visible) hide();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();

      timerRef.current = setTimeout(() => {
        dismiss();
      }, AUTO_HIDE_MS);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, message]);

  const dismiss = () => {
    Animated.timing(slideAnim, {
      toValue: -120,
      duration: 220,
      useNativeDriver: true,
    }).start(() => hide());
  };

  const bgColor = {
    error: theme.colors.status.error,
    success: theme.colors.status.success,
    info: theme.colors.primary.default,
  }[type];

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { top: insets.top + 12, transform: [{ translateY: slideAnim }] },
      ]}
      pointerEvents="none"
    >
      <View style={[styles.pill, { backgroundColor: bgColor }]}>
        <Text weight="medium" style={styles.text}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: "center",
    pointerEvents: "none",
  },
  pill: {
    borderRadius: 99,
    paddingHorizontal: 20,
    paddingVertical: 12,
    maxWidth: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  text: {
    color: "#ffffff",
    fontSize: 15,
    letterSpacing: 0.3,
    textAlign: "center",
  },
});
