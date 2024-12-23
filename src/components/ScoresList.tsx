import React from 'react';
import MatchCard from './MatchCard';

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: 'upcoming' | 'live' | 'finished';
  time?: string;
}

interface ScoresListProps {
  matches: Match[];
  className?: string;
  favorites?: string[];
  onToggleFavorite?: (matchId: string) => void;
}

const ScoresList = ({ matches, className, favorites = [], onToggleFavorite }: ScoresListProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          homeTeam={match.homeTeam}
          awayTeam={match.awayTeam}
          homeScore={match.homeScore}
          awayScore={match.awayScore}
          status={match.status}
          time={match.time}
          isFavorite={favorites.includes(match.id)}
          onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(match.id) : undefined}
        />
      ))}
    </div>
  );
};

export default ScoresList;