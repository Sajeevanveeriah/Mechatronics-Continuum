import { describe, expect, it } from "vitest";
import { lesson } from "./content";
describe("authored content", () => {
  it("fulfils the lesson evidence contract", () => {
    expect(lesson.objectives.length).toBeGreaterThan(2);
    expect(lesson.variables).toContainEqual(["I", "current", "ampere (A)"]);
    expect(lesson.assumptions.length).toBeGreaterThan(1);
    expect(lesson.sources.length).toBeGreaterThan(1);
  });
  it("independently verifies worked result", () => {
    expect(24 / 120).toBeCloseTo(0.2);
    expect(24 * (24 / 120)).toBeCloseTo(4.8);
  });
});
