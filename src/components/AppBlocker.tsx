
import React, { useState, useEffect } from 'react';
import { Shield, Lock, Unlock, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction
} from '@/components/ui/alert-dialog';
import UsageTracker from '@/services/UsageTracker';

interface App {
  id: string;
  name: string;
  iconUrl: string;
  blocked: boolean;
  dailyLimit?: number | null;
}

interface BlockedAppState {
  blockedApps: App[];
  pin: string;
  blockingActive: boolean;
}

const AppBlocker = () => {
  const [apps, setApps] = useState<App[]>([
    { id: '1', name: 'Instagram', iconUrl: '📸', blocked: false },
    { id: '2', name: 'TikTok', iconUrl: '🎬', blocked: false },
    { id: '3', name: 'Facebook', iconUrl: '👥', blocked: false },
    { id: '4', name: 'Twitter', iconUrl: '🐦', blocked: false },
    { id: '5', name: 'YouTube', iconUrl: '▶️', blocked: false },
    { id: '6', name: 'Reddit', iconUrl: '🔠', blocked: false },
  ]);
  
  const [pin, setPin] = useState('');
  const [blockingActive, setBlockingActive] = useState(false);
  const [showDemoDialog, setShowDemoDialog] = useState(false);
  const [unlockType, setUnlockType] = useState<'pin' | 'timer'>('pin');
  const [timerRemaining, setTimerRemaining] = useState(600); // 10 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [showAppAlert, setShowAppAlert] = useState(false);
  const [attemptedApp, setAttemptedApp] = useState<App | null>(null);
  const [limitBlockReason, setLimitBlockReason] = useState(false);
  
  // Load saved state on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('appBlockerState');
    if (savedState) {
      const { blockedApps, pin, blockingActive } = JSON.parse(savedState) as BlockedAppState;
      
      // Update apps with saved state
      setApps(apps => apps.map(app => ({
        ...app,
        blocked: blockedApps.some(blockedApp => blockedApp.id === app.id)
      })));
      setPin(pin);
      setBlockingActive(blockingActive);
    }
    
    // Load time limits
    const savedLimits = localStorage.getItem('mindCleanseAppLimits');
    if (savedLimits) {
      const limits = JSON.parse(savedLimits);
      
      // Update apps with limit information
      setApps(prevApps => prevApps.map(app => {
        const limitInfo = limits.find((limit: any) => limit.appName === app.name);
        return {
          ...app,
          dailyLimit: limitInfo ? limitInfo.dailyLimit : null
        };
      }));
    }
  }, []);
  
  // Save state when it changes
  useEffect(() => {
    const blockedApps = apps.filter(app => app.blocked);
    localStorage.setItem('appBlockerState', JSON.stringify({
      blockedApps,
      pin,
      blockingActive
    }));
  }, [apps, pin, blockingActive]);
  
  // Timer countdown effect
  useEffect(() => {
    let interval: number | undefined;
    
    if (timerActive && timerRemaining > 0) {
      interval = window.setInterval(() => {
        setTimerRemaining(prev => prev - 1);
      }, 1000);
    } else if (timerRemaining === 0) {
      setTimerActive(false);
      setShowDemoDialog(false);
      toast.success('Waiting period complete. App unlocked temporarily.');
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timerRemaining]);
  
  const toggleAppBlock = (appId: string) => {
    setApps(prevApps => 
      prevApps.map(app => 
        app.id === appId ? { ...app, blocked: !app.blocked } : app
      )
    );
  };
  
  const activateBlocking = () => {
    if (apps.filter(app => app.blocked).length === 0) {
      toast.error('Please select at least one app to block');
      return;
    }
    
    if (pin.length !== 4) {
      toast.error('Please set a 4-digit PIN for unblocking');
      return;
    }
    
    setBlockingActive(true);
    toast.success('App blocking has been activated!');
  };
  
  const deactivateBlocking = () => {
    setBlockingActive(false);
    toast.success('App blocking has been deactivated');
  };
  
  const handlePinChange = (value: string) => {
    setPin(value);
  };
  
  const simulateAppAttempt = (app: App) => {
    // Check if app is blocked due to time limit
    if (UsageTracker.shouldBlockApp(app.name)) {
      setLimitBlockReason(true);
    } else {
      setLimitBlockReason(false);
    }
    
    setAttemptedApp(app);
    setShowAppAlert(true);
  };

  const closeAppAlert = () => {
    setShowAppAlert(false);
    setAttemptedApp(null);
  };
  
  const handleDemoApp = () => {
    setShowDemoDialog(true);
    setTimerRemaining(600);
    setEnteredPin('');
    setLimitBlockReason(false);
  };
  
  const startTimer = () => {
    setUnlockType('timer');
    setTimerActive(true);
  };
  
  const checkPin = () => {
    if (enteredPin === pin) {
      setShowDemoDialog(false);
      toast.success('PIN verified. App unlocked temporarily.');
    } else {
      toast.error('Incorrect PIN. Please try again.');
    }
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Check if app has reached its daily limit
  const hasReachedDailyLimit = (appName: string): boolean => {
    return UsageTracker.shouldBlockApp(appName);
  };
  
  // Get percentage of daily limit used
  const getUsagePercentage = (appName: string): number => {
    return UsageTracker.getUsagePercentage(appName);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">App Blocker</h1>
        {blockingActive ? (
          <Button variant="destructive" onClick={deactivateBlocking} className="flex items-center gap-2">
            <Unlock size={18} /> Deactivate Blocking
          </Button>
        ) : (
          <Button onClick={activateBlocking} className="bg-mindcleanse-500 hover:bg-mindcleanse-600 text-white flex items-center gap-2">
            <Lock size={18} /> Activate Blocking
          </Button>
        )}
      </div>
      
      {!blockingActive && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertTitle>Set up app blocking</AlertTitle>
          <AlertDescription>
            Select the apps you want to block during your detox period and set a 4-digit PIN for emergency access.
          </AlertDescription>
        </Alert>
      )}
      
      {blockingActive && (
        <Alert className="bg-green-50 border-green-200">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-700">App blocking active</AlertTitle>
          <AlertDescription className="text-green-600">
            Selected apps will be blocked when you try to use them. You can temporarily unblock by using your PIN or waiting 10 minutes.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Select Apps to Block</CardTitle>
            <CardDescription>Choose which apps to block during your detox period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apps.map(app => (
                <div key={app.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`app-${app.id}`} 
                    checked={app.blocked}
                    onCheckedChange={() => toggleAppBlock(app.id)}
                    disabled={blockingActive}
                  />
                  <Label htmlFor={`app-${app.id}`} className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xl">{app.iconUrl}</span>
                    {app.name}
                    {app.dailyLimit && (
                      <span className="text-xs text-gray-500 ml-1">(Limit: {app.dailyLimit} min/day)</span>
                    )}
                  </Label>
                  
                  {blockingActive && app.blocked && hasReachedDailyLimit(app.name) && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full ml-auto">
                      Limit reached
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Set Unblocking PIN</CardTitle>
            <CardDescription>Create a 4-digit PIN to temporarily unblock apps if needed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <InputOTP maxLength={4} value={pin} onChange={handlePinChange} disabled={blockingActive}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
              
              {blockingActive && (
                <div className="mt-6 text-center">
                  <Button onClick={handleDemoApp} className="bg-mindcleanse-500 hover:bg-mindcleanse-600 text-white mb-4">
                    Demo Blocked App Experience
                  </Button>
                  <div className="grid grid-cols-3 gap-2">
                    {apps.filter(app => app.blocked).map(app => (
                      <Button 
                        key={app.id}
                        variant="outline" 
                        className="flex items-center gap-1 h-auto py-2" 
                        onClick={() => simulateAppAttempt(app)}
                      >
                        <span className="text-xl">{app.iconUrl}</span>
                        <span className="text-xs">{app.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground text-center">
              Remember this PIN. You'll need it to temporarily access blocked apps.
            </p>
          </CardFooter>
        </Card>
      </div>
      
      {/* Attempted app alert dialog */}
      <AlertDialog open={showAppAlert} onOpenChange={setShowAppAlert}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center flex items-center justify-center gap-2">
              <Shield className="h-5 w-5 text-mindcleanse-500" />
              App Blocked!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {attemptedApp?.name} is blocked during your digital detox period.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 px-2 bg-red-50 border border-red-100 rounded-lg text-center">
            <p className="text-lg font-medium text-red-700 mb-2">
              {limitBlockReason 
                ? "You've reached your daily time limit for this app"
                : "This app is blocked during your detox"}
            </p>
            <p className="text-sm text-gray-600">
              {limitBlockReason 
                ? "Come back tomorrow or adjust your time limits in settings."
                : "Remember why you started this journey. You're making great progress!"}
            </p>
          </div>
          <AlertDialogFooter className="flex-col space-y-2">
            <AlertDialogAction onClick={closeAppAlert} className="w-full bg-mindcleanse-500 hover:bg-mindcleanse-600">
              I understand, go back
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Demo app blocking dialog */}
      <Dialog open={showDemoDialog} onOpenChange={setShowDemoDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">This app is blocked during your detox</DialogTitle>
            <DialogDescription className="text-center">
              You've committed to reducing your digital consumption. Stay strong!
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 flex flex-col items-center justify-center">
            <Shield className="h-16 w-16 text-mindcleanse-500 mb-4" />
            
            {unlockType === 'pin' ? (
              <div className="space-y-4 w-full max-w-xs">
                <h3 className="font-medium text-center">Enter your PIN to temporarily unblock</h3>
                
                <InputOTP maxLength={4} value={enteredPin} onChange={setEnteredPin}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
                
                <div className="flex justify-center space-x-2 pt-2">
                  <Button variant="outline" onClick={() => setUnlockType('timer')}>
                    Wait instead
                  </Button>
                  <Button onClick={checkPin} className="bg-mindcleanse-500 hover:bg-mindcleanse-600">
                    Unlock
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 w-full max-w-xs">
                <h3 className="font-medium text-center">Wait to temporarily unblock</h3>
                
                <div className="flex items-center justify-center">
                  <Clock className="h-5 w-5 mr-2 text-mindcleanse-500" />
                  <span className="text-2xl font-mono">{formatTime(timerRemaining)}</span>
                </div>
                
                <p className="text-sm text-center text-muted-foreground">
                  You need to wait 10 minutes before access is temporarily granted
                </p>
                
                <div className="flex justify-center space-x-2 pt-2">
                  <Button variant="outline" onClick={() => setUnlockType('pin')}>
                    Use PIN instead
                  </Button>
                  {!timerActive && (
                    <Button onClick={startTimer} className="bg-mindcleanse-500 hover:bg-mindcleanse-600">
                      Start waiting
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex-col">
            <div className="text-center">
              <p className="text-mindcleanse-600 font-semibold">You are stronger than the scroll.</p>
              <p className="text-sm text-gray-500 mt-1">
                Remember why you started this detox journey.
              </p>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppBlocker;
