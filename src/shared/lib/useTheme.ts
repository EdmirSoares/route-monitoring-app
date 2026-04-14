import { useColorScheme } from "react-native";
import { darkTheme, lightTheme, spacing, radius, typography } from "../config/theme";

export type AppTheme = (typeof lightTheme | typeof darkTheme) & {
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  isDark: boolean;
};

export function useTheme(): AppTheme {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const base = isDark ? darkTheme : lightTheme;

  return { ...base, spacing, radius, typography, isDark };
}
