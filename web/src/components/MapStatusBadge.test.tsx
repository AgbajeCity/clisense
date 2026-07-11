import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MapStatusBadge } from "@/components/MapStatusBadge";

describe("MapStatusBadge", () => {
  it("renders OK state by default", () => {
    render(<MapStatusBadge status="ok" />);
    const el = screen.getByTestId("map-status-badge");
    expect(el).toHaveAttribute("data-status", "ok");
    expect(el.textContent).toMatch(/Map OK/);
  });

  it("renders failed state with correct dataset", () => {
    render(<MapStatusBadge status="failed" />);
    const el = screen.getByTestId("map-status-badge");
    expect(el).toHaveAttribute("data-status", "failed");
    expect(el.textContent).toMatch(/Map failed/);
  });

  it("renders recovering state with spinner styling hook", () => {
    render(<MapStatusBadge status="recovering" />);
    const el = screen.getByTestId("map-status-badge");
    expect(el).toHaveAttribute("data-status", "recovering");
    expect(el.textContent).toMatch(/Recovering/);
  });
});
