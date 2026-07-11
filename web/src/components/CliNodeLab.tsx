import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import {
  Sun, Cloud, CloudRain, Droplets, Thermometer, Battery, Radio,
  AlertTriangle, CheckCircle2, Wifi, WifiOff, Activity, Play, Pause,
  Download, Settings2, HelpCircle, X, Hand, Pointer, MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Scenario = "sun" | "cloud" | "rain" | "drought";

interface Reading {
  device_id: string;
  moisture: number;
  temperature: number;
  solar: number;
  battery: number;
  rssi: number;
  recorded_at: string;
}

interface DeviceCfg {
  id: string;
  label: string;
  location: string;
  scenario: Scenario;
  baseBattery: number;
  baseRssi: number;
}

interface Thresholds {
  batteryLow: number;
  latencyHigh: number;
  rssiDrop: number;
}

const DEVICES: DeviceCfg[] = [
  { id: "CLINODE-A1", label: "Field A · Maize",     location: "Ikire, NG",   scenario: "sun",     baseBattery: 94, baseRssi: -78 },
  { id: "CLINODE-B2", label: "Field B · Cassava",   location: "Osogbo, NG",  scenario: "cloud",   baseBattery: 81, baseRssi: -88 },
  { id: "CLINODE-C3", label: "Refugee plot · Tom.", location: "Kakuma, KE",  scenario: "drought", baseBattery: 67, baseRssi: -94 },
  { id: "CLINODE-D4", label: "Field D · Rice",      location: "Kigali, RW",  scenario: "rain",    baseBattery: 88, baseRssi: -72 },
];

const SCENARIOS: Record<Scenario, { label: string; icon: typeof Sun; moisture: number; temp: number; solar: number; advice: string; color: string }> = {
  sun:     { label: "Sunny",    icon: Sun,         moisture: 38, temp: 31, solar: 4.6, advice: "Optimal growth window. Irrigate at dusk.",          color: "from-amber-400 to-orange-500" },
  cloud:   { label: "Cloudy",   icon: Cloud,       moisture: 44, temp: 26, solar: 2.1, advice: "Good for transplanting. Monitor humidity.",         color: "from-slate-400 to-slate-600" },
  rain:    { label: "Rainfall", icon: CloudRain,   moisture: 78, temp: 23, solar: 0.9, advice: "Flood risk rising. Move livestock to high ground.", color: "from-sky-500 to-blue-600" },
  drought: { label: "Drought",  icon: Thermometer, moisture: 14, temp: 38, solar: 5.1, advice: "Soil critically dry. Activate drip irrigation.",   color: "from-rose-500 to-red-600" },
};

const MAX_HISTORY = 24;
const STORAGE_KEY = "clisense.lab.thresholds";
const HELP_KEY = "clisense.lab.helpSeen";

const TiltCard = ({ children, onTap }: { children: React.ReactNode; onTap?: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-50, 50], [14, -14]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(x, [-50, 50], [-14, 14]), { stiffness: 200, damping: 20 });
  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set(((e.clientX - r.left) / r.width - 0.5) * 100);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 100);
  };
  const reset = () => { x.set(0); y.set(0); };
  return (
    <motion.div ref={ref} onPointerMove={handleMove} onPointerLeave={reset} onPointerCancel={reset} onClick={onTap}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000, touchAction: "none" }}
      className="relative will-change-transform cursor-pointer select-none">
      {children}
    </motion.div>
  );
};

