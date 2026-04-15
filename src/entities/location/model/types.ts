import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { locationData } from "./schema";

export const insertLocationSchema = createInsertSchema(locationData, {
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timestamp: z.number().int().positive(),
  accuracy: z.number().nonnegative().optional(),
  altitude: z.number().optional(),
  speed: z.number().nonnegative().optional(),
});

export const selectLocationSchema = createSelectSchema(locationData);

export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type SelectLocation = z.infer<typeof selectLocationSchema>;

export const SentStatus = {
  UNSENT: 0,
  PENDING: 1,
  SENT: 2,
} as const;
export type SentStatusValue = (typeof SentStatus)[keyof typeof SentStatus];
