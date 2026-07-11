import { Home, Leaf, CloudRain, Bell, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, path: "/dashboard", label: "Home" },
    { icon: Leaf, path: "/advice", label: "Advice" },
    { icon: CloudRain, path: "/predict", label: "Predict" },
    { icon: Bell, path: "/alerts", label: "Alerts" },
    { icon: User, path: "/profile", label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary/10 backdrop-blur-lg border-t border-primary/20">
      {/* Clisense Branding Header */}
      <div className="bg-primary/20 backdrop-blur-lg border-b border-primary/30 py-2">
        <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
          <span className="text-primary font-bold text-sm tracking-wider">CLISENSE</span>
        </div>
      </div>
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {navItems.map(({ icon: Icon, path, label }) => {
          const isActive = location.pathname === path;
          return (
            <Button
              key={path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-1 px-4 py-2 h-auto ${
                isActive
                  ? "bg-primary text-primary-foreground rounded-full"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};