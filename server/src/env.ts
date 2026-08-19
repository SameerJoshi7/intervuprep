import dotenv from "dotenv";
dotenv.config();

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

const isProd = process.env.NODE_ENV === "production";

export const env = {
  isProd,
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET"),
  // Comma-separated list of allowed frontend origins (e.g. your Vercel URL).
  clientOrigins: (process.env.CLIENT_ORIGIN ?? "http://localhost:5173")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
  port: Number(process.env.PORT ?? 4000),
};
