import { useCallback, useEffect, useState } from "react";

// SM-2 spaced-repetition scheduling, persisted to localStorage.
// Quality scale used by the UI: 1 = Again, 3 = Hard, 4 = Good, 5 = Easy.

export interface ReviewRecord {
  questionId: string;
  easeFactor: number; // EF, starts at 2.5, min 1.3
  interval: number; // days until next review
  repetitions: number; // consecutive correct reviews
  dueDate: number; // epoch ms
  lastRating: number;
}

const KEY = "intervu:reviews";
const DAY = 24 * 60 * 60 * 1000;

function readAll(): Record<string, ReviewRecord> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, ReviewRecord>) : {};
  } catch {
    return {};
  }
}

export function scheduleNext(
  prev: ReviewRecord | undefined,
  questionId: string,
  quality: number
): ReviewRecord {
  let ease = prev?.easeFactor ?? 2.5;
  let reps = prev?.repetitions ?? 0;
  let interval = prev?.interval ?? 0;

  if (quality < 3) {
    // failed recall — reset and see it again tomorrow
    reps = 0;
    interval = 1;
  } else {
    reps += 1;
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = 6;
    else interval = Math.round(interval * ease);
  }

  ease = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ease < 1.3) ease = 1.3;

  return {
    questionId,
    easeFactor: ease,
    interval,
    repetitions: reps,
    dueDate: Date.now() + interval * DAY,
    lastRating: quality,
  };
}

export function useReviews() {
  const [reviews, setReviews] = useState<Record<string, ReviewRecord>>(() =>
    readAll()
  );

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(reviews));
    } catch {
      /* ignore */
    }
  }, [reviews]);

  const rate = useCallback((questionId: string, quality: number) => {
    setReviews((prev) => ({
      ...prev,
      [questionId]: scheduleNext(prev[questionId], questionId, quality),
    }));
  }, []);

  const isDue = useCallback(
    (questionId: string) => {
      const r = reviews[questionId];
      return !!r && r.dueDate <= Date.now();
    },
    [reviews]
  );

  const dueIds = useCallback(
    () =>
      Object.values(reviews)
        .filter((r) => r.dueDate <= Date.now())
        .sort((a, b) => a.dueDate - b.dueDate)
        .map((r) => r.questionId),
    [reviews]
  );

  return { reviews, rate, isDue, dueIds };
}
