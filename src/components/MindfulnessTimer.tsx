
import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

const MindfulnessTimer: React.FC = () => {
  const [duration, setDuration] = useState(5); // 5 minutes default
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval!);
            setIsActive(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(duration * 60);
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <div className="container max-w-md mx-auto py-8 animate-fade-in">
      <Card className="bg-white shadow-lg rounded-xl overflow-hidden border-mindcleanse-200">
        <div className="mindcleanse-gradient h-2" style={{ width: `${progress}%` }}></div>
        <CardContent className="p-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-mindcleanse-700">Mindfulness Timer</h2>
            <p className="text-muted-foreground">Take a moment for yourself</p>
          </div>
          
          <div className="flex justify-center items-center">
            <div className="w-48 h-48 rounded-full flex items-center justify-center border-8 border-mindcleanse-100 mb-8">
              <span className="text-4xl font-mono font-bold text-mindcleanse-700">{formatTime(timeLeft)}</span>
            </div>
          </div>
          
          {!isActive ? (
            <>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span>Duration: {duration} minutes</span>
                </div>
                <Slider
                  defaultValue={[duration]}
                  min={1}
                  max={30}
                  step={1}
                  onValueChange={([value]) => setDuration(value)}
                  disabled={isActive}
                  className="mb-6"
                />
              </div>
              <Button 
                className="w-full bg-mindcleanse-500 hover:bg-mindcleanse-600" 
                onClick={handleStart}
              >
                <Play size={20} className="mr-2" />
                Begin Session
              </Button>
            </>
          ) : (
            <div className="flex space-x-4">
              <Button 
                variant="outline"
                className="flex-1 border-mindcleanse-300 text-mindcleanse-600 hover:bg-mindcleanse-100" 
                onClick={handlePause}
              >
                {isPaused ? <Play size={20} className="mr-2" /> : <Pause size={20} className="mr-2" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button 
                variant="outline"
                className="flex-1 border-mindcleanse-300 text-mindcleanse-600 hover:bg-mindcleanse-100" 
                onClick={handleReset}
              >
                <RefreshCw size={20} className="mr-2" />
                Reset
              </Button>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {isActive 
                ? "Focus on your breath and let go of digital distractions." 
                : "Set your timer and practice being present in the moment."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MindfulnessTimer;
