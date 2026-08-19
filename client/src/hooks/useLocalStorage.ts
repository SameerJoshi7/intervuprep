import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore quota / serialization errors */
    }
  }, [key, value]);

  return [value, setValue] as const;
}

const MASTERED_KEY = "intervu:mastered";
const NOTES_KEY = "intervu:notes";

export function useProgress() {
  const [mastered, setMastered] = useLocalStorage<Record<string, boolean>>(
    MASTERED_KEY,
    {}
  );
  const [notes, setNotes] = useLocalStorage<Record<string, string>>(
    NOTES_KEY,
    {}
  );

  const toggleMastered = useCallback(
    (id: string) =>
      setMastered((m) => ({ ...m, [id]: !m[id] })),
    [setMastered]
  );

  const setNote = useCallback(
    (id: string, text: string) =>
      setNotes((n) => ({ ...n, [id]: text })),
    [setNotes]
  );

  return { mastered, toggleMastered, notes, setNote };
}
