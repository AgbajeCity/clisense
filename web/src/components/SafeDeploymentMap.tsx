import { lazy, Suspense, useEffect, useState, useCallback } from "react";
import type { MapNode } from "@/components/data-engine/DeploymentMap";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { MapPin, RotateCcw, AlertTriangle } from "lucide-react";
import { logMapError } from "@/lib/mapErrorLogger";
import { MapErrorViewer } from "@/components/MapErrorViewer";
import type { MapStatus } from "@/components/MapStatusBadge";

// Lazy + client-only: leaflet touches `window` at module load time.
const DeploymentMap = lazy(() =>
  import("@/components/data-engine/DeploymentMap").then((m) => ({ default: m.DeploymentMap }))
);

const MapPlaceholder = ({ note }: { note?: string }) => (
  <div
    data-testid="map-placeholder"
    className="rounded-2xl border border-border/60 h-[360px] bg-muted/30 flex flex-col items-center justify-center text-muted-foreground"
  >
    <MapPin className="w-8 h-8 mb-2 opacity-50" />
    <p className="text-sm">{note ?? "Loading map…"}</p>
  </div>
);

interface SafeDeploymentMapProps {
  nodes: MapNode[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onStatusChange?: (status: MapStatus) => void;
}

export const SafeDeploymentMap = ({ onStatusChange, ...props }: SafeDeploymentMapProps) => {
  const [mounted, setMounted] = useState(false);
  // remountKey bumps to force a fresh mount of the lazy map after a crash
  const [remountKey, setRemountKey] = useState(0);

  useEffect(() => setMounted(true), []);
  // Optimistic: assume OK until proven otherwise
  useEffect(() => {
    if (mounted) onStatusChange?.("ok");
  }, [mounted, remountKey, onStatusChange]);

  const handleError = useCallback(
    (error: Error, info: { componentStack?: string | null }) => {
      onStatusChange?.("failed");
      logMapError(
        error,
        {
          source: "deployment-map",
          action: "render",
          nodeCount: props.nodes?.length ?? 0,
          selectedId: props.selectedId ?? null,
          extra: {
            firstNodeId: props.nodes?.[0]?.id,
            invalidCoords: (props.nodes ?? []).filter(
              (n) => !Number.isFinite(n?.lat) || !Number.isFinite(n?.lng)
            ).length,
          },
        },
        info.componentStack ?? undefined
      );
    },
    [props.nodes, props.selectedId, onStatusChange]
  );

  const retry = useCallback(() => {
    onStatusChange?.("recovering");
    setRemountKey((k) => k + 1);
  }, [onStatusChange]);

  if (!mounted) return <MapPlaceholder />;

  return (
    <ErrorBoundary
      key={remountKey}
      onError={handleError}
      fallback={(reset) => (
        <div
          data-testid="map-fallback"
          className="rounded-2xl border border-amber-500/30 h-[360px] bg-amber-500/5 flex flex-col items-center justify-center text-center p-6"
        >
          <AlertTriangle className="w-8 h-8 text-amber-500 mb-2" />
          <p className="text-sm font-medium mb-1">Map failed to load</p>
          <p className="text-xs text-muted-foreground mb-4 max-w-xs">
            Node data is still live below. You can retry the map or inspect the error.
          </p>
          <div className="flex gap-2 flex-wrap justify-center">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                reset();
                retry();
              }}
            >
              <RotateCcw className="w-4 h-4 mr-1" /> Retry map
            </Button>
            <MapErrorViewer />
          </div>
        </div>
      )}
    >
      <Suspense fallback={<MapPlaceholder />}>
        <DeploymentMap {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};
