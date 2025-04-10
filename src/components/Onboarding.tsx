
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Activity, Clock, Sun, Zap, Brain, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';

// Define the schema for onboarding data
const onboardingSchema = z.object({
  detoxReason: z.string().min(1, { message: "Please select a reason" }),
  detoxDuration: z.string().min(1, { message: "Please select a duration" }),
  customDays: z.string().optional(),
  checkInTime: z.string().min(1, { message: "Please select a check-in time" }),
});

type OnboardingData = z.infer<typeof onboardingSchema>;

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const totalSteps = 3;
  
  const form = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      detoxReason: '',
      detoxDuration: '',
      customDays: '',
      checkInTime: '',
    },
  });

  const onSubmit = (data: OnboardingData) => {
    // Store the onboarding data in localStorage
    localStorage.setItem('mindCleanseOnboarding', JSON.stringify({
      ...data,
      onboardingCompleted: true,
      startDate: new Date().toISOString(),
    }));

    toast.success("All set! Your digital detox journey begins now.");
    navigate('/');
  };

  const goToNextStep = () => {
    if (step === 1 && !form.getValues().detoxReason) {
      form.setError('detoxReason', { message: 'Please select a reason for your detox' });
      return;
    }
    
    if (step === 2) {
      const duration = form.getValues().detoxDuration;
      if (!duration) {
        form.setError('detoxDuration', { message: 'Please select a duration' });
        return;
      }
      
      if (duration === 'custom' && !form.getValues().customDays) {
        form.setError('customDays', { message: 'Please enter the number of days' });
        return;
      }
    }

    setStep(step + 1);
  };

  const goToPreviousStep = () => {
    setStep(step - 1);
  };

  const renderProgressBar = () => (
    <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
      <div 
        className="bg-mindcleanse-500 h-2 rounded-full transition-all duration-500" 
        style={{ width: `${(step / totalSteps) * 100}%` }}
      />
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-semibold text-center">Why are you detoxing?</h2>
            <FormField
              control={form.control}
              name="detoxReason"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="relative">
                        <RadioGroupItem 
                          value="anxiety" 
                          id="anxiety" 
                          className="absolute top-4 left-4 peer sr-only"
                        />
                        <Label 
                          htmlFor="anxiety" 
                          className="flex flex-col items-center space-y-2 rounded-lg border-2 border-gray-200 p-6 peer-data-[state=checked]:border-mindcleanse-500 peer-data-[state=checked]:bg-mindcleanse-50 transition-all cursor-pointer hover:bg-gray-50"
                        >
                          <Brain className="h-8 w-8 text-mindcleanse-500" />
                          <span className="text-lg font-medium">Reduce Anxiety</span>
                          <span className="text-sm text-gray-500">Lower stress from constant notifications</span>
                        </Label>
                      </div>
                      
                      <div className="relative">
                        <RadioGroupItem 
                          value="distraction" 
                          id="distraction" 
                          className="absolute top-4 left-4 peer sr-only"
                        />
                        <Label 
                          htmlFor="distraction" 
                          className="flex flex-col items-center space-y-2 rounded-lg border-2 border-gray-200 p-6 peer-data-[state=checked]:border-mindcleanse-500 peer-data-[state=checked]:bg-mindcleanse-50 transition-all cursor-pointer hover:bg-gray-50"
                        >
                          <Zap className="h-8 w-8 text-mindcleanse-500" />
                          <span className="text-lg font-medium">Less Distraction</span>
                          <span className="text-sm text-gray-500">Reduce time spent scrolling</span>
                        </Label>
                      </div>

                      <div className="relative">
                        <RadioGroupItem 
                          value="sleep" 
                          id="sleep" 
                          className="absolute top-4 left-4 peer sr-only"
                        />
                        <Label 
                          htmlFor="sleep" 
                          className="flex flex-col items-center space-y-2 rounded-lg border-2 border-gray-200 p-6 peer-data-[state=checked]:border-mindcleanse-500 peer-data-[state=checked]:bg-mindcleanse-50 transition-all cursor-pointer hover:bg-gray-50"
                        >
                          <Sun className="h-8 w-8 text-mindcleanse-500" />
                          <span className="text-lg font-medium">Better Sleep</span>
                          <span className="text-sm text-gray-500">Improve sleep quality and patterns</span>
                        </Label>
                      </div>

                      <div className="relative">
                        <RadioGroupItem 
                          value="productivity" 
                          id="productivity" 
                          className="absolute top-4 left-4 peer sr-only"
                        />
                        <Label 
                          htmlFor="productivity" 
                          className="flex flex-col items-center space-y-2 rounded-lg border-2 border-gray-200 p-6 peer-data-[state=checked]:border-mindcleanse-500 peer-data-[state=checked]:bg-mindcleanse-50 transition-all cursor-pointer hover:bg-gray-50"
                        >
                          <Activity className="h-8 w-8 text-mindcleanse-500" />
                          <span className="text-lg font-medium">Productivity</span>
                          <span className="text-sm text-gray-500">Focus better on important tasks</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  {form.formState.errors.detoxReason && (
                    <p className="text-red-500 text-sm text-center">{form.formState.errors.detoxReason.message}</p>
                  )}
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-semibold text-center">How long is your detox?</h2>
            <FormField
              control={form.control}
              name="detoxDuration"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup 
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value !== 'custom') {
                          form.setValue('customDays', '');
                        }
                      }} 
                      defaultValue={field.value}
                      className="grid grid-cols-2 md:grid-cols-4 gap-3"
                    >
                      <div className="relative">
                        <RadioGroupItem 
                          value="1" 
                          id="day1" 
                          className="absolute top-2 left-2 peer sr-only"
                        />
                        <Label 
                          htmlFor="day1" 
                          className="flex flex-col items-center justify-center h-24 rounded-lg border-2 border-gray-200 peer-data-[state=checked]:border-mindcleanse-500 peer-data-[state=checked]:bg-mindcleanse-50 transition-all cursor-pointer hover:bg-gray-50"
                        >
                          <span className="text-xl font-medium">1 Day</span>
                          <span className="text-sm text-gray-500">Try it out</span>
                        </Label>
                      </div>

                      <div className="relative">
                        <RadioGroupItem 
                          value="3" 
                          id="day3" 
                          className="absolute top-2 left-2 peer sr-only"
                        />
                        <Label 
                          htmlFor="day3" 
                          className="flex flex-col items-center justify-center h-24 rounded-lg border-2 border-gray-200 peer-data-[state=checked]:border-mindcleanse-500 peer-data-[state=checked]:bg-mindcleanse-50 transition-all cursor-pointer hover:bg-gray-50"
                        >
                          <span className="text-xl font-medium">3 Days</span>
                          <span className="text-sm text-gray-500">Weekend reset</span>
                        </Label>
                      </div>

                      <div className="relative">
                        <RadioGroupItem 
                          value="7" 
                          id="day7" 
                          className="absolute top-2 left-2 peer sr-only"
                        />
                        <Label 
                          htmlFor="day7" 
                          className="flex flex-col items-center justify-center h-24 rounded-lg border-2 border-gray-200 peer-data-[state=checked]:border-mindcleanse-500 peer-data-[state=checked]:bg-mindcleanse-50 transition-all cursor-pointer hover:bg-gray-50"
                        >
                          <span className="text-xl font-medium">7 Days</span>
                          <span className="text-sm text-gray-500">Full week</span>
                        </Label>
                      </div>

                      <div className="relative">
                        <RadioGroupItem 
                          value="custom" 
                          id="custom" 
                          className="absolute top-2 left-2 peer sr-only"
                        />
                        <Label 
                          htmlFor="custom" 
                          className="flex flex-col items-center justify-center h-24 rounded-lg border-2 border-gray-200 peer-data-[state=checked]:border-mindcleanse-500 peer-data-[state=checked]:bg-mindcleanse-50 transition-all cursor-pointer hover:bg-gray-50"
                        >
                          <span className="text-xl font-medium">Custom</span>
                          <span className="text-sm text-gray-500">Your choice</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  {form.formState.errors.detoxDuration && (
                    <p className="text-red-500 text-sm text-center">{form.formState.errors.detoxDuration.message}</p>
                  )}
                </FormItem>
              )}
            />

            {form.getValues().detoxDuration === 'custom' && (
              <FormField
                control={form.control}
                name="customDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of days</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter number of days" 
                        min="1" 
                        max="365"
                        {...field}
                      />
                    </FormControl>
                    {form.formState.errors.customDays && (
                      <p className="text-red-500 text-sm">{form.formState.errors.customDays.message}</p>
                    )}
                  </FormItem>
                )}
              />
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-semibold text-center">What time should we check in with you daily?</h2>
            <FormField
              control={form.control}
              name="checkInTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose a time that works best for you:</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select check-in time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="morning">Morning (8:00 AM)</SelectItem>
                      <SelectItem value="noon">Midday (12:00 PM)</SelectItem>
                      <SelectItem value="evening">Evening (6:00 PM)</SelectItem>
                      <SelectItem value="night">Night (9:00 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.checkInTime && (
                    <p className="text-red-500 text-sm">{form.formState.errors.checkInTime.message}</p>
                  )}
                </FormItem>
              )}
            />
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-2">
                We'll send you reminders and check in at your chosen time
              </p>
              <Clock className="h-16 w-16 mx-auto text-mindcleanse-400" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-mindcleanse-50 to-white flex flex-col">
      <div className="container max-w-2xl mx-auto py-8 px-4 md:px-0 flex-grow flex flex-col">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 rounded-full bg-mindcleanse-500 mr-2"></div>
            <h1 className="text-2xl font-bold text-mindcleanse-700">MindCleanse</h1>
          </div>
          <p className="text-mindcleanse-600">Let's set up your digital detox journey</p>
        </div>
        
        {renderProgressBar()}
        
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex-grow flex flex-col">
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-grow">
            <div className="flex-grow">
              {renderStepContent()}
            </div>
            
            <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
              {step > 1 ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={goToPreviousStep}
                  className="flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div></div>
              )}
              
              {step < totalSteps ? (
                <Button 
                  type="button"
                  onClick={goToNextStep}
                  className="flex items-center bg-mindcleanse-500 hover:bg-mindcleanse-600"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit"
                  className="flex items-center bg-mindcleanse-500 hover:bg-mindcleanse-600"
                >
                  Complete
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
