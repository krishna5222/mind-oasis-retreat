
import React, { useState, useEffect } from 'react';
import { BarChart, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { 
  ResponsiveContainer, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  LabelList,
  LineChart,
  Line,
  Tooltip
} from 'recharts';
import UsageTracker from '@/services/UsageTracker';

interface AppDailyUsageData {
  appName: string;
  minutes: number;
  limit: number | null;
  percentage: number;
  icon: string;
}

interface DayData {
  name: string;
  date: string;
  total: number;
  blocked: number;
  apps: {
    [app: string]: number;
  };
}

const UsageReport = () => {
  const [dailyData, setDailyData] = useState<DayData[]>([]);
  const [todayAppUsage, setTodayAppUsage] = useState<AppDailyUsageData[]>([]);
  const [selectedTab, setSelectedTab] = useState('today');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadUsageData();
    
    // Listen for usage data changes
    const handleUsageUpdate = () => {
      loadUsageData();
    };
    
    window.addEventListener('usageReset', handleUsageUpdate);
    
    // Check for updates every minute
    const intervalId = setInterval(() => {
      loadUsageData();
    }, 60000);
    
    return () => {
      window.removeEventListener('usageReset', handleUsageUpdate);
      clearInterval(intervalId);
    };
  }, []);
  
  const loadUsageData = () => {
    setIsLoading(true);
    
    // Get app limits from localStorage
    const savedLimits = localStorage.getItem('mindCleanseAppLimits');
    const appLimits = savedLimits ? JSON.parse(savedLimits) : [];
    
    // Get today's usage data
    const todayUsage = UsageTracker.getAllAppUsage();
    const appUsageData: AppDailyUsageData[] = [];
    
    // Create app usage data
    Object.entries(todayUsage).forEach(([appName, minutes]) => {
      const appConfig = appLimits.find((app: any) => app.appName === appName);
      const limit = appConfig ? appConfig.dailyLimit : null;
      const percentage = limit ? Math.min(100, Math.round((minutes / limit) * 100)) : 0;
      
      appUsageData.push({
        appName,
        minutes,
        limit,
        percentage,
        icon: appConfig ? appConfig.icon : '📱'
      });
    });
    
    // Add apps with limits that haven't been used today
    appLimits.forEach((app: any) => {
      if (!Object.keys(todayUsage).includes(app.appName)) {
        appUsageData.push({
          appName: app.appName,
          minutes: 0,
          limit: app.dailyLimit,
          percentage: 0,
          icon: app.icon
        });
      }
    });
    
    // Sort by usage percentage (highest first)
    appUsageData.sort((a, b) => b.percentage - a.percentage);
    setTodayAppUsage(appUsageData);
    
    // Get weekly usage data
    const weeklyData = UsageTracker.getWeeklyUsage();
    const chartData: DayData[] = [];
    
    // If no data, generate some placeholder data
    if (weeklyData.length === 0) {
      // Generate 7 days of empty data
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = formatDate(date);
        
        chartData.push({
          name: formatDayName(date),
          date: dateStr,
          total: 0,
          blocked: 0,
          apps: {}
        });
      }
    } else {
      weeklyData.forEach(day => {
        const date = new Date(day.date);
        
        // Convert app usage record to what we need
        chartData.push({
          name: formatDayName(date),
          date: day.date,
          total: day.totalMinutes,
          blocked: day.savedMinutes,
          apps: day.appUsage
        });
      });
    }
    
    setDailyData(chartData);
    setIsLoading(false);
  };
  
  const formatDayName = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };
  
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    if (remainingMinutes === 0) {
      return `${hours} hr`;
    }
    return `${hours} hr ${remainingMinutes} min`;
  };
  
  const getLimitStatusColor = (percentage: number): string => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-amber-500';
    return 'bg-green-500';
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
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-mindcleanse-700 flex items-center justify-center">
          <BarChart className="mr-2 text-mindcleanse-500" size={28} />
          Usage Report
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Track your daily app usage and stay within your time limits
        </p>
      </div>
      
      <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="w-full mb-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="today">Today's Usage</TabsTrigger>
          <TabsTrigger value="history">7-Day History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today" className="mt-6">
          {todayAppUsage.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No usage data yet</AlertTitle>
              <AlertDescription>
                Start using your tracked apps to see your daily usage report here.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-mindcleanse-500" />
                    Time Limits Status
                  </CardTitle>
                  <CardDescription>
                    Your progress towards daily app limits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {todayAppUsage.map((app, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span>{app.icon}</span>
                            <span className="font-medium">{app.appName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline"
                              className={`${app.limit ? getLimitStatusColor(app.percentage) : 'bg-gray-200'} text-white`}
                            >
                              {app.limit ? `${app.percentage}%` : 'No Limit'}
                            </Badge>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${getLimitStatusColor(app.percentage)}`} 
                            style={{ width: `${Math.min(100, app.percentage)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{formatTime(app.minutes)}</span>
                          {app.limit && <span>Limit: {formatTime(app.limit)}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-mindcleanse-500" />
                    App Breakdown
                  </CardTitle>
                  <CardDescription>
                    How you've spent your digital time today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ChartContainer
                      config={{
                        usage: { theme: { light: "#7856FF", dark: "#7856FF" } },
                        limit: { theme: { light: "#EF4444", dark: "#EF4444" } },
                      }}
                    >
                      <RechartsBarChart
                        data={todayAppUsage
                          .filter(app => app.minutes > 0)
                          .map(app => ({
                            name: app.appName,
                            usage: app.minutes,
                            limit: app.limit || 0
                          }))}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" tickFormatter={(value) => `${value}m`} />
                        <YAxis type="category" dataKey="name" width={80} />
                        <ChartTooltip
                          content={<ChartTooltipContent />}
                        />
                        <Bar 
                          dataKey="usage" 
                          name="usage" 
                          fill="var(--color-usage)" 
                          radius={[0, 4, 4, 0]}
                        >
                          <LabelList dataKey="usage" position="right" formatter={(value: number) => `${value}m`} />
                        </Bar>
                      </RechartsBarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-mindcleanse-500" />
                7-Day Usage History
              </CardTitle>
              <CardDescription>
                Your app usage trends over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    total: { theme: { light: "#7856FF", dark: "#7856FF" } },
                    instagram: { theme: { light: "#E1306C", dark: "#E1306C" } },
                    facebook: { theme: { light: "#4267B2", dark: "#4267B2" } },
                    twitter: { theme: { light: "#1DA1F2", dark: "#1DA1F2" } },
                    youtube: { theme: { light: "#FF0000", dark: "#FF0000" } },
                    tiktok: { theme: { light: "#000000", dark: "#ffffff" } },
                    reddit: { theme: { light: "#FF4500", dark: "#FF4500" } },
                  }}
                >
                  <RechartsBarChart
                    data={dailyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value}m`} />
                    <ChartTooltip
                      content={<ChartTooltipContent nameKey="app" />}
                    />
                    <Bar 
                      dataKey="total" 
                      name="total" 
                      fill="var(--color-total)" 
                      radius={[4, 4, 0, 0]}
                      stackId="a"
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#8884d8"
                      name="Daily Total"
                    />
                  </RechartsBarChart>
                </ChartContainer>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">App-Specific Trends</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {['Instagram', 'Facebook', 'TikTok', 'Twitter', 'YouTube', 'Reddit'].map(app => {
                    const appKey = app.toLowerCase();
                    const hasData = dailyData.some(day => day.apps && day.apps[app] > 0);
                    
                    if (!hasData) return null;
                    
                    return (
                      <Card key={appKey} className="h-[200px]">
                        <CardHeader className="p-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            {app}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <ChartContainer
                            config={{
                              [appKey]: { theme: { light: `var(--color-${appKey})`, dark: `var(--color-${appKey})` } },
                            }}
                          >
                            <LineChart
                              data={dailyData.map(day => ({
                                name: day.name,
                                [appKey]: day.apps && day.apps[app] ? day.apps[app] : 0
                              }))}
                              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                            >
                              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                              <YAxis tickFormatter={(value) => `${value}m`} tick={{ fontSize: 10 }} />
                              <Tooltip />
                              <Line 
                                type="monotone" 
                                dataKey={appKey} 
                                name={appKey}
                                stroke={`var(--color-${appKey})`} 
                                strokeWidth={2}
                              />
                            </LineChart>
                          </ChartContainer>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UsageReport;
