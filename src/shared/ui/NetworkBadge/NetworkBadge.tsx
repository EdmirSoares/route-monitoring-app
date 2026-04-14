import { View, StyleSheet } from "react-native";
import { Text } from "../Text/Text";
import { useTheme } from "@/src/shared/lib/useTheme";
import { useNetworkStatus } from "@/src/shared/lib/useNetworkStatus";

export function NetworkBadge() {
  const theme = useTheme();
  const { isConnected, type, cellularGeneration } = useNetworkStatus();

  const label = isConnected
    ? type === "cellular"
      ? `${cellularGeneration ?? "cellular"}`
      : type
    : "offline";

  const bg = isConnected
    ? theme.colors.status.success
    : theme.colors.status.error;

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text weight="semiBold" size="xs" style={{ color: theme.colors.text.white }}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    alignSelf: "flex-start",
  },
});
