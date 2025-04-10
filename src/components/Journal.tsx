
import React, { useState } from 'react';
import { BookOpen, Save, Plus, Calendar, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const Journal: React.FC = () => {
  const { toast } = useToast();
  const [journalEntry, setJournalEntry] = useState('');
  const [mood, setMood] = useState<'good' | 'bad' | null>(null);

  // Mock past entries
  const pastEntries = [
    { 
      date: 'April 8, 2025', 
      content: 'I managed to avoid Instagram completely today. I found myself reaching for my phone several times but caught myself and practiced breathing instead.',
      mood: 'good' 
    },
    { 
      date: 'April 7, 2025', 
      content: 'Today was challenging. I felt disconnected not checking social media, but I did enjoy the extra time I had to read.',
      mood: 'bad' 
    },
  ];

  const handleSaveEntry = () => {
    if (journalEntry.trim()) {
      toast({
        title: "Journal entry saved",
        description: "Your reflection has been recorded.",
        duration: 3000,
      });
      setJournalEntry('');
      setMood(null);
    } else {
      toast({
        title: "Cannot save empty entry",
        description: "Please write something before saving.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const selectMood = (selectedMood: 'good' | 'bad') => {
    setMood(selectedMood === mood ? null : selectedMood);
  };

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-mindcleanse-700 flex items-center justify-center">
          <BookOpen className="mr-2 text-mindcleanse-500" size={28} />
          Digital Detox Journal
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Reflect on your journey away from social media and track your progress
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="mr-2 text-mindcleanse-500" size={20} />
              Today's Reflection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="mb-2 text-sm text-muted-foreground">How did your digital detox go today?</p>
              <Textarea
                placeholder="Write your thoughts here..."
                className="min-h-[200px] mb-4"
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
              />
              
              <div className="flex items-center mb-4">
                <p className="text-sm text-muted-foreground mr-4">How do you feel about your progress?</p>
                <Button
                  variant="outline"
                  className={`mr-2 ${mood === 'good' ? 'bg-green-100 border-green-300' : ''}`}
                  onClick={() => selectMood('good')}
                >
                  <ThumbsUp size={18} className={`${mood === 'good' ? 'text-green-500' : 'text-gray-400'}`} />
                </Button>
                <Button
                  variant="outline"
                  className={`${mood === 'bad' ? 'bg-red-100 border-red-300' : ''}`}
                  onClick={() => selectMood('bad')}
                >
                  <ThumbsDown size={18} className={`${mood === 'bad' ? 'text-red-500' : 'text-gray-400'}`} />
                </Button>
              </div>
              
              <Button
                className="bg-mindcleanse-500 hover:bg-mindcleanse-600"
                onClick={handleSaveEntry}
              >
                <Save size={18} className="mr-2" />
                Save Entry
              </Button>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-2">Journaling Tips:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Record any urges to check social media and what you did instead.</li>
                <li>Note how you felt throughout the day without digital distractions.</li>
                <li>What activities did you enjoy that replaced screen time?</li>
                <li>Were there any challenging moments? How did you overcome them?</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 text-mindcleanse-500" size={20} />
              Past Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pastEntries.map((entry, index) => (
              <div key={index} className="mb-6 pb-6 border-b last:border-b-0 last:pb-0 last:mb-0">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">{entry.date}</h4>
                  {entry.mood === 'good' ? (
                    <ThumbsUp size={16} className="text-green-500" />
                  ) : (
                    <ThumbsDown size={16} className="text-red-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{entry.content}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4 border-lavender-300 text-lavender-500 hover:bg-lavender-100">
              View All Entries
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Journal;
