import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Leaf } from "lucide-react";
import { Layout } from "@/components/Layout";

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Mock login - in real app, would validate credentials
    navigate("/dashboard");
  };

  return (
    <Layout showNavBar={false}>
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          backgroundImage: `linear-gradient(rgba(34, 139, 34, 0.8), rgba(34, 139, 34, 0.9)), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" stop-color="%2334a853"/><stop offset="100%" stop-color="%23137c38"/></radialGradient></defs><rect width="100%" height="100%" fill="url(%23a)"/></svg>')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center gap-4 text-white">
              <h1 className="text-4xl font-bold tracking-wider">CLISENSE</h1>
              <div className="text-center">
                <h2 className="text-2xl font-bold">WELCOME BACK</h2>
                <p className="text-sm opacity-90 mt-2 max-w-sm">
                  Climate-Smart Agriculture Platform for Sub-Saharan Africa
                </p>
                <p className="text-xs opacity-80 mt-1">
                  AI-powered insights for resilient farming
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-bold">
                EMAIL
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="user@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-bold">
                PASSWORD
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="**********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
              />
            </div>
            <div className="text-center">
              <Button
                variant="link"
                className="text-white underline text-sm p-0"
                onClick={() => navigate("/forgot-password")}
              >
                FORGOT YOUR PASSWORD?
              </Button>
            </div>
            <Button
              onClick={handleLogin}
              className="w-full bg-success hover:bg-success/90 text-white font-bold py-3 rounded-xl"
              size="lg"
            >
              LOG IN
            </Button>
            <div className="text-center text-white text-sm">
              <span>DON'T HAVE AN ACCOUNT </span>
              <Button
                variant="link"
                className="text-white underline text-sm p-0"
                onClick={() => navigate("/signup")}
              >
                SIGNUP?
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};