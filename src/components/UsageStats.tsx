import React, { useState, useEffect } from 'react';
import { Clock, Smartphone, Activity, TrendingUp, BarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { 
  ResponsiveContainer, 
  BarChart as RechartsBarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

interface AppUsage {
  appName: string;
  timeSpent: number; // in minutes
  icon: string;
}

interface DailyUsage {
  date: string;
  totalMinutes: number;
  savedMinutes: number;
}

const UsageStats: React.FC = () => {
  const { toast } = useToast();
  const [appUsage, setAppUsage] = useState<AppUsage[]>([]);
  const [dailyUsage, setDailyUsage] = useState<DailyUsage[]>([]);
  const [totalSavedMinutes, setTotalSavedMinutes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState('');
  const [manualMinutes, setManualMinutes] = useState('');

  // Mock apps that users might be trying to avoid
  const commonApps = [
    { appName: 'Instagram', icon: '📸' },
    { appName: 'TikTok', icon: '🎵' },
    { appName: 'Facebook', icon: '👤' },
    { appName: 'Twitter', icon: '🐦' },
    { appName: 'YouTube', icon: '🎬' },
    { appName: 'Other', icon: '📱' }
  ];

  useEffect(() => {
    // Load saved usage data from localStorage
    const loadUsageData = () => {
      try {
        const savedAppUsage = localStorage.getItem('mindCleanseAppUsage');
        const savedDailyUsage = localStorage.getItem('mindCleanseDailyUsage');
        const savedTotalMinutes = localStorage.getItem('mindCleanseTotalSaved');
        
        if (savedAppUsage) {
          setAppUsage(JSON.parse(savedAppUsage));
        } else {
          // Initialize with default apps and zero usage
          setAppUsage(commonApps.map(app => ({
            ...app,
            timeSpent: 0
          })));
        }
        
        if (savedDailyUsage) {
          setDailyUsage(JSON.parse(savedDailyUsage));
        } else {
          // Generate past 7 days data with random values for first-time users
          const pastWeekData = generatePastWeekData();
          setDailyUsage(pastWeekData);
          localStorage.setItem('mindCleanseDailyUsage', JSON.stringify(pastWeekData));
        }
        
        if (savedTotalMinutes) {
          setTotalSavedMinutes(parseInt(savedTotalMinutes));
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading usage data", error);
        toast({
          variant: "destructive",
          title: "Error loading data",
          description: "There was a problem loading your usage statistics."
        });
        setIsLoading(false);
      }
    };
    
    loadUsageData();
  }, [toast]);

  // Generate mock data for the past week for first-time users
  const generatePastWeekData = (): DailyUsage[] => {
    const result: DailyUsage[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Generate random usage between 10-120 minutes
      const totalMinutes = Math.floor(Math.random() * 110) + 10;
      // Generate random saved minutes between 20-180 minutes
      const savedMinutes = Math.floor(Math.random() * 160) + 20;
      
      result.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        totalMinutes,
        savedMinutes
      });
    }
    
    return result;
  };

  // Format minutes into hours and minutes
  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} hr`;
    }
    return `${hours} hr ${remainingMinutes} min`;
  };

  // Handle manual app usage logging
  const handleLogUsage = () => {
    if (!selectedApp || !manualMinutes || parseInt(manualMinutes) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Please select an app and enter a valid time."
      });
      return;
    }

    const minutes = parseInt(manualMinutes);
    
    // Update app usage
    const updatedAppUsage = appUsage.map(app => {
      if (app.appName === selectedApp) {
        return { ...app, timeSpent: app.timeSpent + minutes };
      }
      return app;
    });
    
    // Update today's daily usage
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    let updatedDailyUsage = [...dailyUsage];
    const todayIndex = updatedDailyUsage.findIndex(day => day.date === today);
    
    if (todayIndex >= 0) {
      updatedDailyUsage[todayIndex].totalMinutes += minutes;
    } else {
      updatedDailyUsage.push({
        date: today,
        totalMinutes: minutes,
        savedMinutes: 0
      });
    }
    
    // If array is longer than 7 days, keep only the most recent 7
    if (updatedDailyUsage.length > 7) {
      updatedDailyUsage = updatedDailyUsage.slice(updatedDailyUsage.length - 7);
    }
    
    // Save to state and localStorage
    setAppUsage(updatedAppUsage);
    setDailyUsage(updatedDailyUsage);
    localStorage.setItem('mindCleanseAppUsage', JSON.stringify(updatedAppUsage));
    localStorage.setItem('mindCleanseDailyUsage', JSON.stringify(updatedDailyUsage));
    
    // Reset form
    setSelectedApp('');
    setManualMinutes('');
    
    toast({
      title: "Usage logged",
      description: `Added ${minutes} minutes to ${selectedApp}.`
    });
  };

  // Log saved time from resisting app usage
  const handleLogSavedTime = () => {
    if (!manualMinutes || parseInt(manualMinutes) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Please enter valid saved minutes."
      });
      return;
    }

    const savedMin = parseInt(manualMinutes);
    const newTotal = totalSavedMinutes + savedMin;
    
    // Update today's saved minutes
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    let updatedDailyUsage = [...dailyUsage];
    const todayIndex = updatedDailyUsage.findIndex(day => day.date === today);
    
    if (todayIndex >= 0) {
      updatedDailyUsage[todayIndex].savedMinutes += savedMin;
    } else {
      updatedDailyUsage.push({
        date: today,
        totalMinutes: 0,
        savedMinutes: savedMin
      });
    }
    
    // Save to state and localStorage
    setTotalSavedMinutes(newTotal);
    setDailyUsage(updatedDailyUsage);
    localStorage.setItem('mindCleanseTotalSaved', newTotal.toString());
    localStorage.setItem('mindCleanseDailyUsage', JSON.stringify(updatedDailyUsage));
    
    // Reset form
    setManualMinutes('');
    
    toast({
      title: "Time saved!",
      description: `You've saved ${savedMin} minutes by resisting the scroll!`,
    });
  };

  // Get today's usage
  const getTodayUsage = (): number => {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const todayData = dailyUsage.find(day => day.date === today);
    return todayData ? todayData.totalMinutes : 0;
  };

  // Get today's saved time
  const getTodaySaved = (): number => {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const todayData = dailyUsage.find(day => day.date === today);
    return todayData ? todayData.savedMinutes : 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mindcleanse-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-mindcleanse-700 flex items-center justify-center">
          <BarChart className="mr-2 text-mindcleanse-500" size={28} />
          Usage Statistics
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Track your social media usage and see how much time you're saving
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Today's Usage Card */}
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Clock className="mr-2 text-mindcleanse-500" size={20} />
              Today's Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-mindcleanse-700">
              {formatTime(getTodayUsage())}
            </div>
            <p className="text-sm text-muted-foreground">
              Time spent on tracked apps today
            </p>
          </CardContent>
        </Card>

        {/* Time Saved Today Card */}
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="mr-2 text-green-500" size={20} />
              Today's Saved Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatTime(getTodaySaved())}
            </div>
            <p className="text-sm text-muted-foreground">
              Time saved from not scrolling today
            </p>
          </CardContent>
        </Card>

        {/* Total Time Saved Card */}
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Activity className="mr-2 text-blue-500" size={20} />
              Total Time Saved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {formatTime(totalSavedMinutes)}
            </div>
            <p className="text-sm text-muted-foreground">
              Total time reclaimed since starting detox
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Screen Time Chart */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 text-mindcleanse-500" size={20} />
              Daily Screen Time Trend
            </CardTitle>
            <CardDescription>Your usage over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  usage: { theme: { light: "#7856FF", dark: "#7856FF" } },
                  saved: { theme: { light: "#10B981", dark: "#10B981" } },
                }}
              >
                <RechartsBarChart
                  data={dailyUsage}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value}m`}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />
                  <Bar
                    dataKey="totalMinutes"
                    name="usage"
                    fill="var(--color-usage)"
                    radius={[4, 4, 0, 0]}
                    label="Usage"
                  />
                  <Bar
                    dataKey="savedMinutes"
                    name="saved"
                    fill="var(--color-saved)"
                    radius={[4, 4, 0, 0]}
                    label="Saved"
                  />
                </RechartsBarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* App Breakdown */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="mr-2 text-mindcleanse-500" size={20} />
              App Usage Breakdown
            </CardTitle>
            <CardDescription>Time spent on each app</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>App</TableHead>
                  <TableHead>Time Used</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appUsage
                  .sort((a, b) => b.timeSpent - a.timeSpent)
                  .map((app, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="mr-2">{app.icon}</span>
                          {app.appName}
                        </div>
                      </TableCell>
                      <TableCell>{formatTime(app.timeSpent)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Manual Tracking Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Log App Usage</CardTitle>
            <CardDescription>
              Manually track when you used apps you're trying to avoid
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="app" className="block text-sm font-medium text-gray-700 mb-1">
                  Select App
                </label>
                <select
                  id="app"
                  className="w-full p-2 border rounded-md bg-background"
                  value={selectedApp}
                  onChange={(e) => setSelectedApp(e.target.value)}
                >
                  <option value="">Select an app...</option>
                  {commonApps.map((app, index) => (
                    <option key={index} value={app.appName}>
                      {app.icon} {app.appName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="minutes" className="block text-sm font-medium text-gray-700 mb-1">
                  Minutes Spent
                </label>
                <input
                  id="minutes"
                  type="number"
                  min="1"
                  className="w-full p-2 border rounded-md bg-background"
                  value={manualMinutes}
                  onChange={(e) => setManualMinutes(e.target.value)}
                  placeholder="Enter minutes"
                />
              </div>
              <Button onClick={handleLogUsage} className="w-full bg-mindcleanse-500 hover:bg-mindcleanse-600">
                Log Usage
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Record Time Saved</CardTitle>
            <CardDescription>
              Record when you successfully avoided using an app you wanted to check
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="saved-minutes" className="block text-sm font-medium text-gray-700 mb-1">
                  Minutes Saved
                </label>
                <input
                  id="saved-minutes"
                  type="number"
                  min="1"
                  className="w-full p-2 border rounded-md bg-background"
                  value={manualMinutes}
                  onChange={(e) => setManualMinutes(e.target.value)}
                  placeholder="Enter minutes saved"
                />
              </div>
              <Button onClick={handleLogSavedTime} className="w-full bg-green-600 hover:bg-green-700">
                Log Time Saved
              </Button>
              <p className="text-xs text-gray-500 italic">
                Tip: Each time you resist checking an app, log the time you would have spent scrolling
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsageStats;
