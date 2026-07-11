import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Cpu, Radio, Battery, Sprout, Droplets, Wifi } from "lucide-react";
import clinodeHero from "@/assets/clinode-hero.jpg";

const HOTSPOTS = [
  {
    id: "solar",
    icon: Sun,
    label: "Solar Panel",
    spec: "5W mono-Si · 24/7 self-charging",
    pos: { top: "18%", left: "50%" },
    color: "from-amber-400 to-orange-500",
  },
  {
    id: "antenna",
    icon: Radio,
    label: "LoRaWAN",
    spec: "10 km range · 2G/NB-IoT fallback",
    pos: { top: "26%", left: "82%" },
    color: "from-sky-400 to-blue-600",
  },
  {
    id: "led",
    icon: Wifi,
    label: "Live Status",
    spec: "Streams every 15 minutes",
    pos: { top: "40%", left: "50%" },
    color: "from-emerald-400 to-green-600",
  },
  {
    id: "mcu",
    icon: Cpu,
    label: "ESP32 + Edge AI",
    spec: "On-device flood pre-detect",
    pos: { top: "55%", left: "30%" },
    color: "from-violet-500 to-fuchsia-600",
  },
  {
    id: "probe",
    icon: Sprout,
    label: "Soil Probe",
    spec: "NPK · pH · moisture · temp",
    pos: { top: "78%", left: "50%" },
    color: "from-lime-500 to-emerald-600",
  },
];

const LIVE_METRICS = [
  { icon: Droplets, label: "Soil moist.", unit: "%", min: 28, max: 46, color: "text-cyan-300" },
  { icon: Sun, label: "Solar in.", unit: "W", min: 3.4, max: 4.9, color: "text-amber-300" },
  { icon: Battery, label: "Battery", unit: "%", min: 88, max: 96, color: "text-emerald-300" },
];

export const CliNodeShowcase = () => {
  const [active, setActive] = useState<string>("led");
  const [metrics, setMetrics] = useState(
    LIVE_METRICS.map((m) => ({ ...m, value: (m.min + m.max) / 2 }))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => ({
          ...m,
          value: +(m.min + Math.random() * (m.max - m.min)).toFixed(1),
        }))
      );
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const activeHotspot = HOTSPOTS.find((h) => h.id === active);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Device image with interactive hotspots */}
      <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/30 ring-1 ring-white/10">
        <img
          src={clinodeHero}
          alt="CliNode IoT sensor in a smallholder farm"
          className="w-full h-full object-cover"
          width={1024}
          height={1024}
        />
        {/* Subtle scan-line aura */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent pointer-events-none" />

        {/* Hotspots */}
        {HOTSPOTS.map((h) => {
          const isActive = active === h.id;
          return (
            <button
              key={h.id}
              onClick={() => setActive(h.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              style={{ top: h.pos.top, left: h.pos.left }}
              aria-label={h.label}
            >
              <span className={`absolute inset-0 rounded-full ${isActive ? "animate-ping" : ""} bg-emerald-400/60`} />
              <span
                className={`relative block w-5 h-5 rounded-full border-2 border-white shadow-lg transition-all ${
                  isActive
                    ? "scale-125 bg-gradient-to-br " + h.color
                    : "bg-white/90 group-hover:scale-110"
                }`}
              />
            </button>
          );
        })}

        {/* Active hotspot label */}
        <AnimatePresence mode="wait">
          {activeHotspot && (
            <motion.div
              key={activeHotspot.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-4 left-4 right-4 backdrop-blur-xl bg-black/50 rounded-2xl p-3 border border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${activeHotspot.color}`}>
                  <activeHotspot.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{activeHotspot.label}</p>
                  <p className="text-white/70 text-xs">{activeHotspot.spec}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Live floating metric chips */}
      <div className="absolute -left-3 top-8 hidden md:block">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-3 py-2 shadow-xl"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white text-xs font-semibold tracking-wide">CliNode · Live</span>
          </div>
        </motion.div>
      </div>

      <div className="absolute -right-3 bottom-24 hidden md:block">
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-3 shadow-xl space-y-2 min-w-[140px]"
        >
          {metrics.map((m) => (
            <div key={m.label} className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-white/80">
                <m.icon className={`w-3 h-3 ${m.color}`} />
                {m.label}
              </div>
              <span className="font-bold text-white tabular-nums">
                {m.value}
                {m.unit}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
