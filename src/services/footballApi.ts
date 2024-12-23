import { Match } from '@/utils/cache';

const API_BASE_URL = 'https://api.football-data.org/v4';

async function fetchWithAuth(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'X-Auth-Token': import.meta.env.VITE_FOOTBALL_DATA_API_KEY || '',
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

export interface ApiMatch {
  id: number;
  homeTeam: { name: string };
  awayTeam: { name: string };
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
  status: string;
  utcDate: string;
}

function mapApiMatchToMatch(match: ApiMatch): Match {
  const status = 
    match.status === 'FINISHED' ? 'finished' :
    match.status === 'IN_PLAY' || match.status === 'PAUSED' ? 'live' :
    'upcoming';

  return {
    id: match.id.toString(),
    homeTeam: match.homeTeam.name,
    awayTeam: match.awayTeam.name,
    homeScore: match.score.fullTime.home ?? undefined,
    awayScore: match.score.fullTime.away ?? undefined,
    status,
    time: status === 'upcoming' ? new Date(match.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
  };
}

export async function fetchMatches(): Promise<{ 
  previous: Match[];
  live: Match[];
  upcoming: Match[];
}> {
  try {
    // Fetch matches from the last 2 days to next 7 days
    const dateFrom = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const dateTo = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const response = await fetchWithAuth(
      `/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`
    );

    const matches = response.matches.map(mapApiMatchToMatch);

    return {
      previous: matches.filter(m => m.status === 'finished'),
      live: matches.filter(m => m.status === 'live'),
      upcoming: matches.filter(m => m.status === 'upcoming'),
    };
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
}