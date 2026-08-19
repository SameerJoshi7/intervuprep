import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "./env.js";

const TOKEN_COOKIE = "intervu_token";
const TOKEN_TTL = "7d";

export interface AuthedRequest extends Request {
  userId?: string;
}

export function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}

export function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

export function issueToken(res: Response, userId: string) {
  const token = jwt.sign({ sub: userId }, env.jwtSecret, {
    expiresIn: TOKEN_TTL,
  });
  res.cookie(TOKEN_COOKIE, token, {
    httpOnly: true,
    // Cross-site cookies (frontend and API on different domains) require
    // SameSite=None + Secure. Locally we use Lax over http.
    sameSite: env.isProd ? "none" : "lax",
    secure: env.isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearToken(res: Response) {
  res.clearCookie(TOKEN_COOKIE, {
    httpOnly: true,
    sameSite: env.isProd ? "none" : "lax",
    secure: env.isProd,
  });
}

export function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.[TOKEN_COOKIE];
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    const payload = jwt.verify(token, env.jwtSecret) as { sub: string };
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
}
