import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn, formatCompactNumber } from '../lib/utils';

interface MetricCardProps {
  label: string;
  value: number;
  delta: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  label, 
  value, 
  delta, 
  prefix = '', 
  suffix = '',
  delay = 0 
}) => {
  const isPositive = delta >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="card group"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="font-mono text-[10px] tracking-wider text-text-muted uppercase">
          {label}
        </span>
        <div className={cn(
          "font-mono text-[11px]",
          isPositive ? "text-accent" : "text-danger"
        )}>
          {isPositive ? '+' : ''}{delta}%
        </div>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-[12px] font-mono text-text-muted">{prefix}</span>
        <span className="text-[28px] font-sans font-bold tracking-[-1px] text-text-primary group-hover:text-accent transition-colors">
          {formatCompactNumber(value)}
        </span>
        <span className="text-[10px] font-mono text-text-muted lowercase">{suffix}</span>
      </div>

      <div className="mt-4 flex gap-[2px]">
        {Array.from({ length: 40 }).map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "h-1 grow rounded-[1px]",
              i < (value % 40) ? "bg-accent/40" : "bg-border"
            )} 
          />
        ))}
      </div>
    </motion.div>
  );
};
