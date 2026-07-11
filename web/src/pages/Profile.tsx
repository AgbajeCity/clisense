import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, User, Lock, Settings, Fingerprint, Bell, Globe, Shield, HelpCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logging out...",
      description: "You have been successfully logged out of Clisense",
    });
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  const accountOptions = [
    { icon: User, title: "PROFILE", subtitle: "EDIT YOUR PROFILE", action: () => navigate("/edit-profile") },
    { icon: Lock, title: "PASSWORD", subtitle: "CHANGE YOUR PASSWORD", action: () => {} },
    { icon: Settings, title: "SETTINGS", subtitle: "GO TO YOUR SETTINGS", action: () => navigate("/settings") },
  ];

  const preferenceOptions = [
    { icon: Bell, title: "COMMUNICATION", subtitle: "MANAGE YOUR COMMUNICATION PREFERENCES", action: () => navigate("/communication") },
    { icon: Globe, title: "LANGUAGE", subtitle: "SWITCH LANGUAGES", action: () => {} },
  ];

  const helpOptions = [
    { icon: HelpCircle, title: "CONTACT", subtitle: "CONTACT US FOR HELP", action: () => {} },
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
            <h1 className="text-xl font-bold">PROFILE</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <Avatar className="w-16 h-16">
                <AvatarImage src="/uploads/cfc77567-41c4-4c66-b304-e5f85ebd27f4.png" />
                <AvatarFallback>AA</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">AYOMIDE AGBAJE</h2>
              <p className="text-sm text-muted-foreground">agbajeayomide001@gmail.com</p>
            </div>
          </div>

          {/* Account Section */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-3">ACCOUNT</h3>
            <Card>
              <CardContent className="p-0">
                {accountOptions.map((option, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-4 p-4 border-b border-border last:border-b-0 cursor-pointer hover:bg-muted/50"
                    onClick={option.action}
                  >
                    <div className="bg-muted p-3 rounded-lg">
                      <option.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground">{option.title}</h4>
                      <p className="text-sm text-success">{option.subtitle}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-4 p-4">
                  <div className="bg-muted p-3 rounded-lg">
                    <Fingerprint className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground">ENABLE BIOMETRICS</h4>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preferences Section */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-3">PREFERENCES</h3>
            <Card>
              <CardContent className="p-0">
                {preferenceOptions.map((option, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-4 p-4 border-b border-border last:border-b-0 cursor-pointer hover:bg-muted/50"
                    onClick={option.action}
                  >
                    <div className="bg-muted p-3 rounded-lg">
                      <option.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground">{option.title}</h4>
                      <p className="text-sm text-success">{option.subtitle}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Privacy Section */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-3">PRIVACY</h3>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-muted p-3 rounded-lg">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground">PRIVACY</h4>
                    <p className="text-sm text-success">PRIVACY AND DATA USE NOTIFICATIONS</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Help Section */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-3">Help</h3>
            <Card>
              <CardContent className="p-0">
                {helpOptions.map((option, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-4 p-4 border-b border-border last:border-b-0 cursor-pointer hover:bg-muted/50"
                    onClick={option.action}
                  >
                    <div className="bg-muted p-3 rounded-lg">
                      <option.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground">{option.title}</h4>
                      <p className="text-sm text-success">{option.subtitle}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-4 p-4 border-b border-border">
                  <div className="bg-muted p-3 rounded-lg">
                    <Fingerprint className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground">NOTIFICATION</h4>
                    <h4 className="font-bold text-foreground">PREFERENCES</h4>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Logout Section */}
          <div>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full bg-destructive hover:bg-destructive/90 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-3"
              size="lg"
            >
              <LogOut className="w-5 h-5" />
              LOGOUT
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};