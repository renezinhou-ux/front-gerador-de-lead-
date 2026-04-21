import React from 'react';
import { cn } from '../lib/utils';
import { LeadStatus } from '../types';

interface StatusBadgeProps {
  status: LeadStatus | 'online' | 'degraded' | 'offline';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getColors = () => {
    switch (status) {
      case 'captured': return 'bg-accent-blue/10 text-accent-blue border-accent-blue/20';
      case 'validated': return 'bg-accent/10 text-accent border-accent/20';
      case 'deduplicated': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'scored': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'distributed': return 'bg-accent/20 text-accent border-accent/40';
      case 'rejected': return 'bg-danger/10 text-danger border-danger/20';
      case 'online': return 'bg-accent/10 text-accent border-accent/20';
      case 'degraded': return 'bg-warning/10 text-warning border-warning/20';
      case 'offline': return 'bg-danger/10 text-danger border-danger/20';
      default: return 'bg-border text-text-muted border-border';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'captured': return 'capturado';
      case 'validated': return 'validado';
      case 'deduplicated': return 'deduplicado';
      case 'scored': return 'pontuado';
      case 'distributed': return 'distribuído';
      case 'rejected': return 'rejeitado';
      case 'online': return 'online';
      case 'degraded': return 'degradado';
      case 'offline': return 'offline';
      default: return status;
    }
  };

  return (
    <span className={cn(
      "px-2 py-0.5 rounded-sm text-[9px] font-mono font-bold uppercase border tracking-widest",
      getColors(),
      className
    )}>
      {getLabel()}
    </span>
  );
};
