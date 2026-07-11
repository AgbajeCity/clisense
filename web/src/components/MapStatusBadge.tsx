import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

export type MapStatus = "ok" | "failed" | "recovering";

interface Props {
  status: MapStatus;
  className?: string;
}

const CONFIG: Record<MapStatus, { label: string; icon: typeof CheckCircle2; styles: string; dot: string }> = {
  ok: {
    label: "Map OK",
    icon: CheckCircle2,
    styles: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  failed: {
    label: "Map failed",
    icon: AlertTriangle,
    styles: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30",
    dot: "bg-rose-500",
  },
  recovering: {
    label: "Recovering",
    icon: RotateCw,
    styles: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
    dot: "bg-amber-500 animate-pulse",
  },
};

export const MapStatusBadge = ({ status, className }: Props) => {
  const c = CONFIG[status];
  const Icon = c.icon;
  // brief flash when status changes
  const [bumped, setBumped] = useState(false);
  useEffect(() => {
    setBumped(true);
    const t = setTimeout(() => setBumped(false), 400);
    return () => clearTimeout(t);
  }, [status]);

  return (
    <span
      data-testid="map-status-badge"
      data-status={status}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border transition-all",
        c.styles,
        bumped && "scale-105",
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", c.dot)} />
      <Icon className={cn("w-3 h-3", status === "recovering" && "animate-spin")} />
      {c.label}
    </span>
  );
};
