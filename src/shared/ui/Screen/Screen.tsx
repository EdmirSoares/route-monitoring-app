import { SafeAreaView, View, type ViewProps, StyleSheet } from "react-native";
import { useTheme } from "@/src/shared/lib/useTheme";

type ScreenProps = ViewProps & {
  safe?: boolean;
};

export function Screen({ safe = true, style, children, ...props }: ScreenProps) {
  const theme = useTheme();

  const content = (
    <View
      style={[styles.inner, { backgroundColor: theme.colors.background }, style]}
      {...props}
    >
      {children}
    </View>
  );

  if (safe) {
    return (
      <SafeAreaView style={[styles.flex, { backgroundColor: theme.colors.background }]}>
        {content}
      </SafeAreaView>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  inner: { flex: 1 },
});
