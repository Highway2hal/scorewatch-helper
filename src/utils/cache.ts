interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: 'upcoming' | 'live' | 'finished';
  time?: string;
}

const CACHE_KEY = 'football-scores-cache';
const FAVORITES_KEY = 'football-favorites';

interface CacheData {
  matches: {
    previous: Match[];
    live: Match[];
    upcoming: Match[];
  };
  lastUpdated: number;
}

export const saveToCache = (data: CacheData) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
};

export const getFromCache = (): CacheData | null => {
  const cached = localStorage.getItem(CACHE_KEY);
  return cached ? JSON.parse(cached) : null;
};

export const saveFavorites = (teamIds: string[]) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(teamIds));
};

export const getFavorites = (): string[] => {
  const favorites = localStorage.getItem(FAVORITES_KEY);
  return favorites ? JSON.parse(favorites) : [];
};