import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "@/src/entities/location/model/schema";

let _db: ReturnType<typeof drizzle> | null = null;

export function getDatabase() {
  if (!_db) {
    const sqlite = openDatabaseSync("locations.db", { enableChangeListener: true });
    _db = drizzle(sqlite, { schema });
  }
  return _db;
}

export function initDatabase(): void {
  const db = getDatabase();
  db.run(`PRAGMA journal_mode = WAL;`);
  db.run(`
    CREATE TABLE IF NOT EXISTS location_data (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      latitude   REAL    NOT NULL,
      longitude  REAL    NOT NULL,
      timestamp  INTEGER NOT NULL,
      accuracy   REAL,
      altitude   REAL,
      speed      REAL,
      is_sent    INTEGER NOT NULL DEFAULT 0 CHECK (is_sent IN (0, 1, 2)),
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );
  `);
  db.run(`CREATE INDEX IF NOT EXISTS idx_location_sent ON location_data(is_sent);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_location_timestamp ON location_data(timestamp);`);
}
