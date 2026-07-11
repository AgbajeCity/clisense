import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle, CheckCircle, Info, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const Alerts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAlertClick = (alert: any) => {
    toast({
      title: alert.title,
      description: `Alert Details: ${alert.message}`,
    });
  };

  const alerts = [
    {
      type: "success",
      icon: CheckCircle,
      title: "No Active Warnings",
      message: "No weather warnings are currently active for your area.",
      time: "Last updated: 2 hours ago",
    },
    {
      type: "info",
      icon: Info,
      title: "Weekly Forecast Update",
      message: "New 7-day forecast is available with improved accuracy.",
      time: "3 hours ago",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="bg-primary text-white p-4">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="text-white hover:bg-white/20 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">WEATHER ALERTS</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Current Status */}
          <Card className="border-success bg-success/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-success/10 p-3 rounded-full">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground">ALL CLEAR</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    No weather warnings for your area in the next 7 days
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    No Active Alerts
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alert History */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">RECENT ALERTS</h3>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <Card 
                  key={index}
                  className="cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => handleAlertClick(alert)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        alert.type === "success" ? "bg-success/10" :
                        alert.type === "warning" ? "bg-warning/10" : "bg-blue-100"
                      }`}>
                        <alert.icon className={`w-5 h-5 ${
                          alert.type === "success" ? "text-success" :
                          alert.type === "warning" ? "text-warning" : "text-blue-600"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground">{alert.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">{alert.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Alert Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">ALERT PREFERENCES</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-foreground">SMS Alerts</p>
                  <p className="text-sm text-muted-foreground">Receive weather warnings via SMS</p>
                </div>
                <div className="w-12 h-6 bg-success rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-foreground">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Get notified on your device</p>
                </div>
                <div className="w-12 h-6 bg-success rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Access Buttons */}
          <div className="flex gap-3 mb-4">
            <Button
              onClick={() => navigate("/profile")}
              variant="outline"
              className="flex-1 font-bold py-3 rounded-xl flex items-center justify-center gap-2"
              size="lg"
            >
              <User className="w-5 h-5" />
              PROFILE
            </Button>
            <Button
              onClick={() => navigate("/settings")}
              variant="outline"
              className="flex-1 font-bold py-3 rounded-xl flex items-center justify-center gap-2"
              size="lg"
            >
              <Settings className="w-5 h-5" />
              SETTINGS
            </Button>
          </div>

          {/* Refresh Button */}
          <Button
            onClick={() => window.location.reload()}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl"
            size="lg"
          >
            REFRESH ALERTS
          </Button>
        </div>
      </div>
    </Layout>
  );
};