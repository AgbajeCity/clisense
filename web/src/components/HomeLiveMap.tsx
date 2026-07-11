import { useEffect, useState } from "react";
import type { MapNode } from "@/components/data-engine/DeploymentMap";
import { SafeDeploymentMap } from "@/components/SafeDeploymentMap";
import { MapStatusBadge, type MapStatus } from "@/components/MapStatusBadge";

const SEED: MapNode[] = [
  { id: "n-ng-01", site: "Ikire Cooperative", type: "Farm · Nigeria", category: "farm", status: "online", battery: 92, signal: 78, soil: 42, lat: 7.36, lng: 4.18 },
  { id: "n-ng-02", site: "Osogbo Plot 7", type: "Farm · Nigeria", category: "farm", status: "online", battery: 87, signal: 71, soil: 38, lat: 7.77, lng: 4.55 },
  { id: "n-rw-01", site: "Mahama Settlement", type: "Refugee · Rwanda", category: "refugee", status: "syncing", battery: 64, signal: 55, soil: 51, lat: -2.30, lng: 30.79 },
  { id: "n-ug-01", site: "Nakivale Settlement", type: "Refugee · Uganda", category: "refugee", status: "online", battery: 81, signal: 66, soil: 47, lat: -0.79, lng: 30.92 },
  { id: "n-ke-01", site: "Kakuma Camp", type: "Refugee · Kenya", category: "refugee", status: "online", battery: 75, signal: 60, soil: 33, lat: 3.71, lng: 34.86 },
  { id: "n-ke-02", site: "Eldoret Cooperative", type: "Farm · Kenya", category: "farm", status: "online", battery: 90, signal: 82, soil: 49, lat: 0.52, lng: 35.27 },
];

export const HomeLiveMap = () => {
  const [nodes, setNodes] = useState(SEED);
  const [selected, setSelected] = useState<string | null>(null);
  const [mapStatus, setMapStatus] = useState<MapStatus>("ok");

  useEffect(() => {
    const id = setInterval(() => {
      setNodes((ns) =>
        ns.map((n) => ({
          ...n,
          battery: Math.max(20, Math.min(100, n.battery + (Math.random() - 0.5) * 2)),
          signal: Math.max(20, Math.min(100, n.signal + (Math.random() - 0.5) * 4)),
          soil: Math.max(10, Math.min(80, n.soil + (Math.random() - 0.5) * 3)),
        }))
      );
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const stats = {
    online: nodes.filter((n) => n.status === "online").length,
    refugee: nodes.filter((n) => n.category === "refugee").length,
    farm: nodes.filter((n) => n.category === "farm").length,
  };

  const sel = nodes.find((n) => n.id === selected);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
        <MapStatusBadge status={mapStatus} />
      </div>
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
        <SafeDeploymentMap
          nodes={nodes}
          selectedId={selected}
          onSelect={setSelected}
          onStatusChange={setMapStatus}
        />
        <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border p-3 text-center">
            <p className="text-2xl font-bold text-emerald-600">{stats.online}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Online</p>
          </div>
          <div className="rounded-xl border p-3 text-center">
            <p className="text-2xl font-bold text-orange-500">{stats.refugee}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Refugee</p>
          </div>
          <div className="rounded-xl border p-3 text-center">
            <p className="text-2xl font-bold text-emerald-500">{stats.farm}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Farm</p>
          </div>
        </div>
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {nodes.map((n) => (
            <button
              key={n.id}
              onClick={() => setSelected(n.id)}
              className={`w-full text-left rounded-xl border p-3 hover:bg-muted/40 transition-colors ${selected === n.id ? "ring-2 ring-emerald-500" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{n.site}</p>
                  <p className="text-[11px] text-muted-foreground">{n.type}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${n.status === "online" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/15 text-amber-700 dark:text-amber-300"}`}>
                  {n.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 text-[11px]">
                <span>🔋 {n.battery.toFixed(0)}%</span>
                <span>📶 {n.signal.toFixed(0)}%</span>
                <span>🌱 {n.soil.toFixed(0)}%</span>
              </div>
            </button>
          ))}
        </div>
        {sel && (
          <div className="rounded-xl border-2 border-emerald-500/40 p-3 bg-emerald-500/5">
            <p className="text-xs text-muted-foreground">Selected</p>
            <p className="font-bold">{sel.site}</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};
