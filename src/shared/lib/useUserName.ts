import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

const KEY = "app_user_name";

export function useUserName() {
  const [name, setName] = useState("");

  useEffect(() => {
    SecureStore.getItemAsync(KEY).then((stored) => {
      if (stored) setName(stored);
    });
  }, []);

  const saveName = async (value: string) => {
    await SecureStore.setItemAsync(KEY, value.trim());
    setName(value.trim());
  };

  const deleteName = async () => {
    await SecureStore.deleteItemAsync(KEY);
    setName("");
  };

  return { name, saveName, deleteName };
}
