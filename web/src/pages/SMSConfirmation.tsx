import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MessageSquare, Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const SMSConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const contentType = location.state?.contentType || "forecast";
  const content = location.state?.content || "Weather forecast information";

  const handleSendSMS = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate SMS sending
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "SMS Sent Successfully!",
        description: `${contentType} information has been sent to ${phoneNumber}`,
      });
      navigate(-1);
    }, 2000);
  };

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
            <h1 className="text-xl font-bold">SEND VIA SMS</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* SMS Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-primary" />
            </div>
          </div>

          {/* Content Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Content to Send</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {contentType === "forecast" ? "Weather Forecast" : "Crop Advice"} information will be sent via SMS
              </p>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm">{content}</p>
              </div>
            </CardContent>
          </Card>

          {/* Phone Number Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Enter Phone Number</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+234 XXX XXX XXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Standard SMS rates apply. Message will be sent in English or local language based on your preference.
              </p>
            </CardContent>
          </Card>

          {/* Clisense SMS Service Info */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success mt-0.5" />
                <div>
                  <h3 className="font-medium text-sm">Clisense SMS Service</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Our AI-powered platform delivers hyperlocal weather forecasts and climate insights via SMS to ensure accessibility for all farmers, regardless of smartphone availability.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Send Button */}
          <Button
            onClick={handleSendSMS}
            disabled={isLoading}
            className="w-full bg-success hover:bg-success/90 text-white font-bold py-3 rounded-xl"
            size="lg"
          >
            {isLoading ? "SENDING..." : "SEND SMS"}
          </Button>
        </div>
      </div>
    </Layout>
  );
};