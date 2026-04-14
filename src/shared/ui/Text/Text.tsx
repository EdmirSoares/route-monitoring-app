import { Text as RNText, type TextProps as RNTextProps, StyleSheet } from "react-native";
import { useTheme } from "@/src/shared/lib/useTheme";
import type { typography } from "@/src/shared/config/theme";

type FontWeight = keyof typeof typography.fontFamily;
type FontSize = keyof typeof typography.fontSize;

type TextProps = RNTextProps & {
  weight?: FontWeight;
  size?: FontSize;
};

export function Text({ weight = "regular", size = "base", style, ...props }: TextProps) {
  const theme = useTheme();

  return (
    <RNText
      style={[
        {
          fontFamily: theme.typography.fontFamily[weight],
          fontSize: theme.typography.fontSize[size],
          color: theme.colors.text.primary,
        },
        style,
      ]}
      {...props}
    />
  );
}
