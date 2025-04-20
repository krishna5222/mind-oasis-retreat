
import React, { useState, useEffect } from 'react';
import { Clock, Save, AlertCircle, Timer } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from 'sonner';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AppLimit {
  appName: string;
  icon: string;
  dailyLimit: number; // in minutes
}

const TimeSettings = () => {
  const [apps, setApps] = useState<AppLimit[]>([
    { appName: 'Instagram', icon: '📸', dailyLimit: 60 },
    { appName: 'TikTok', icon: '🎬', dailyLimit: 45 },
    { appName: 'Facebook', icon: '👥', dailyLimit: 60 },
    { appName: 'Twitter', icon: '🐦', dailyLimit: 30 },
    { appName: 'YouTube', icon: '▶️', dailyLimit: 60 },
    { appName: 'Reddit', icon: '🔠', dailyLimit: 45 },
  ]);
  
  const [customApp, setCustomApp] = useState('');
  const [customLimit, setCustomLimit] = useState(30);
  
  useEffect(() => {
    // Load saved app limits from localStorage
    const savedLimits = localStorage.getItem('mindCleanseAppLimits');
    if (savedLimits) {
      setApps(JSON.parse(savedLimits));
    }
  }, []);
  
  // Handle saving app limits
  const handleSaveAppLimits = () => {
    localStorage.setItem('mindCleanseAppLimits', JSON.stringify(apps));
    
    // Update the app blocker with the latest limits information
    const blockedAppsData = localStorage.getItem('appBlockerState');
    if (blockedAppsData) {
      const blockedAppsState = JSON.parse(blockedAppsData);
      const updatedBlockedApps = blockedAppsState.blockedApps.map((app: any) => {
        const limitInfo = apps.find(a => a.appName === app.name);
        return {
          ...app,
          dailyLimit: limitInfo ? limitInfo.dailyLimit : null
        };
      });
      
      localStorage.setItem('appBlockerState', JSON.stringify({
        ...blockedAppsState,
        blockedApps: updatedBlockedApps
      }));
    }
    
    toast.success('Daily time limits saved successfully');
  };
  
  // Handle updating a specific app's limit
  const handleLimitChange = (appName: string, newLimit: number) => {
    setApps(prevApps => 
      prevApps.map(app => 
        app.appName === appName ? { ...app, dailyLimit: newLimit } : app
      )
    );
  };
  
  // Add a new custom app
  const handleAddCustomApp = () => {
    if (!customApp.trim()) {
      toast.error('Please enter an app name');
      return;
    }
    
    // Check if app already exists
    if (apps.some(app => app.appName.toLowerCase() === customApp.trim().toLowerCase())) {
      toast.error('This app already exists in your list');
      return;
    }
    
    const newApp = {
      appName: customApp.trim(),
      icon: '📱', // Default icon
      dailyLimit: customLimit
    };
    
    setApps(prevApps => [...prevApps, newApp]);
    setCustomApp('');
    setCustomLimit(30);
    toast.success(`${customApp} added to your list`);
  };
  
  // Format minutes to hours and minutes
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

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-mindcleanse-700 flex items-center justify-center">
          <Clock className="mr-2 text-mindcleanse-500" size={28} />
          Daily Time Limits
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Set daily limits for how much time you want to spend on each app
        </p>
      </div>
      
      <Alert className="mb-6">
        <Timer className="h-4 w-4" />
        <AlertTitle>Why set time limits?</AlertTitle>
        <AlertDescription>
          Setting daily time limits helps you be more intentional about your app usage.
          When you reach your limit, the app will be blocked until midnight.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle>App Time Limits</CardTitle>
          <CardDescription>
            Set how much time you'll allow yourself to spend on each app daily
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>App</TableHead>
                <TableHead>Daily Limit</TableHead>
                <TableHead>Adjust</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apps.map((app, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-2">{app.icon}</span>
                      {app.appName}
                    </div>
                  </TableCell>
                  <TableCell>{formatTime(app.dailyLimit)}</TableCell>
                  <TableCell className="w-1/3">
                    <div className="flex flex-col gap-2">
                      <Slider
                        defaultValue={[app.dailyLimit]}
                        max={240}
                        step={15}
                        onValueChange={(values) => handleLimitChange(app.appName, values[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>15m</span>
                        <span>1h</span>
                        <span>2h</span>
                        <span>4h</span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex flex-col gap-6">
          <div className="w-full border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Add Custom App</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="custom-app">App Name</Label>
                <Input 
                  id="custom-app" 
                  placeholder="Enter app name" 
                  value={customApp}
                  onChange={(e) => setCustomApp(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="custom-limit">Time Limit (minutes)</Label>
                <Input 
                  id="custom-limit"
                  type="number" 
                  min="5"
                  max="240"
                  step="5"
                  value={customLimit} 
                  onChange={(e) => setCustomLimit(parseInt(e.target.value))} 
                />
              </div>
            </div>
            <Button 
              onClick={handleAddCustomApp} 
              variant="outline" 
              className="mt-4"
            >
              Add App
            </Button>
          </div>
          
          <Button 
            onClick={handleSaveAppLimits} 
            className="w-full bg-mindcleanse-500 hover:bg-mindcleanse-600 flex items-center gap-2"
          >
            <Save size={18} /> Save Time Limits
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TimeSettings;
