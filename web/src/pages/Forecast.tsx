import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Cloud, 
  CloudRain, 
  Droplets, 
  Wind, 
  Sun, 
  CloudSnow,
  Zap,
  Wheat,
  Database,
  HelpCircle,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Thermometer,
  Eye,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const Forecast = () => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const forecastData = [
    {
      day: "TODAY",
      date: "Dec 8",
      weather: "RAINY",
      icon: CloudRain,
      maxTemp: 28,
      minTemp: 22,
      rainfall: "15mm",
      humidity: "85%",
      wind: "12 km/h",
      confidence: "HIGH",
      color: "text-blue-400",
      bgGradient: "from-blue-400/20 to-blue-600/20"
    },
    {
      day: "TOMORROW", 
      date: "Dec 9",
      weather: "RAINY",
      icon: CloudRain,
      maxTemp: 27,
      minTemp: 21,
      rainfall: "12mm",
      humidity: "82%",
      wind: "10 km/h",
      confidence: "HIGH",
      color: "text-blue-400",
      bgGradient: "from-blue-400/20 to-blue-600/20"
    },
    {
      day: "WED",
      date: "Dec 10",
      weather: "CLOUDY",
      icon: Cloud,
      maxTemp: 26,
      minTemp: 23,
      rainfall: "5mm",
      humidity: "75%",
      wind: "8 km/h",
      confidence: "MEDIUM",
      color: "text-gray-400",
      bgGradient: "from-gray-400/20 to-gray-600/20"
    },
    {
      day: "THU",
      date: "Dec 11",
      weather: "SUNNY",
      icon: Sun,
      maxTemp: 30,
      minTemp: 24,
      rainfall: "0mm",
      humidity: "60%",
      wind: "15 km/h",
      confidence: "HIGH",
      color: "text-yellow-400",
      bgGradient: "from-yellow-400/20 to-orange-500/20"
    },
    {
      day: "FRI",
      date: "Dec 12",
      weather: "RAINY",
      icon: CloudRain,
      maxTemp: 25,
      minTemp: 20,
      rainfall: "18mm",
      humidity: "90%",
      wind: "14 km/h",
      confidence: "HIGH",
      color: "text-blue-400",
      bgGradient: "from-blue-400/20 to-blue-600/20"
    },
    {
      day: "SAT",
      date: "Dec 13",
      weather: "STORMY",
      icon: Zap,
      maxTemp: 24,
      minTemp: 19,
      rainfall: "25mm",
      humidity: "95%",
      wind: "20 km/h",
      confidence: "MEDIUM",
      color: "text-purple-400",
      bgGradient: "from-purple-400/20 to-purple-600/20"
    },
    {
      day: "SUN",
      date: "Dec 14",
      weather: "CLOUDY",
      icon: Cloud,
      maxTemp: 27,
      minTemp: 22,
      rainfall: "8mm",
      humidity: "78%",
      wind: "11 km/h",
      confidence: "HIGH",
      color: "text-gray-400",
      bgGradient: "from-gray-400/20 to-gray-600/20"
    }
  ];

  const quickActions = [
    { label: "GET FORECAST", icon: Calendar, color: "from-blue-500 to-blue-600", route: "/forecast" },
    { label: "CHECK ALERTS", icon: AlertTriangle, color: "from-orange-500 to-red-500", route: "/alerts" },
    { label: "CROP ADVICE", icon: Wheat, color: "from-green-500 to-emerald-600", route: "/crop-advice" },
    { label: "WATER-ENERGY-FOOD NEXUS", icon: Droplets, color: "from-teal-500 to-cyan-600", route: "/wef-nexus" },
    { label: "DATA ENGINE", icon: Database, color: "from-purple-500 to-indigo-600", route: "/data-engine" },
    { label: "HELP & SUPPORT", icon: HelpCircle, color: "from-gray-500 to-slate-600", route: "/help" }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background pb-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Header */}
        <div className={`bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground p-6 relative overflow-hidden transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="text-primary-foreground hover:bg-primary-foreground/20 p-3 rounded-xl backdrop-blur-sm border border-primary-foreground/20 transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-wide">CLISENSE</h1>
                <p className="text-primary-foreground/90 text-lg font-medium">FORECAST</p>
              </div>
            </div>
            
            {/* Current Weather Hero */}
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium mb-2">NEXT 7 DAYS</p>
                  <div className="flex items-center gap-4 mb-4">
                    <CloudRain className="w-12 h-12 text-primary-foreground animate-bounce" />
                    <div>
                      <h2 className="text-4xl font-bold text-primary-foreground">RAINY</h2>
                      <p className="text-2xl font-semibold text-primary-foreground/90">22°C - 28°C</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="text-sm font-medium mb-2">
                    <Eye className="w-4 h-4 mr-1" />
                    High Visibility
                  </Badge>
                  <p className="text-primary-foreground/80 text-sm">Confidence: HIGH</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8 relative z-10">
          {/* Alerts Section */}
          <Card className={`backdrop-blur-sm bg-card/80 border-2 transition-all duration-700 hover:shadow-elegant ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{transitionDelay: '200ms'}}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-success/20 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-success" />
                  </div>
                  ALERTS
                </CardTitle>
                <Badge variant="outline" className="text-success border-success/30 bg-success/10">
                  NO WARNING
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 bg-success/10 rounded-xl border border-success/20">
                <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
                <div>
                  <p className="font-semibold text-success">ALL CLEAR</p>
                  <p className="text-sm text-muted-foreground">NO ALERTS FOR THE NEXT 7 DAYS</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 7-Day Forecast */}
          <Card className={`backdrop-blur-sm bg-card/80 transition-all duration-700 hover:shadow-elegant ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{transitionDelay: '400ms'}}>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <Calendar className="w-6 h-6 text-primary" />
                7-DAY DETAILED FORECAST
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {forecastData.map((forecast, index) => {
                  const IconComponent = forecast.icon;
                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedDay(index)}
                      className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg ${
                        selectedDay === index 
                          ? `bg-gradient-to-r ${forecast.bgGradient} border-2 border-primary/30 shadow-lg` 
                          : 'bg-muted/30 hover:bg-muted/50 border border-border/50'
                      } ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${selectedDay === index ? 'bg-primary-foreground/20' : 'bg-background/50'}`}>
                            <IconComponent className={`w-8 h-8 ${selectedDay === index ? forecast.color : 'text-muted-foreground'}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-bold text-lg">{forecast.day}</h3>
                              <Badge variant="outline" className="text-xs">{forecast.date}</Badge>
                            </div>
                            <p className={`text-sm font-semibold ${forecast.color}`}>{forecast.weather}</p>
                            <p className="text-xs text-muted-foreground">Confidence: {forecast.confidence}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-2">
                            <Thermometer className="w-4 h-4 text-muted-foreground" />
                            <span className="text-2xl font-bold">{forecast.maxTemp}°</span>
                            <span className="text-lg text-muted-foreground">{forecast.minTemp}°</span>
                          </div>
                          
                          {selectedDay === index && (
                            <div className="space-y-1 text-xs text-muted-foreground animate-pulse">
                              <div className="flex items-center gap-1">
                                <Droplets className="w-3 h-3" />
                                <span>{forecast.rainfall}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Wind className="w-3 h-3" />
                                <span>{forecast.wind}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span>{forecast.humidity}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Grid */}
          <div className={`grid grid-cols-2 gap-4 transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{transitionDelay: '600ms'}}>
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={index}
                  onClick={() => navigate(action.route)}
                  className={`h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-r ${action.color} hover:scale-105 transition-all duration-300 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl border-0 group relative overflow-hidden ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
                  style={{
                    animationDelay: `${(index + 3) * 100}ms`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <IconComponent className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-xs text-center leading-tight">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};