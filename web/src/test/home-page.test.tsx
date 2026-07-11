import { describe, it, expect, vi, beforeEach } from "vitest";
import { StrictMode } from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock the lazy DeploymentMap so we don't try to mount real Leaflet in jsdom.
let shouldThrow = true;
vi.mock("@/components/data-engine/DeploymentMap", () => ({
  DeploymentMap: (props: any) => {
    if (shouldThrow) throw new Error("Simulated leaflet crash");
    return (
      <div data-testid="real-map">
        Map with {props.nodes?.length ?? 0} nodes
      </div>
    );
  },
}));

import { SafeDeploymentMap } from "@/components/SafeDeploymentMap";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const NODES = [
  { id: "n1", site: "Ikire", type: "Farm", category: "farm" as const, status: "online" as const, battery: 90, signal: 70, soil: 40, lat: 7.36, lng: 4.18 },
];

describe("Home page — map resilience under StrictMode", () => {
  beforeEach(() => {
    shouldThrow = true;
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("renders a fallback (never blanks) when the map crashes inside StrictMode", async () => {
    const { container } = render(
      <StrictMode>
        <main>
          <h1>Home</h1>
          <SafeDeploymentMap nodes={NODES} />
        </main>
      </StrictMode>
    );

    // Page chrome stays visible — UI never blanks
    expect(screen.getByRole("heading", { name: "Home" })).toBeInTheDocument();

    // Map fallback appears (after lazy load + boundary catch)
    const fallback = await screen.findByTestId("map-fallback", {}, { timeout: 3000 });
    expect(fallback).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry map/i })).toBeInTheDocument();

    // No blank screen: container has visible children
    expect(container.textContent).toContain("Home");
  });

  it("retry button remounts the map and recovers without page reload", async () => {
    const user = userEvent.setup();
    render(
      <StrictMode>
        <SafeDeploymentMap nodes={NODES} />
      </StrictMode>
    );

    await screen.findByTestId("map-fallback", {}, { timeout: 3000 });

    // "Fix" the underlying map and click retry
    shouldThrow = false;
    await act(async () => {
      await user.click(screen.getByRole("button", { name: /retry map/i }));
    });

    await waitFor(
      () => expect(screen.getByTestId("real-map")).toBeInTheDocument(),
      { timeout: 3000 }
    );
    expect(screen.queryByTestId("map-fallback")).not.toBeInTheDocument();
  });

  it("ErrorBoundary onError receives the thrown error (used for structured logging)", async () => {
    const onError = vi.fn();
    render(
      <StrictMode>
        <ErrorBoundary onError={onError} fallback={<div data-testid="boom">boom</div>}>
          <ThrowingChild />
        </ErrorBoundary>
      </StrictMode>
    );

    await waitFor(() => expect(screen.getByTestId("boom")).toBeInTheDocument());
    expect(onError).toHaveBeenCalled();
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
  });
});

const ThrowingChild = () => {
  throw new Error("nope");
};
