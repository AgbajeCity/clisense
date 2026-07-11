import { describe, it, expect, beforeEach, vi } from "vitest";
import { logMapError, getRecentMapErrors, clearMapErrors } from "@/lib/mapErrorLogger";

describe("mapErrorLogger", () => {
  beforeEach(() => {
    clearMapErrors();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("captures error + context as a structured payload", () => {
    const payload = logMapError(
      new Error("tile fetch failed"),
      { source: "tile-layer", action: "load", nodeCount: 6, selectedId: "n-ke-01" },
      "in DeploymentMap\nin SafeDeploymentMap"
    );

    expect(payload.message).toBe("tile fetch failed");
    expect(payload.source).toBe("tile-layer");
    expect(payload.nodeCount).toBe(6);
    expect(payload.selectedId).toBe("n-ke-01");
    expect(payload.componentStack).toContain("DeploymentMap");
    expect(payload.timestamp).toMatch(/\d{4}-\d{2}-\d{2}T/);
  });

  it("keeps a bounded recent-errors buffer", () => {
    for (let i = 0; i < 25; i++) {
      logMapError(new Error(`e${i}`), { source: "deployment-map" });
    }
    const recent = getRecentMapErrors();
    expect(recent.length).toBe(20);
    expect(recent[recent.length - 1].message).toBe("e24");
  });

  it("normalises non-Error throws", () => {
    const payload = logMapError("string crash", { source: "unknown" });
    expect(payload.name).toBe("Error");
    expect(payload.message).toBe("string crash");
  });

  it("persists events to localStorage and survives a module reload", async () => {
    logMapError(new Error("persist me"), { source: "node-marker", nodeId: "n-ng-02" });
    const raw = window.localStorage.getItem("clisense:mapErrors:v1");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed[parsed.length - 1].message).toBe("persist me");

    // Simulate a "page reload" by re-importing the fresh module
    vi.resetModules();
    const fresh = await import("@/lib/mapErrorLogger");
    const last = fresh.getLastMapError();
    expect(last?.message).toBe("persist me");
    expect(last?.nodeId).toBe("n-ng-02");
  });

  it("notifies subscribers when new errors arrive", async () => {
    const mod = await import("@/lib/mapErrorLogger");
    const spy = vi.fn();
    const unsub = mod.subscribeMapErrors(spy);
    mod.logMapError(new Error("boom"), { source: "fly-to" });
    expect(spy).toHaveBeenCalled();
    unsub();
  });
});
