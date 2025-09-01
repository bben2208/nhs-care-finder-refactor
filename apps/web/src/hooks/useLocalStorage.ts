import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const hasWindow = typeof window !== "undefined";

  const readValue = (): T => {
    if (!hasWindow) return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  };

  const [value, setValue] = useState<T>(readValue);

  // Write to localStorage when value changes
  useEffect(() => {
    if (!hasWindow) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore write errors (e.g., quota) */
    }
  }, [key, value, hasWindow]);

  // Keep value in sync across tabs/windows
  useEffect(() => {
    if (!hasWindow) return;

    const onStorage = (e: StorageEvent) => {
      if (e.key === key) {
        setValue(readValue());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key, hasWindow]);

  return [value, setValue] as const;
}