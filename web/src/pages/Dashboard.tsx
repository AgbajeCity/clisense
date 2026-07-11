import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Cloud, 
  Thermometer, 
  Droplets, 
  TrendingUp, 
  AlertTriangle, 
  Sprout, 
  HelpCircle, 
  Sun, 
  CloudRain, 
  Wind, 
  Database,
  Leaf,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(true);

  const actionButtons = [
    { 
      icon: TrendingUp, 
      secondIcon: Sun,
      label: "GET FORECAST", 
      route: "/forecast",
      gradient: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/25"
    },
    { 
      icon: AlertTriangle, 
      secondIcon: CloudRain,
      label: "CHECK ALERTS", 
      route: "/alerts",
      gradient: "from-amber-500 to-orange-500",
      shadow: "shadow-amber-500/25"
    },
    { 
      icon: Sprout, 
      secondIcon: Wind,
      label: "CROP ADVICE", 
      route: "/advice",
      gradient: "from-green-500 to-emerald-500",
      shadow: "shadow-green-500/25"
    },
    { 
      icon: Droplets, 
      secondIcon: TrendingUp,
      label: "WEF NEXUS", 
      route: "/wef-nexus",
      gradient: "from-blue-500 to-cyan-500",
      shadow: "shadow-blue-500/25"
    },
    { 
      icon: Database, 
      secondIcon: Cloud,
      label: "DATA ENGINE", 
      route: "/data-engine",
      gradient: "from-purple-500 to-pink-500",
      shadow: "shadow-purple-500/25"
    },
    { 
      icon: HelpCircle, 
      secondIcon: Sparkles,
      label: "HELP & SUPPORT", 
      route: "/about",
      gradient: "from-slate-500 to-gray-600",
      shadow: "shadow-slate-500/25"
    },
  ];

  const forecastDays = [
    { day: "Today", temp: "26°C", icon: Sun, condition: "Sunny" },
    { day: "Tomorrow", temp: "24°C", icon: CloudRain, condition: "Rainy" },
    { day: "Wed", temp: "25°C", icon: Cloud, condition: "Cloudy" },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-accent pb-24">
        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-40 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <div className="relative z-10 px-4 pt-6 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">CLISENSE</h1>
                <p className="text-xs text-white/70">Climate Intelligence Platform</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
              </span>
              Live
            </Badge>
          </div>
        </div>

        <div className="relative z-10 px-4 space-y-5">
          {/* Weather Overview Card */}
          <Card className="glass-strong border-0 overflow-hidden shadow-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-primary" />
                  Weather Forecast
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary hover:bg-primary/10"
                  onClick={() => navigate("/forecast")}
                >
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {forecastDays.map((day, i) => (
                  <div 
                    key={i}
                    className={`p-4 rounded-2xl text-center transition-all duration-300 ${
                      i === 0 
                        ? 'bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/25' 
                        : 'bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    <p className={`text-xs font-medium mb-2 ${i === 0 ? 'text-white/80' : 'text-muted-foreground'}`}>
                      {day.day}
                    </p>
                    <day.icon className={`w-8 h-8 mx-auto mb-2 ${i === 0 ? 'text-white' : 'text-primary'}`} />
                    <p className="font-bold text-lg">{day.temp}</p>
                    <p className={`text-xs ${i === 0 ? 'text-white/70' : 'text-muted-foreground'}`}>
                      {day.condition}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts Card */}
          <Card className="glass-strong border-0 overflow-hidden shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-success to-emerald-400 rounded-2xl shadow-lg shadow-success/25">
                  <Thermometer className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-foreground">ALL CLEAR</p>
                    <Badge className="bg-success/10 text-success border-success/20 text-xs">
                      ✓ Safe
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No weather alerts for the next 7 days
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white/80 px-1">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {actionButtons.map((action, index) => (
                <Button
                  key={index}
                  onClick={() => navigate(action.route)}
                  className={`
                    relative h-auto py-5 px-4
                    bg-gradient-to-br ${action.gradient} 
                    hover:opacity-90 
                    text-white font-semibold 
                    rounded-2xl 
                    shadow-xl ${action.shadow}
                    border-0
                    overflow-hidden
                    group
                    transition-all duration-300
                    hover:scale-[1.02] hover:shadow-2xl
                  `}
                >
                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <action.icon className="w-5 h-5" />
                      <action.secondIcon className="w-4 h-4 opacity-70" />
                    </div>
                    <span className="text-xs tracking-wide">{action.label}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <Card className="glass-strong border-0 shadow-xl">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">78%</p>
                  <p className="text-xs text-muted-foreground">Water Index</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">64%</p>
                  <p className="text-xs text-muted-foreground">Energy Access</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-success">71%</p>
                  <p className="text-xs text-muted-foreground">Food Security</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
