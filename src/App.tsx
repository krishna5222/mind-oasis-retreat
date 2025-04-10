
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OnboardingPage from "./pages/OnboardingPage";

const queryClient = new QueryClient();

const App = () => {
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if onboarding is completed
    const onboardingData = localStorage.getItem('mindCleanseOnboarding');
    if (onboardingData) {
      const { onboardingCompleted } = JSON.parse(onboardingData);
      setOnboardingCompleted(onboardingCompleted);
    } else {
      setOnboardingCompleted(false);
    }
  }, []);

  // Show loading state while checking onboarding status
  if (onboardingCompleted === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/onboarding" element={onboardingCompleted ? <Navigate to="/" /> : <OnboardingPage />} />
            <Route path="/" element={!onboardingCompleted ? <Navigate to="/onboarding" /> : <Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
