import { useEffect, useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { useTracking } from "@/src/features/tracking";
import { useTheme } from "@/src/shared/lib/useTheme";
import { getAllLocations } from "@/src/entities/location";

export function useHomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { isTracking, currentLocation, startTracking, stopTracking } = useTracking();
  const [route, setRoute] = useState<{ latitude: number; longitude: number }[]>([]);

  const loadRoute = useCallback(async () => {
    const pts = await getAllLocations(500);
    setRoute(pts);
  }, []);

  useEffect(() => {
    loadRoute();
  }, [currentLocation, loadRoute]);

  const toggleTracking = useCallback(() => {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
  }, [isTracking, startTracking, stopTracking]);

  const location = currentLocation
    ? {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      }
    : null;

  const goToSettings = () => router.push("/settings");

  return { theme, isTracking, location, route, toggleTracking, goToSettings };
}