const useEased = (target: number, duration = 600) => {
  const [val, setVal] = useState(target);
  useEffect(() => {
    const start = val;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(+(start + (target - start) * eased).toFixed(1));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return val;
};

const formatAgo = (iso: string | null) => {
  if (!iso) return "—";
  const s = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
};

const seedHistory = (dev: DeviceCfg): Reading[] => {
  const sc = SCENARIOS[dev.scenario];
  const now = Date.now();
  return Array.from({ length: MAX_HISTORY }, (_, i) => {
    const t = now - (MAX_HISTORY - 1 - i) * 60_000 * 2;
    const wobble = Math.sin(i / 3) * 4 + (Math.random() - 0.5) * 3;
    return {
      device_id: dev.id,
      moisture: +(sc.moisture + wobble).toFixed(1),
      temperature: +(sc.temp + wobble * 0.3).toFixed(1),
      solar: +(Math.max(0, sc.solar + wobble * 0.1)).toFixed(2),
      battery: +(Math.max(0, dev.baseBattery - i * 0.15)).toFixed(1),
      rssi: Math.round(dev.baseRssi + (Math.random() - 0.5) * 6),
      recorded_at: new Date(t).toISOString(),
    };
  });
};

export const CliNodeLab = () => {
  const [deviceId, setDeviceId] = useState<string>(DEVICES[0].id);
  const device = DEVICES.find((d) => d.id === deviceId)!;

  const [historyMap, setHistoryMap] = useState<Record<string, Reading[]>>(() =>
    Object.fromEntries(DEVICES.map((d) => [d.id, seedHistory(d)]))
  );
  const history = historyMap[deviceId] ?? [];

  const [scrubIdx, setScrubIdx] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [pulse, setPulse] = useState(0);
  const [latency, setLatency] = useState<number>(420);
  const [, force] = useState(0);

  // Help overlay (auto-show first visit)
  const [helpOpen, setHelpOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem(HELP_KEY);
  });
  const closeHelp = () => {
    setHelpOpen(false);
    try { localStorage.setItem(HELP_KEY, "1"); } catch { /* noop */ }
  };

  // Thresholds (persisted)
  const [thresholds, setThresholds] = useState<Thresholds>(() => {
    if (typeof window === "undefined") return { batteryLow: 30, latencyHigh: 5000, rssiDrop: -100 };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch { /* noop */ }
    return { batteryLow: 30, latencyHigh: 5000, rssiDrop: -100 };
  });
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(thresholds)); } catch { /* noop */ }
  }, [thresholds]);

  // Tick + simulate ingest every 4s for the active device
  useEffect(() => {
    const tickId = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(tickId);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setHistoryMap((prev) => {
        const next: Record<string, Reading[]> = { ...prev };
        for (const d of DEVICES) {
          const sc = SCENARIOS[d.scenario];
          const last = prev[d.id][prev[d.id].length - 1];
          const wobble = (Math.random() - 0.5) * 4;
          const newReading: Reading = {
            device_id: d.id,
            moisture: +Math.max(5, Math.min(95, Number(last.moisture) + wobble)).toFixed(1),
            temperature: +Math.max(10, Math.min(45, Number(last.temperature) + wobble * 0.2)).toFixed(1),
            solar: +Math.max(0, Math.min(6, sc.solar + (Math.random() - 0.5) * 0.6)).toFixed(2),
            battery: +Math.max(0, Number(last.battery) - 0.05 + (Math.random() < 0.05 ? -0.5 : 0)).toFixed(1),
            rssi: Math.round(d.baseRssi + (Math.random() - 0.5) * 12),
            recorded_at: new Date().toISOString(),
          };
          next[d.id] = [...prev[d.id].slice(-(MAX_HISTORY - 1)), newReading];
        }
        return next;
      });
      setLatency(Math.round(180 + Math.random() * 600 + (Math.random() < 0.08 ? 5500 : 0)));
      setPulse((p) => p + 1);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // Threshold alerts (fire once per crossing per device)
  const alertedRef = useRef<Record<string, { battery?: boolean; latency?: boolean; rssi?: boolean }>>({});
  useEffect(() => {
    const tip = history[history.length - 1];
    if (!tip) return;
    const a = (alertedRef.current[deviceId] ??= {});

    if (Number(tip.battery) <= thresholds.batteryLow && !a.battery) {
      a.battery = true;
      toast.warning(`${device.label}: battery low`, { description: `${tip.battery}% — below ${thresholds.batteryLow}% threshold`, icon: <Battery className="w-4 h-4" /> });
    } else if (Number(tip.battery) > thresholds.batteryLow + 2) a.battery = false;

    if (latency >= thresholds.latencyHigh && !a.latency) {
      a.latency = true;
      toast.error(`${device.label}: high latency`, { description: `${latency} ms — above ${thresholds.latencyHigh} ms threshold`, icon: <Activity className="w-4 h-4" /> });
    } else if (latency < thresholds.latencyHigh - 500) a.latency = false;

    if (Number(tip.rssi) <= thresholds.rssiDrop && !a.rssi) {
      a.rssi = true;
      toast(`${device.label}: weak signal`, { description: `RSSI ${tip.rssi} dBm — at/below ${thresholds.rssiDrop} dBm`, icon: <Radio className="w-4 h-4" /> });
    } else if (Number(tip.rssi) > thresholds.rssiDrop + 4) a.rssi = false;
  }, [history, latency, thresholds, deviceId, device.label]);

  // Reset scrubber when switching device
  useEffect(() => { setScrubIdx(null); setPlaying(false); }, [deviceId]);

  // Scrubber playback
  useEffect(() => {
    if (!playing || history.length === 0) return;
    const id = setInterval(() => {
      setScrubIdx((i) => {
        const cur = i ?? 0;
        if (cur >= history.length - 1) { setPlaying(false); return null; }
        return cur + 1;
      });
    }, 350);
    return () => clearInterval(id);
  }, [playing, history.length]);

  const tip = history[history.length - 1];
  const live = scrubIdx != null ? history[scrubIdx] : tip;
  const sc = SCENARIOS[device.scenario];

  const moisture = useEased(live ? Number(live.moisture) : sc.moisture);
  const temp = useEased(live ? Number(live.temperature) : sc.temp);
  const solar = useEased(live ? Number(live.solar) : sc.solar);
  const battery = useEased(live ? Number(live.battery) : 96);

  const tapPulse = useCallback(() => setPulse((p) => p + 1), []);

  const risk: "low" | "med" | "high" = useMemo(() => {
    if (!live) return "low";
    const m = Number(live.moisture), t = Number(live.temperature);
    if (m > 70 || m < 18 || t > 36) return "high";
    if (m > 60 || m < 25 || t > 33) return "med";
    return "low";
  }, [live]);

  const advice = risk === "high"
    ? (live && Number(live.moisture) > 70 ? "Flood risk rising. Move livestock to high ground." : "Soil critically dry. Activate drip irrigation.")
    : risk === "med" ? "Conditions shifting. Check field within 12h." : sc.advice;

  const riskColor = risk === "high" ? "text-rose-500 bg-rose-500/10 border-rose-500/30"
    : risk === "med" ? "text-amber-500 bg-amber-500/10 border-amber-500/30"
    : "text-emerald-500 bg-emerald-500/10 border-emerald-500/30";

  const sparkData = history.map((h) => Number(h.moisture));
  const maxSpark = Math.max(...sparkData, 1);
  const minSpark = Math.min(...sparkData, 0);

  const healthState: "ok" | "warn" | "down" =
    latency > thresholds.latencyHigh ? "warn" : "ok";

  // CSV export
  const exportCsv = () => {
    if (history.length === 0) return;
    const header = ["device_id", "recorded_at", "moisture_pct", "temperature_c", "solar_w", "battery_pct", "rssi_dbm"];
    const rows = history.map((r) => [r.device_id, r.recorded_at, r.moisture, r.temperature, r.solar, r.battery, r.rssi].join(","));
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${deviceId}_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded", { description: `${history.length} readings from ${device.label}` });
  };

  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950 p-6 md:p-10 overflow-hidden ring-1 ring-white/10">
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
      }} />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top toolbar */}
      <div className="relative flex flex-wrap items-center gap-2 mb-5">
        <Select value={deviceId} onValueChange={setDeviceId}>
          <SelectTrigger className="w-[220px] bg-white/10 border-white/15 text-white hover:bg-white/15">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DEVICES.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{d.id}</span>
                  <span>{d.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="inline-flex items-center gap-1 text-white/70 text-xs">
          <MapPin className="w-3 h-3" /> {device.location}
        </span>

        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="bg-white/10 border-white/15 text-white hover:bg-white/20" onClick={exportCsv}>
            <Download className="w-3.5 h-3.5 mr-1" /> CSV
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline" className="bg-white/10 border-white/15 text-white hover:bg-white/20">
                <Settings2 className="w-3.5 h-3.5 mr-1" /> Alerts
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Alert thresholds</p>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1"><Battery className="w-3 h-3" /> Battery low (≤)</span>
                    <span className="font-mono">{thresholds.batteryLow}%</span>
                  </Label>
                  <Slider value={[thresholds.batteryLow]} min={5} max={80} step={1}
                    onValueChange={(v) => setThresholds((t) => ({ ...t, batteryLow: v[0] }))} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> Latency high (≥)</span>
                    <span className="font-mono">{thresholds.latencyHigh} ms</span>
                  </Label>
                  <Slider value={[thresholds.latencyHigh]} min={500} max={10000} step={250}
                    onValueChange={(v) => setThresholds((t) => ({ ...t, latencyHigh: v[0] }))} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1"><Radio className="w-3 h-3" /> RSSI drop (≤)</span>
                    <span className="font-mono">{thresholds.rssiDrop} dBm</span>
                  </Label>
                  <Input type="number" value={thresholds.rssiDrop} min={-130} max={-50} step={1}
                    onChange={(e) => setThresholds((t) => ({ ...t, rssiDrop: Number(e.target.value) }))}
                    className="h-8 text-xs" />
                </div>
                <p className="text-[10px] text-muted-foreground">Toasts fire once per crossing — saved to this browser.</p>
              </div>
            </PopoverContent>
          </Popover>
          <Button size="sm" variant="outline" className="bg-white/10 border-white/15 text-white hover:bg-white/20" onClick={() => setHelpOpen(true)}>
            <HelpCircle className="w-3.5 h-3.5 mr-1" /> Help
          </Button>
        </div>
      </div>

      <div className="relative grid lg:grid-cols-[1fr_1.1fr] gap-8 items-center">
        {/* LEFT — interactive 3D device */}
        <div className="flex flex-col items-center relative">
          <TiltCard onTap={tapPulse}>
            <div className="relative w-64 h-80 md:w-72 md:h-96 rounded-[2rem] bg-gradient-to-b from-slate-100 via-white to-slate-200 shadow-2xl border border-white/40 overflow-hidden">
              <div className="absolute top-3 left-3 right-3 h-16 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-1.5 shadow-inner">
                <div className="grid grid-cols-6 grid-rows-2 gap-0.5 h-full">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="bg-gradient-to-br from-blue-900 to-indigo-950 rounded-sm" />
                  ))}
                </div>
                <motion.div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent rounded-xl" animate={{ opacity: solar / 6 }} />
              </div>

              <div className="absolute top-24 left-3 right-3 bottom-20 rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-700 tracking-widest">{deviceId}</span>
                  <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.6, repeat: Infinity }} className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-slate-600"><Droplets className="w-3 h-3 text-cyan-500" /> H2O</span>
                    <span className="font-bold text-slate-800 tabular-nums">{moisture}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500" animate={{ width: `${moisture}%` }} transition={{ duration: 0.6 }} />
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="flex items-center gap-1 text-slate-600"><Thermometer className="w-3 h-3 text-rose-500" /> Temp</span>
                    <span className="font-bold text-slate-800 tabular-nums">{temp}°C</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-amber-400 to-rose-500" animate={{ width: `${(temp / 45) * 100}%` }} transition={{ duration: 0.6 }} />
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="flex items-center gap-1 text-slate-600"><Battery className="w-3 h-3 text-emerald-500" /> Bat</span>
                    <span className="font-bold text-slate-800 tabular-nums">{battery}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-emerald-400 to-green-600" animate={{ width: `${battery}%` }} transition={{ duration: 0.6 }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><Radio className="w-3 h-3" /> LoRa</span>
                  <span>RSSI {live?.rssi ?? -82} dBm</span>
                </div>
              </div>

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-20 bg-gradient-to-b from-slate-400 to-slate-700 rounded-b-full" />
              <motion.div className="absolute -top-6 right-8 w-1 h-8 bg-slate-700 rounded-full" animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.9)]" />
              </motion.div>
              <AnimatePresence>
                <motion.span key={pulse} initial={{ scale: 0.6, opacity: 0.7 }} animate={{ scale: 2.4, opacity: 0 }} transition={{ duration: 1.6, ease: "easeOut" }}
                  className="absolute -top-6 right-8 w-3 h-3 rounded-full border-2 border-emerald-400 pointer-events-none" />
              </AnimatePresence>
            </div>
          </TiltCard>

          <p className="text-white/60 text-xs mt-4 italic text-center px-4">
            Drag to tilt · tap to ping · simulated stream every 4s
          </p>

          {/* Help overlay */}
          <AnimatePresence>
            {helpOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 flex items-center justify-center p-4 backdrop-blur-md bg-black/40 rounded-2xl">
                <motion.div initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
                  className="relative bg-white/95 dark:bg-slate-900/95 rounded-2xl p-5 max-w-xs shadow-2xl border border-white/40">
                  <button onClick={closeHelp} className="absolute top-2 right-2 p-1 rounded-md hover:bg-muted" aria-label="Close help">
                    <X className="w-4 h-4" />
                  </button>
                  <p className="text-xs uppercase tracking-widest text-emerald-600 font-bold mb-3">How to use</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-600 shrink-0"><Hand className="w-4 h-4" /></div>
                      <div>
                        <p className="font-semibold leading-tight">Drag to tilt</p>
                        <p className="text-xs text-muted-foreground">Move your finger across the device to rotate it in 3D.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-sky-500/15 text-sky-600 shrink-0"><Pointer className="w-4 h-4" /></div>
                      <div>
                        <p className="font-semibold leading-tight">Tap to ping</p>
                        <p className="text-xs text-muted-foreground">Tap the device to fire a transmission pulse from the antenna.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/15 text-amber-600 shrink-0"><Activity className="w-4 h-4" /></div>
                      <div>
                        <p className="font-semibold leading-tight">Scrub the timeline</p>
                        <p className="text-xs text-muted-foreground">Drag the slider below to replay the last 24 readings.</p>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" className="w-full mt-4" onClick={closeHelp}>Got it</Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT — controls */}
        <div className="space-y-4">
          {/* Connection health panel */}
          <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/70 text-xs uppercase tracking-widest">Connection health · {deviceId}</p>
              <motion.span animate={{ opacity: healthState === "ok" ? [1, 0.4, 1] : 1 }} transition={{ duration: 1.4, repeat: Infinity }}
                className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                  healthState === "ok" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                  : healthState === "warn" ? "bg-amber-500/20 text-amber-300 border border-amber-400/40"
                  : "bg-rose-500/20 text-rose-300 border border-rose-400/40"
                }`}>
                {healthState === "ok" ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {healthState === "ok" ? "Connected" : "Degraded"}
              </motion.span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-white/5 p-2">
                <p className="text-[10px] text-white/50 uppercase tracking-wide">Latency</p>
                <p className="text-white font-bold text-sm tabular-nums">{latency} ms</p>
              </div>
              <div className="rounded-lg bg-white/5 p-2">
                <p className="text-[10px] text-white/50 uppercase tracking-wide">Last msg</p>
                <p className="text-white font-bold text-sm tabular-nums">{formatAgo(tip?.recorded_at ?? null)}</p>
              </div>
              <div className="rounded-lg bg-white/5 p-2">
                <p className="text-[10px] text-white/50 uppercase tracking-wide">Buffer</p>
                <p className="text-white font-bold text-sm tabular-nums">{history.length}/{MAX_HISTORY}</p>
              </div>
            </div>
          </div>

          {/* Live readings */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { Icon: Droplets, val: `${moisture}%`, label: "Soil", color: "from-cyan-400 to-blue-600" },
              { Icon: Thermometer, val: `${temp}°C`, label: "Air", color: "from-amber-400 to-rose-500" },
              { Icon: Sun, val: `${solar}W`, label: "Solar", color: "from-yellow-400 to-orange-500" },
            ].map((m, i) => (
              <div key={i} className="rounded-2xl bg-white/10 border border-white/10 p-3 backdrop-blur">
                <div className={`inline-flex p-1.5 rounded-lg bg-gradient-to-br ${m.color} mb-1.5`}><m.Icon className="w-3.5 h-3.5 text-white" /></div>
                <p className="text-white font-bold text-lg tabular-nums leading-none">{m.val}</p>
                <p className="text-white/60 text-[10px] uppercase tracking-wide mt-1">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Sparkline + risk */}
          <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/70 text-xs uppercase tracking-widest flex items-center gap-1.5"><Activity className="w-3 h-3" /> Last {sparkData.length} readings</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase ${riskColor}`}>
                {risk === "high" ? <span className="inline-flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {risk}</span>
                : <span className="inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {risk}</span>}
              </span>
            </div>
            <svg viewBox="0 0 240 60" className="w-full h-14">
              <defs>
                <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                </linearGradient>
              </defs>
              {(() => {
                const w = 240, h = 60, pad = 4;
                const range = Math.max(1, maxSpark - minSpark);
                const pts = sparkData.map((v, i) => {
                  const x = (i / Math.max(1, sparkData.length - 1)) * (w - pad * 2) + pad;
                  const y = h - ((v - minSpark) / range) * (h - pad * 2) - pad;
                  return [x, y];
                });
                if (pts.length === 0) return null;
                const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
                const area = `${d} L${pts[pts.length - 1][0]},${h} L${pts[0][0]},${h} Z`;
                const cur = pts[scrubIdx ?? pts.length - 1];
                return (
                  <>
                    <path d={area} fill="url(#sparkFill)" />
                    <path d={d} fill="none" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" />
                    {cur && <line x1={cur[0]} y1={0} x2={cur[0]} y2={h} stroke="rgba(255,255,255,0.3)" strokeDasharray="2 2" />}
                    {cur && <circle cx={cur[0]} cy={cur[1]} r="3.5" fill="#fff" />}
                  </>
                );
              })()}
            </svg>
            <p className="text-white/85 text-sm mt-2 leading-snug">{advice}</p>
          </div>

          {/* Timeline scrubber */}
          {history.length > 1 && (
            <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/70 text-xs uppercase tracking-widest">Replay timeline</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/60 tabular-nums">
                    {scrubIdx != null ? formatAgo(history[scrubIdx].recorded_at) : "live"}
                  </span>
                  <button onClick={() => { if (scrubIdx == null) setScrubIdx(0); setPlaying((p) => !p); }}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white" aria-label={playing ? "Pause" : "Play"}>
                    {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => { setScrubIdx(null); setPlaying(false); }}
                    className="text-[10px] px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Live
                  </button>
                </div>
              </div>
              <Slider value={[scrubIdx ?? history.length - 1]} min={0} max={history.length - 1} step={1}
                onValueChange={(v) => { setScrubIdx(v[0]); setPlaying(false); }} className="my-1" />
              <div className="flex justify-between text-[10px] text-white/50 mt-1">
                <span>oldest</span>
                <span>newest</span>
              </div>
            </div>
          )}

          <Button className="w-full bg-white text-emerald-900 hover:bg-emerald-50 font-semibold"
            onClick={() => document.getElementById("auth")?.scrollIntoView({ behavior: "smooth" })}>
            Stream this to my farm
          </Button>
        </div>
      </div>
    </div>
  );
};
