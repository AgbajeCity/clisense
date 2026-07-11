import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const StrategyDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { strategy, crop } = location.state || {};

  const implementationSteps = [
    {
      step: 1,
      title: "Planning Phase",
      description: "Assess current conditions and plan implementation timeline",
      icon: Info,
    },
    {
      step: 2,
      title: "Resource Preparation",
      description: "Gather necessary materials and tools for implementation",
      icon: AlertCircle,
    },
    {
      step: 3,
      title: "Implementation",
      description: "Execute the adaptation strategy according to best practices",
      icon: CheckCircle,
    },
  ];

  const benefits = [
    "Improved crop resilience to climate variability",
    "Enhanced soil health and water retention", 
    "Reduced input costs over time",
    "Increased yield stability",
    "Better adaptation to changing weather patterns"
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
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/20 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">STRATEGY DETAILS</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Strategy Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                {strategy?.icon && <strategy.icon className="w-6 h-6 text-primary" />}
                {strategy?.title || "Strategy Details"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Recommended for: {crop || "Selected crop"}
              </p>
              <p className="text-sm">{strategy?.description}</p>
            </CardContent>
          </Card>

          {/* Implementation Steps */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">IMPLEMENTATION STEPS</h3>
            <div className="space-y-3">
              {implementationSteps.map((step, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-2 rounded-full min-w-[40px] flex items-center justify-center">
                        <span className="text-primary font-bold">{step.step}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground mb-1">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                      <step.icon className="w-5 h-5 text-success" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">EXPECTED BENEFITS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <p className="text-sm text-foreground">{benefit}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Clisense Information */}
          <Card className="bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium text-sm">Clisense Recommendation</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    This strategy has been validated through our AI analysis of local climate patterns and agricultural data for optimal results in your region.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/sms-confirmation", { 
                state: { 
                  contentType: "strategy details", 
                  content: `${strategy?.title}: ${strategy?.description}. Implementation steps and benefits included.` 
                } 
              })}
              className="flex-1 bg-success hover:bg-success/90 text-white font-bold py-3 rounded-xl"
              size="lg"
            >
              SEND VIA SMS
            </Button>
            <Button
              onClick={() => navigate("/voice-playback", { 
                state: { 
                  contentType: "strategy details", 
                  content: `${strategy?.title}: ${strategy?.description}. Implementation steps and benefits included.` 
                } 
              })}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl"
              size="lg"
            >
              VOICE PLAYBACK
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};