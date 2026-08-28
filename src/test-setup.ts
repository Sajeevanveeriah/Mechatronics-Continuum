import "@testing-library/jest-dom";
import "fake-indexeddb/auto";

Object.defineProperty(window, "scrollTo", { value: () => undefined });
