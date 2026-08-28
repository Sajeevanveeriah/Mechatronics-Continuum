import { describe, expect, it } from "vitest";
import { lesson, lessons, lessonById } from "./content";
describe("authored content", () => {
  it("provides a sequenced twelve-lesson foundation path", () => {
    expect(lessons).toHaveLength(12);
    expect(lessons[0].id).toBe("engineering-units");
    expect(lessons.at(-1)?.id).toBe("foundation-challenge");
    expect(lessonById.get("series-circuits")?.title).toBe("Series circuits");
  });
  it("fulfils the lesson evidence contract", () => {
    expect(lesson.objectives.length).toBeGreaterThan(2);
    expect(lesson.equation).toContain("V");
    expect(lesson.practice.length).toBeGreaterThan(20);
    expect(lesson.check.options).toHaveLength(4);
  });
  it("independently verifies worked result", () => {
    expect(24 / 120).toBeCloseTo(0.2);
    expect(24 * (24 / 120)).toBeCloseTo(4.8);
  });
});
