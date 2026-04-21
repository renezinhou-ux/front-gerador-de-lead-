import React from 'react';
import { cn } from '../lib/utils';

interface ScoreBarProps {
  score: number;
  className?: string;
  showText?: boolean;
}

export const ScoreBar: React.FC<ScoreBarProps> = ({ score, className, showText = false }) => {
  const getColor = () => {
    if (score >= 70) return 'bg-accent shadow-[0_0_8px_rgba(0,229,160,0.4)]';
    if (score >= 40) return 'bg-warning shadow-[0_0_8px_rgba(245,158,11,0.4)]';
    return 'bg-danger shadow-[0_0_8px_rgba(239,68,68,0.4)]';
  };

  return (
    <div className={cn("flex flex-col gap-1 w-full", className)}>
      <div className="h-1 w-full bg-border rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-1000", getColor())}
          style={{ width: `${score}%` }}
        />
      </div>
      {showText && (
        <span className={cn(
          "text-[9px] font-mono font-bold",
          score >= 70 ? "text-accent" : score >= 40 ? "text-warning" : "text-danger"
        )}>
          {score.toString().padStart(2, '0')}/100
        </span>
      )}
    </div>
  );
};
