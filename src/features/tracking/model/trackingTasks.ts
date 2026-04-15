import * as TaskManager from "expo-task-manager";
import {
  countUnsentLocations,
  insertLocation,
  getUnsentLocations,
  markLocationsPending,
  markLocationsSent,
  revertPendingToUnsent,
} from "@/src/entities/location";

export const LOCATION_TASK = "background-location-task";

export async function syncLocations(): Promise<void> {
  const unsent = await getUnsentLocations(100);
  if (unsent.length === 0) return;

  const ids = unsent.map((r) => r.id);
  await markLocationsPending(ids);

  try {
    await markLocationsSent(ids);
  } catch (err) {
    console.warn("[sync] failed, reverting to unsent:", err);
    await revertPendingToUnsent(ids);
    throw err;
  }
}

export function registerLocationTask() {
  TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
    if (error) {
      console.error("[LocationTask] error:", error.message);
      return;
    }

    if (!data) return;

    const { locations } = data as { locations: { coords: { latitude: number; longitude: number; accuracy: number | null; altitude: number | null; speed: number | null } }[] };
    const [loc] = locations;
    if (!loc) return;

    const unsentCount = await countUnsentLocations();
    if (unsentCount >= 20) {
      await syncLocations().catch(console.warn);
    }

    await insertLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      accuracy: loc.coords.accuracy ?? undefined,
      speed: loc.coords.speed ?? undefined,
      altitude: loc.coords.altitude ?? undefined,
      timestamp: Date.now(),
    });
  });
}
