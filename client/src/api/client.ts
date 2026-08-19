const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
}

export interface SyncState {
  notes: Record<string, string>;
  mastered: Record<string, boolean>;
}

async function req<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  me: () => req<AuthUser>("/auth/me"),
  register: (email: string, password: string, displayName?: string) =>
    req<AuthUser>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, displayName }),
    }),
  login: (email: string, password: string) =>
    req<AuthUser>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () => req<{ ok: boolean }>("/auth/logout", { method: "POST" }),

  getState: () => req<SyncState>("/sync/state"),
  putNote: (questionId: string, content: string) =>
    req<{ ok: boolean }>("/sync/note", {
      method: "PUT",
      body: JSON.stringify({ questionId, content }),
    }),
  putMastery: (questionId: string, mastered: boolean) =>
    req<{ ok: boolean }>("/sync/mastery", {
      method: "PUT",
      body: JSON.stringify({ questionId, mastered }),
    }),
  bulk: (state: Partial<SyncState>) =>
    req<{ ok: boolean; imported: number }>("/sync/bulk", {
      method: "POST",
      body: JSON.stringify(state),
    }),
};
