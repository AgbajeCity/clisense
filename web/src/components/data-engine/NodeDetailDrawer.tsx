import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Battery, Signal, Droplets, MapPin, Activity, Cpu, Wifi } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { MapNode } from "./DeploymentMap";

export interface NodeHistoryPoint {
  t: string;
  battery: number;
  signal: number;
  soil: number;
}

interface NodeDetailDrawerProps {
  node: MapNode | null;
  history: NodeHistoryPoint[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NodeDetailDrawer = ({ node, history, open, onOpenChange }: NodeDetailDrawerProps) => {
  if (!node) return null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="text-left">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <Cpu className="w-4 h-4 text-primary" />
            </div>
            <Badge
              className={
                node.status === "online"
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 border-amber-500/20"
              }
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
              {node.status}
            </Badge>
          </div>
          <SheetTitle className="text-lg">{node.id} · {node.site}</SheetTitle>
          <SheetDescription className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {node.type}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          {/* Live readings */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/50 rounded-xl p-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <Battery className="w-3 h-3" /> Battery
              </div>
              <p className="text-lg font-bold">{node.battery}%</p>
              <Progress value={node.battery} className="h-1 mt-1" />
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <Signal className="w-3 h-3" /> Signal
              </div>
              <p className="text-lg font-bold">{node.signal}%</p>
              <Progress value={node.signal} className="h-1 mt-1" />
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <Droplets className="w-3 h-3" /> Soil
              </div>
              <p className="text-lg font-bold">{node.soil}%</p>
              <Progress value={node.soil} className="h-1 mt-1" />
            </div>
          </div>

          {/* History chart */}
          <div className="bg-card border border-border/60 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <p className="font-semibold text-sm">24h history</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Wifi className="w-3 h-3 text-emerald-500 animate-pulse" /> live
              </div>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="t" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Line type="monotone" dataKey="battery" stroke="#10b981" strokeWidth={2} dot={false} name="Battery" />
                  <Line type="monotone" dataKey="signal" stroke="#3b82f6" strokeWidth={2} dot={false} name="Signal" />
                  <Line type="monotone" dataKey="soil" stroke="#06b6d4" strokeWidth={2} dot={false} name="Soil" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-around text-xs mt-2">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />Battery</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" />Signal</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500" />Soil</span>
            </div>
          </div>

          {/* Location */}
          <div className="bg-muted/50 rounded-xl p-4 text-sm">
            <p className="text-xs text-muted-foreground mb-1">Coordinates</p>
            <p className="font-mono">{node.lat.toFixed(4)}, {node.lng.toFixed(4)}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
