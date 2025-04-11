
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, format } from 'date-fns';

const DetoxCountdown = () => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [detoxEnds, setDetoxEnds] = useState<Date | null>(null);
  const [timeSaved, setTimeSaved] = useState(0);
  const { toast } = useToast();

  // Calculate time remaining in the detox period
  useEffect(() => {
    const onboardingData = localStorage.getItem('mindCleanseOnboarding');
    if (!onboardingData) return;

    const { startDate, detoxDuration, customDays } = JSON.parse(onboardingData);
    const start = new Date(startDate);
    
    // Calculate end date based on duration
    const durationInDays = detoxDuration === 'custom' ? 
      parseInt(customDays, 10) : 
      parseInt(detoxDuration, 10);
    
    const end = new Date(start);
    end.setDate(end.getDate() + durationInDays);
    setDetoxEnds(end);
    
    // Update the countdown
    const updateCountdown = () => {
      const now = new Date();
      
      if (now >= end) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = differenceInDays(end, now);
      const hours = differenceInHours(end, now) % 24;
      const minutes = differenceInMinutes(end, now) % 60;
      const seconds = differenceInSeconds(end, now) % 60;
      
      setTimeRemaining({ days, hours, minutes, seconds });
    };
    
    // Initial update
    updateCountdown();
    
    // Set up interval for countdown
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Get saved time data and show reminder notifications
  useEffect(() => {
    // Get the usage data to calculate time saved
    const getTimeSavedToday = () => {
      const usageData = localStorage.getItem('mindCleanseUsageStats');
      if (!usageData) return 0;
      
      const { sessions } = JSON.parse(usageData);
      const today = format(new Date(), 'yyyy-MM-dd');
      const todaySessions = sessions.filter((session: any) => 
        session.date === today && session.avoidedUsage === true
      );
      
      const totalMinutes = todaySessions.reduce((total: number, session: any) => 
        total + session.duration, 0);
      
      return totalMinutes;
    };

    // Check and update time saved once per minute
    const checkTimeSaved = () => {
      const savedMinutes = getTimeSavedToday();
      if (savedMinutes !== timeSaved) {
        setTimeSaved(savedMinutes);
        
        // Only show notification if there's a meaningful update (more time saved)
        if (savedMinutes > timeSaved && timeSaved > 0) {
          toast({
            title: "Daily Reminder",
            description: `Stay strong! You've saved ${savedMinutes} minutes today.`,
            duration: 5000,
          });
        }
      }
    };

    // Initial check
    checkTimeSaved();
    
    // Set up interval for checking time saved (every minute)
    const interval = setInterval(checkTimeSaved, 60000);
    
    return () => clearInterval(interval);
  }, [timeSaved, toast]);

  // Format the countdown for display
  const formatTimeUnit = (unit: number) => {
    return unit.toString().padStart(2, '0');
  };

  if (!detoxEnds) {
    return null; // Don't render until we have the detox end date
  }

  return (
    <Card className="bg-gradient-to-br from-mindcleanse-50 to-white shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-mindcleanse-700">Detox Countdown</CardTitle>
        <CardDescription>Time remaining in your digital detox</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-mindcleanse-600">{formatTimeUnit(timeRemaining.days)}</span>
            <span className="text-xs text-gray-500">Days</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-mindcleanse-600">{formatTimeUnit(timeRemaining.hours)}</span>
            <span className="text-xs text-gray-500">Hours</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-mindcleanse-600">{formatTimeUnit(timeRemaining.minutes)}</span>
            <span className="text-xs text-gray-500">Minutes</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-mindcleanse-600">{formatTimeUnit(timeRemaining.seconds)}</span>
            <span className="text-xs text-gray-500">Seconds</span>
          </div>
        </div>
        
        {timeSaved > 0 && (
          <div className="mt-4 text-center bg-mindcleanse-100 p-2 rounded-md">
            <p className="text-sm text-mindcleanse-700">
              <span className="font-semibold">Today's progress:</span> You've saved {timeSaved} minutes!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DetoxCountdown;
