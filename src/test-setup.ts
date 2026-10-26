import { vi } from "vitest";
import "@testing-library/jest-dom";
import "fake-indexeddb/auto";

Object.defineProperty(window, "scrollTo", { value: () => undefined });

// Vitest 4 cannot load the vite-plugin-pwa virtual module, so stub the
// service-worker registration that jsdom cannot perform anyway.
vi.mock("virtual:pwa-register", () => ({
  registerSW: () => () => Promise.resolve(),
}));
