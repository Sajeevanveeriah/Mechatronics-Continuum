import { render, screen, waitFor } from "@testing-library/react";
import { App } from "./main";
import { describe, expect, it } from "vitest";
describe("shell", () => {
  it("renders accessible navigation and a next lesson", async () => {
    const view = render(<App />);
    expect(
      screen.getByRole("navigation", { name: "Primary" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Good to see you/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continue lesson" }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(document.documentElement.dataset.theme).toBe("system"),
    );
    view.unmount();
  });
});
