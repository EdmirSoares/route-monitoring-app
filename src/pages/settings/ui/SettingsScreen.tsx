import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
} from "react-native";
import { Text } from "@/src/shared/ui/Text/Text";
import { BrandDetail } from "@/src/shared/ui/BrandDetail/BrandDetail";
import { ConfirmModal } from "@/src/shared/ui/ConfirmModal/ConfirmModal";
import { useSettingsScreen } from "../model/useSettingsScreen";
import ConnectionIcon from "@/src/shared/assets/icons/connection_icon.svg";
import ArrowIcon from "@/src/shared/assets/icons/arrow_icon.svg";
import { transform } from "zod";

export function SettingsScreen() {
  const {
    theme,
    name,
    network,
    isConnected,
    connectionLabel,
    connectionColor,
    networkTypeLabel,
    unsentCount,
    syncing,
    syncCardTitle,
    syncBtnBg,
    exitModalVisible,
    setExitModalVisible,
    handleSync,
    handleExitConfirm,
    goBack,
  } = useSettingsScreen();

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

      <View style={[styles.container, { gap: theme.spacing[2] }]}>
        <View style={[styles.header, { paddingBottom: theme.spacing[10] }]}>
          <View style={[{ gap: theme.spacing[8] }]}>
            <Pressable onPress={goBack}>
              <ArrowIcon width={24} height={19} style={{ transform: [{ rotate: "180deg" }] }} />
            </Pressable>

            <View style={styles.greeting}>
              <Text weight="extraLight" style={[styles.greetingOla, { color: theme.colors.primary.default }]}>
                OLÁ
                <Text weight="extraLight" style={[styles.greetingComma, { color: theme.colors.primary.default }]}>
                  ,
                </Text>
              </Text>
              <Text weight="medium" style={[styles.greetingName, { color: theme.colors.text.white }]}>
                {name || "Usuário"}
              </Text>
            </View>
          </View>
          <View style={styles.headerBrandDetail}>
            <BrandDetail size={106} />
          </View>
        </View>

        <View style={styles.topRow}>
          <Pressable
            style={[styles.exitBtn, { backgroundColor: theme.colors.surfaceMuted }]}
            onPress={() => setExitModalVisible(true)}
          >
            <View style={styles.exitContent}>
              <Text weight="medium" style={[styles.exitText, { color: theme.colors.text.white }]}>
                EXIT
              </Text>
              <ArrowIcon width={24} height={19} />
            </View>
          </Pressable>

          <View style={[styles.versionBtn, { borderColor: theme.colors.primary.default }]}>
            <Text weight="medium" style={[styles.versionLabel, { color: theme.colors.text.white }]}>
              App version
            </Text>
            <Text weight="medium" style={[styles.versionValue, { color: theme.colors.text.white }]}>
              1.0.0
            </Text>
          </View>
        </View>

        <View style={[styles.syncCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.syncLeft}>
            <Text weight="bold" style={[styles.syncTitle, { color: theme.colors.text.primary }]}>
              {syncCardTitle}
            </Text>

            <Pressable
              style={[styles.syncBtn, { backgroundColor: syncBtnBg }]}
              onPress={handleSync}
              disabled={!isConnected || unsentCount === 0 || syncing}
            >
              <Text weight="medium" style={[styles.syncBtnText, { color: theme.colors.text.primary }]}>
                {syncing ? "SYNCING..." : "SYNC"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.syncRight}>
            <Text weight="medium" style={[styles.syncCount, { color: theme.colors.text.white }]}>
              {`${unsentCount} new`}
            </Text>
            <Text weight="medium" style={[styles.syncCountSub, { color: theme.colors.text.white }]}>
              locations
            </Text>
            <View style={[styles.syncDivider, { backgroundColor: theme.colors.primary.default }]} />
          </View>
        </View>

        <View style={[styles.connectionCard, { backgroundColor: theme.colors.surfaceAlt }]}>

          <ConnectionIcon width={166} height={166} style={styles.connectionIcon} />


          <View style={styles.connectionText}>
            <Text weight="medium" style={[styles.connectionLabel, { color: theme.colors.text.white }]}>
              Connection
            </Text>
            <Text weight="bold" style={[styles.connectionStatus, { color: connectionColor }]}>
              {connectionLabel}
            </Text>
            {network.type !== "unknown" && (
              <Text style={[styles.networkType, { color: theme.colors.text.subtle }]}>
                {networkTypeLabel}
              </Text>
            )}
          </View>
        </View>
      </View>

      <ConfirmModal
        visible={exitModalVisible}
        title={"Exit\nnow?"}
        onClose={() => setExitModalVisible(false)}
        onConfirm={handleExitConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "blue",
  },
  container: {
    paddingHorizontal: 8,
    flex: 1,
    justifyContent: "flex-end",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingLeft: 25,
    paddingTop: 60,
    marginBottom: 0,
  },
  greeting: {
    width: '100%'
  },
  greetingOla: {
    fontSize: 34,
    letterSpacing: 1.02,
    textTransform: "uppercase",
  },
  greetingComma: {
    fontSize: 19,
  },
  greetingName: {
    fontSize: 28,
    letterSpacing: 0.84,
    textTransform: "capitalize",
  },
  headerBrandDetail: {
    opacity: 0.9,
  },
  topRow: {
    flexDirection: "row",
    gap: 11,
    alignItems: "center",
  },
  exitBtn: {
    borderRadius: 18,
    width: 171,
    height: 118,
    alignItems: "center",
    justifyContent: "center",
  },
  exitContent: {
    alignItems: "center",
    gap: 9,
  },
  exitText: {
    fontSize: 17,
    letterSpacing: 0.51,
  },
  exitArrow: {
    fontSize: 20,
  },
  versionBtn: {
    flex: 1,
    height: 118,
    borderWidth: 1,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  versionLabel: {
    fontSize: 17,
    letterSpacing: 0.51,
    textAlign: "center",
  },
  versionValue: {
    fontSize: 17,
    letterSpacing: 0.51,
    textAlign: "center",
  },
  syncCard: {
    borderRadius: 18,
    height: 337,
    paddingHorizontal: 25,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  syncLeft: {
    flex: 1,
    gap: 77,
    justifyContent: "space-between",
  },
  syncTitle: {
    fontSize: 40,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    lineHeight: 44,
  },
  syncBtn: {
    borderRadius: 18,
    height: 70,
    width: 190,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  syncBtnText: {
    fontSize: 17,
    letterSpacing: 0.51,
  },
  syncRight: {
    width: 90,
    alignItems: "center",
    position: "absolute",
    right: 25,
    bottom: 0,
    gap: 4,
  },
  syncCount: {
    fontSize: 17,
    letterSpacing: 0.51,
    textAlign: "center",
  },
  syncCountSub: {
    fontSize: 17,
    letterSpacing: 0.51,
    textAlign: "center",
  },
  syncDivider: {
    width: 1,
    height: 169,
    marginTop: 15,
    alignSelf: "center",
  },
  connectionCard: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    height: 193,
    paddingHorizontal: 25,
    paddingVertical: 28,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "flex-end",
  },
  connectionIcon: {
    position: "absolute",
    left: -20,
    bottom: -20,
    opacity: 0.5,
    transform: [{ rotate: "26deg" }],
  },
  connectionText: {
    alignItems: "flex-end",
    flex: 1,
    gap: 2,
  },
  connectionLabel: {
    fontSize: 17,
    letterSpacing: 0.51,
    textAlign: "right",
  },
  connectionStatus: {
    fontSize: 40,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    textAlign: "right",
    lineHeight: 44,
  },
  networkType: {
    fontSize: 12,
    letterSpacing: 0.36,
    textAlign: "right",
  },
});
