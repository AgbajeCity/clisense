import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/sonner";
import {
  ArrowLeft, ArrowRight, Bluetooth, Radio, Sprout, CheckCircle2,
  Loader2, Cpu, Wifi, MapPin, Sparkles,
} from "lucide-react";

type Step = {
  id: string;
  title: string;
  subtitle: string;
  icon: typeof Bluetooth;
};

const STEPS: Step[] = [
  { id: "pair", title: "Pair via Bluetooth", subtitle: "Wake the device & connect", icon: Bluetooth },
  { id: "network", title: "Choose network", subtitle: "LoRaWAN or NB-IoT", icon: Radio },
  { id: "location", title: "Set location", subtitle: "GPS pin & site name", icon: MapPin },
  { id: "calibrate", title: "Calibrate soil probe", subtitle: "Reference dry / wet readings", icon: Sprout },
  { id: "done", title: "Online", subtitle: "Streaming to the cloud", icon: Sparkles },
];

const SetupWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [pairing, setPairing] = useState(false);
  const [paired, setPaired] = useState(false);
  const [network, setNetwork] = useState<"lora" | "nbiot">("lora");
  const [site, setSite] = useState("Ikire Farm Plot 4");
  const [calProgress, setCalProgress] = useState(0);
  const [calibrating, setCalibrating] = useState(false);

  const progress = ((step + 1) / STEPS.length) * 100;

  const startPair = () => {
    setPairing(true);
    setTimeout(() => {
      setPairing(false);
      setPaired(true);
      toast.success("CliNode-A47F2 paired");
    }, 1800);
  };

  const startCalibrate = () => {
    setCalibrating(true);
    setCalProgress(0);
    const t = setInterval(() => {
      setCalProgress((v) => {
        if (v >= 100) {
          clearInterval(t);
          setCalibrating(false);
          toast.success("Soil probe calibrated");
          return 100;
        }
        return v + 4;
      });
    }, 80);
  };

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-background to-teal-50/30 dark:from-emerald-950/20 dark:via-background dark:to-teal-950/10">
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}><ArrowLeft className="w-4 h-4 mr-1" /> Home</Button>
          <Badge variant="outline">CliNode setup</Badge>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-10 max-w-3xl">
        {/* Stepper */}
        <div className="mb-10">
          <Progress value={progress} className="h-1.5 mb-6" />
          <div className="grid grid-cols-5 gap-2">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const active = i === step;
              const done = i < step;
              return (
                <button
                  key={s.id}
                  onClick={() => i <= step && setStep(i)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${active ? "bg-emerald-500/10" : ""}`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    done ? "bg-emerald-500 text-white" :
                    active ? "bg-foreground text-background ring-4 ring-emerald-500/20" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-[10px] font-medium hidden sm:block text-center leading-tight ${active ? "text-foreground" : "text-muted-foreground"}`}>{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">{STEPS[step].title}</h2>
                <p className="text-sm text-muted-foreground">{STEPS[step].subtitle}</p>
              </div>

              {step === 0 && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center justify-center py-8">
                    <motion.div
                      animate={pairing ? { scale: [1, 1.15, 1] } : {}}
                      transition={{ repeat: pairing ? Infinity : 0, duration: 1 }}
                      className={`w-32 h-32 rounded-full flex items-center justify-center ${paired ? "bg-emerald-500/15" : "bg-blue-500/10"}`}
                    >
                      {paired ? <CheckCircle2 className="w-16 h-16 text-emerald-500" /> :
                       pairing ? <Loader2 className="w-12 h-12 text-blue-500 animate-spin" /> :
                       <Bluetooth className="w-14 h-14 text-blue-500" />}
                    </motion.div>
                    <p className="mt-4 text-sm text-muted-foreground">
                      {paired ? "CliNode-A47F2 · firmware 2.1.4" : pairing ? "Scanning nearby devices…" : "Press the wake button on your CliNode"}
                    </p>
                  </div>
                  {!paired && <Button onClick={startPair} disabled={pairing} className="w-full">{pairing ? "Pairing…" : "Start pairing"}</Button>}
                </div>
              )}

              {step === 1 && (
                <RadioGroup value={network} onValueChange={(v: any) => setNetwork(v)} className="space-y-3">
                  {[
                    { v: "lora", t: "LoRaWAN", d: "10 km range · ultra-low power · best for rural", icon: Radio },
                    { v: "nbiot", t: "NB-IoT (cellular failover)", d: "Anywhere with mobile signal", icon: Wifi },
                  ].map((o) => (
                    <Label key={o.v} htmlFor={o.v} className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${network === o.v ? "border-emerald-500 bg-emerald-500/5" : "hover:bg-muted/40"}`}>
                      <RadioGroupItem value={o.v} id={o.v} className="mt-1" />
                      <o.icon className="w-5 h-5 text-emerald-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">{o.t}</p>
                        <p className="text-xs text-muted-foreground">{o.d}</p>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="site">Site name</Label>
                    <Input id="site" value={site} onChange={(e) => setSite(e.target.value)} className="mt-1.5" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Latitude</Label>
                      <Input value="7.3667" readOnly className="mt-1.5" />
                    </div>
                    <div>
                      <Label>Longitude</Label>
                      <Input value="4.1833" readOnly className="mt-1.5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 text-sm text-emerald-700 dark:text-emerald-300">
                    <MapPin className="w-4 h-4" /> GPS lock acquired · ±3.2m accuracy
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 text-center bg-amber-500/5 border-amber-500/20">
                      <p className="text-xs text-muted-foreground uppercase">Dry reference</p>
                      <p className="text-3xl font-bold text-amber-600 mt-1">12%</p>
                    </Card>
                    <Card className="p-4 text-center bg-blue-500/5 border-blue-500/20">
                      <p className="text-xs text-muted-foreground uppercase">Wet reference</p>
                      <p className="text-3xl font-bold text-blue-600 mt-1">88%</p>
                    </Card>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Calibration</span>
                      <span className="font-mono">{calProgress}%</span>
                    </div>
                    <Progress value={calProgress} className="h-2" />
                  </div>
                  <Button onClick={startCalibrate} disabled={calibrating || calProgress === 100} className="w-full">
                    {calibrating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Calibrating…</> :
                     calProgress === 100 ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Calibrated</> :
                     "Run auto-calibration"}
                  </Button>
                </div>
              )}

              {step === 4 && (
                <div className="text-center py-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.6 }} className="w-24 h-24 mx-auto rounded-full bg-emerald-500/15 flex items-center justify-center mb-4">
                    <Sparkles className="w-12 h-12 text-emerald-500" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2">CliNode-A47F2 is online</h3>
                  <p className="text-muted-foreground mb-6">Streaming on {network === "lora" ? "LoRaWAN" : "NB-IoT"} · {site}</p>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    {[
                      { l: "Battery", v: "94%" },
                      { l: "Signal", v: "-78 dBm" },
                      { l: "Soil", v: "42% VWC" },
                    ].map((m) => (
                      <Card key={m.l} className="p-3">
                        <p className="text-xs text-muted-foreground">{m.l}</p>
                        <p className="font-bold text-lg">{m.v}</p>
                      </Card>
                    ))}
                  </div>
                  <Button className="mt-6 w-full" onClick={() => navigate("/firmware-demo")}>
                    Open live dashboard <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </Card>

            {step < 4 && (
              <div className="flex justify-between mt-6">
                <Button variant="ghost" onClick={back} disabled={step === 0}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
                <Button
                  onClick={next}
                  disabled={(step === 0 && !paired) || (step === 3 && calProgress < 100)}
                >
                  Continue <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SetupWizard;
