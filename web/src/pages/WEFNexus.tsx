import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Droplets, 
  Zap, 
  Wheat, 
  AlertTriangle, 
  TrendingUp, 
  MapPin,
  BarChart3,
  Target,
  Shield,
  Globe,
  ArrowLeft,
  Sparkles,
  Activity,
  Users,
  Building2,
  Scale
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WEFNexus = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("overview");

  // Mock data for demonstration
  const efficiencyData = [
    { name: 'Nexus Efficiency', value: 78, color: 'hsl(var(--primary))' },
    { name: 'Sustainability', value: 65, color: 'hsl(var(--accent))' },
    { name: 'Resilience', value: 82, color: 'hsl(var(--success))' }
  ];

  const correlationData = [
    { name: 'Water-Energy', value: 85 },
    { name: 'Water-Food', value: 72 },
    { name: 'Energy-Food', value: 68 }
  ];

  const metrics = [
    { icon: Droplets, label: "Water Resources", value: "78%", desc: "Availability Index", color: "from-blue-500 to-cyan-500" },
    { icon: Zap, label: "Energy Access", value: "64%", desc: "Grid Reliability", color: "from-yellow-500 to-orange-500" },
    { icon: Wheat, label: "Food Security", value: "71%", desc: "Security Index", color: "from-green-500 to-emerald-500" },
  ];

  return (
    <Layout showNavBar={false}>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl animate-float animation-delay-1000" />
          </div>

          <div className="container mx-auto px-4 py-6 relative z-10">
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
                  <Globe className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    WEF Nexus Intelligence
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                  </h1>
                  <p className="text-sm text-primary-foreground/80">
                    Integrated Water-Energy-Food Analytics
                  </p>
                </div>
              </div>
            </div>
            
            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-2">
              {metrics.map((metric, i) => (
                <div 
                  key={i}
                  className="glass rounded-2xl p-5 transform hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${metric.color} shadow-lg group-hover:scale-110 transition-transform`}>
                      <metric.icon className="h-5 w-5 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      Live
                    </Badge>
                  </div>
                  <p className="text-3xl font-bold mb-1">{metric.value}</p>
                  <p className="text-sm font-medium">{metric.label}</p>
                  <p className="text-xs text-primary-foreground/70">{metric.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* Main Analytics Dashboard */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-card/80 backdrop-blur-sm p-1 rounded-xl shadow-lg">
              <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
              <TabsTrigger value="correlations" className="rounded-lg">Correlations</TabsTrigger>
              <TabsTrigger value="predictions" className="rounded-lg">Predictions</TabsTrigger>
              <TabsTrigger value="stakeholders" className="rounded-lg">Stakeholders</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Efficiency Metrics */}
                <Card className="card-elevated border-0 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-primary to-accent" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl">
                        <Target className="h-5 w-5 text-white" />
                      </div>
                      <span>System Efficiency</span>
                    </CardTitle>
                    <CardDescription>
                      Integrated performance across WEF sectors
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {[
                      { label: "Nexus Efficiency", value: 78, color: "bg-primary" },
                      { label: "Sustainability Index", value: 65, color: "bg-accent" },
                      { label: "Resilience Score", value: 82, color: "bg-success" },
                    ].map((item, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{item.label}</span>
                          <span className="text-sm font-bold">{item.value}%</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Resource Optimization Chart */}
                <Card className="card-elevated border-0 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-accent to-primary" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-accent to-primary rounded-xl">
                        <BarChart3 className="h-5 w-5 text-white" />
                      </div>
                      <span>Resource Optimization</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={efficiencyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Risk Assessment */}
                <Card className="card-elevated border-0 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-warning to-destructive" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-warning to-orange-500 rounded-xl">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <span>Climate Risk Assessment</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: "Drought Risk", level: "Medium", color: "warning", icon: AlertTriangle },
                      { label: "Water Stress", level: "High", color: "destructive", icon: Droplets },
                      { label: "Energy Security", level: "Low Risk", color: "success", icon: Zap },
                    ].map((risk, i) => (
                      <div 
                        key={i} 
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-${risk.color}/10`}>
                            <risk.icon className={`h-4 w-4 text-${risk.color}`} />
                          </div>
                          <span className="font-medium">{risk.label}</span>
                        </div>
                        <Badge 
                          variant={risk.color === "success" ? "default" : "outline"}
                          className={
                            risk.color === "destructive" ? "border-destructive text-destructive" :
                            risk.color === "warning" ? "border-warning text-warning" :
                            "bg-success/10 text-success border-success/20"
                          }
                        >
                          {risk.level}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Actionable Insights */}
                <Card className="card-elevated border-0 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-success to-accent" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-success to-accent rounded-xl">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <span>Actionable Insights</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { title: "Water Conservation Priority", desc: "Implement drip irrigation to improve efficiency by 35%", color: "primary" },
                      { title: "Renewable Energy Opportunity", desc: "Solar potential indicates 2.5kW capacity for farms", color: "accent" },
                      { title: "Crop Diversification", desc: "Introduce drought-resistant varieties for food security", color: "success" },
                    ].map((insight, i) => (
                      <div 
                        key={i}
                        className={`p-4 bg-${insight.color}/5 border border-${insight.color}/20 rounded-xl hover:bg-${insight.color}/10 transition-colors cursor-pointer`}
                      >
                        <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                        <p className="text-xs text-muted-foreground">{insight.desc}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="correlations" className="animate-fade-in">
              <Card className="card-elevated border-0 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-blue-500 via-yellow-500 to-green-500" />
                <CardHeader>
                  <CardTitle>WEF Nexus Correlations</CardTitle>
                  <CardDescription>
                    Understanding interconnections between water, energy, and food systems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={correlationData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="value" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="predictions" className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="card-elevated border-0 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      Predictive Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 text-sm">
                      AI-powered predictions for the next 12 months
                    </p>
                    <div className="space-y-3">
                      {[
                        { label: "Water Availability", trend: "Declining 15%", color: "warning" },
                        { label: "Energy Demand", trend: "Increasing 22%", color: "destructive" },
                        { label: "Food Production", trend: "Stable", color: "success" },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-muted/50 rounded-xl">
                          <span className="font-medium">{item.label}</span>
                          <Badge variant="outline" className={`border-${item.color} text-${item.color}`}>
                            {item.trend}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-elevated border-0 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
                  <CardHeader>
                    <CardTitle>Scenario Planning</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { icon: MapPin, label: "Climate Impact Assessment" },
                      { icon: BarChart3, label: "Resource Optimization Scenarios" },
                      { icon: Target, label: "Policy Intervention Analysis" },
                    ].map((item, i) => (
                      <Button key={i} variant="outline" className="w-full justify-start h-12 hover:bg-primary/5">
                        <item.icon className="h-4 w-4 mr-3 text-primary" />
                        {item.label}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="stakeholders" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { 
                    icon: Users, 
                    title: "Farmers Dashboard", 
                    desc: "Farm-level insights and recommendations",
                    color: "from-green-500 to-emerald-500",
                    features: ["Crop yield optimization", "Water usage efficiency", "Climate risk alerts"]
                  },
                  { 
                    icon: Building2, 
                    title: "Business Intelligence", 
                    desc: "Market trends and supply chain insights",
                    color: "from-blue-500 to-cyan-500",
                    features: ["Supply chain optimization", "Risk management tools", "Investment opportunities"]
                  },
                  { 
                    icon: Scale, 
                    title: "Policy Makers", 
                    desc: "Regional analysis and policy support",
                    color: "from-purple-500 to-pink-500",
                    features: ["Regional impact analysis", "Policy effectiveness metrics", "Resource allocation guidance"]
                  },
                ].map((item, i) => (
                  <Card key={i} className="card-interactive border-0 overflow-hidden">
                    <div className={`h-1 bg-gradient-to-r ${item.color}`} />
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>{item.desc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className={`w-full mb-4 bg-gradient-to-r ${item.color} hover:opacity-90`}>
                        Access Dashboard
                      </Button>
                      <ul className="space-y-2">
                        {item.features.map((feature, j) => (
                          <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default WEFNexus;
