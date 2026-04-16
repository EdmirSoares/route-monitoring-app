import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useNetworkStatus } from "@/src/shared/lib/useNetworkStatus";
import { useUserName } from "@/src/shared/lib/useUserName";
import { useTheme } from "@/src/shared/lib/useTheme";
import { useToastStore } from "@/src/shared/store/toastStore";
import { countUnsentLocations, deleteAllLocations } from "@/src/entities/location";
import { syncLocations } from "@/src/features/tracking";

export function useSettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { name, deleteName } = useUserName();
  const network = useNetworkStatus();
  const showToast = useToastStore((s) => s.show);
  const [unsentCount, setUnsentCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [exitModalVisible, setExitModalVisible] = useState(false);

  const isConnected = network.isConnected;
  const connectionLabel = isConnected ? "STABLE" : "LOST";
  const connectionColor = isConnected
    ? theme.colors.text.primary
    : theme.colors.status.error;

  const networkTypeLabel =
    network.type === "cellular" && network.cellularGeneration
      ? network.cellularGeneration.toUpperCase()
      : network.type.toUpperCase();

  const syncCardTitle = unsentCount > 0 ? "waiting for sync" : "no data to sync";
  const syncBtnBg =
    unsentCount > 0 && isConnected
      ? theme.colors.primary.default
      : theme.colors.background;

  const loadUnsentCount = async () => {
    const count = await countUnsentLocations();
    setUnsentCount(count);
  };

  useEffect(() => {
    loadUnsentCount();
  }, []);

  const handleSync = async () => {
    if (!isConnected || unsentCount === 0 || syncing) return;
    try {
      setSyncing(true);
      await syncLocations();
      await loadUnsentCount();
      showToast("Locations synced successfully", "success");
    } catch {
      showToast("Sync failed. Try again.", "error");
    } finally {
      setSyncing(false);
    }
  };

  const handleExitConfirm = async () => {
    try {
      await deleteAllLocations();
      await deleteName();
      setExitModalVisible(false);
      router.replace("/");
    } catch {
      showToast("Could not exit. Try again.", "error");
    }
  };

  return {
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
    goBack: () => router.back(),
  };
}
