import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Smartphone, Wifi, Download, Database, Trash2, LogOut } from "lucide-react";

export const Settings = () => {
  const navigate = useNavigate();

  const settingsOptions = [
    { icon: Smartphone, title: "SYNC DATA", subtitle: "Automatically sync your data", hasSwitch: true },
    { icon: Wifi, title: "OFFLINE MODE", subtitle: "Enable offline functionality", hasSwitch: true },
    { icon: Download, title: "AUTO DOWNLOAD", subtitle: "Download updates automatically", hasSwitch: true },
    { icon: Database, title: "DATA USAGE", subtitle: "Monitor your data consumption", hasSwitch: false },
  ];

  const dangerOptions = [
    { icon: Trash2, title: "CLEAR CACHE", subtitle: "Clear app cache and temporary files", action: () => {} },
    { icon: LogOut, title: "LOGOUT", subtitle: "Sign out of your account", action: () => navigate("/login") },
  ];

  return (
    <Layout showNavBar={false}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-primary text-white p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/profile")}
              className="text-white hover:bg-white/20 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">SETTINGS</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* General Settings */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-3">GENERAL</h3>
            <Card>
              <CardContent className="p-0">
                {settingsOptions.map((option, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border-b border-border last:border-b-0">
                    <div className="bg-muted p-3 rounded-lg">
                      <option.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground">{option.title}</h4>
                      <p className="text-sm text-success">{option.subtitle}</p>
                    </div>
                    {option.hasSwitch && <Switch defaultChecked />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Danger Zone */}
          <div>
            <h3 className="text-lg font-bold text-destructive mb-3">DANGER ZONE</h3>
            <Card>
              <CardContent className="p-0">
                {dangerOptions.map((option, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-4 p-4 border-b border-border last:border-b-0 cursor-pointer hover:bg-muted/50"
                    onClick={option.action}
                  >
                    <div className="bg-destructive/10 p-3 rounded-lg">
                      <option.icon className="w-5 h-5 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-destructive">{option.title}</h4>
                      <p className="text-sm text-muted-foreground">{option.subtitle}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* App Version */}
          <div className="text-center pt-8">
            <p className="text-sm text-muted-foreground">Clisense v1.0.0</p>
            <p className="text-xs text-muted-foreground mt-1">© 2024 Clisense. All rights reserved.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};