import { openDB } from "idb";
import { z } from "zod";
import type { Progress } from "./types";
const masteryState = z.enum([
  "Not-started",
  "Learning",
  "Practising",
  "Review-due",
  "Demonstrated",
  "Needs-repair",
]);
const mistakeType = z.enum([
  "concept gap",
  "recall-latency problem",
  "incorrect formula or method selection",
  "algebra or calculus error",
  "unit or dimensional error",
  "sign, direction or coordinate error",
  "assumption or boundary-condition error",
  "implementation or debugging error",
  "communication error",
  "careless transcription",
]);
export const seed: Progress = {
  schemaVersion: 1,
  name: "Saj",
  goal: "Reconstruct engineering knowledge and retrieve it accurately in technical interviews.",
  theme: "system",
  states: {},
  notes: {},
  bookmarks: [],
  mistakes: [],
  reviews: [],
  session: null,
};
const schema = z.object({
  schemaVersion: z.literal(1),
  name: z.string().max(100),
  goal: z.string().max(500),
  theme: z.enum(["system", "light", "dark"]),
  states: z.record(z.string(), masteryState),
  notes: z.record(z.string(), z.string().max(10000)),
  bookmarks: z.array(z.string()).max(1000),
  mistakes: z
    .array(
      z.object({
        id: z.string(),
        lesson: z.string(),
        type: mistakeType,
        note: z.string(),
        created: z.string(),
      }),
    )
    .max(5000),
  reviews: z
    .array(
      z.object({ lesson: z.string(), due: z.string(), interval: z.number() }),
    )
    .max(5000),
  session: z
    .object({
      duration: z.number().int().min(10).max(180),
      paused: z.boolean(),
      index: z.number().int().nonnegative(),
    })
    .nullable(),
});
const db = () =>
  openDB("mechatronics-continuum", 1, {
    upgrade(d) {
      if (!d.objectStoreNames.contains("progress"))
        d.createObjectStore("progress");
    },
  });
export async function load(): Promise<Progress> {
  try {
    const d = await db();
    const current = await d.get("progress", "current");
    const pending = await d.get("progress", "pending");
    for (const candidate of [current, pending]) {
      const parsed = schema.safeParse(candidate);
      if (parsed.success) {
        if (candidate === pending) {
          await d.put("progress", parsed.data, "current");
          await d.delete("progress", "pending");
        }
        return parsed.data;
      }
    }
    return structuredClone(seed);
  } catch {
    return structuredClone(seed);
  }
}
export async function save(p: Progress) {
  const d = await db();
  await d.put("progress", p, "pending");
  await d.put("progress", p, "current");
  await d.delete("progress", "pending");
}
export function exportProgress(p: Progress) {
  return JSON.stringify(
    { ...p, exportedAt: new Date().toISOString() },
    null,
    2,
  );
}
export function importProgress(raw: string): Progress {
  if (raw.length > 2_000_000) throw Error("Import exceeds 2 MB");
  const parsed = JSON.parse(raw);
  return schema.parse(parsed);
}
export function schedule(
  now: Date,
  interval: number,
  rating: "Again" | "Difficult" | "Correct" | "Easy",
  mistakes = 0,
) {
  const factors = { Again: 0, Difficult: 1.2, Correct: 2, Easy: 3 };
  const days =
    rating === "Again"
      ? 1
      : Math.max(
          1,
          Math.round(
            (Math.max(interval, 1) * factors[rating]) / (1 + mistakes * 0.15),
          ),
        );
  const due = new Date(now);
  due.setUTCDate(due.getUTCDate() + days);
  return { days, due: due.toISOString() };
}
