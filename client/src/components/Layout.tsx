import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAppState } from "../state/AppState";

const linkBase = "rounded-md px-3 py-1.5 text-sm font-medium transition";

const NAV = [
  { to: "/", label: "Topics", end: true },
  { to: "/visualize", label: "Visualize" },
  { to: "/quiz", label: "Quiz" },
  { to: "/review", label: "Review" },
  { to: "/stats", label: "Stats" },
];

function navClass({ isActive }: { isActive: boolean }) {
  return `${linkBase} ${
    isActive ? "bg-white/10 text-white" : "text-slate-300 hover:text-white"
  }`;
}

function AuthWidget() {
  const { user, ready, logout } = useAppState();
  const navigate = useNavigate();
  if (!ready) {
    return (
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-brand-400" />
    );
  }
  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden text-sm text-slate-300 sm:inline">
          {user.displayName}
        </span>
        <button
          onClick={() => logout()}
          className="rounded-md bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600"
        >
          Log out
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={() => navigate("/account")}
      className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium hover:bg-brand-500"
    >
      Sign in
    </button>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b1020]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-sm font-bold">
              IP
            </span>
            <span className="text-lg font-semibold tracking-tight">
              IntervuPrep
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={navClass}>
                {n.label}
              </NavLink>
            ))}
            <div className="ml-2">
              <AuthWidget />
            </div>
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <AuthWidget />
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((o) => !o)}
              className="grid h-9 w-9 place-items-center rounded-md bg-white/5 ring-1 ring-white/10"
            >
              <span className="text-lg leading-none">{open ? "\u2715" : "\u2630"}</span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <nav className="flex flex-col gap-1 border-t border-white/10 px-4 py-2 md:hidden">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                onClick={() => setOpen(false)}
                className={navClass}
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        <p>
          IntervuPrep — open, visual interview & CS learning. Sign in to sync your
          progress across devices; otherwise it's saved locally in your browser.
        </p>
        <p className="mt-2">&copy; {new Date().getFullYear()} Sameer. All rights reserved.</p>
      </footer>
    </div>
  );
}
