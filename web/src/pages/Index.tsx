import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Droplets,
  Zap,
  Wheat,
  TrendingUp,
  Users,
  Satellite,
  Brain,
  Shield,
  Globe,
  Target,
  CheckCircle,
  ArrowRight,
  Star,
  Leaf,
  Menu,
  X,
  Cpu,
  Radio,
  Sun,
  Sprout,
  Battery,
} from "lucide-react";
import clisenseLogo from "@/assets/clisense-logo.jpg";
import clinodeExploded from "@/assets/clinode-exploded.jpg";
import { CliNodeShowcase } from "@/components/CliNodeShowcase";
import { CliNodeLab } from "@/components/CliNodeLab";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { HomeLiveMap } from "@/components/HomeLiveMap";
import { Area, AreaChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";

const Index = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAuth = () => {
    if (authMode === "login") {
      navigate("/dashboard");
    } else {
      navigate("/onboarding");
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const impactNumbers = [
    { number: "87%", value: 87, suffix: "%", label: "Flood Prediction Accuracy", icon: Satellite, color: "from-emerald-500 to-green-600" },
    { number: "30%", value: 30, suffix: "%", label: "Crop Loss Reduced", icon: TrendingUp, color: "from-blue-500 to-cyan-600" },
    { number: "450T", value: 450, suffix: "T", label: "Crops Protected (Tons)", icon: Wheat, color: "from-amber-500 to-orange-600" },
    { number: "47", value: 47, suffix: "", label: "Families Impacted", icon: Users, color: "from-purple-500 to-violet-600" },
    { number: "100", value: 100, suffix: "", label: "Users Onboarded", icon: Globe, color: "from-pink-500 to-rose-600" },
    { number: "$1.37", value: 1.37, prefix: "$", decimals: 2, suffix: "", label: "Monthly Subscription", icon: Droplets, color: "from-sky-500 to-blue-600" },
  ];

  const features = [
    {
      icon: Zap,
      title: "Solar-Powered IoT Sensors",
      description: "Arduino-compatible soil moisture and temperature sensors built from recycled e-waste, powered by clean solar energy and deployed on smallholder farmlands.",
      gradient: "from-amber-500 to-orange-600"
    },
    {
      icon: Satellite,
      title: "Geospatial Intelligence",
      description: "CHIRPS satellite rainfall (0.05°), MODIS land surface temperature, and basin gauge data fused into 1km, 72-hour hyperlocal forecasts.",
      gradient: "from-violet-500 to-purple-600"
    },
    {
      icon: Brain,
      title: "AI Predictive Analytics",
      description: "Tuned Random Forest and gradient boosting models trained on 8 years of regional records — 87% flood accuracy, 92% temperature accuracy.",
      gradient: "from-pink-500 to-rose-600"
    },
    {
      icon: Shield,
      title: "Early Warning Systems",
      description: "Real-time, actionable alerts via IVR, SMS, WhatsApp, and dashboard in Yoruba, Igbo, Kinyarwanda, and English.",
      gradient: "from-emerald-500 to-teal-600"
    },
  ];

  const products = [
    {
      title: "IoT Sensor Network",
      description: "Solar-powered, e-waste-built soil and climate sensors deployed on rural and refugee community farmlands — our flagship hardware product.",
      icon: Zap,
      features: ["Recycled e-waste build", "Solar powered", "Circular-economy design"],
      gradient: "from-amber-600 to-orange-500",
      link: "/data-engine"
    },
    {
      title: "Water-Energy-Food Data Engine",
      description: "Africa's first data engine for the WEF nexus — integrating geospatial data, AI analytics, and remote sensing across interconnected systems.",
      icon: Droplets,
      features: ["WEF nexus analytics", "Resource optimization", "Policy-grade insights"],
      gradient: "from-blue-600 to-cyan-500",
      link: "/wef-nexus"
    },
    {
      title: "Climate Risk Intelligence",
      description: "Predictive models and early warning systems serving smallholder farmers in climate-affected refugee and displacement-affected communities.",
      icon: Shield,
      features: ["72-hour forecasts", "Multi-channel alerts", "Adaptation guidance"],
      gradient: "from-rose-600 to-pink-500",
      link: "/alerts"
    }
  ];

  const testimonials = [
    {
      name: "Mama Folake",
      role: "Smallholder Farmer, Ikire, Nigeria",
      quote: "Clisense warned us before the floods came. For the first time in years, my harvest was protected and my family did not go hungry.",
      avatar: "MF"
    },
    {
      name: "Cooperative Lead",
      role: "Osun State Cooperative",
      quote: "The 87% flood prediction accuracy and 1km forecasts have helped our farmers protect 450 tons of crops across the Osun River corridor.",
      avatar: "CL"
    },
    {
      name: "Extension Officer",
      role: "Agricultural Extension, Nigeria",
      quote: "IVR in Yoruba, SMS, WhatsApp — Clisense meets farmers where they are. At $1.37 a month, even our most remote farmers can subscribe.",
      avatar: "EO"
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <img 
                src={clisenseLogo} 
                alt="Clisense Logo" 
                className="h-10 w-auto object-contain"
              />
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('about')} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</button>
              <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</button>
              <button onClick={() => scrollToSection('products')} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Products</button>
              <button onClick={() => scrollToSection('impact')} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Impact</button>
              <button onClick={() => navigate('/predict')} className="text-sm font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">Live Predict</button>
              <button onClick={() => scrollToSection('auth')} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Login</button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <button onClick={() => { scrollToSection('about'); setMobileMenuOpen(false); }} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left">About</button>
                <button onClick={() => { scrollToSection('features'); setMobileMenuOpen(false); }} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left">Features</button>
                <button onClick={() => { scrollToSection('products'); setMobileMenuOpen(false); }} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left">Products</button>
                <button onClick={() => { scrollToSection('impact'); setMobileMenuOpen(false); }} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left">Impact</button>
                <button onClick={() => { navigate('/predict'); setMobileMenuOpen(false); }} className="text-sm font-semibold text-emerald-600 hover:text-emerald-500 transition-colors text-left">Live Predict</button>
                <button onClick={() => { scrollToSection('auth'); setMobileMenuOpen(false); }} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left">Login</button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero — CliNode device as the centerpiece */}
      <section className="relative min-h-screen flex items-center pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute inset-0 opacity-[0.07]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }} />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
            {/* Left — minimal copy */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-white/90 text-xs font-medium tracking-wide uppercase">Meet CliNode</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-[1.05] tracking-tight">
                A sensor that <span className="bg-gradient-to-r from-emerald-300 to-amber-300 bg-clip-text text-transparent">grows climate resilience.</span>
              </h1>

              <p className="text-lg text-white/70 mb-8 max-w-md mx-auto lg:mx-0">
                Solar-powered. Built from e-waste. Streaming from the soil.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
                <Button
                  size="lg"
                  className="bg-white text-emerald-900 hover:bg-emerald-50 font-semibold shadow-xl shadow-emerald-500/20 h-12"
                  onClick={() => document.getElementById("auth")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white bg-white/5 hover:bg-white/15 backdrop-blur h-12"
                  onClick={() => navigate("/data-engine")}
                >
                  Explore the device
                </Button>
              </div>

              {/* Inline tech chips */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {[
                  { icon: Sun, label: "5W Solar" },
                  { icon: Cpu, label: "ESP32 + Edge AI" },
                  { icon: Radio, label: "LoRaWAN 10km" },
                  { icon: Sprout, label: "Soil NPK · pH" },
                  { icon: Battery, label: "Always-on" },
                ].map((c, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 text-xs text-white/85 bg-white/10 border border-white/15 backdrop-blur px-3 py-1.5 rounded-full"
                  >
                    <c.icon className="w-3 h-3 text-emerald-300" />
                    {c.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — interactive device */}
            <div className="relative">
              <CliNodeShowcase />
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs flex flex-col items-center gap-1 animate-bounce">
          <span>scroll</span>
          <span className="w-px h-6 bg-white/30" />
        </div>
      </section>

      {/* Anatomy of CliNode — visual storytelling */}
      <section className="py-24 bg-gradient-to-b from-background via-emerald-50/30 to-background dark:via-emerald-950/10 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3 border-emerald-500/40 text-emerald-600">The Device</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Eight parts. <span className="text-emerald-600">One mission.</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border bg-card">
              <img
                src={clinodeExploded}
                alt="CliNode exploded technical diagram"
                loading="lazy"
                width={1536}
                height={1024}
                className="w-full h-auto"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { n: "1", icon: Sun, label: "Solar Panel", color: "from-amber-400 to-orange-500" },
                { n: "2", icon: Cpu, label: "ESP32 MCU", color: "from-violet-500 to-fuchsia-600" },
                { n: "3", icon: Radio, label: "LoRa Antenna", color: "from-sky-400 to-blue-600" },
                { n: "4", icon: Battery, label: "Li-Ion Pack", color: "from-emerald-400 to-green-600" },
                { n: "5", icon: Shield, label: "IP67 Housing", color: "from-slate-400 to-slate-600" },
                { n: "6", icon: Target, label: "Ground Stake", color: "from-stone-500 to-stone-700" },
                { n: "7", icon: Sprout, label: "Soil Probe", color: "from-lime-500 to-emerald-600" },
                { n: "8", icon: Globe, label: "Cellular Failover", color: "from-cyan-500 to-teal-600" },
              ].map((p) => (
                <div
                  key={p.n}
                  className="group relative rounded-2xl border border-border bg-card p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-foreground text-background text-[11px] font-bold flex items-center justify-center">
                    {p.n}
                  </span>
                  <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${p.color} mb-2 shadow`}>
                    <p.icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="font-semibold text-sm">{p.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive CliNode Lab — try a live device */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-3 border-emerald-500/40 text-emerald-600">Try it live</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Touch a CliNode. <span className="text-emerald-600">Watch it think.</span>
            </h2>
            <p className="text-muted-foreground mt-3 text-sm max-w-md mx-auto">
              Tap a weather scenario to stream live readings from the device.
            </p>
          </div>
          <CliNodeLab />
        </div>
      </section>

      {/* Auth — repositioned as a clean inline section */}
      <section id="auth" className="py-20 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 relative overflow-hidden scroll-mt-20">
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Join the network</h2>
              <p className="text-white/70 text-sm">100 farmers · 47 families · 450T crops protected</p>
            </div>
            <Card className="backdrop-blur-xl bg-white/95 shadow-2xl border-0">
              <CardHeader className="pb-2">
                <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as "login" | "signup")} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                    <TabsTrigger value="login" className="font-semibold">Login</TabsTrigger>
                    <TabsTrigger value="signup" className="font-semibold">Sign Up</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {authMode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" type="text" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} className="h-12" />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12" />
                </div>
                {authMode === "login" && (
                  <div className="text-right">
                    <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">Forgot password?</button>
                  </div>
                )}
                <Button
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 font-semibold text-lg shadow-lg shadow-emerald-500/30"
                  size="lg"
                  onClick={handleAuth}
                >
                  {authMode === "login" ? "Login to Dashboard" : "Create Account"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact — visual numbers + sparkline chart */}
      <section id="impact" className="py-20 bg-background relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3 border-emerald-500/40 text-emerald-600">Pilot · Osun State 2024</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Numbers from <span className="text-emerald-600">the field.</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 items-stretch">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {impactNumbers.map((item, index) => (
                <Card key={index} className="text-center p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-background to-muted/50 group">
                  <div className={`inline-flex items-center justify-center w-11 h-11 bg-gradient-to-br ${item.color} rounded-xl mb-3 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-1">
                    <AnimatedCounter value={item.value} prefix={item.prefix} suffix={item.suffix} decimals={item.decimals ?? 0} />
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">{item.label}</div>
                </Card>
              ))}
            </div>

            {/* Trend chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Crop loss avoided</p>
                  <p className="text-2xl font-bold">+30% YoY</p>
                </div>
                <Badge variant="secondary" className="text-xs">2024 cohort</Badge>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { m: "Jan", v: 12 }, { m: "Feb", v: 14 }, { m: "Mar", v: 18 },
                    { m: "Apr", v: 21 }, { m: "May", v: 24 }, { m: "Jun", v: 28 },
                    { m: "Jul", v: 30 }, { m: "Aug", v: 33 }, { m: "Sep", v: 36 },
                  ]}>
                    <defs>
                      <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="m" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis hide />
                    <RechartsTooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Area type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} fill="url(#grad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                {[
                  { l: "Accuracy", v: "87%" },
                  { l: "Sites", v: "6" },
                  { l: "Tons saved", v: "450" },
                ].map((s) => (
                  <div key={s.l} className="rounded-lg bg-muted/50 p-2">
                    <p className="text-base font-bold">{s.v}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{s.l}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Live deployment map */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <Badge variant="outline" className="mb-3 border-emerald-500/40 text-emerald-600">Live</Badge>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                CliNodes <span className="text-emerald-600">across Africa.</span>
              </h2>
            </div>
            <Button variant="outline" onClick={() => navigate("/data-engine")}>
              Open data engine <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <HomeLiveMap />
        </div>
      </section>

      {/* About — chips */}
      <section id="about" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-3 border-emerald-500/40 text-emerald-600">About</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Data, soil, <span className="text-emerald-600">and dignity.</span></h2>
          </div>
          <div className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto mb-10">
            {[
              "Solar-powered hardware",
              "70% recycled e-waste",
              "Refugee & farm communities",
              "Yoruba · Igbo · Kinyarwanda",
              "$1.37/month",
              "100K farmers by 2025",
              "Rwanda · Kenya · Nigeria",
              "WEF nexus engine",
            ].map((c) => (
              <span key={c} className="text-sm px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-colors cursor-default">
                {c}
              </span>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <Card className="p-6 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background border-emerald-100 dark:border-emerald-900/40">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center mb-3 shadow-md">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-bold mb-1">Mission</h4>
              <p className="text-sm text-muted-foreground">Climate-smart intelligence for every smallholder.</p>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-background border-blue-100 dark:border-blue-900/40">
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center mb-3 shadow-md">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-bold mb-1">Vision</h4>
              <p className="text-sm text-muted-foreground">A resilient, data-driven African food system.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features — compact icon grid */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-3 border-emerald-500/40 text-emerald-600">Stack</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Sensor → satellite → <span className="text-emerald-600">soil decision.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <Card key={index} className="group p-5 hover:shadow-xl hover:-translate-y-1 transition-all border-0 bg-card relative overflow-hidden">
                <div className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                <div className={`inline-flex items-center justify-center w-11 h-11 bg-gradient-to-br ${feature.gradient} rounded-xl mb-3 shadow-md`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{feature.description.split(".")[0]}.</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products — compact tiles */}
      <section id="products" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-3 border-emerald-500/40 text-emerald-600">Products</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              One device. <span className="text-emerald-600">Three platforms.</span>
            </h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <Card key={index} className="group p-6 hover:shadow-2xl hover:-translate-y-2 transition-all border-0 relative overflow-hidden cursor-pointer" onClick={() => navigate(product.link)}>
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${product.gradient}`} />
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${product.gradient} rounded-xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <product.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{product.title}</h3>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {product.features.map((f) => (
                    <span key={f} className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{f}</span>
                  ))}
                </div>
                <div className="flex items-center text-sm font-medium text-emerald-600 group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — compact quote cards */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-3 border-emerald-500/40 text-emerald-600">Voices</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">From the <span className="text-emerald-600">field.</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <Card key={i} className="p-5 hover:shadow-xl hover:-translate-y-1 transition-all border-0 bg-card">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm leading-relaxed mb-4 line-clamp-4">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-3 border-t">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm leading-tight">{t.name}</div>
                    <div className="text-[11px] text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">
          <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Plant a CliNode.
          </h2>
          <p className="text-xl text-white/70 mb-10">Grow a resilient future.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-emerald-800 hover:bg-white/90 font-semibold shadow-lg h-14 px-8 text-lg"
              onClick={() => document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Free Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 h-14 px-8 text-lg"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-16 border-t">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">CLISENSE</span>
              </div>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm">
                Transforming climate resilience through data-driven agricultural intelligence. Building a sustainable future for Africa.
              </p>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-emerald-500 text-emerald-500" />
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => navigate('/wef-nexus')} className="text-muted-foreground hover:text-emerald-600 transition-colors">Water-Energy-Food Nexus</button></li>
                <li><button onClick={() => navigate('/data-engine')} className="text-muted-foreground hover:text-emerald-600 transition-colors">Data Engine</button></li>
                <li><button onClick={() => navigate('/alerts')} className="text-muted-foreground hover:text-emerald-600 transition-colors">Climate Intelligence</button></li>
                <li><button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-emerald-600 transition-colors">Analytics Dashboard</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => scrollToSection('features')} className="text-muted-foreground hover:text-emerald-600 transition-colors">Documentation</button></li>
                <li><button onClick={() => scrollToSection('impact')} className="text-muted-foreground hover:text-emerald-600 transition-colors">Case Studies</button></li>
                <li><button onClick={() => scrollToSection('about')} className="text-muted-foreground hover:text-emerald-600 transition-colors">Research Papers</button></li>
                <li><button onClick={() => scrollToSection('features')} className="text-muted-foreground hover:text-emerald-600 transition-colors">API Reference</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => navigate('/about')} className="text-muted-foreground hover:text-emerald-600 transition-colors">About Us</button></li>
                <li><button onClick={() => scrollToSection('about')} className="text-muted-foreground hover:text-emerald-600 transition-colors">Careers</button></li>
                <li><button onClick={() => navigate('/contact')} className="text-muted-foreground hover:text-emerald-600 transition-colors">Contact</button></li>
                <li><button onClick={() => scrollToSection('about')} className="text-muted-foreground hover:text-emerald-600 transition-colors">Privacy Policy</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            © 2024 Clisense. All rights reserved. Building a climate-resilient future for Africa.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
