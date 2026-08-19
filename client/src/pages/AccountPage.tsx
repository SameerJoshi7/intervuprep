import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../state/AppState";

export default function AccountPage() {
  const { user, login, register, logout } = useAppState();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (user) {
    return (
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-2xl font-bold">You're signed in</h1>
        <p className="mt-2 text-slate-400">
          {user.displayName} ({user.email})
        </p>
        <p className="mt-4 text-sm text-slate-400">
          Your notes and progress now sync to your account and are available on
          any device you sign in from.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium hover:bg-brand-500"
          >
            Start studying
          </button>
          <button
            onClick={() => logout()}
            className="rounded-md bg-slate-700 px-4 py-2 text-sm hover:bg-slate-600"
          >
            Log out
          </button>
        </div>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "login") await login(email, password);
      else await register(email, password, displayName || undefined);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6 flex overflow-hidden rounded-lg ring-1 ring-white/10">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={`flex-1 py-2 text-sm font-medium capitalize transition ${
              mode === m ? "bg-brand-600 text-white" : "bg-slate-800 text-slate-300"
            }`}
          >
            {m === "login" ? "Log in" : "Create account"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-3">
        {mode === "register" && (
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display name (optional)"
            className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-brand-500"
          />
        )}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-brand-500"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 8 characters)"
          className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-brand-500"
        />
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-md bg-brand-600 py-2 text-sm font-medium hover:bg-brand-500 disabled:opacity-60"
        >
          {busy ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-slate-500">
        Any progress you've saved as a guest will be merged into your account on
        first sign in.
      </p>
    </div>
  );
}
