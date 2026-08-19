import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="text-6xl font-bold text-brand-500">404</div>
      <h1 className="mt-3 text-xl font-semibold">Page not found</h1>
      <p className="mt-2 text-slate-400">
        That page doesn't exist. Let's get you back to studying.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-md bg-brand-600 px-5 py-2 text-sm font-medium hover:bg-brand-500"
      >
        Back home
      </Link>
    </div>
  );
}
