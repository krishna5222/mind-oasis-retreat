
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Trophy, Award, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DetoxGoal {
  day: number;
  goal: string;
  completed: boolean;
}

const ProgressTracker = () => {
  const [detoxDay, setDetoxDay] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [dailyGoals, setDailyGoals] = useState<DetoxGoal[]>([]);
  
  // Check if onboarding is completed and get detox info
  useEffect(() => {
    const onboardingData = localStorage.getItem('mindCleanseOnboarding');
    if (onboardingData) {
      const parsedData = JSON.parse(onboardingData);
      if (parsedData.startDate) {
        const startDate = new Date(parsedData.startDate);
        const currentDate = new Date();
        const timeDiff = currentDate.getTime() - startDate.getTime();
        const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24)) + 1;
        
        // Set current detox day
        setDetoxDay(dayDiff);
        
        // Calculate completion rate
        let totalDays = 7; // Default to 7 days
        if (parsedData.detoxDuration) {
          totalDays = parsedData.detoxDuration === 'custom' 
            ? parseInt(parsedData.customDays || '7') 
            : parseInt(parsedData.detoxDuration);
        }
        
        setCompletionRate(Math.min(100, Math.round((dayDiff / totalDays) * 100)));
      }
    }
    
    // Set example goals
    setDailyGoals([
      { day: 1, goal: "No social media for 2 hours", completed: true },
      { day: 2, goal: "Meditate for 10 minutes", completed: true },
      { day: 3, goal: "Replace social media with reading", completed: false },
      { day: 4, goal: "Journal about your feelings", completed: false },
      { day: 5, goal: "30 minute outdoor walk", completed: false },
      { day: 6, goal: "Call a friend instead of texting", completed: false },
      { day: 7, goal: "Full day without social media", completed: false },
    ]);
  }, []);

  const toggleGoalCompletion = (index: number) => {
    setDailyGoals(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        completed: !updated[index].completed
      };
      return updated;
    });
  };

  const goToDay = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && detoxDay > 1) {
      setDetoxDay(prev => prev - 1);
    } else if (direction === 'next' && detoxDay < dailyGoals.length) {
      setDetoxDay(prev => prev + 1);
    }
  };

  // Calculate completed goals percentage
  const completedGoals = dailyGoals.filter(goal => goal.completed).length;
  const goalCompletionPercentage = Math.round((completedGoals / dailyGoals.length) * 100);

  const currentDayGoal = dailyGoals.find(goal => goal.day === detoxDay) || dailyGoals[0];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Detox Progress</CardTitle>
            <CardDescription>Day {detoxDay} of your journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Start</span>
                <span>{completionRate}% Complete</span>
              </div>
              <Progress value={completionRate} className="h-2" />
              
              {completionRate >= 100 && (
                <div className="flex items-center justify-center mt-6 text-center space-y-2">
                  <Trophy className="h-8 w-8 text-yellow-500 mr-2" />
                  <div>
                    <p className="font-semibold">Congratulations!</p>
                    <p className="text-sm text-gray-500">You've completed your detox goal</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Goals Completed</CardTitle>
            <CardDescription>Your mindfulness achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>{completedGoals} of {dailyGoals.length} goals completed</span>
                <span>{goalCompletionPercentage}%</span>
              </div>
              <Progress value={goalCompletionPercentage} className="h-2" />
              
              {completedGoals > 0 && (
                <div className="flex items-center mt-4">
                  <Award className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm">Keep up the good work!</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Day {detoxDay}</CardTitle>
            <CardDescription>Today's mindfulness goal</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => goToDay('prev')} 
              disabled={detoxDay <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => goToDay('next')} 
              disabled={detoxDay >= dailyGoals.length}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {currentDayGoal && (
            <div 
              className={`p-4 rounded-lg border ${currentDayGoal.completed ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'} 
              flex items-center justify-between`}
            >
              <span className="font-medium">{currentDayGoal.goal}</span>
              <Button 
                variant={currentDayGoal.completed ? "default" : "outline"}
                size="sm" 
                onClick={() => toggleGoalCompletion(currentDayGoal.day - 1)}
                className={currentDayGoal.completed ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {currentDayGoal.completed ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" /> Completed
                  </>
                ) : (
                  "Mark Complete"
                )}
              </Button>
            </div>
          )}
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">Your Progress</h4>
            <div className="space-y-3">
              {dailyGoals.map((goal, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div 
                    className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 
                    ${goal.completed ? 'bg-green-500 text-white' : 'border border-gray-300'}`}
                  >
                    {goal.completed && <CheckCircle className="h-3 w-3" />}
                  </div>
                  <span className={`${goal.completed ? 'line-through text-gray-500' : ''}`}>
                    Day {goal.day}: {goal.goal}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTracker;
