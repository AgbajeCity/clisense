import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { DeploymentMap, type MapNode } from "@/components/data-engine/DeploymentMap";
import { NodeDetailDrawer, type NodeHistoryPoint } from "@/components/data-engine/NodeDetailDrawer";
import { downloadCliNodeSpecPdf } from "@/lib/clinodeSpecPdf";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FileDown, RefreshCw, Map as MapIcon, List, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Database,
  Upload,
  Download,
  Satellite,
  Brain,
  Activity,
  ArrowLeft,
  Droplets,
  Zap,
  Wheat,
  CheckCircle,
  Cloud,
  Sun,
  Cpu,
  Radio,
  Recycle,
  Tent,
  Sprout,
  MapPin,
  Wifi,
  Battery,
  Thermometer,
  Gauge,
  Wind,
  Signal,
  HardDrive,
  Users,
  ShieldCheck,
} from "lucide-react";

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));

const DataEngine = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [waterData, setWaterData] = useState({
    location_name: "",
    water_availability_m3: "",
    water_quality_index: "",
    precipitation_mm: "",
    water_stress_level: "low",
    measurement_date: new Date().toISOString().split("T")[0],
  });
  const [energyData, setEnergyData] = useState({
    location_name: "",
    solar_irradiance_kwh_m2: "",
    energy_consumption_kwh: "",
    grid_reliability_score: "",
    measurement_date: new Date().toISOString().split("T")[0],
  });
  const [foodData, setFoodData] = useState({
    location_name: "",
    crop_type: "",
    crop_yield_kg_ha: "",
    soil_health_index: "",
    measurement_date: new Date().toISOString().split("T")[0],
  });

  const submitData = (type: string) => {
    setLoading(true);
    setTimeout(() => {
      toast({
        title: `${type} data submitted successfully`,
        description: "Your data has been added to the nexus engine for analysis",
      });
      setLoading(false);
    }, 1200);
  };

  const sensorSpecs = [
    { icon: Sun, label: "Power", value: "5W solar panel + 4400 mAh Li-ion buffer", color: "from-amber-400 to-orange-500" },
    { icon: Cpu, label: "MCU", value: "ESP32-S3 dual-core, edge ML inference", color: "from-violet-500 to-fuchsia-500" },
    { icon: Radio, label: "Connectivity", value: "LoRaWAN 868/915 MHz, 2G/NB-IoT fallback, BLE", color: "from-sky-500 to-blue-600" },
    { icon: Thermometer, label: "Climate probes", value: "Air temp, humidity, soil moisture (3 depths)", color: "from-emerald-500 to-teal-500" },
    { icon: Gauge, label: "Soil & water", value: "NPK, pH, EC, leaf wetness, rain gauge", color: "from-cyan-500 to-blue-500" },
    { icon: Wind, label: "Resilience", value: "IP67, –10 °C to 65 °C, dust & flood tolerant", color: "from-slate-500 to-zinc-600" },
    { icon: HardDrive, label: "Edge storage", value: "16 MB local cache, store-and-forward", color: "from-indigo-500 to-purple-600" },
    { icon: Recycle, label: "Build", value: "≈70% recycled e-waste enclosure & wiring", color: "from-green-500 to-emerald-600" },
  ];

  const initialNodes: MapNode[] = [
    { id: "CLS-014", site: "Bidi Bidi Settlement, Uganda", type: "Refugee farm cluster", category: "refugee", battery: 92, signal: 86, soil: 31, status: "online", lat: 3.4, lng: 31.4 },
    { id: "CLS-027", site: "Kakuma Camp, Kenya", type: "Refugee livelihood plot", category: "refugee", battery: 78, signal: 64, soil: 22, status: "online", lat: 3.72, lng: 34.86 },
    { id: "CLS-041", site: "Ogun cooperative, Nigeria", type: "Smallholder maize farm", category: "farm", battery: 88, signal: 91, soil: 44, status: "online", lat: 7.16, lng: 3.35 },
    { id: "CLS-052", site: "Mahama Camp, Rwanda", type: "Pilot deployment", category: "refugee", battery: 54, signal: 48, soil: 27, status: "syncing", lat: -2.16, lng: 30.55 },
    { id: "CLS-063", site: "Nyeri cooperative, Kenya", type: "Smallholder coffee farm", category: "farm", battery: 81, signal: 73, soil: 52, status: "online", lat: -0.42, lng: 36.95 },
    { id: "CLS-078", site: "Kaduna cooperative, Nigeria", type: "Smallholder sorghum farm", category: "farm", battery: 67, signal: 58, soil: 36, status: "syncing", lat: 10.52, lng: 7.44 },
  ];

  const deployments = [
    {
      icon: Tent,
      title: "Refugee & displacement settlements",
      desc: "Co-deployed with camp food-security officers. Sensors share early flood, drought and crop-stress signals via SMS and voice in Swahili, Kinyarwanda, Arabic and local languages.",
      stats: [
        { label: "Settlements piloted", value: "3" },
        { label: "Households reached", value: "47" },
        { label: "Crop loss avoided", value: "30%" },
      ],
      gradient: "from-rose-500 to-orange-500",
    },
    {
      icon: Sprout,
      title: "Smallholder farm cooperatives",
      desc: "Mounted on 0.5–2 ha plots. One node covers up to 4 ha and feeds the WEF Nexus engine with hyperlocal soil, water and microclimate data every 15 minutes.",
      stats: [
        { label: "Active nodes", value: "32" },
        { label: "Crops protected", value: "450 t" },
        { label: "Flood prediction", value: "87%" },
      ],
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  const pipeline = [
    { icon: Activity, label: "Sense", desc: "Soil, water & climate every 15 min" },
    { icon: Radio, label: "Transmit", desc: "LoRaWAN → gateway → cloud" },
    { icon: Brain, label: "Analyse", desc: "WEF Nexus AI fuses with satellites" },
    { icon: Users, label: "Act", desc: "Voice / SMS advisory to farmer" },
  ];

  // ---- Live nodes state with simulated real-time refresh ----
  const [nodes, setNodes] = useState<MapNode[]>(initialNodes);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [history, setHistory] = useState<Record<string, NodeHistoryPoint[]>>(() => {
    const seed: Record<string, NodeHistoryPoint[]> = {};
    initialNodes.forEach((n) => {
      seed[n.id] = Array.from({ length: 12 }, (_, i) => ({
        t: `${String(i * 2).padStart(2, "0")}:00`,
        battery: clamp(n.battery + (Math.random() * 20 - 10)),
        signal: clamp(n.signal + (Math.random() * 20 - 10)),
        soil: clamp(n.soil + (Math.random() * 20 - 10)),
      }));
    });
    return seed;
  });

  const [filterCategory, setFilterCategory] = useState<"all" | "refugee" | "farm">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "online" | "syncing">("all");
  const [view, setView] = useState<"list" | "map">("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setNodes((prev) =>
        prev.map((n) => {
          const battery = clamp(n.battery + (Math.random() * 4 - 2));
          const signal = clamp(n.signal + (Math.random() * 8 - 4));
          const soil = clamp(n.soil + (Math.random() * 6 - 3));
          return { ...n, battery: Math.round(battery), signal: Math.round(signal), soil: Math.round(soil) };
        })
      );
      setHistory((prev) => {
        const next: Record<string, NodeHistoryPoint[]> = {};
        const stamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        Object.keys(prev).forEach((k) => {
          const series = prev[k];
          const last = series[series.length - 1];
          const point: NodeHistoryPoint = {
            t: stamp,
            battery: clamp(last.battery + (Math.random() * 4 - 2)),
            signal: clamp(last.signal + (Math.random() * 8 - 4)),
            soil: clamp(last.soil + (Math.random() * 6 - 3)),
          };
          next[k] = [...series.slice(-23), point];
        });
        return next;
      });
      setLastUpdate(new Date());
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const filteredNodes = useMemo(
    () =>
      nodes.filter(
        (n) =>
          (filterCategory === "all" || n.category === filterCategory) &&
          (filterStatus === "all" || n.status === filterStatus)
      ),
    [nodes, filterCategory, filterStatus]
  );

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedId) ?? null,
    [nodes, selectedId]
  );

  const openNode = (id: string) => {
    setSelectedId(id);
    setDrawerOpen(true);
  };

  const handleDownloadSpecs = () => {
    downloadCliNodeSpecPdf(sensorSpecs.map((s) => ({ label: s.label, value: s.value })));
    toast({ title: "Specs downloaded", description: "CliNode v2.1 hardware specs PDF saved." });
  };

  return (
    <Layout showNavBar={false}>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/30 rounded-full blur-3xl animate-pulse-glow" />
            <div className="absolute top-10 right-0 w-80 h-80 bg-accent/40 rounded-full blur-3xl animate-float" />
          </div>

          <div className="container mx-auto px-4 py-6 relative">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard")}
                className="text-white hover:bg-white/20 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Database className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold leading-tight">Clisense Data Engine</h1>
                  <p className="text-sm text-primary-foreground/80">
                    Solar IoT × Satellites × WEF Nexus AI
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-strong rounded-2xl p-5 md:p-6 mb-4"
            >
              <Badge className="bg-white/20 text-white border-white/30 mb-3">
                <Recycle className="w-3 h-3 mr-1" /> Built from recycled e-waste
              </Badge>
              <h2 className="text-xl md:text-2xl font-bold mb-2">
                Hyperlocal climate sensing for the last mile
              </h2>
              <p className="text-sm md:text-base text-primary-foreground/85 leading-relaxed">
                Africa's first solar-powered IoT mesh purpose-built for smallholder farmers,
                refugee settlements and displacement-affected communities. Every node streams
                live soil, water and microclimate data into Clisense's WEF Nexus engine.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                {[
                  { label: "Active nodes", value: "32" },
                  { label: "Sites", value: "5" },
                  { label: "Uptime", value: "99.2%" },
                  { label: "Recycled parts", value: "70%" },
                ].map((s, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-primary-foreground/80">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 space-y-8">
          {/* The CliNode flagship */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">The CliNode sensor</h3>
                <p className="text-sm text-muted-foreground">Flagship hardware powering the engine</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="hidden sm:inline-flex">
                  v2.1 · field-tested
                </Badge>
                <Button
                  size="sm"
                  onClick={handleDownloadSpecs}
                  className="bg-gradient-to-r from-primary to-accent text-white shadow hover:opacity-90"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Download specs
                </Button>
              </div>
            </div>

            <Card className="card-elevated border-0 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-amber-400 via-emerald-500 to-sky-500" />
              <CardContent className="p-5 md:p-6">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  {/* Visual */}
                  <div className="relative aspect-square max-w-sm mx-auto w-full rounded-3xl bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-amber-500/10 border border-border/50 flex items-center justify-center">
                    <div className="absolute top-4 left-4 right-4 h-16 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 shadow-inner flex items-center justify-center">
                      <Sun className="w-7 h-7 text-white/90" />
                      <span className="ml-2 text-xs font-semibold text-white/90">5W Solar</span>
                    </div>
                    <div className="w-40 h-44 rounded-2xl bg-card border border-border shadow-xl flex flex-col items-center justify-center gap-2 mt-10">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Cpu className="w-7 h-7 text-primary" />
                      </div>
                      <p className="text-sm font-bold">CliNode</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Wifi className="w-3 h-3 text-emerald-500 animate-pulse" />
                        LoRaWAN live
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Battery className="w-3 h-3 text-emerald-500" />
                        92%
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-3 rounded-full bg-gradient-to-r from-emerald-700 to-emerald-500 opacity-70" />
                  </div>

                  {/* Specs */}
                  <div className="space-y-3">
                    {sensorSpecs.map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${s.color} shrink-0`}>
                          <s.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            {s.label}
                          </p>
                          <p className="text-sm font-medium leading-snug">{s.value}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Data pipeline */}
          <section>
            <h3 className="text-xl font-bold mb-4">From sensor to farmer</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {pipeline.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glass rounded-2xl p-4 text-center relative overflow-hidden"
                >
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-primary to-accent mb-2">
                    <p.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-semibold text-sm">{p.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Live deployments map / nodes */}
          <section>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-xl font-bold">Live deployments</h3>
                <p className="text-sm text-muted-foreground">
                  Auto-refreshing every 4s · last update {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  <RefreshCw className="w-3 h-3 mr-1.5 animate-spin" style={{ animationDuration: "4s" }} />
                  Live
                </Badge>
                <ToggleGroup
                  type="single"
                  value={view}
                  onValueChange={(v) => v && setView(v as "list" | "map")}
                  size="sm"
                  className="bg-muted/60 rounded-lg p-0.5"
                >
                  <ToggleGroupItem value="list" aria-label="List view" className="h-8 px-2">
                    <List className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="map" aria-label="Map view" className="h-8 px-2">
                    <MapIcon className="w-4 h-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-4 p-3 rounded-xl bg-muted/40 border border-border/50">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Filter className="w-3.5 h-3.5" /> Filters
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground mr-1">Region:</span>
                <ToggleGroup
                  type="single"
                  value={filterCategory}
                  onValueChange={(v) => v && setFilterCategory(v as typeof filterCategory)}
                  size="sm"
                >
                  <ToggleGroupItem value="all" className="h-8 px-3 text-xs">All</ToggleGroupItem>
                  <ToggleGroupItem value="refugee" className="h-8 px-3 text-xs">
                    <Tent className="w-3 h-3 mr-1" /> Refugee
                  </ToggleGroupItem>
                  <ToggleGroupItem value="farm" className="h-8 px-3 text-xs">
                    <Sprout className="w-3 h-3 mr-1" /> Farms
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground mr-1">Status:</span>
                <ToggleGroup
                  type="single"
                  value={filterStatus}
                  onValueChange={(v) => v && setFilterStatus(v as typeof filterStatus)}
                  size="sm"
                >
                  <ToggleGroupItem value="all" className="h-8 px-3 text-xs">All</ToggleGroupItem>
                  <ToggleGroupItem value="online" className="h-8 px-3 text-xs">Online</ToggleGroupItem>
                  <ToggleGroupItem value="syncing" className="h-8 px-3 text-xs">Syncing</ToggleGroupItem>
                </ToggleGroup>
              </div>
              <Badge variant="secondary" className="ml-auto">
                {filteredNodes.length} of {nodes.length} nodes
              </Badge>
            </div>

            {view === "map" ? (
              <DeploymentMap
                nodes={filteredNodes}
                selectedId={selectedId}
                onSelect={openNode}
              />
            ) : (
              <div className="grid gap-3">
                {filteredNodes.length === 0 && (
                  <div className="p-8 text-center text-sm text-muted-foreground bg-muted/30 rounded-xl">
                    No nodes match the current filters.
                  </div>
                )}
                {filteredNodes.map((n, i) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Card
                      className="border-border/50 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => openNode(n.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className={`p-2 rounded-xl shrink-0 ${n.category === "refugee" ? "bg-orange-500/10" : "bg-emerald-500/10"}`}>
                              {n.category === "refugee" ? (
                                <Tent className={`w-4 h-4 ${n.category === "refugee" ? "text-orange-500" : "text-emerald-500"}`} />
                              ) : (
                                <Sprout className="w-4 h-4 text-emerald-500" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm truncate">{n.site}</p>
                              <p className="text-xs text-muted-foreground">{n.type} · {n.id}</p>
                            </div>
                          </div>
                          <Badge
                            className={
                              n.status === "online"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            }
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
                            {n.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                              <Battery className="w-3 h-3" /> Battery
                            </div>
                            <Progress value={n.battery} className="h-1.5" />
                            <p className="text-xs font-medium mt-1 tabular-nums">{n.battery}%</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                              <Signal className="w-3 h-3" /> Signal
                            </div>
                            <Progress value={n.signal} className="h-1.5" />
                            <p className="text-xs font-medium mt-1 tabular-nums">{n.signal}%</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                              <Droplets className="w-3 h-3" /> Soil moist.
                            </div>
                            <Progress value={n.soil} className="h-1.5" />
                            <p className="text-xs font-medium mt-1 tabular-nums">{n.soil}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          <NodeDetailDrawer
            node={selectedNode}
            history={selectedNode ? history[selectedNode.id] ?? [] : []}
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
          />

          {/* Where we deploy */}
          <section>
            <h3 className="text-xl font-bold mb-4">Where we deploy</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {deployments.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="card-elevated border-0 overflow-hidden h-full">
                    <div className={`h-1 bg-gradient-to-r ${d.gradient}`} />
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${d.gradient}`}>
                          <d.icon className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-bold text-base">{d.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{d.desc}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {d.stats.map((s, j) => (
                          <div key={j} className="bg-muted/50 rounded-xl p-2 text-center">
                            <p className="font-bold text-base">{s.value}</p>
                            <p className="text-[10px] text-muted-foreground leading-tight">
                              {s.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Trust strip */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { icon: ShieldCheck, label: "Encrypted at edge & in transit (AES-256 / TLS)" },
              { icon: Recycle, label: "Field-repairable, swap modules in <10 min" },
              { icon: Satellite, label: "Fused with Sentinel-2 & CHIRPS satellite feeds" },
            ].map((t, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/50"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <t.icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm font-medium">{t.label}</p>
              </div>
            ))}
          </section>

          {/* Data submission tabs (existing) */}
          <section>
            <div className="mb-4">
              <h3 className="text-xl font-bold">Contribute ground-truth data</h3>
              <p className="text-sm text-muted-foreground">
                Field officers and partners can push observations into the engine
              </p>
            </div>
            <Tabs defaultValue="water" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-card/80 backdrop-blur-sm p-1 rounded-xl shadow-lg">
                <TabsTrigger value="water" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  <Droplets className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Water</span>
                </TabsTrigger>
                <TabsTrigger value="energy" className="rounded-lg data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
                  <Zap className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Energy</span>
                </TabsTrigger>
                <TabsTrigger value="food" className="rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white">
                  <Wheat className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Food</span>
                </TabsTrigger>
                <TabsTrigger value="integration" className="rounded-lg data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                  <Cloud className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Integration</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="water" className="animate-fade-in">
                <Card className="card-elevated border-0 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-blue-400 to-cyan-500" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                        <Droplets className="h-5 w-5 text-white" />
                      </div>
                      <span>Water Resources Data</span>
                    </CardTitle>
                    <CardDescription>
                      Submit water availability, quality, and usage data for nexus analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Location Name</Label>
                        <Input
                          value={waterData.location_name}
                          onChange={(e) => setWaterData({ ...waterData, location_name: e.target.value })}
                          placeholder="e.g., Central Kenya"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Water Stress Level</Label>
                        <Select
                          value={waterData.water_stress_level}
                          onValueChange={(value) => setWaterData({ ...waterData, water_stress_level: value })}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">🟢 Low</SelectItem>
                            <SelectItem value="medium">🟡 Medium</SelectItem>
                            <SelectItem value="high">🟠 High</SelectItem>
                            <SelectItem value="extremely_high">🔴 Extremely High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Water Availability (m³)</Label>
                        <Input
                          type="number"
                          value={waterData.water_availability_m3}
                          onChange={(e) => setWaterData({ ...waterData, water_availability_m3: e.target.value })}
                          placeholder="1000000"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Water Quality Index (0-100)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={waterData.water_quality_index}
                          onChange={(e) => setWaterData({ ...waterData, water_quality_index: e.target.value })}
                          placeholder="75"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Precipitation (mm)</Label>
                        <Input
                          type="number"
                          value={waterData.precipitation_mm}
                          onChange={(e) => setWaterData({ ...waterData, precipitation_mm: e.target.value })}
                          placeholder="50.5"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Measurement Date</Label>
                        <Input
                          type="date"
                          value={waterData.measurement_date}
                          onChange={(e) => setWaterData({ ...waterData, measurement_date: e.target.value })}
                          className="h-11"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => submitData("Water")}
                      disabled={loading}
                      className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-blue-500/25"
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      Submit Water Data
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="energy" className="animate-fade-in">
                <Card className="card-elevated border-0 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-yellow-400 to-orange-500" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      <span>Energy Systems Data</span>
                    </CardTitle>
                    <CardDescription>Submit energy consumption, production, and access data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Location Name</Label>
                        <Input
                          value={energyData.location_name}
                          onChange={(e) => setEnergyData({ ...energyData, location_name: e.target.value })}
                          placeholder="e.g., Central Kenya"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Solar Irradiance (kWh/m²)</Label>
                        <Input
                          type="number"
                          value={energyData.solar_irradiance_kwh_m2}
                          onChange={(e) => setEnergyData({ ...energyData, solar_irradiance_kwh_m2: e.target.value })}
                          placeholder="5.5"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Energy Consumption (kWh)</Label>
                        <Input
                          type="number"
                          value={energyData.energy_consumption_kwh}
                          onChange={(e) => setEnergyData({ ...energyData, energy_consumption_kwh: e.target.value })}
                          placeholder="1500"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Grid Reliability Score (0-100)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={energyData.grid_reliability_score}
                          onChange={(e) => setEnergyData({ ...energyData, grid_reliability_score: e.target.value })}
                          placeholder="85"
                          className="h-11"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => submitData("Energy")}
                      disabled={loading}
                      className="w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-yellow-500/25"
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      Submit Energy Data
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="food" className="animate-fade-in">
                <Card className="card-elevated border-0 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-green-400 to-emerald-500" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                        <Wheat className="h-5 w-5 text-white" />
                      </div>
                      <span>Food Security Data</span>
                    </CardTitle>
                    <CardDescription>Submit crop production, yield, and nutrition data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Location Name</Label>
                        <Input
                          value={foodData.location_name}
                          onChange={(e) => setFoodData({ ...foodData, location_name: e.target.value })}
                          placeholder="e.g., Central Kenya"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Crop Type</Label>
                        <Select
                          value={foodData.crop_type}
                          onValueChange={(value) => setFoodData({ ...foodData, crop_type: value })}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select crop" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="maize">🌽 Maize</SelectItem>
                            <SelectItem value="wheat">🌾 Wheat</SelectItem>
                            <SelectItem value="rice">🍚 Rice</SelectItem>
                            <SelectItem value="cassava">🥔 Cassava</SelectItem>
                            <SelectItem value="sorghum">🌿 Sorghum</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Crop Yield (kg/ha)</Label>
                        <Input
                          type="number"
                          value={foodData.crop_yield_kg_ha}
                          onChange={(e) => setFoodData({ ...foodData, crop_yield_kg_ha: e.target.value })}
                          placeholder="2500"
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Soil Health Index (0-100)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={foodData.soil_health_index}
                          onChange={(e) => setFoodData({ ...foodData, soil_health_index: e.target.value })}
                          placeholder="72"
                          className="h-11"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => submitData("Food")}
                      disabled={loading}
                      className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg shadow-green-500/25"
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      Submit Food Data
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="integration" className="animate-fade-in">
                <Card className="card-elevated border-0 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-purple-400 to-pink-500" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                        <Cloud className="h-5 w-5 text-white" />
                      </div>
                      <span>Data Integration Hub</span>
                    </CardTitle>
                    <CardDescription>Connect and sync data from multiple sources</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { name: "Satellite Data", status: "connected", icon: Satellite },
                        { name: "IoT Sensors", status: "syncing", icon: Activity },
                        { name: "Weather API", status: "connected", icon: Cloud },
                      ].map((source, i) => (
                        <div
                          key={i}
                          className="p-4 bg-muted/50 rounded-xl border border-border/50 flex items-center gap-3"
                        >
                          <div className="p-2 bg-background rounded-lg shadow-sm">
                            <source.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{source.name}</p>
                            <Badge
                              variant={source.status === "connected" ? "default" : "secondary"}
                              className={
                                source.status === "connected"
                                  ? "bg-success/10 text-success border-success/20"
                                  : ""
                              }
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {source.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground">Export Data</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="h-12">
                          <Download className="w-4 h-4 mr-2" />
                          Export CSV
                        </Button>
                        <Button variant="outline" className="h-12">
                          <Download className="w-4 h-4 mr-2" />
                          Export JSON
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>

          {/* CTA */}
          <section>
            <Card className="border-0 overflow-hidden bg-gradient-to-br from-primary to-accent text-primary-foreground">
              <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">Deploy CliNodes in your community</h3>
                  <p className="text-sm text-primary-foreground/85">
                    Cooperatives, NGOs and camp managers — partner with us to host a sensor cluster.
                  </p>
                </div>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate("/contact")}
                  className="font-semibold"
                >
                  Request a deployment
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default DataEngine;
