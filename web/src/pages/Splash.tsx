import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf } from "lucide-react";
import { Layout } from "@/components/Layout";

export const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Layout showNavBar={false}>
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center text-white">
          <div className="mb-8">
            <h1 className="text-5xl font-bold tracking-wider mb-4">CLISENSE</h1>
            <p className="text-lg opacity-90 mb-2">Climate-Smart Agriculture Platform</p>
            <p className="text-sm opacity-80 max-w-md mx-auto">
              Empowering smallholder farmers in Sub-Saharan Africa with AI-powered climate insights and early warnings
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};