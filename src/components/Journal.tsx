
import React, { useState, useEffect } from 'react';
import { BookOpen, Save, Plus, Calendar, ThumbsUp, ThumbsDown, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface JournalEntry {
  date: string;
  content: string;
  mood: 'good' | 'bad' | null;
  prompt: string;
}

const JOURNAL_PROMPTS = [
  "What did you do instead of scrolling today?",
  "What emotions came up today?",
  "What's one win from today?",
  "Did you notice any urges to use social media? How did you handle them?",
  "What did you learn about yourself today without digital distractions?",
  "How has your focus changed since starting your digital detox?",
  "What are you grateful for today?",
  "What real-life connections did you nurture today?"
];

const Journal: React.FC = () => {
  const { toast } = useToast();
  const [journalEntry, setJournalEntry] = useState('');
  const [mood, setMood] = useState<'good' | 'bad' | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [pastEntries, setPastEntries] = useState<JournalEntry[]>([]);
  
  // Initialize with a random prompt and load saved entries
  useEffect(() => {
    getRandomPrompt();
    const savedEntries = localStorage.getItem('mindCleanseJournal');
    if (savedEntries) {
      setPastEntries(JSON.parse(savedEntries));
    }
  }, []);
  
  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * JOURNAL_PROMPTS.length);
    setCurrentPrompt(JOURNAL_PROMPTS[randomIndex]);
  };

  const handleSaveEntry = () => {
    if (journalEntry.trim()) {
      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      const newEntry: JournalEntry = {
        date: formattedDate,
        content: journalEntry,
        mood: mood,
        prompt: currentPrompt
      };
      
      const updatedEntries = [newEntry, ...pastEntries];
      setPastEntries(updatedEntries);
      
      // Save to localStorage
      localStorage.setItem('mindCleanseJournal', JSON.stringify(updatedEntries));
      
      toast({
        title: "Journal entry saved",
        description: "Your reflection has been recorded.",
        duration: 3000,
      });
      
      setJournalEntry('');
      setMood(null);
      getRandomPrompt();
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
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Plus className="mr-2 text-mindcleanse-500" size={20} />
                Today's Reflection
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={getRandomPrompt} 
                className="text-mindcleanse-500"
              >
                <RefreshCcw size={16} className="mr-1" />
                New Prompt
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="bg-mindcleanse-50 p-4 rounded-md mb-4 border border-mindcleanse-200">
                <p className="font-medium text-mindcleanse-700">{currentPrompt}</p>
              </div>
              
              <p className="mb-2 text-sm text-muted-foreground">Your response:</p>
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
            {pastEntries.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {pastEntries.map((entry, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex justify-between mb-2">
                              <h4 className="font-medium">{entry.date}</h4>
                              {entry.mood === 'good' ? (
                                <ThumbsUp size={16} className="text-green-500" />
                              ) : entry.mood === 'bad' ? (
                                <ThumbsDown size={16} className="text-red-500" />
                              ) : null}
                            </div>
                            <div className="bg-gray-50 p-2 rounded text-xs text-gray-500 italic mb-2">
                              "{entry.prompt}"
                            </div>
                            <p className="text-sm text-muted-foreground">{entry.content}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-2">
                  <CarouselPrevious className="relative mr-2 inset-0 translate-y-0" />
                  <CarouselNext className="relative ml-2 inset-0 translate-y-0" />
                </div>
              </Carousel>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No entries yet.</p>
                <p className="text-sm">Your journal entries will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Journal;
