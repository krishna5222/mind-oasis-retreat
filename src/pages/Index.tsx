
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Dashboard from '@/components/Dashboard';
import MindfulnessTimer from '@/components/MindfulnessTimer';
import Journal from '@/components/Journal';
import ProgressTracker from '@/components/ProgressTracker';
import DailyCheckIn from '@/components/DailyCheckIn';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container-padding">
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="bg-white shadow-sm">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-mindcleanse-500 data-[state=active]:text-white">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="check-in" className="data-[state=active]:bg-mindcleanse-500 data-[state=active]:text-white">
                Check-in
              </TabsTrigger>
              <TabsTrigger value="timer" className="data-[state=active]:bg-mindcleanse-500 data-[state=active]:text-white">
                Mindfulness
              </TabsTrigger>
              <TabsTrigger value="journal" className="data-[state=active]:bg-mindcleanse-500 data-[state=active]:text-white">
                Journal
              </TabsTrigger>
              <TabsTrigger value="progress" className="data-[state=active]:bg-mindcleanse-500 data-[state=active]:text-white">
                Progress
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
          <TabsContent value="check-in">
            <DailyCheckIn />
          </TabsContent>
          <TabsContent value="timer">
            <MindfulnessTimer />
          </TabsContent>
          <TabsContent value="journal">
            <Journal />
          </TabsContent>
          <TabsContent value="progress">
            <ProgressTracker />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
