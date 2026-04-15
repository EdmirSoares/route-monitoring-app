import { eq, inArray, lt, asc } from "drizzle-orm";
import { getDatabase } from "@/src/core/database/db";
import { locationData } from "../model/schema";
import { insertLocationSchema, SentStatus, type InsertLocation } from "../model/types";

function db() {
  return getDatabase();
}

export async function insertLocation(payload: InsertLocation): Promise<number> {
  const validated = insertLocationSchema.parse(payload);
  const result = await db().insert(locationData).values(validated).returning({ id: locationData.id });
  return result[0].id;
}

export async function getUnsentLocations(limit = 100) {
  return db()
    .select()
    .from(locationData)
    .where(eq(locationData.isSent, SentStatus.UNSENT))
    .orderBy(asc(locationData.timestamp))
    .limit(limit);
}

export async function getAllLocations(limit = 100) {
  return db()
    .select({
      latitude: locationData.latitude,
      longitude: locationData.longitude,
    })
    .from(locationData)
    .orderBy(asc(locationData.timestamp))
    .limit(limit);
}

export async function countUnsentLocations(): Promise<number> {
  const rows = await db()
    .select({ id: locationData.id })
    .from(locationData)
    .where(eq(locationData.isSent, SentStatus.UNSENT));
  return rows.length;
}

export async function markLocationsPending(ids: number[]): Promise<void> {
  if (ids.length === 0) return;
  await db()
    .update(locationData)
    .set({ isSent: SentStatus.PENDING })
    .where(inArray(locationData.id, ids));
}

export async function markLocationsSent(ids: number[]): Promise<void> {
  if (ids.length === 0) return;
  await db()
    .update(locationData)
    .set({ isSent: SentStatus.SENT })
    .where(inArray(locationData.id, ids));
}

export async function revertPendingToUnsent(ids: number[]): Promise<void> {
  if (ids.length === 0) return;
  await db()
    .update(locationData)
    .set({ isSent: SentStatus.UNSENT })
    .where(inArray(locationData.id, ids));
}

export async function deleteSentLocations(): Promise<number> {
  const result = await db()
    .delete(locationData)
    .where(eq(locationData.isSent, SentStatus.SENT))
    .returning({ id: locationData.id });
  return result.length;
}

export async function deleteAllLocations(): Promise<void> {
  await db().delete(locationData);
}

export async function cleanupOldLocations(daysToKeep = 30): Promise<number> {
  const cutoff = Math.floor(Date.now() / 1000) - daysToKeep * 86400;
  const result = await db()
    .delete(locationData)
    .where(lt(locationData.timestamp, cutoff))
    .returning({ id: locationData.id });
  return result.length;
}
