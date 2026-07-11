import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export interface MapNode {
  id: string;
  site: string;
  type: string;
  category: "refugee" | "farm";
  status: "online" | "syncing";
  battery: number;
  signal: number;
  soil: number;
  lat: number;
  lng: number;
}

interface DeploymentMapProps {
  nodes: MapNode[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

const FlyToSelected = ({ nodes, selectedId }: { nodes: MapNode[]; selectedId?: string | null }) => {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const n = nodes.find((x) => x.id === selectedId);
    if (n) map.flyTo([n.lat, n.lng], 6, { duration: 0.8 });
  }, [selectedId, nodes, map]);
  return null;
};

export const DeploymentMap = ({ nodes, selectedId, onSelect }: DeploymentMapProps) => {
  const validNodes = (nodes ?? []).filter(
    (n) => Number.isFinite(n?.lat) && Number.isFinite(n?.lng)
  );
  const center: [number, number] = [0.5, 32]; // central africa-ish
  return (
    <div className="rounded-2xl overflow-hidden border border-border/60 h-[360px] relative z-0">
      <MapContainer
        center={center}
        zoom={4}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyToSelected nodes={validNodes} selectedId={selectedId} />
        {validNodes.map((n) => {
          const color = n.category === "refugee" ? "#f97316" : "#10b981";
          const isSelected = selectedId === n.id;
          return (
            <CircleMarker
              key={n.id}
              center={[n.lat, n.lng]}
              radius={isSelected ? 12 : 8}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: n.status === "online" ? 0.85 : 0.45,
                weight: isSelected ? 3 : 2,
              }}
              eventHandlers={{
                click: () => onSelect?.(n.id),
              }}
            >
              <Popup>
                <div className="text-xs">
                  <p className="font-bold">{n.site}</p>
                  <p className="text-muted-foreground">{n.type}</p>
                  <p className="mt-1">Battery {n.battery}% · Signal {n.signal}%</p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      <div className="absolute top-2 right-2 bg-background/90 backdrop-blur rounded-lg px-3 py-2 text-xs shadow-md space-y-1 z-[1000]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ background: "#f97316" }} />
          Refugee settlements
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ background: "#10b981" }} />
          Farm cooperatives
        </div>
      </div>
    </div>
  );
};
