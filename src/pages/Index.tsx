
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Dashboard from '@/components/Dashboard';
import MindfulnessTimer from '@/components/MindfulnessTimer';
import Journal from '@/components/Journal';
import ProgressTracker from '@/components/ProgressTracker';
import DailyCheckIn from '@/components/DailyCheckIn';
import CravingHelp from '@/components/CravingHelp';
import UsageStats from '@/components/UsageStats';
import AppBlocker from '@/components/AppBlocker';
import DetoxCountdown from '@/components/DetoxCountdown';
import TimeSettings from '@/components/TimeSettings';
import UsageReport from '@/components/UsageReport';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container-padding">
        {/* Always display the countdown timer at the top */}
        <div className="mb-6">
          <DetoxCountdown />
        </div>
        
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-6 overflow-x-auto scrollbar-hide">
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
              <TabsTrigger value="usage-stats" className="data-[state=active]:bg-mindcleanse-500 data-[state=active]:text-white">
                Usage Stats
              </TabsTrigger>
              <TabsTrigger value="usage-report" className="data-[state=active]:bg-mindcleanse-500 data-[state=active]:text-white">
                Usage Report
              </TabsTrigger>
              <TabsTrigger value="blocker" className="data-[state=active]:bg-mindcleanse-500 data-[state=active]:text-white">
                App Blocker
              </TabsTrigger>
              <TabsTrigger value="time-limits" className="data-[state=active]:bg-mindcleanse-500 data-[state=active]:text-white">
                Time Limits
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
          <TabsContent value="usage-stats">
            <UsageStats />
          </TabsContent>
          <TabsContent value="usage-report">
            <UsageReport />
          </TabsContent>
          <TabsContent value="blocker">
            <AppBlocker />
          </TabsContent>
          <TabsContent value="time-limits">
            <TimeSettings />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />

      {/* Craving Help button - always visible */}
      <CravingHelp />
    </div>
  );
};

export default Index;
