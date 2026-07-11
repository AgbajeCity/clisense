import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft, Cpu, Radio, Sun, Battery, Shield, Sprout, Globe, Target,
  Wifi, Zap, Thermometer, Download, ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import clinodeHero from "@/assets/clinode-hero.jpg";
import clinodePcb from "@/assets/clinode-pcb.jpg";
import clinodeFarm from "@/assets/clinode-deployed-farm.jpg";
import clinodeRefugee from "@/assets/clinode-deployed-refugee.jpg";
import { downloadCliNodeSpecPdf } from "@/lib/clinodeSpecPdf";

const HARDWARE = [
  { icon: Cpu, label: "MCU", value: "ESP32-S3 · 240MHz dual-core", grad: "from-violet-500 to-fuchsia-600" },
  { icon: Radio, label: "Radio", value: "LoRaWAN SX1262 · NB-IoT failover", grad: "from-sky-500 to-blue-600" },
  { icon: Sun, label: "Power", value: "5W mono-Si solar · MPPT", grad: "from-amber-500 to-orange-500" },
  { icon: Battery, label: "Battery", value: "18650 Li-Ion · 7d autonomy", grad: "from-emerald-500 to-green-600" },
  { icon: Sprout, label: "Soil Probe", value: "NPK · pH · Moisture · Temp", grad: "from-lime-500 to-emerald-600" },
  { icon: Thermometer, label: "Climate", value: "BME280 air T/H/P · UV index", grad: "from-rose-500 to-pink-600" },
  { icon: Shield, label: "Housing", value: "IP67 · 70% recycled e-waste", grad: "from-slate-500 to-slate-700" },
  { icon: Globe, label: "Mesh", value: "10km LoRa range · 32 nodes/gateway", grad: "from-cyan-500 to-teal-600" },
];

const POWER = [
  { label: "Solar input", val: 75, suffix: "5W peak" },
  { label: "Battery cycle", val: 92, suffix: "2000+ cycles" },
  { label: "Sleep current", val: 96, suffix: "12µA deep sleep" },
  { label: "Uptime SLA", val: 99, suffix: "99.2% field-tested" },
];

const CONNECTIVITY = [
  { proto: "LoRaWAN", range: "10 km LoS", power: "Ultra-low", icon: Radio },
  { proto: "NB-IoT", range: "Cellular", power: "Low", icon: Wifi },
  { proto: "BLE 5", range: "100 m setup", power: "Very low", icon: Zap },
];

const PHOTOS = [
  { src: clinodeFarm, caption: "Osun State, Nigeria · Smallholder cooperative" },
  { src: clinodeRefugee, caption: "Nakivale Settlement, Uganda · UNHCR partnership" },
  { src: clinodePcb, caption: "CliNode v2.1 mainboard · ESP32-S3 + LoRa SX1262" },
];

const CliNodeDevice = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Home
          </Button>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => downloadCliNodeSpecPdf(HARDWARE.map((h) => ({ label: h.label, value: h.value })))}>
              <Download className="w-4 h-4 mr-1" /> Specs PDF
            </Button>
            <Button size="sm" onClick={() => navigate("/setup-wizard")}>
              Setup wizard <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950 py-20">
        <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <Badge className="mb-4 bg-white/10 text-white border-white/20">CliNode v2.1</Badge>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-4">
              The device behind <span className="bg-gradient-to-r from-emerald-300 to-amber-300 bg-clip-text text-transparent">every forecast.</span>
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-md">
              Solar. Sealed. Self-healing mesh. Built from recycled e-waste.
            </p>
            <div className="flex flex-wrap gap-2">
              {["IP67", "5W solar", "10km LoRa", "7d battery", "ESP32-S3"].map((t) => (
                <span key={t} className="text-xs text-white/85 bg-white/10 border border-white/15 px-3 py-1.5 rounded-full">{t}</span>
              ))}
            </div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <img src={clinodeHero} alt="CliNode device" width={1280} height={832} className="rounded-3xl shadow-2xl ring-1 ring-white/10" />
          </motion.div>
        </div>
      </section>

      {/* Hardware grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-3 border-emerald-500/40 text-emerald-600">Hardware</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Engineered for the field.</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {HARDWARE.map((h, i) => (
              <motion.div key={h.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Card className="p-5 h-full hover:-translate-y-1 hover:shadow-xl transition-all">
                  <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${h.grad} mb-3 shadow`}>
                    <h.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{h.label}</p>
                  <p className="font-semibold text-sm mt-1">{h.value}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Power & Connectivity */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-10">
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Sun className="w-6 h-6 text-amber-500" />
              <h3 className="text-2xl font-bold">Power profile</h3>
            </div>
            <div className="space-y-5">
              {POWER.map((p) => (
                <div key={p.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{p.label}</span>
                    <span className="text-muted-foreground">{p.suffix}</span>
                  </div>
                  <Progress value={p.val} className="h-2" />
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Radio className="w-6 h-6 text-sky-500" />
              <h3 className="text-2xl font-bold">Connectivity</h3>
            </div>
            <div className="space-y-3">
              {CONNECTIVITY.map((c) => (
                <div key={c.proto} className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-sky-500/10">
                      <c.icon className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{c.proto}</p>
                      <p className="text-xs text-muted-foreground">{c.range}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{c.power}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Deployment photos */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-3 border-emerald-500/40 text-emerald-600">In the field</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Where CliNodes live.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PHOTOS.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="overflow-hidden group">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={p.src} alt={p.caption} loading="lazy" width={1280} height={832} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4 text-sm text-muted-foreground">{p.caption}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 to-teal-900 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">Ready to plant a CliNode?</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button size="lg" className="bg-white text-emerald-900 hover:bg-white/90" onClick={() => navigate("/setup-wizard")}>Start setup wizard</Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={() => navigate("/firmware-demo")}>Try firmware demo</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CliNodeDevice;
