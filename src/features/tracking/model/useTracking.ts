import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { Alert, Linking, Platform } from "react-native";
import { insertLocation } from "@/src/entities/location";
import { LOCATION_TASK, syncLocations } from "./trackingTasks";

type TrackingState = {
  isTracking: boolean;
  isLoading: boolean;
  currentLocation: Location.LocationObject | null;
  error: string | null;
};

export function useTracking() {
  const [state, setState] = useState<TrackingState>({
    isTracking: false,
    isLoading: false,
    currentLocation: null,
    error: null,
  });

  const syncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const setPartial = (partial: Partial<TrackingState>) =>
    setState((prev) => ({ ...prev, ...partial }));

  const requestPermissions = async (): Promise<boolean> => {
    const { status: fg } = await Location.requestForegroundPermissionsAsync();
    if (fg !== "granted") {
      Alert.alert(
        "Permission required",
        "Enable location permissions in settings.",
        [
          { text: "Open settings", onPress: () => Linking.openSettings() },
          { text: "Cancel", style: "cancel" },
        ]
      );
      return false;
    }

    const { status: bg } = await Location.requestBackgroundPermissionsAsync();
    if (bg !== "granted") {
      setPartial({ error: "Background location permission denied" });
      return false;
    }

    return true;
  };

  const startTracking = async () => {
    try {
      setPartial({ isLoading: true, error: null });

      const granted = await requestPermissions();
      if (!granted) return;

      const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK);
      if (!isRegistered) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK, {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
          deferredUpdatesInterval: 15_000,
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: "Tracking",
            notificationBody: "We are tracking your location in the background",
            notificationColor: "#ff5300",
          },
        });
      }

      const location = await Location.getCurrentPositionAsync({});
      setPartial({ currentLocation: location });

      await insertLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy ?? undefined,
        speed: location.coords.speed ?? undefined,
        altitude: location.coords.altitude ?? undefined,
        timestamp: Date.now(),
      });

      setPartial({ isTracking: true });
    } catch (err) {
      console.error("[tracking] startTracking:", err);
      setPartial({ error: "Erro ao iniciar rastreamento" });
    } finally {
      setPartial({ isLoading: false });
    }
  };

  const stopTracking = async () => {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK);
      if (isRegistered) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK);
      }

      await syncLocations().catch(console.warn);

      setPartial({ isTracking: false, currentLocation: null });
    } catch (err) {
      console.error("[tracking] stopTracking:", err);
      setPartial({ error: "Erro while stopping tracking" });
    }
  };

  useEffect(() => {
    if (state.isTracking) {
      syncIntervalRef.current = setInterval(() => {
        syncLocations().catch(console.warn);
      }, 60_000);
    } else {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [state.isTracking]);

  return {
    ...state,
    startTracking,
    stopTracking,
    syncLocations,
  };
}
