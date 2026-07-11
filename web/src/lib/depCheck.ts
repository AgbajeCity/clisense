/**
 * Runtime compatibility guard for known mismatched peer dependencies.
 * Currently checks: react-leaflet major version vs React major version.
 *
 * react-leaflet@5 requires React 19. On React 18 it crashes inside
 * Context.Consumer with "render2 is not a function" and blanks the screen.
 */
import React from "react";

export interface DepIssue {
  package: string;
  message: string;
  severity: "error" | "warn";
}

export const checkDependencyCompatibility = async (): Promise<DepIssue[]> => {
  const issues: DepIssue[] = [];
  const reactMajor = parseInt(React.version.split(".")[0], 10);

  try {
    // package.json is bundled by Vite as a JSON import
    const pkg = (await import("../../package.json")).default as {
      dependencies?: Record<string, string>;
    };
    const deps = pkg.dependencies ?? {};
    const rl = deps["react-leaflet"];
    if (rl) {
      const rlMajor = parseInt(rl.replace(/[^\d.]/g, "").split(".")[0] || "0", 10);
      if (rlMajor >= 5 && reactMajor < 19) {
        issues.push({
          package: "react-leaflet",
          severity: "error",
          message: `react-leaflet@${rl} requires React 19+, but this project uses React ${React.version}. Downgrade to react-leaflet@^4.2.1.`,
        });
      }
      if (rlMajor <= 3 && reactMajor >= 18) {
        issues.push({
          package: "react-leaflet",
          severity: "warn",
          message: `react-leaflet@${rl} predates React 18 concurrent rendering. Upgrade to ^4.2.1.`,
        });
      }
    }
  } catch {
    // ignore — best-effort check
  }

  return issues;
};

/** Run the check on app boot; logs to console (non-blocking). */
export const runDependencyCheck = () => {
  checkDependencyCompatibility().then((issues) => {
    issues.forEach((i) => {
      const tag = `[depCheck:${i.package}]`;
      if (i.severity === "error") console.error(tag, i.message);
      else console.warn(tag, i.message);
    });
  });
};
