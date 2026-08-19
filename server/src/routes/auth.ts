import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import {
  hashPassword,
  verifyPassword,
  issueToken,
  clearToken,
  requireAuth,
  type AuthedRequest,
} from "../auth.js";

export const authRouter = Router();

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  displayName: z.string().min(1).optional(),
});

authRouter.post("/register", async (req, res) => {
  const parsed = credsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { email, password, displayName } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: "Email already registered" });

  const user = await prisma.user.create({
    data: {
      email,
      displayName: displayName || email.split("@")[0],
      passwordHash: await hashPassword(password),
    },
  });
  issueToken(res, user.id);
  res.status(201).json({ id: user.id, email: user.email, displayName: user.displayName });
});

authRouter.post("/login", async (req, res) => {
  const parsed = credsSchema.pick({ email: true, password: true }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  issueToken(res, user.id);
  res.json({ id: user.id, email: user.email, displayName: user.displayName });
});

authRouter.post("/logout", (_req, res) => {
  clearToken(res);
  res.json({ ok: true });
});

authRouter.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, email: true, displayName: true },
  });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});
