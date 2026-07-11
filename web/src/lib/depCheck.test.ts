import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return { ...actual, version: "18.3.1" };
});

// Mock the bundled package.json so we can vary react-leaflet version per test.
let mockedReactLeafletVersion = "^4.2.1";
vi.mock("../../package.json", () => ({
  default: {
    get dependencies() {
      return { "react-leaflet": mockedReactLeafletVersion };
    },
  },
}));

import { checkDependencyCompatibility } from "@/lib/depCheck";

describe("depCheck — react-leaflet vs React 18", () => {
  beforeEach(() => {
    mockedReactLeafletVersion = "^4.2.1";
  });

  it("passes for react-leaflet@4 on React 18", async () => {
    mockedReactLeafletVersion = "^4.2.1";
    const issues = await checkDependencyCompatibility();
    expect(issues).toEqual([]);
  });

  it("flags an error for react-leaflet@5 on React 18", async () => {
    mockedReactLeafletVersion = "^5.0.0";
    const issues = await checkDependencyCompatibility();
    expect(issues).toHaveLength(1);
    expect(issues[0].package).toBe("react-leaflet");
    expect(issues[0].severity).toBe("error");
    expect(issues[0].message).toMatch(/requires React 19/i);
  });

  it("warns for react-leaflet@3 on React 18", async () => {
    mockedReactLeafletVersion = "^3.2.5";
    const issues = await checkDependencyCompatibility();
    expect(issues).toHaveLength(1);
    expect(issues[0].severity).toBe("warn");
    expect(issues[0].message).toMatch(/4\.2\.1/);
  });

  it("handles missing react-leaflet entry gracefully", async () => {
    mockedReactLeafletVersion = "";
    const issues = await checkDependencyCompatibility();
    expect(issues).toEqual([]);
  });
});
