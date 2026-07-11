import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft, Cpu, Activity, Droplets, Thermometer, Sun, Wind, Pause, Play, Zap,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

type Reading = { t: number; soil: number; temp: number; humidity: number; light: number };

const MAX_POINTS = 40;

const FirmwareDemo = () => {
  const navigate = useNavigate();
  const [running, setRunning] = useState(true);
  const [intervalMs, setIntervalMs] = useState(1000);
  const [bias, setBias] = useState({ soil: 45, temp: 28, humidity: 65, light: 600 });
  const [readings, setReadings] = useState<Reading[]>([]);
  const [packets, setPackets] = useState(0);
  const tickRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      tickRef.current++;
      const noise = (n: number) => (Math.random() - 0.5) * n;
      const r: Reading = {
        t: Date.now(),
        soil: Math.max(0, Math.min(100, bias.soil + noise(6))),
        temp: bias.temp + noise(1.5),
        humidity: Math.max(0, Math.min(100, bias.humidity + noise(5))),
        light: Math.max(0, bias.light + noise(120)),
      };
      setReadings((prev) => [...prev.slice(-MAX_POINTS + 1), r]);
      setPackets((p) => p + 1);
    }, intervalMs);
    return () => clearInterval(id);
  }, [running, intervalMs, bias]);

  const last = readings[readings.length - 1];

  const stats = [
    { icon: Droplets, label: "Soil moisture", value: last ? `${last.soil.toFixed(1)}%` : "—", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: Thermometer, label: "Air temperature", value: last ? `${last.temp.toFixed(1)}°C` : "—", color: "text-rose-500", bg: "bg-rose-500/10" },
    { icon: Wind, label: "Humidity", value: last ? `${last.humidity.toFixed(0)}%` : "—", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { icon: Sun, label: "Light (lux)", value: last ? `${last.light.toFixed(0)}` : "—", color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}><ArrowLeft className="w-4 h-4 mr-1" /> Home</Button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span className={`w-2 h-2 rounded-full ${running ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"}`} />
              <span className="font-mono">{running ? "STREAMING" : "PAUSED"}</span>
            </div>
            <Badge variant="secondary"><Cpu className="w-3 h-3 mr-1" /> firmware 2.1.4</Badge>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Firmware & telemetry sandbox</h1>
          <p className="text-sm text-muted-foreground">Simulate sensor readings — watch them stream into the dashboard in real time.</p>
        </div>

        {/* Live stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label} className="p-5">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${s.bg}`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
                <span className="text-[10px] font-mono text-muted-foreground">LIVE</span>
              </div>
              <p className="text-xs text-muted-foreground mt-3">{s.label}</p>
              <p className="text-2xl font-bold tabular-nums">{s.value}</p>
            </Card>
          ))}
        </div>

        {/* Chart + controls */}
        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold">Real-time stream</h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <Zap className="w-3 h-3" /> {packets} packets
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={readings} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="t" tickFormatter={(t) => new Date(t).toLocaleTimeString().slice(3, 8)} fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip
                    labelFormatter={(t) => new Date(t as number).toLocaleTimeString()}
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  />
                  <Line type="monotone" dataKey="soil" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="temp" stroke="#f43f5e" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="humidity" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Controls</h3>
              <Button size="sm" variant={running ? "outline" : "default"} onClick={() => setRunning(!running)}>
                {running ? <><Pause className="w-4 h-4 mr-1" /> Pause</> : <><Play className="w-4 h-4 mr-1" /> Resume</>}
              </Button>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <Label>Sample interval</Label>
                <span className="font-mono">{intervalMs}ms</span>
              </div>
              <Slider value={[intervalMs]} min={250} max={3000} step={250} onValueChange={(v) => setIntervalMs(v[0])} />
            </div>

            {([
              { k: "soil", l: "Soil moisture %", min: 0, max: 100 },
              { k: "temp", l: "Temp °C", min: 5, max: 50 },
              { k: "humidity", l: "Humidity %", min: 0, max: 100 },
              { k: "light", l: "Light lux", min: 0, max: 1500 },
            ] as const).map((s) => (
              <div key={s.k}>
                <div className="flex justify-between text-xs mb-2">
                  <Label>{s.l}</Label>
                  <span className="font-mono">{(bias as any)[s.k].toFixed(0)}</span>
                </div>
                <Slider value={[(bias as any)[s.k]]} min={s.min} max={s.max} step={1} onValueChange={(v) => setBias((b) => ({ ...b, [s.k]: v[0] }))} />
              </div>
            ))}
          </Card>
        </div>

        {/* Packet log */}
        <Card className="p-6">
          <h3 className="font-semibold mb-3">Packet log</h3>
          <div className="bg-muted/40 rounded-lg p-4 font-mono text-xs space-y-1 max-h-48 overflow-y-auto">
            {readings.slice(-12).reverse().map((r, i) => (
              <div key={i} className="flex gap-3 text-muted-foreground">
                <span>{new Date(r.t).toLocaleTimeString()}</span>
                <span className="text-emerald-600">[CliNode-A47F2]</span>
                <span>soil={r.soil.toFixed(1)} temp={r.temp.toFixed(1)} hum={r.humidity.toFixed(0)} lux={r.light.toFixed(0)}</span>
              </div>
            ))}
            {!readings.length && <div className="text-muted-foreground">Waiting for packets…</div>}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FirmwareDemo;
