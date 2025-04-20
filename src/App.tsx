
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
    
    // Initialize the usage tracker
    if (typeof window !== 'undefined') {
      import('@/services/UsageTracker').then(() => {
        console.log('Usage tracker initialized');
      });
    }
    
    // Set up daily notification
    const checkAndSendDailyNotification = () => {
      const lastNotification = localStorage.getItem('lastDailyNotification');
      const today = new Date().toDateString();
      
      if (lastNotification !== today) {
        // Import dynamically to avoid issues during initialization
        import('@/services/UsageTracker').then(({ default: UsageTracker }) => {
          // Get today's saved minutes
          const savedMinutes = UsageTracker.getDailyUsage(new Date().toISOString().split('T')[0])?.savedMinutes || 0;
          
          setTimeout(() => {
            import('sonner').then(({ toast }) => {
              toast({
                title: "Daily Reminder",
                description: `Stay strong! You've saved ${savedMinutes} minutes today.`,
                duration: 5000,
              });
            });
          }, 5000); // Show after 5 seconds
          
          // Mark notification as shown today
          localStorage.setItem('lastDailyNotification', today);
        });
      }
    };
    
    checkAndSendDailyNotification();
    
    // Schedule notification check every hour
    const intervalId = setInterval(checkAndSendDailyNotification, 3600000);
    
    return () => clearInterval(intervalId);
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
