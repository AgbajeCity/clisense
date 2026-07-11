import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Sprout, Shield, Leaf, Link2, Droplets } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const CropAdvice = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCrop, setSelectedCrop] = useState("");

  const handleStrategyClick = (strategy: any) => {
    toast({
      title: strategy.title,
      description: `${strategy.description} This strategy is particularly effective for climate adaptation in your region.`,
    });
    navigate("/strategy-details", { 
      state: { 
        strategy,
        crop: selectedCrop 
      } 
    });
  };

  const adaptationStrategies = [
    {
      icon: Sprout,
      title: "EARLY PLANTING",
      description: "Plant early-maturing varieties to avoid late season droughts.",
    },
    {
      icon: Shield,
      title: "CONSERVATION TILLAGE",
      description: "Use conservation tillage to retain soil moisture and improve soil health.",
    },
    {
      icon: Leaf,
      title: "MULCHING",
      description: "Apply organic mulch to reduce evaporation and suppress weeds.",
    },
    {
      icon: Link2,
      title: "INTERCROPPING",
      description: "Intercrop with legumes to improve soil fertility and water use efficiency.",
    },
    {
      icon: Droplets,
      title: "Water Harvesting",
      description: "Implement water harvesting techniques to capture and store rainwater.",
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
            <h1 className="text-xl font-bold">CROP ADVICE</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Crop Selection */}
          <Card>
            <CardContent className="p-4">
              <Select onValueChange={setSelectedCrop}>
                <SelectTrigger className="w-full text-left font-bold text-muted-foreground">
                  <SelectValue placeholder="SELECT CROP" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maize">Maize/Corn</SelectItem>
                  <SelectItem value="rice">Rice</SelectItem>
                  <SelectItem value="wheat">Wheat</SelectItem>
                  <SelectItem value="cassava">Cassava</SelectItem>
                  <SelectItem value="yam">Yam</SelectItem>
                  <SelectItem value="plantain">Plantain</SelectItem>
                  <SelectItem value="cocoa">Cocoa</SelectItem>
                  <SelectItem value="coffee">Coffee</SelectItem>
                  <SelectItem value="tea">Tea</SelectItem>
                  <SelectItem value="beans">Beans/Legumes</SelectItem>
                  <SelectItem value="groundnuts">Groundnuts/Peanuts</SelectItem>
                  <SelectItem value="millet">Millet</SelectItem>
                  <SelectItem value="sorghum">Sorghum</SelectItem>
                  <SelectItem value="sweet-potato">Sweet Potato</SelectItem>
                  <SelectItem value="irish-potato">Irish Potato</SelectItem>
                  <SelectItem value="tomato">Tomato</SelectItem>
                  <SelectItem value="pepper">Pepper</SelectItem>
                  <SelectItem value="onion">Onion</SelectItem>
                  <SelectItem value="okra">Okra</SelectItem>
                  <SelectItem value="cucumber">Cucumber</SelectItem>
                  <SelectItem value="watermelon">Watermelon</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="citrus">Citrus Fruits</SelectItem>
                  <SelectItem value="avocado">Avocado</SelectItem>
                  <SelectItem value="mango">Mango</SelectItem>
                  <SelectItem value="papaya">Papaya</SelectItem>
                  <SelectItem value="sugarcane">Sugarcane</SelectItem>
                  <SelectItem value="cotton">Cotton</SelectItem>
                  <SelectItem value="tobacco">Tobacco</SelectItem>
                  <SelectItem value="sesame">Sesame</SelectItem>
                  <SelectItem value="sunflower">Sunflower</SelectItem>
                  <SelectItem value="palm-oil">Oil Palm</SelectItem>
                  <SelectItem value="rubber">Rubber</SelectItem>
                  <SelectItem value="soybeans">Soybeans</SelectItem>
                  <SelectItem value="mixed-vegetables">Mixed Vegetables</SelectItem>
                  <SelectItem value="mixed-cereals">Mixed Cereals</SelectItem>
                  <SelectItem value="livestock-feed">Livestock Feed Crops</SelectItem>
                  <SelectItem value="medicinal-plants">Medicinal Plants</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Adaptation Strategies */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">ADAPTATION STRATEGIES</h2>
            <div className="space-y-4">
              {adaptationStrategies.map((strategy, index) => (
                <Card 
                  key={index} 
                  className="bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleStrategyClick(strategy)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-muted p-3 rounded-lg">
                        <strategy.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground mb-1">{strategy.title}</h3>
                        <p className="text-sm text-muted-foreground">{strategy.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/sms-confirmation", { 
                state: { 
                  contentType: "crop advice", 
                  content: `CROP ADVICE for ${selectedCrop || "selected crop"}: Early planting, conservation tillage, mulching, intercropping, and water harvesting techniques recommended for climate adaptation.` 
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
                  contentType: "crop advice", 
                  content: `CROP ADVICE for ${selectedCrop || "selected crop"}: Early planting, conservation tillage, mulching, intercropping, and water harvesting techniques recommended for climate adaptation.` 
                } 
              })}
              className="flex-1 bg-success/80 hover:bg-success/70 text-white font-bold py-3 rounded-xl"
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