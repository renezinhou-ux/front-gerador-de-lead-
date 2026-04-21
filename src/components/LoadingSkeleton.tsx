import React from 'react';
import { cn } from '../lib/utils';

interface LoadingSkeletonProps {
  variant?: 'card' | 'table-row' | 'metric' | 'text';
  className?: string;
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  variant = 'text', 
  className,
  count = 1
}) => {
  const items = Array.from({ length: count });

  if (variant === 'metric') {
    return (
      <div className={cn("bg-surface border border-border p-4 space-y-4 animate-pulse", className)}>
        <div className="h-3 w-20 bg-border" />
        <div className="h-8 w-24 bg-border" />
        <div className="h-1 w-full bg-border" />
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn("bg-surface border border-border p-6 space-y-4 animate-pulse", className)}>
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 bg-border" />
          <div className="w-16 h-4 bg-border" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-3/4 bg-border" />
          <div className="h-3 w-1/2 bg-border" />
        </div>
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <>
        {items.map((_, i) => (
          <tr key={i} className="animate-pulse">
            <td className="px-6 py-4"><div className="h-4 w-12 bg-border" /></td>
            <td className="px-6 py-4"><div className="h-4 w-32 bg-border" /></td>
            <td className="px-6 py-4"><div className="h-4 w-16 bg-border" /></td>
            <td className="px-6 py-4"><div className="h-4 w-24 bg-border" /></td>
            <td className="px-6 py-4"><div className="h-4 w-20 bg-border" /></td>
            <td className="px-6 py-4 text-right"><div className="h-4 w-16 ml-auto bg-border" /></td>
            <td className="px-6 py-4"><div className="h-4 w-4 bg-border" /></td>
          </tr>
        ))}
      </>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((_, i) => (
        <div key={i} className={cn("h-4 bg-border animate-pulse", className)} />
      ))}
    </div>
  );
};
