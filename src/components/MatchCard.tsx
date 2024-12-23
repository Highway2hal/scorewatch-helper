import React from 'react';
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface MatchCardProps {
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: 'upcoming' | 'live' | 'finished';
  time?: string;
  className?: string;
}

const MatchCard = ({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  status,
  time,
  className
}: MatchCardProps) => {
  return (
    <div className={cn(
      "w-full p-4 rounded-lg bg-card border shadow-sm",
      status === 'live' && "border-primary",
      className
    )}>
      <div className="flex justify-between items-center mb-2">
        <span className={cn(
          "text-xs font-medium",
          status === 'live' && "text-primary animate-pulse"
        )}>
          {status === 'live' ? (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> LIVE
            </span>
          ) : status === 'upcoming' ? time : 'FT'}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">{homeTeam}</span>
          <span className="text-lg font-semibold">{homeScore !== undefined ? homeScore : '-'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">{awayTeam}</span>
          <span className="text-lg font-semibold">{awayScore !== undefined ? awayScore : '-'}</span>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;