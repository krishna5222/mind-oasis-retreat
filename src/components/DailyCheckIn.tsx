
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { SmilePlus, Meh, Frown, Timer, Lightbulb, Quote } from 'lucide-react';

const DailyCheckIn = () => {
  const [mood, setMood] = useState<string>('');
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood) {
      toast({
        title: "Please select your mood",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Check-in recorded",
      description: "Thanks for sharing how you're feeling today!",
    });
  };

  const offlineActivities = [
    "Take a 15-minute nature walk",
    "Read a chapter of a book",
    "Practice mindful breathing",
    "Write in your journal",
    "Call a friend or family member",
  ];

  const randomActivity = offlineActivities[Math.floor(Math.random() * offlineActivities.length)];

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 animate-fade-in">
      <h1 className="text-3xl font-bold text-mindcleanse-700 mb-6 text-center">Daily Check-in</h1>
      
      <div className="grid gap-6">
        {/* Quote Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Quote className="text-mindcleanse-500" />
              Today's Inspiration
            </CardTitle>
          </CardHeader>
          <CardContent className="italic text-gray-600">
            "The greatest power you have is the power to focus your attention where you choose."
          </CardContent>
        </Card>

        {/* Time Saved Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Timer className="text-mindcleanse-500" />
              Time Saved Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-mindcleanse-600">45 minutes</div>
            <p className="text-gray-600 mt-1">Great job staying focused!</p>
          </CardContent>
        </Card>

        {/* Activity Suggestion Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Lightbulb className="text-mindcleanse-500" />
              Try This Instead
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{randomActivity}</p>
          </CardContent>
        </Card>

        {/* Mood Check Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              How are you feeling today?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <RadioGroup
                value={mood}
                onValueChange={setMood}
                className="grid grid-cols-3 gap-4"
              >
                <div className="flex flex-col items-center gap-2">
                  <Label
                    htmlFor="happy"
                    className="cursor-pointer flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-transparent hover:border-mindcleanse-200 transition-all"
                  >
                    <SmilePlus className="w-8 h-8 text-green-500" />
                    <RadioGroupItem value="happy" id="happy" className="sr-only" />
                    Happy
                  </Label>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <Label
                    htmlFor="neutral"
                    className="cursor-pointer flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-transparent hover:border-mindcleanse-200 transition-all"
                  >
                    <Meh className="w-8 h-8 text-yellow-500" />
                    <RadioGroupItem value="neutral" id="neutral" className="sr-only" />
                    Neutral
                  </Label>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <Label
                    htmlFor="stressed"
                    className="cursor-pointer flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-transparent hover:border-mindcleanse-200 transition-all"
                  >
                    <Frown className="w-8 h-8 text-red-500" />
                    <RadioGroupItem value="stressed" id="stressed" className="sr-only" />
                    Stressed
                  </Label>
                </div>
              </RadioGroup>

              <Button 
                type="submit" 
                className="w-full mt-6 bg-mindcleanse-500 hover:bg-mindcleanse-600"
              >
                Submit Check-in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyCheckIn;
