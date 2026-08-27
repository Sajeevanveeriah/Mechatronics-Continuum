import { describe, expect, it } from "vitest";
import {
  exportProgress,
  importProgress,
  load,
  save,
  schedule,
  seed,
} from "./storage";
describe("local data", () => {
  it("round trips a complete export", () =>
    expect(importProgress(exportProgress(seed))).toMatchObject(seed));
  it("rejects corrupt import", () =>
    expect(() => importProgress("{bad")).toThrow());
  it("rejects invalid mastery and session records", () => {
    expect(() =>
      importProgress(
        JSON.stringify({ ...seed, states: { x: "Read" }, session: null }),
      ),
    ).toThrow();
    expect(() =>
      importProgress(
        JSON.stringify({
          ...seed,
          session: { duration: 1000, paused: false, index: 0 },
        }),
      ),
    ).toThrow();
  });
  it("persists and reloads validated progress", async () => {
    const progress = { ...seed, name: "Storage test" };
    await save(progress);
    await expect(load()).resolves.toMatchObject(progress);
  });
  it("uses a deterministic fixed clock", () =>
    expect(schedule(new Date("2026-01-01T00:00:00Z"), 2, "Correct")).toEqual({
      days: 4,
      due: "2026-01-05T00:00:00.000Z",
    }));
});
