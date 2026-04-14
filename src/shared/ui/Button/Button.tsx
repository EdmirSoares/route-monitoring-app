import { Pressable, type PressableProps, ActivityIndicator } from "react-native";
import { Text } from "../Text/Text";
import { useTheme } from "@/src/shared/lib/useTheme";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = PressableProps & {
  label: string;
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
};

export function Button({
  label,
  variant = "primary",
  loading = false,
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const bgColor: Record<Variant, string> = {
    primary: theme.colors.primary.default,
    secondary: theme.colors.surface,
    ghost: "transparent",
    danger: theme.colors.status.error,
  };

  const textColor: Record<Variant, string> = {
    primary: theme.colors.text.inverse,
    secondary: theme.colors.text.primary,
    ghost: theme.colors.primary.default,
    danger: theme.colors.text.inverse,
  };

  return (
    <Pressable
      disabled={isDisabled}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 48,
        backgroundColor: bgColor[variant],
        borderWidth: variant === "secondary" ? 1 : 0,
        borderColor: theme.colors.border,
        opacity: pressed || isDisabled ? 0.7 : 1,
        alignSelf: fullWidth ? ("stretch" as const) : ("center" as const),
        paddingVertical: theme.spacing[3],
        paddingHorizontal: theme.spacing[5],
        borderRadius: theme.radius.md,
      })}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColor[variant]} />
      ) : (
        <Text
          weight="semiBold"
          size="base"
          style={{ color: textColor[variant] }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

