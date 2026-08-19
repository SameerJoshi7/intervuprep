import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth, type AuthedRequest } from "../auth.js";

export const syncRouter = Router();
syncRouter.use(requireAuth);

// Return all of the user's notes and mastered flags as maps keyed by questionId.
syncRouter.get("/state", async (req: AuthedRequest, res) => {
  const [notes, progress] = await Promise.all([
    prisma.note.findMany({ where: { userId: req.userId } }),
    prisma.progress.findMany({ where: { userId: req.userId } }),
  ]);
  res.json({
    notes: Object.fromEntries(notes.map((n) => [n.questionId, n.content])),
    mastered: Object.fromEntries(
      progress.filter((p) => p.mastered).map((p) => [p.questionId, true])
    ),
  });
});

const noteSchema = z.object({
  questionId: z.string().min(1),
  content: z.string(),
});

syncRouter.put("/note", async (req: AuthedRequest, res) => {
  const parsed = noteSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const { questionId, content } = parsed.data;
  const userId = req.userId!;

  await prisma.note.upsert({
    where: { userId_questionId: { userId, questionId } },
    create: { userId, questionId, content },
    update: { content },
  });
  res.json({ ok: true });
});

const masterySchema = z.object({
  questionId: z.string().min(1),
  mastered: z.boolean(),
});

syncRouter.put("/mastery", async (req: AuthedRequest, res) => {
  const parsed = masterySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const { questionId, mastered } = parsed.data;
  const userId = req.userId!;

  await prisma.progress.upsert({
    where: { userId_questionId: { userId, questionId } },
    create: { userId, questionId, mastered },
    update: { mastered },
  });
  res.json({ ok: true });
});

// Bulk import (used to migrate existing localStorage progress on first login).
const bulkSchema = z.object({
  notes: z.record(z.string()).optional(),
  mastered: z.record(z.boolean()).optional(),
});

syncRouter.post("/bulk", async (req: AuthedRequest, res) => {
  const parsed = bulkSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
  const userId = req.userId!;
  const { notes = {}, mastered = {} } = parsed.data;

  const ops = [
    ...Object.entries(notes).map(([questionId, content]) =>
      prisma.note.upsert({
        where: { userId_questionId: { userId, questionId } },
        create: { userId, questionId, content },
        update: { content },
      })
    ),
    ...Object.entries(mastered).map(([questionId, val]) =>
      prisma.progress.upsert({
        where: { userId_questionId: { userId, questionId } },
        create: { userId, questionId, mastered: val },
        update: { mastered: val },
      })
    ),
  ];
  await prisma.$transaction(ops);
  res.json({ ok: true, imported: ops.length });
});
