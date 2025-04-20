
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Check, ChevronRight, AlertTriangle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import TimeSetupOnboarding from '@/components/TimeSetupOnboarding';
import { toast } from 'sonner';

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [detoxDuration, setDetoxDuration] = useState('7');
  const [detoxGoal, setDetoxGoal] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const options = [
    { id: 'anxiety', label: 'Reduce Anxiety' },
    { id: 'focus', label: 'Improve Focus' },
    { id: 'sleep', label: 'Better Sleep' },
    { id: 'productivity', label: 'Increase Productivity' },
    { id: 'presence', label: 'Be More Present' },
    { id: 'addiction', label: 'Break Phone Addiction' }
  ];

  const toggleOption = (id: string) => {
    setSelectedOptions(current =>
      current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id]
    );
  };

  const handleContinue = () => {
    // Validation for each step
    if (currentStep === 1 && !userName.trim()) {
      toast.error("Please enter your name to continue");
      return;
    }

    if (currentStep === 2 && !detoxDuration) {
      toast.error("Please select a detox duration");
      return;
    }

    if (currentStep === 3 && selectedOptions.length === 0) {
      toast.error("Please select at least one goal");
      return;
    }

    // Move to next step
    setCurrentStep(prevStep => prevStep + 1);
  };

  const handleCompleteOnboarding = () => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(detoxDuration));

    // Save onboarding data
    const onboardingData = {
      userName,
      detoxDuration: parseInt(detoxDuration),
      detoxGoal,
      goals: selectedOptions,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      onboardingCompleted: true
    };

    localStorage.setItem('mindCleanseOnboarding', JSON.stringify(onboardingData));
    
    // Initialize the usage tracker
    if (typeof window !== 'undefined') {
      import('@/services/UsageTracker').then(module => {
        // Just importing initializes the singleton
      });
    }
    
    // Navigate to main app
    navigate('/');
  };

  const handleTimeSetupComplete = () => {
    setCurrentStep(5);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-mindcleanse-50 to-white flex flex-col">
      <header className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-mindcleanse-800">MindCleanse</h1>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4, 5].map(step => (
                <div
                  key={step}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step === currentStep
                      ? 'bg-mindcleanse-500 text-white'
                      : step < currentStep
                      ? 'bg-mindcleanse-300 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {step < currentStep ? <Check size={16} /> : step}
                </div>
              ))}
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-mindcleanse-500 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
              />
            </div>
          </div>

          <Card className="border-none shadow-lg">
            <CardContent className="p-8">
              {/* Step 1: Welcome */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-center text-mindcleanse-800">Welcome to MindCleanse</h2>
                  <p className="text-center text-gray-600">
                    Your journey to digital wellbeing starts here. Let's get to know you a little better.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">What's your name?</Label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={handleContinue}
                      className="bg-mindcleanse-500 hover:bg-mindcleanse-600"
                    >
                      Continue <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Set Detox Duration */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-center text-mindcleanse-800">Set Your Detox Duration</h2>
                  <p className="text-center text-gray-600">
                    How long would you like your digital detox to last?
                  </p>
                  
                  <RadioGroup
                    value={detoxDuration}
                    onValueChange={setDetoxDuration}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    {[
                      { value: '7', label: '7 days', description: 'A gentle reset' },
                      { value: '14', label: '14 days', description: 'Build new habits' },
                      { value: '30', label: '30 days', description: 'Transform your relationship' }
                    ].map(option => (
                      <div key={option.value} className="relative">
                        <RadioGroupItem
                          value={option.value}
                          id={`duration-${option.value}`}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={`duration-${option.value}`}
                          className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            detoxDuration === option.value
                              ? 'border-mindcleanse-500 bg-mindcleanse-50'
                              : 'border-gray-200 hover:border-mindcleanse-200'
                          }`}
                        >
                          <span className="text-xl font-bold">{option.label}</span>
                          <span className="text-sm text-gray-500">{option.description}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      Back
                    </Button>
                    <Button
                      onClick={handleContinue}
                      className="bg-mindcleanse-500 hover:bg-mindcleanse-600"
                    >
                      Continue <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Set Goals */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-center text-mindcleanse-800">What Are Your Goals?</h2>
                  <p className="text-center text-gray-600">
                    Select all the benefits you hope to experience from your digital detox.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={option.id}
                          checked={selectedOptions.includes(option.id)}
                          onCheckedChange={() => toggleOption(option.id)}
                        />
                        <label
                          htmlFor={option.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="detox-goal">What's your primary goal for this detox?</Label>
                    <Textarea
                      id="detox-goal"
                      placeholder="I want to reduce my screen time because..."
                      value={detoxGoal}
                      onChange={(e) => setDetoxGoal(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                      Back
                    </Button>
                    <Button
                      onClick={handleContinue}
                      className="bg-mindcleanse-500 hover:bg-mindcleanse-600"
                    >
                      Continue <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Set App Time Limits */}
              {currentStep === 4 && (
                <TimeSetupOnboarding 
                  onCompleteTimeSetup={handleTimeSetupComplete}
                  onSkip={() => setCurrentStep(5)}
                />
              )}

              {/* Step 5: Finalization */}
              {currentStep === 5 && (
                <div className="space-y-6 text-center">
                  <div className="bg-green-50 text-green-800 p-4 rounded-lg flex items-center justify-center gap-2 mb-4">
                    <Check size={20} className="text-green-600" />
                    <span className="font-medium">All set! You're ready to begin your detox journey</span>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-mindcleanse-800">Ready to Start, {userName}?</h2>
                  <p className="text-gray-600">
                    You've set up a {detoxDuration}-day digital detox with daily app time limits. 
                    Your journey to digital wellbeing starts now!
                  </p>
                  
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-left text-amber-700">
                      Remember, the app will track your usage, send reminders when you approach your limits, 
                      and help you stay accountable to your goals.
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <Button
                      onClick={handleCompleteOnboarding}
                      className="bg-mindcleanse-500 hover:bg-mindcleanse-600 min-w-[200px]"
                    >
                      Begin My Detox
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="p-6 text-center text-sm text-gray-500">
        <p>© 2023 MindCleanse • Your Digital Wellbeing Companion</p>
      </footer>
    </div>
  );
};

export default Onboarding;
