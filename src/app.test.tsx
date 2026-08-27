import { render, screen, waitFor } from "@testing-library/react";
import { App } from "./main";
import { describe, expect, it } from "vitest";
describe("shell", () => {
  it("renders accessible navigation and queue", async () => {
    const view = render(<App />);
    expect(
      screen.getByRole("navigation", { name: "Primary" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Today's study queue" }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(document.documentElement.dataset.theme).toBe("system"),
    );
    view.unmount();
  });
});
