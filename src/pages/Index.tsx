import React, { useState } from 'react';
import ScoresList from '@/components/ScoresList';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Mock data - in a real app this would come from an API
const mockMatches = {
  previous: [
    {
      id: '1',
      homeTeam: 'Arsenal',
      awayTeam: 'Chelsea',
      homeScore: 2,
      awayScore: 1,
      status: 'finished' as const,
    },
    {
      id: '2',
      homeTeam: 'Liverpool',
      awayTeam: 'Man City',
      homeScore: 0,
      awayScore: 0,
      status: 'finished' as const,
    },
  ],
  live: [
    {
      id: '3',
      homeTeam: 'Man United',
      awayTeam: 'Tottenham',
      homeScore: 1,
      awayScore: 1,
      status: 'live' as const,
      time: "45'"
    },
  ],
  upcoming: [
    {
      id: '4',
      homeTeam: 'Newcastle',
      awayTeam: 'Brighton',
      status: 'upcoming' as const,
      time: '20:00',
    },
    {
      id: '5',
      homeTeam: 'Wolves',
      awayTeam: 'Everton',
      status: 'upcoming' as const,
      time: '21:00',
    },
  ],
};

type ViewType = 'previous' | 'live' | 'upcoming';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('live');

  const getMatches = () => {
    switch (currentView) {
      case 'previous':
        return mockMatches.previous;
      case 'live':
        return mockMatches.live;
      case 'upcoming':
        return mockMatches.upcoming;
    }
  };

  const navigateView = (direction: 'left' | 'right') => {
    const views: ViewType[] = ['previous', 'live', 'upcoming'];
    const currentIndex = views.indexOf(currentView);
    if (direction === 'left' && currentIndex > 0) {
      setCurrentView(views[currentIndex - 1]);
    } else if (direction === 'right' && currentIndex < views.length - 1) {
      setCurrentView(views[currentIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateView('left')}
          disabled={currentView === 'previous'}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <h1 className="text-lg font-semibold">
          {currentView === 'previous' ? 'Results' : 
           currentView === 'live' ? 'Live' : 
           'Upcoming'}
        </h1>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateView('right')}
          disabled={currentView === 'upcoming'}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <ScoresList 
        matches={getMatches()}
        className="max-w-sm mx-auto"
      />
    </div>
  );
};

export default Index;