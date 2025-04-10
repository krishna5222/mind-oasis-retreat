
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeartPulse, Clock, ArrowRight } from "lucide-react";

const BREATHING_SECONDS = 4;

const CravingHelp = () => {
  const [open, setOpen] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [counter, setCounter] = useState(BREATHING_SECONDS);
  const [detoxReason, setDetoxReason] = useState<string | null>(null);
  
  // Get the user's detox reason from localStorage
  useEffect(() => {
    const onboardingData = localStorage.getItem('onboardingData');
    if (onboardingData) {
      try {
        const parsed = JSON.parse(onboardingData);
        setDetoxReason(parsed.reason || 'your digital wellbeing');
      } catch (e) {
        setDetoxReason('your digital wellbeing');
      }
    }
  }, []);
  
  // Handle breathing exercise
  useEffect(() => {
    if (!open) return;
    
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          // Cycle through breathing phases
          setBreathingPhase((currentPhase) => {
            if (currentPhase === 'inhale') return 'hold';
            if (currentPhase === 'hold') return 'exhale';
            return 'inhale';
          });
          return BREATHING_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [open, breathingPhase]);
  
  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-mindcleanse-500 hover:bg-mindcleanse-600 shadow-lg flex items-center gap-2 rounded-full px-5 py-6 z-50"
      >
        <HeartPulse size={22} />
        <span>Craving Help</span>
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              Craving Moment
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Reason for detox */}
            <Card className="border-mindcleanse-200 bg-mindcleanse-50">
              <CardContent className="pt-6">
                <h3 className="font-medium text-center mb-2">Remember why you're doing this</h3>
                <p className="text-center text-gray-600">
                  You're detoxing for <span className="font-bold text-mindcleanse-700">{detoxReason}</span>
                </p>
              </CardContent>
            </Card>
            
            {/* Breathing exercise */}
            <Card className="border-mindcleanse-200">
              <CardContent className="pt-6">
                <h3 className="font-medium text-center mb-6">Take a moment to breathe</h3>
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-all duration-1000
                      ${breathingPhase === 'inhale' ? 'bg-mindcleanse-100 scale-110' : ''}
                      ${breathingPhase === 'hold' ? 'bg-mindcleanse-200' : ''}
                      ${breathingPhase === 'exhale' ? 'bg-mindcleanse-100 scale-90' : ''}
                    `}
                  >
                    <span className="text-lg font-medium">
                      {breathingPhase === 'inhale' && 'Inhale'}
                      {breathingPhase === 'hold' && 'Hold'}
                      {breathingPhase === 'exhale' && 'Exhale'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{counter}</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Affirmation */}
            <div className="text-center py-2">
              <p className="text-lg font-medium text-mindcleanse-700">
                You are stronger than the scroll.
              </p>
            </div>
            
            {/* Wait suggestion */}
            <Card className="border-mindcleanse-200 bg-mindcleanse-50">
              <CardContent className="pt-6 flex items-center gap-3">
                <Clock className="text-mindcleanse-500" />
                <div>
                  <h3 className="font-medium">Wait just 2 minutes</h3>
                  <p className="text-sm text-gray-600">
                    The urge will pass, and you'll feel proud of yourself
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Close button */}
            <Button 
              onClick={() => setOpen(false)} 
              className="w-full mt-2 bg-mindcleanse-500 hover:bg-mindcleanse-600"
            >
              I'm Feeling Better <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CravingHelp;
