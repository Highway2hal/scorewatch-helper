import React, { useState, useEffect } from 'react';
import ScoresList from '@/components/ScoresList';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Wifi, WifiOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { saveToCache, getFromCache, saveFavorites, getFavorites } from '@/utils/cache';
import { useQuery } from '@tanstack/react-query';
import { fetchMatches } from '@/services/footballApi';

type ViewType = 'previous' | 'live' | 'upcoming';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('live');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();

  const { data: matches, error, isLoading } = useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches,
    refetchInterval: currentView === 'live' ? 30000 : false, // Refresh every 30 seconds for live matches
    onSuccess: (data) => {
      // Save to cache for offline use
      saveToCache({
        matches: data,
        lastUpdated: Date.now(),
      });
    },
  });

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

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  const getMatchesToDisplay = () => {
    if (isOffline) {
      const cached = getFromCache();
      if (cached) {
        return cached.matches[currentView];
      }
      return [];
    }
    return matches ? matches[currentView] : [];
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

  if (error) {
    return (
      <div className="min-h-screen bg-background p-2 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load matches</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

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

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-pulse text-sm text-muted-foreground">
            Loading matches...
          </div>
        </div>
      ) : (
        <ScoresList 
          matches={getMatchesToDisplay()}
          className="max-w-[180px] mx-auto"
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </div>
  );
};

export default Index;