import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { api, type AuthUser } from "../api/client";

const MASTERED_KEY = "intervu:mastered";
const NOTES_KEY = "intervu:notes";

function readLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

interface AppState {
  user: AuthUser | null;
  ready: boolean;
  mastered: Record<string, boolean>;
  notes: Record<string, string>;
  toggleMastered: (id: string) => void;
  setNote: (id: string, text: string) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  const [mastered, setMastered] = useState<Record<string, boolean>>(() =>
    readLS(MASTERED_KEY, {})
  );
  const [notes, setNotes] = useState<Record<string, string>>(() =>
    readLS(NOTES_KEY, {})
  );

  // Always cache to localStorage (offline-friendly, and used for guest mode).
  useEffect(() => {
    localStorage.setItem(MASTERED_KEY, JSON.stringify(mastered));
  }, [mastered]);
  useEffect(() => {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }, [notes]);

  // On mount, restore session if a valid cookie exists.
  useEffect(() => {
    (async () => {
      try {
        const me = await api.me();
        setUser(me);
        const state = await api.getState();
        setMastered(state.mastered);
        setNotes(state.notes);
      } catch {
        /* guest mode */
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // After login/register: push any local guest progress up, then pull merged state.
  const afterAuth = useCallback(
    async (u: AuthUser) => {
      setUser(u);
      try {
        await api.bulk({ notes, mastered });
        const state = await api.getState();
        setMastered(state.mastered);
        setNotes(state.notes);
      } catch {
        /* keep local state if sync fails */
      }
    },
    [notes, mastered]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      await afterAuth(await api.login(email, password));
    },
    [afterAuth]
  );

  const register = useCallback(
    async (email: string, password: string, displayName?: string) => {
      await afterAuth(await api.register(email, password, displayName));
    },
    [afterAuth]
  );

  const logout = useCallback(async () => {
    await api.logout().catch(() => {});
    setUser(null); // local cache stays for offline/guest use
  }, []);

  const toggleMastered = useCallback(
    (id: string) => {
      setMastered((m) => {
        const next = { ...m, [id]: !m[id] };
        if (user) api.putMastery(id, next[id]).catch(() => {});
        return next;
      });
    },
    [user]
  );

  // Debounce note saves to the server so we don't POST on every keystroke.
  const noteTimers = useRef<Record<string, number>>({});
  const setNote = useCallback(
    (id: string, text: string) => {
      setNotes((n) => ({ ...n, [id]: text }));
      if (!user) return;
      if (noteTimers.current[id]) clearTimeout(noteTimers.current[id]);
      noteTimers.current[id] = window.setTimeout(() => {
        api.putNote(id, text).catch(() => {});
      }, 600);
    },
    [user]
  );

  return (
    <Ctx.Provider
      value={{
        user,
        ready,
        mastered,
        notes,
        toggleMastered,
        setNote,
        login,
        register,
        logout,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}

// Backwards-compatible shape for existing components.
export function useProgress() {
  const { mastered, toggleMastered, notes, setNote } = useAppState();
  return { mastered, toggleMastered, notes, setNote };
}
