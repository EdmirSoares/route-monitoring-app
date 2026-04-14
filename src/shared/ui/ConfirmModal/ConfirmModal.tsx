import { Modal, View, StyleSheet, Pressable } from "react-native";
import { Text } from "@/src/shared/ui/Text/Text";
import { useTheme } from "@/src/shared/lib/useTheme";

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  closeLabel?: string;
  confirmLabel?: string;
};

export function ConfirmModal({
  visible,
  title,
  onClose,
  onConfirm,
  closeLabel = "CLOSE",
  confirmLabel = "CONFIRM",
}: ConfirmModalProps) {
  const theme = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={[styles.backdrop, { backgroundColor: theme.colors.overlayDim }]} onPress={onClose}>
        <Pressable style={[styles.card, { backgroundColor: theme.colors.surface }]} onPress={() => { }}>
          <Text weight="bold" style={[styles.title, { color: theme.colors.text.primary }]}>
            {title}
          </Text>

          <View style={styles.buttons}>
            <Pressable
              style={({ pressed }) => [
                styles.closeBtn,
                { backgroundColor: theme.colors.surfaceAlt, opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={onClose}
            >
              <Text weight="medium" style={[styles.btnText, { color: theme.colors.text.primary }]}>
                {closeLabel}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.confirmBtn,
                { backgroundColor: theme.colors.primary.default, opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={onConfirm}
            >
              <Text weight="medium" style={[styles.btnText, { color: theme.colors.text.primary }]}>
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 24,
  },
  card: {
    borderRadius: 18,
    paddingHorizontal: 26,
    paddingTop: 46,
    paddingBottom: 48,
    gap: 77,
    width: "100%",
  },
  title: {
    fontSize: 40,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    lineHeight: 44,
  },
  buttons: {
    flexDirection: "row",
    gap: 13,
    alignItems: "center",
  },
  closeBtn: {
    height: 70,
    width: 132,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    paddingHorizontal: 20,
  },
  confirmBtn: {
    flex: 1,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    paddingHorizontal: 20,
  },
  btnText: {
    fontSize: 17,
    letterSpacing: 0.51,
  },
});
