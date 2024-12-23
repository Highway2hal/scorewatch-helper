import React from 'react';
import { cn } from "@/lib/utils";
import { Clock, Star } from "lucide-react";

interface MatchCardProps {
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: 'upcoming' | 'live' | 'finished';
  time?: string;
  className?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const MatchCard = ({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  status,
  time,
  className,
  isFavorite,
  onToggleFavorite
}: MatchCardProps) => {
  return (
    <div className={cn(
      "w-full p-2 rounded-lg bg-card border shadow-sm",
      status === 'live' && "border-primary",
      className
    )}>
      <div className="flex justify-between items-center mb-1">
        <span className={cn(
          "text-xs font-medium",
          status === 'live' && "text-primary animate-pulse"
        )}>
          {status === 'live' ? (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {time}
            </span>
          ) : status === 'upcoming' ? time : 'FT'}
        </span>
        {onToggleFavorite && (
          <button 
            onClick={onToggleFavorite}
            className="p-1"
          >
            <Star 
              className={cn(
                "w-3 h-3",
                isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
              )} 
            />
          </button>
        )}
      </div>
      
      <div className="space-y-1 text-sm">
        <div className="flex justify-between items-center">
          <span className="font-medium truncate max-w-[70%]">{homeTeam}</span>
          <span className="font-semibold">{homeScore !== undefined ? homeScore : '-'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium truncate max-w-[70%]">{awayTeam}</span>
          <span className="font-semibold">{awayScore !== undefined ? awayScore : '-'}</span>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;