import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { initDatabase } from "../database/db";

type DBContextValue = {
  isReady: boolean;
  error: Error | null;
};

const DBContext = createContext<DBContextValue>({ isReady: false, error: null });

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      initDatabase();
      setIsReady(true);
    } catch (err) {
      console.error("[DB] init failed:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, []);

  return (
    <DBContext.Provider value={{ isReady, error }}>
      {children}
    </DBContext.Provider>
  );
}

export function useDatabase() {
  return useContext(DBContext);
}
