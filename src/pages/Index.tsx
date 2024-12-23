import React, { useState, useEffect } from 'react';
import ScoresList from '@/components/ScoresList';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Wifi, WifiOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { saveToCache, getFromCache, saveFavorites, getFavorites } from '@/utils/cache';

type ViewType = 'previous' | 'live' | 'upcoming';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('live');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();

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

  useEffect(() => {
    // Load favorites
    setFavorites(getFavorites());

    // Handle online/offline status
    const handleOnline = () => {
      setIsOffline(false);
      toast({
        title: "Back Online",
        description: "Live scores will now update automatically",
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast({
        title: "Offline Mode",
        description: "Using cached data",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Save initial data to cache
    saveToCache({
      matches: mockMatches,
      lastUpdated: Date.now(),
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  const getMatches = () => {
    if (isOffline) {
      const cached = getFromCache();
      if (cached) {
        return cached.matches[currentView];
      }
    }
    return mockMatches[currentView];
  };

  const handleToggleFavorite = (matchId: string) => {
    const newFavorites = favorites.includes(matchId)
      ? favorites.filter(id => id !== matchId)
      : [...favorites, matchId];
    
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
    
    // Provide haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
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
    <div className="min-h-screen bg-background p-2">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateView('left')}
          disabled={currentView === 'previous'}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold">
            {currentView === 'previous' ? 'Results' : 
             currentView === 'live' ? 'Live' : 
             'Upcoming'}
          </h1>
          {isOffline ? <WifiOff className="w-3 h-3 text-destructive" /> : <Wifi className="w-3 h-3 text-primary" />}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateView('right')}
          disabled={currentView === 'upcoming'}
          className="h-8 w-8"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <ScoresList 
        matches={getMatches()}
        className="max-w-[180px] mx-auto"
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
};

export default Index;