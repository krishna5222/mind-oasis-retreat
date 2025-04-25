import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Trophy, Clock, CalendarCheck, TrendingUp, RefreshCcw } from 'lucide-react';

const DetoxCountdown = () => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [detoxEnds, setDetoxEnds] = useState<Date | null>(null);
  const [timeSaved, setTimeSaved] = useState(0);
  const [isDetoxEnded, setIsDetoxEnded] = useState(false);
  const [detoxSummary, setDetoxSummary] = useState({
    totalHoursSaved: 0,
    daysCompleted: 0,
    mostImprovedDay: '',
    mostImprovedMinutes: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    const onboardingData = localStorage.getItem('mindCleanseOnboarding');
    if (!onboardingData) return;

    const { startDate, detoxDuration, customDays } = JSON.parse(onboardingData);
    const start = new Date(startDate);
    
    const durationInDays = detoxDuration === 'custom' ? 
      parseInt(customDays, 10) : 
      parseInt(detoxDuration, 10);
    
    const end = new Date(start);
    end.setDate(end.getDate() + durationInDays);
    setDetoxEnds(end);
    
    const updateCountdown = () => {
      const now = new Date();
      
      if (now >= end) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (!isDetoxEnded) {
          setIsDetoxEnded(true);
          generateDetoxSummary(start, end);
        }
        return;
      }
      
      const days = differenceInDays(end, now);
      const hours = differenceInHours(end, now) % 24;
      const minutes = differenceInMinutes(end, now) % 60;
      const seconds = differenceInSeconds(end, now) % 60;
      
      setTimeRemaining({ days, hours, minutes, seconds });
    };
    
    updateCountdown();
    
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [isDetoxEnded]);

  const generateDetoxSummary = (startDate: Date, endDate: Date) => {
    const usageData = localStorage.getItem('mindCleanseUsageStats');
    if (!usageData) return;
    
    const { sessions } = JSON.parse(usageData);
    
    const avoidedSessions = sessions.filter((session: any) => session.avoidedUsage === true);
    const totalMinutesSaved = avoidedSessions.reduce((total: number, session: any) => 
      total + session.duration, 0);
    
    const daysCompleted = differenceInDays(endDate, startDate);
    
    const dayStats: {[key: string]: number} = {};
    avoidedSessions.forEach((session: any) => {
      if (!dayStats[session.date]) {
        dayStats[session.date] = 0;
      }
      dayStats[session.date] += session.duration;
    });
    
    let mostImprovedDay = '';
    let mostImprovedMinutes = 0;
    
    Object.entries(dayStats).forEach(([date, minutes]) => {
      if (minutes > mostImprovedMinutes) {
        mostImprovedDay = date;
        mostImprovedMinutes = minutes;
      }
    });
    
    setDetoxSummary({
      totalHoursSaved: Math.round((totalMinutesSaved / 60) * 10) / 10,
      daysCompleted,
      mostImprovedDay: mostImprovedDay ? format(new Date(mostImprovedDay), 'MMM d, yyyy') : 'N/A',
      mostImprovedMinutes
    });
    
    toast({
      title: "Detox Completed!",
      description: "Congratulations! Your digital detox is complete. Check your summary.",
      duration: 10000,
    });
  };

  const handleRestartDetox = () => {
    const onboardingData = localStorage.getItem('mindCleanseOnboarding');
    if (!onboardingData) return;
    
    const data = JSON.parse(onboardingData);
    
    data.startDate = new Date().toISOString();
    data.onboardingCompleted = true;
    
    localStorage.setItem('mindCleanseOnboarding', JSON.stringify(data));
    
    setIsDetoxEnded(false);
    
    toast({
      title: "Detox Restarted",
      description: "Your digital detox has been restarted. Good luck!",
      duration: 5000,
    });
    
    window.location.reload();
  };

  useEffect(() => {
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

    const checkTimeSaved = () => {
      const savedMinutes = getTimeSavedToday();
      if (savedMinutes !== timeSaved) {
        setTimeSaved(savedMinutes);
        
        if (savedMinutes > timeSaved && timeSaved > 0) {
          toast({
            title: "Daily Reminder",
            description: `Stay strong! You've saved ${savedMinutes} minutes today.`,
            duration: 5000,
          });
        }
      }
    };

    checkTimeSaved();
    
    const interval = setInterval(checkTimeSaved, 60000);
    
    return () => clearInterval(interval);
  }, [timeSaved, toast]);

  const formatTimeUnit = (unit: number) => {
    return unit.toString().padStart(2, '0');
  };

  if (!detoxEnds) {
    return null;
  }

  return (
    <>
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

      <AlertDialog open={isDetoxEnded} onOpenChange={setIsDetoxEnded}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center justify-center text-2xl text-mindcleanse-700">
              <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
              Detox Completed!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Congratulations on completing your digital detox journey! Here's a summary of your achievements:
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="grid grid-cols-2 gap-4 my-6">
            <Alert className="bg-mindcleanse-50 border-mindcleanse-100">
              <Clock className="h-5 w-5 text-mindcleanse-700" />
              <AlertTitle>Time Saved</AlertTitle>
              <AlertDescription>
                <span className="text-2xl font-bold text-mindcleanse-700">
                  {detoxSummary.totalHoursSaved}
                </span> hours
              </AlertDescription>
            </Alert>
            
            <Alert className="bg-mindcleanse-50 border-mindcleanse-100">
              <CalendarCheck className="h-5 w-5 text-mindcleanse-700" />
              <AlertTitle>Days Completed</AlertTitle>
              <AlertDescription>
                <span className="text-2xl font-bold text-mindcleanse-700">
                  {detoxSummary.daysCompleted}
                </span> days
              </AlertDescription>
            </Alert>
            
            <Alert className="col-span-2 bg-mindcleanse-50 border-mindcleanse-100">
              <TrendingUp className="h-5 w-5 text-mindcleanse-700" />
              <AlertTitle>Most Improved Day</AlertTitle>
              <AlertDescription>
                {detoxSummary.mostImprovedDay}
                <span className="block text-sm text-mindcleanse-600">
                  {detoxSummary.mostImprovedMinutes} minutes saved
                </span>
              </AlertDescription>
            </Alert>
          </div>
          
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              className="w-full sm:w-auto bg-mindcleanse-600 hover:bg-mindcleanse-700" 
              onClick={handleRestartDetox}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Restart Detox
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DetoxCountdown;
