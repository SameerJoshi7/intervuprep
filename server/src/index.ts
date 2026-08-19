import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./env.js";
import { authRouter } from "./routes/auth.js";
import { syncRouter } from "./routes/sync.js";

const app = express();

// Behind a hosting proxy (Render/Fly/etc.) so Secure cookies work correctly.
app.set("trust proxy", 1);

app.use(
  cors({
    origin(origin, cb) {
      // Allow same-origin / curl (no origin) and any configured client origin.
      if (!origin || env.clientOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api/sync", syncRouter);

app.listen(env.port, () => {
  console.log(`IntervuPrep API listening on http://localhost:${env.port}`);
});
