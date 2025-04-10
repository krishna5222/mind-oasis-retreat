
import React from 'react';
import { LineChart, Calendar, Award, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the chart
const weeklyData = [
  { name: 'Mon', minutes: 15 },
  { name: 'Tue', minutes: 30 },
  { name: 'Wed', minutes: 20 },
  { name: 'Thu', minutes: 45 },
  { name: 'Fri', minutes: 25 },
  { name: 'Sat', minutes: 10 },
  { name: 'Sun', minutes: 35 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 shadow rounded border border-mindcleanse-100">
        <p className="text-sm text-mindcleanse-700">{`${payload[0].value} minutes`}</p>
      </div>
    );
  }
  return null;
};

const ProgressTracker: React.FC = () => {
  // Mock data
  const currentStreak = 3;
  const totalDays = 21;
  const daysCompleted = 12;
  const achievements = [
    { name: '3-Day Streak', completed: true },
    { name: '1 Week Completed', completed: true },
    { name: '10 Journal Entries', completed: false },
    { name: '2 Weeks Completed', completed: false },
    { name: '30 Mindful Minutes', completed: true },
  ];
  
  const percentComplete = (daysCompleted / totalDays) * 100;

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-mindcleanse-700 flex items-center justify-center">
          <LineChart className="mr-2 text-mindcleanse-500" size={28} />
          Your Progress
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Track your digital detox journey and celebrate your achievements
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-mindcleanse-600">
              <Calendar size={18} className="mr-2" />
              CURRENT STREAK
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <span className="text-5xl font-bold text-mindcleanse-700">{currentStreak}</span>
              <span className="text-xl ml-2 text-muted-foreground">days</span>
            </div>
            <p className="text-muted-foreground text-sm mt-2">Keep going! Your longest streak was 7 days.</p>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-mindcleanse-600">
              <Clock size={18} className="mr-2" />
              MINDFUL MINUTES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <span className="text-5xl font-bold text-mindcleanse-700">180</span>
              <span className="text-xl ml-2 text-muted-foreground">total</span>
            </div>
            <p className="text-muted-foreground text-sm mt-2">That's 3 hours of mindfulness practice!</p>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-mindcleanse-600">
              <Award size={18} className="mr-2" />
              ACHIEVEMENTS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <span className="text-5xl font-bold text-mindcleanse-700">3</span>
              <span className="text-xl ml-2 text-muted-foreground">of 5</span>
            </div>
            <p className="text-muted-foreground text-sm mt-2">You've unlocked 3 out of 5 achievements!</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <Card className="card-hover lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              Weekly Mindfulness Minutes
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="minutes" fill="#4AA69B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              21-Day Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">{daysCompleted} days completed</span>
                <span className="text-sm text-muted-foreground">{totalDays} days total</span>
              </div>
              <Progress value={percentComplete} className="h-2 bg-mindcleanse-100" indicatorClassName="bg-mindcleanse-500" />
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Achievements</h4>
              <ul className="space-y-2">
                {achievements.map((achievement, index) => (
                  <li key={index} className="flex items-center">
                    {achievement.completed ? (
                      <div className="w-5 h-5 rounded-full bg-mindcleanse-500 flex items-center justify-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-mindcleanse-200 mr-2"></div>
                    )}
                    <span className={achievement.completed ? 'text-mindcleanse-700' : 'text-muted-foreground'}>
                      {achievement.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="card-hover bg-mindcleanse-50">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-medium mb-2">Your Digital Wellness Score</h3>
            <div className="flex justify-center items-center mb-4">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-mindcleanse-300 flex items-center justify-center">
                <span className="text-3xl font-bold text-mindcleanse-600">76</span>
              </div>
            </div>
            <p className="max-w-lg mx-auto text-muted-foreground">
              Your digital wellness score is calculated based on your mindfulness minutes, journal entries, 
              and streak consistency. Keep up the good work to improve your score!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTracker;
