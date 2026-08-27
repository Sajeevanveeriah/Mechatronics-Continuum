import { readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";
import { describe, expect, it } from "vitest";

describe("repository artwork", () => {
  it("uses reviewable text assets instead of binary images", () => {
    const files = readdirSync("public");
    const binaryExtensions = new Set([
      ".gif",
      ".ico",
      ".jpeg",
      ".jpg",
      ".png",
      ".webp",
    ]);

    expect(files.filter((file) => binaryExtensions.has(extname(file)))).toEqual(
      [],
    );
    expect(files).toContain("app-icon.svg");
    expect(readFileSync(join("public", "app-icon.svg"), "utf8")).toMatch(
      /^<svg[\s\S]*<title[\s\S]*<desc/,
    );
  });
});
