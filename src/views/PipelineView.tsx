import React from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Clock, Zap, Server, ChevronRight, Terminal as TerminalIcon } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { usePipelineNodes } from '../lib/hooks';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';

export const PipelineView: React.FC = () => {
  const { data: nodes, isLoading, isError, refetch } = usePipelineNodes();

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <LoadingSkeleton key={i} variant="card" className="h-[250px]" />
          ))
        ) : (
          nodes?.map((node, i) => (
            <React.Fragment key={node.id}>
              <PipelineNodeCard node={node} />
              {i < nodes.length - 1 && (
                <div className="hidden lg:flex items-center justify-center">
                  <ChevronRight className="w-6 h-6 text-border" />
                </div>
              )}
            </React.Fragment>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Terminal Logs */}
        <div className="lg:col-span-2 bg-[#050505] border border-border rounded-sm overflow-hidden flex flex-col h-[500px]">
            <div className="p-3 border-b border-border bg-surface flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TerminalIcon className="w-3 h-3 text-accent" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">Fluxo_Global_do_Pipeline</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-border" />
              <div className="w-2.5 h-2.5 rounded-full bg-border" />
              <div className="w-2.5 h-2.5 rounded-full bg-border" />
            </div>
          </div>
          <div className="flex-1 p-6 font-mono text-[11px] overflow-y-auto space-y-2 selection:bg-accent/40">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="flex gap-4 group">
                <span className="text-text-muted shrink-0">[{format(new Date(), 'HH:mm:ss:SSS')}]</span>
                <span className="text-accent underline shrink-0 uppercase">INFO</span>
                <p className="text-text-primary/90">
                  <span className="text-accent-blue opacity-50">Node_{Math.floor(Math.random()*5)}</span>: 
                  Processando payload <span className="text-warning">#{(1000 + i).toString(16)}</span> - 
                  Transição de estado: <StatusBadge status="validated" className="scale-75 origin-left" /> concluída em {Math.floor(Math.random()*200)}ms
                </p>
              </div>
            ))}
            <div className="flex gap-4 animate-pulse">
               <span className="text-accent">_</span>
            </div>
          </div>
        </div>

        {/* System Stats */}
        <div className="space-y-6">
          <div className="bg-surface border border-border p-6 space-y-6">
             <h3 className="font-display font-black text-xs tracking-widest uppercase mb-4">Carga_do_Pipeline_X86</h3>
             <div className="space-y-4">
                <StatRow label="Throughput Global" value="1.2k" suffix="eps" />
                <StatRow label="Tempo Médio Proc." value="142" suffix="ms" />
                <StatRow label="Taxa de Erro" value="0.04" suffix="%" />
                <StatRow label="Workers Ativos" value="48" suffix="nós" />
             </div>
          </div>

          <div className="bg-accent/5 border border-accent/20 p-6">
             <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-accent" />
                <h3 className="font-display font-black text-xs tracking-widest uppercase">Status_Autoescala</h3>
             </div>
             <p className="text-[11px] text-text-muted leading-relaxed mb-6 font-mono">
                Cluster rodando a <span className="text-accent font-bold">120%</span> da capacidade. 
                Provisionando <span className="text-accent-blue font-bold">8 nós extras</span> em us-east-1 para pico.
             </p>
             <div className="h-1 bg-border rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '82%' }}
                  className="h-full bg-accent"
                />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PipelineNodeCard = ({ node }: { node: any }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-surface border border-border border-dashed p-4 flex flex-col gap-4 relative group cursor-pointer lg:col-span-1 font-mono text-[11px]"
  >
    <div className="flex justify-between items-start">
      <div className="p-2 bg-bg border border-border group-hover:border-accent/40 transition-colors">
        <Server className={cn("w-4 h-4 text-text-muted transition-colors", node.status === 'online' ? 'group-hover:text-accent' : node.status === 'degraded' ? 'group-hover:text-warning' : 'group-hover:text-danger')} />
      </div>
      <StatusBadge status={node.status} className="scale-90" />
    </div>

    <div>
      <h3 className="text-[10px] tracking-widest text-text-muted uppercase mb-1">{node.name}</h3>
      <div className="text-xl font-bold tracking-tighter">
        {node.throughput}
        <span className="text-[10px] text-text-muted ml-1 lowercase">e/m</span>
      </div>
    </div>

    <div className="space-y-3">
      <div className="flex justify-between items-center text-[9px] font-mono uppercase">
        <span className="text-text-muted">Queue Depth</span>
        <span className={node.queueDepth > 100 ? "text-danger" : "text-text-primary"}>{node.queueDepth}</span>
      </div>
      <div className="h-12 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={node.sparkline.map((v: number, i: number) => ({ v, i }))}>
            <defs>
              <linearGradient id={`gradient-${node.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={node.status === 'online' ? '#00E5A0' : node.status === 'degraded' ? '#F59E0B' : '#EF4444'} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={node.status === 'online' ? '#00E5A0' : node.status === 'degraded' ? '#F59E0B' : '#EF4444'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="v" 
              stroke={node.status === 'online' ? '#00E5A0' : node.status === 'degraded' ? '#F59E0B' : '#EF4444'} 
              fillOpacity={1} 
              fill={`url(#gradient-${node.id})`} 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-2 text-[8px] font-mono text-text-muted uppercase">
         <Clock className="w-2.5 h-2.5" />
         Last Event: {format(new Date(node.lastEvent), 'HH:mm:ss')}
      </div>
    </div>
  </motion.div>
);

const StatRow = ({ label, value, suffix }: { label: string, value: string, suffix: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-[10px] font-mono text-text-muted uppercase">{label}</span>
    <div className="flex items-baseline gap-1">
      <span className="text-sm font-mono font-bold text-text-primary">{value}</span>
      <span className="text-[9px] font-mono text-text-muted lowercase">{suffix}</span>
    </div>
  </div>
);
