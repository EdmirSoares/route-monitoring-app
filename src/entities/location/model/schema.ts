import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const locationData = sqliteTable("location_data", {
  id: int("id").primaryKey({ autoIncrement: true }),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  timestamp: int("timestamp").notNull(),
  accuracy: real("accuracy"),
  altitude: real("altitude"),
  speed: real("speed"),
  // 0=unsent, 1=pending, 2=sent
  isSent: int("is_sent").default(0).notNull(),
  createdAt: int("created_at")
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
});

export type LocationData = typeof locationData.$inferSelect;
export type NewLocationData = typeof locationData.$inferInsert;
