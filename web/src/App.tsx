import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Splash } from "./pages/Splash";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Onboarding } from "./pages/Onboarding";
import { Congratulations } from "./pages/Congratulations";
import { Dashboard } from "./pages/Dashboard";
import { CropAdvice } from "./pages/CropAdvice";
import { Profile } from "./pages/Profile";
import { Forecast } from "./pages/Forecast";
import { Alerts } from "./pages/Alerts";
import { About } from "./pages/About";
import { EditProfile } from "./pages/EditProfile";
import { Settings } from "./pages/Settings";
import { Communication } from "./pages/Communication";
import { SMSConfirmation } from "./pages/SMSConfirmation";
import { VoicePlayback } from "./pages/VoicePlayback";
import { StrategyDetails } from "./pages/StrategyDetails";
import WEFNexus from "./pages/WEFNexus";
import DataEngine from "./pages/DataEngine";
import { Contact } from "./pages/Contact";
import CliNodeDevice from "./pages/CliNodeDevice";
import SetupWizard from "./pages/SetupWizard";
import FirmwareDemo from "./pages/FirmwareDemo";
import LivePredict from "./pages/LivePredict";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><ErrorBoundary><Index /></ErrorBoundary></PageTransition>} />
        <Route path="/login" element={<PageTransition><ErrorBoundary><Index /></ErrorBoundary></PageTransition>} />
        <Route path="/signup" element={<PageTransition><ErrorBoundary><Index /></ErrorBoundary></PageTransition>} />
        <Route path="/onboarding" element={<PageTransition><Onboarding /></PageTransition>} />
        <Route path="/congratulations" element={<PageTransition><Congratulations /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/advice" element={<PageTransition><CropAdvice /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="/forecast" element={<PageTransition><Forecast /></PageTransition>} />
        <Route path="/alerts" element={<PageTransition><Alerts /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/edit-profile" element={<PageTransition><EditProfile /></PageTransition>} />
        <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
        <Route path="/communication" element={<PageTransition><Communication /></PageTransition>} />
        <Route path="/sms-confirmation" element={<PageTransition><SMSConfirmation /></PageTransition>} />
        <Route path="/voice-playback" element={<PageTransition><VoicePlayback /></PageTransition>} />
        <Route path="/strategy-details" element={<PageTransition><StrategyDetails /></PageTransition>} />
        <Route path="/wef-nexus" element={<PageTransition><WEFNexus /></PageTransition>} />
        <Route path="/data-engine" element={<PageTransition><DataEngine /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/clinode" element={<PageTransition><CliNodeDevice /></PageTransition>} />
        <Route path="/setup-wizard" element={<PageTransition><SetupWizard /></PageTransition>} />
        <Route path="/firmware-demo" element={<PageTransition><FirmwareDemo /></PageTransition>} />
        <Route path="/predict" element={<PageTransition><ErrorBoundary><LivePredict /></ErrorBoundary></PageTransition>} />
        <Route path="/index" element={<PageTransition><Index /></PageTransition>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
