import { openDB } from "idb";
import { z } from "zod";
import type { Progress } from "./types";

// These enums are part of the persisted Progress schema, not presentation-only
// labels. Renaming or removing values requires an explicit import/storage
// migration because old browser data is validated against them on load.
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

// `seed` is the deterministic recovery state when IndexedDB is empty,
// unavailable or contains data that no longer satisfies the validated schema.
export const seed: Progress = {
  schemaVersion: 1,
  name: "Saj",
  goal: "Reconstruct engineering knowledge and retrieve it accurately in technical interviews.",
  theme: "light",
  states: {},
  notes: {},
  bookmarks: [],
  mistakes: [],
  reviews: [],
  session: null,
};

// Import and persisted-data validation share this schema so untrusted JSON and
// stale browser records pass through the same structural limits before use.
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

// One object store holds both the durable `current` record and the transient
// `pending` recovery record used by save/load below.
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

    // Prefer the normal current record. A valid pending record is the recovery
    // path when a previous save was interrupted after staging but before the
    // final current write/cleanup completed.
    for (const candidate of [current, pending]) {
      const parsed = schema.safeParse(candidate);
      if (parsed.success) {
        if (candidate === pending) {
          await d.put("progress", parsed.data, "current");
          await d.delete("progress", "pending");
        }
        return parsed.data.theme === "system"
          ? { ...parsed.data, theme: "light" }
          : parsed.data;
      }
    }
    return structuredClone(seed);
  } catch {
    // Storage failure must not prevent the learning application from opening;
    // fall back to an isolated clone so callers cannot mutate the seed object.
    return structuredClone(seed);
  }
}

export async function save(p: Progress) {
  const d = await db();

  // Ordering is intentional: stage a recoverable copy first, replace current,
  // then clear the staging record. Keep this sequence together if persistence
  // is refactored.
  await d.put("progress", p, "pending");
  await d.put("progress", p, "current");
  await d.delete("progress", "pending");
}

export function exportProgress(p: Progress) {
  // `exportedAt` is export metadata only; schema parsing ignores it on import
  // because the validated Progress object itself remains schemaVersion 1.
  return JSON.stringify(
    { ...p, exportedAt: new Date().toISOString() },
    null,
    2,
  );
}

export function importProgress(raw: string): Progress {
  // Bound parsing work and reject unexpectedly large local backup files before
  // JSON parsing. Imported values still have to satisfy the full Zod schema.
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
  // This is the deterministic spaced-review policy. `Again` resets to one day;
  // the other ratings multiply the previous interval, while recorded mistakes
  // shorten that interval by the denominator penalty. Changing these constants
  // changes learning behaviour and belongs with scheduler regression tests.
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
