import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, X } from "lucide-react";
import { Layout } from "@/components/Layout";

export const Congratulations = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Layout showNavBar={false}>
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          backgroundImage: `linear-gradient(rgba(34, 139, 34, 0.3), rgba(34, 139, 34, 0.5)), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><pattern id="b" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="%2322c55e"/><circle cx="20" cy="20" r="3" fill="%23166534" opacity="0.3"/></pattern></defs><rect width="100%" height="100%" fill="url(%23b)"/></svg>')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-lg">
          <CardContent className="p-8 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
            
            <div className="mb-6">
              <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-success" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">CONGRATULATIONS</h1>
              <p className="text-muted-foreground">
                Your account is ready to use. You will be redirected to the Home Page in a few seconds.
              </p>
            </div>

            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-success hover:bg-success/90 text-white font-bold py-3 rounded-xl"
              size="lg"
            >
              GO TO DASHBOARD
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};