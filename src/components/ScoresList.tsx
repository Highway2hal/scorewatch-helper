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
}

const ScoresList = ({ matches, className }: ScoresListProps) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          homeTeam={match.homeTeam}
          awayTeam={match.awayTeam}
          homeScore={match.homeScore}
          awayScore={match.awayScore}
          status={match.status}
          time={match.time}
        />
      ))}
    </div>
  );
};

export default ScoresList;