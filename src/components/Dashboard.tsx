
import React from 'react';
import { Calendar, Clock, BookOpen, LineChart, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const currentStreak = 3; // Mock data
  const totalMindfullMinutes = 45; // Mock data

  const handleClick = () => {
    toast({
      title: "🌱 Well done!",
      description: "Your mindful moment has been logged.",
      duration: 3000,
    });
  };

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-mindcleanse-700 mb-2">Welcome to your digital detox</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Take a breath, slow down, and reconnect with yourself. MindCleanse helps you build healthier digital habits.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-mindcleanse-600">
              <Clock size={18} className="mr-2" />
              MINDFULNESS TIMER
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMindfullMinutes} mins</div>
            <p className="text-muted-foreground text-sm">Mindful moments this week</p>
            <Button onClick={handleClick} className="mt-4 w-full bg-mindcleanse-500 hover:bg-mindcleanse-600">
              Start Session
            </Button>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-lavender-500">
              <Calendar size={18} className="mr-2" />
              TODAY'S CHECK-IN
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Not Yet</div>
            <p className="text-muted-foreground text-sm">Daily reflection journaling</p>
            <Button onClick={handleClick} variant="outline" className="mt-4 w-full border-lavender-300 text-lavender-500 hover:bg-lavender-100">
              Write Entry
            </Button>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-sand-500">
              <LineChart size={18} className="mr-2" />
              PROGRESS TRACKER
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStreak} days</div>
            <p className="text-muted-foreground text-sm">Current streak</p>
            <Button onClick={handleClick} variant="outline" className="mt-4 w-full border-sand-300 text-sand-500 hover:bg-sand-100">
              View Progress
            </Button>
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
            <div className="text-2xl font-bold">2 of 10</div>
            <p className="text-muted-foreground text-sm">Milestones reached</p>
            <Button onClick={handleClick} variant="outline" className="mt-4 w-full border-mindcleanse-300 text-mindcleanse-500 hover:bg-mindcleanse-100">
              See All
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-secondary p-6 rounded-xl mb-10">
        <div className="flex items-start md:items-center flex-col md:flex-row">
          <div className="mb-4 md:mb-0 md:mr-6">
            <div className="w-16 h-16 rounded-full bg-mindcleanse-500 flex items-center justify-center text-white text-xl font-bold">
              {currentStreak}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">Your digital detox journey is going well!</h3>
            <p className="text-muted-foreground">
              You've spent {totalMindfullMinutes} minutes on mindfulness this week and maintained a {currentStreak}-day streak.
              Keep it up!
            </p>
          </div>
          <Button onClick={handleClick} className="mt-4 md:mt-0 md:ml-auto bg-mindcleanse-500 hover:bg-mindcleanse-600">
            Daily Challenge
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 text-mindcleanse-500" />
              Motivation Quote
            </CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="italic border-l-4 border-mindcleanse-300 pl-4 py-2">
              "Almost everything will work again if you unplug it for a few minutes, including you."
              <footer className="text-right text-sm text-muted-foreground mt-2">— Anne Lamott</footer>
            </blockquote>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Today's Tip</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Try the 5-minute rule: When you feel the urge to check social media, wait just 5 minutes. Often, the urge will pass.</p>
            <Button onClick={handleClick} variant="outline" className="text-mindcleanse-500 border-mindcleanse-200 hover:bg-mindcleanse-100">
              More Tips
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
