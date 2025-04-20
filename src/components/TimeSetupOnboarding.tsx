
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, ChevronRight, Info, Timer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

interface AppTimeLimit {
  name: string;
  icon: string;
  limit: number; // in minutes
  selected: boolean;
}

interface TimeSetupOnboardingProps {
  onCompleteTimeSetup: () => void;
  onSkip: () => void;
}

const TimeSetupOnboarding: React.FC<TimeSetupOnboardingProps> = ({ onCompleteTimeSetup, onSkip }) => {
  const [apps, setApps] = useState<AppTimeLimit[]>([
    { name: 'Instagram', icon: '📸', limit: 60, selected: true },
    { name: 'TikTok', icon: '🎬', limit: 45, selected: true },
    { name: 'Facebook', icon: '👥', limit: 60, selected: false },
    { name: 'Twitter', icon: '🐦', limit: 30, selected: false },
    { name: 'YouTube', icon: '▶️', limit: 60, selected: true },
    { name: 'Reddit', icon: '🔠', limit: 45, selected: false }
  ]);

  const handleAppToggle = (index: number) => {
    setApps(prevApps => {
      const newApps = [...prevApps];
      newApps[index].selected = !newApps[index].selected;
      return newApps;
    });
  };

  const handleLimitChange = (index: number, newLimit: number[]) => {
    setApps(prevApps => {
      const newApps = [...prevApps];
      newApps[index].limit = newLimit[0];
      return newApps;
    });
  };

  const handleContinue = () => {
    if (!apps.some(app => app.selected)) {
      toast.error('Please select at least one app to track');
      return;
    }

    // Save the selected apps and their limits
    const selectedApps = apps.filter(app => app.selected).map(app => ({
      appName: app.name,
      icon: app.icon,
      dailyLimit: app.limit
    }));

    localStorage.setItem('mindCleanseAppLimits', JSON.stringify(selectedApps));
    onCompleteTimeSetup();
  };

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
    <div className="space-y-6 max-w-4xl mx-auto py-8 animate-fade-in">
      <div className="text-center">
        <div className="bg-mindcleanse-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
          <Timer className="w-6 h-6 text-mindcleanse-600" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Set Your Daily App Limits</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Choose which apps you want to limit and set a daily time budget for each one
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apps.map((app, index) => (
          <Card 
            key={index} 
            className={`border-2 transition-all ${
              app.selected ? 'border-mindcleanse-500 bg-mindcleanse-50' : 'border-gray-200 bg-white'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{app.icon}</span>
                  <span className="font-medium text-lg">{app.name}</span>
                </div>
                <Button
                  variant={app.selected ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleAppToggle(index)}
                  className={app.selected ? "bg-mindcleanse-500 hover:bg-mindcleanse-600" : ""}
                >
                  {app.selected ? 'Selected' : 'Select'}
                </Button>
              </div>
              
              {app.selected && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Daily time limit:</span>
                    <span className="font-medium text-mindcleanse-700">{formatTime(app.limit)}</span>
                  </div>
                  <Slider
                    defaultValue={[app.limit]}
                    max={240}
                    step={15}
                    onValueChange={(value) => handleLimitChange(index, value)}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>15m</span>
                    <span>1h</span>
                    <span>2h</span>
                    <span>4h</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 mt-0.5" />
        <div>
          <h4 className="font-medium text-blue-700">How it works</h4>
          <p className="text-blue-600 text-sm">
            Once you reach your daily limit for an app, MindCleanse will show a reminder screen and help you stay on track with your digital wellbeing goals.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 pt-4">
        <Button 
          variant="outline" 
          onClick={onSkip}
        >
          Skip for now
        </Button>
        <Button 
          onClick={handleContinue}
          className="bg-mindcleanse-500 hover:bg-mindcleanse-600"
        >
          Continue <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default TimeSetupOnboarding;
