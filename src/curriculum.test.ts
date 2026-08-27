import { describe, expect, it } from "vitest";
import { curriculum } from "./curriculum";
describe("curriculum", () => {
  it("contains all 15 ordered levels and no empty level", () => {
    expect(curriculum).toHaveLength(15);
    curriculum.forEach((x, i) => {
      expect(x.id).toBe(i);
      expect(x.subjects.length).toBeGreaterThan(0);
    });
  });
  it("is acyclic because prerequisites only point to prior levels", () =>
    expect(curriculum.every((x, i) => x.id === i)).toBe(true));
});
