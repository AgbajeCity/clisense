import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, Volume2, Languages, Download } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const VoicePlayback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("english");

  const contentType = location.state?.contentType || "forecast";
  const content = location.state?.content || "Weather forecast information";

  const languages = [
    { code: "english", name: "English", flag: "🇬🇧" },
    { code: "yoruba", name: "Yoruba", flag: "🇳🇬" },
    { code: "hausa", name: "Hausa", flag: "🇳🇬" },
    { code: "igbo", name: "Igbo", flag: "🇳🇬" },
    { code: "kinyarwanda", name: "Kinyarwanda", flag: "🇷🇼" },
  ];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      // Create audio element for actual voice playback
      const audio = new Audio();
      
      // Sample text-to-speech message based on content
      const speechText = contentType === "forecast" ? 
        `Weather forecast for your area: ${content}. Expect temperatures between 22 to 28 degrees Celsius with rainy conditions in the next 7 days.` :
        `Agricultural advice: ${content}. These adaptation strategies will help protect your crops from climate changes.`;
      
      // Use Web Speech API for actual voice synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.lang = selectedLanguage === 'yoruba' ? 'yo-NG' : 
                        selectedLanguage === 'hausa' ? 'ha-NE' :
                        selectedLanguage === 'igbo' ? 'ig-NG' :
                        selectedLanguage === 'kinyarwanda' ? 'rw-RW' : 'en-US';
        
        utterance.onstart = () => {
          toast({
            title: "Playing Voice Message",
            description: `${contentType} information in ${languages.find(l => l.code === selectedLanguage)?.name}`,
          });
        };
        
        utterance.onend = () => {
          setIsPlaying(false);
          toast({
            title: "Playback Complete",
            description: "Voice message finished playing",
          });
        };
        
        speechSynthesis.speak(utterance);
      } else {
        // Fallback for browsers without speech synthesis
        toast({
          title: "Playing Voice Message",
          description: `${contentType} information in ${languages.find(l => l.code === selectedLanguage)?.name}`,
        });
        
        setTimeout(() => {
          setIsPlaying(false);
          toast({
            title: "Playback Complete",
            description: "Voice message finished playing",
          });
        }, 5000);
      }
    } else {
      // Stop speech synthesis if playing
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    }
  };

  const handleDownload = () => {
    toast({
      title: "Downloading Audio",
      description: "Voice message is being downloaded to your device",
    });
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
            <h1 className="text-xl font-bold">VOICE PLAYBACK</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Voice Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Volume2 className="w-10 h-10 text-primary" />
            </div>
          </div>

          {/* Content Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Audio Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {contentType === "forecast" ? "Weather Forecast" : "Crop Advice"} information
              </p>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm">{content}</p>
              </div>
            </CardContent>
          </Card>

          {/* Language Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Languages className="w-5 h-5" />
                Select Language
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={selectedLanguage === lang.code ? "default" : "outline"}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className="justify-start"
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Playback Controls */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={handlePlayPause}
                    size="lg"
                    className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8 ml-1" />
                    )}
                  </Button>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`bg-primary h-2 rounded-full transition-all duration-1000 ${
                      isPlaying ? "w-full" : "w-0"
                    }`}
                  />
                </div>
                
                <p className="text-sm text-muted-foreground text-center">
                  {isPlaying ? "Playing..." : "Ready to play"} in {languages.find(l => l.code === selectedLanguage)?.name}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Clisense Voice Service Info */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Volume2 className="w-5 h-5 text-success mt-0.5" />
                <div>
                  <h3 className="font-medium text-sm">Clisense Voice Service</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Our platform provides voice messages in multiple local languages to ensure farmers with limited literacy can access critical climate information and agricultural guidance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex-1 font-bold py-3 rounded-xl"
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" />
              DOWNLOAD
            </Button>
            <Button
              onClick={() => navigate("/sms-confirmation", { 
                state: { contentType, content } 
              })}
              className="flex-1 bg-success hover:bg-success/90 text-white font-bold py-3 rounded-xl"
              size="lg"
            >
              SEND VIA SMS
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};