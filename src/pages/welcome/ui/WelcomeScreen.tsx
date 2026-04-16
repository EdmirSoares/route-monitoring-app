import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Controller } from "react-hook-form";
import { Text } from "@/src/shared/ui/Text/Text";
import { BrandDetail } from "@/src/shared/ui/BrandDetail/BrandDetail";
import { useWelcomeScreen } from "../model/useWelcomeScreen";

export function WelcomeScreen() {
  const { control, errors, handleContinue, theme } = useWelcomeScreen();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.logoArea}>
          <View style={styles.brandDetailWrap}>
            <BrandDetail size={112} />
          </View>
        </View>

        <View
          style={[styles.borderDecoration, { borderColor: theme.colors.primary.default }]}
          pointerEvents="none"
        />

        <View style={[styles.card, { backgroundColor: theme.colors.surface, paddingBottom: Math.max(insets.bottom, 18) }]}>
          <Text
            weight="bold"
            style={[styles.welcomeText, { color: theme.colors.text.primary }]}
            numberOfLines={2}
          >
            {"WEL\nCOME"}
          </Text>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  { borderColor: errors.name ? theme.colors.error : theme.colors.primary.default, color: theme.colors.text.white },
                ]}
                placeholder="First name"
                placeholderTextColor={theme.colors.text.subtle}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                returnKeyType="done"
                onSubmitEditing={handleContinue}
              />
            )}
          />

          <View style={styles.buttonRow}>
            <Pressable
              onPress={handleContinue}
              style={({ pressed }) => [
                styles.continueBtn,
                { backgroundColor: theme.colors.primary.default, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text weight="medium" style={[styles.continueBtnText, { color: theme.colors.text.primary }]}>
                CONTINUE
              </Text>
            </Pressable>
          </View>

          <Text style={[styles.versionText, { color: theme.colors.text.subtle }]}>v 1.0.0</Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  kav: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 8,
  },
  logoArea: {
    paddingBottom: 38,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  brandDetailWrap: {
    marginTop: 80,
    marginLeft: 8,
  },
  borderDecoration: {
    position: "absolute",
    top: 120,
    left: 23,
    right: 23,
    bottom: 0,
    borderWidth: 1,
    borderRadius: 18,
    pointerEvents: "none",
  },
  card: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 25,
    paddingTop: 58,
    gap: 62,
  },
  welcomeText: {
    fontSize: 65,
    letterSpacing: 1.95,
    textTransform: "uppercase",
    lineHeight: 72,
  },
  input: {
    borderWidth: 1,
    borderRadius: 18,
    borderBottomRightRadius: 0,
    paddingHorizontal: 25,
    paddingVertical: 20,
    fontSize: 17,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.51,
    height: 65,
  },
  buttonRow: {
    alignItems: "flex-end",
  },
  continueBtn: {
    borderRadius: 18,
    height: 65,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 63,
  },
  continueBtnText: {
    fontSize: 17,
    letterSpacing: 0.51,
  },
  versionText: {
    fontSize: 12,
    letterSpacing: 0.36,
    textAlign: "left",
  },
});
