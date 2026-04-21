import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, ResponsiveContainer, Cell
} from 'recharts';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { format } from 'date-fns';
import { useMetrics, useFunnelData, useSourceBreakdown, useLeads } from '../lib/hooks';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';

export const DashboardView: React.FC = () => {
  const { data: metrics, isLoading: metricsLoading, isError: metricsError } = useMetrics();
  const { data: funnelData, isLoading: funnelLoading } = useFunnelData();
  const { data: sourceData, isLoading: sourceLoading } = useSourceBreakdown();
  const { data: leadsData, isLoading: leadsLoading } = useLeads({ limit: 10, page: 1 });

  if (metricsError) {
    return <ErrorState queryKey={['metrics']} />;
  }

  const recentLeads = leadsData?.data || [];
  const totalLeadsToday = metrics?.totalLeadsToday || 0;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {metricsLoading ? (
          <>
            <LoadingSkeleton variant="metric" />
            <LoadingSkeleton variant="metric" />
            <LoadingSkeleton variant="metric" />
            <LoadingSkeleton variant="metric" />
          </>
        ) : (
          <>
            <MetricCard 
              label="Total Leads Hoje" 
              value={metrics?.totalLeadsToday || 0} 
              delta={metrics?.delta.total || 0} 
              delay={0.1}
            />
            <MetricCard 
              label="Validados" 
              value={metrics?.validatedLeads || 0} 
              delta={metrics?.delta.validated || 0} 
              delay={0.2}
            />
            <MetricCard 
              label="Rejeitados" 
              value={metrics?.rejectedLeads || 0} 
              delta={metrics?.delta.rejected || 0} 
              delay={0.3}
            />
            <MetricCard 
              label="Distribuídos" 
              value={metrics?.distributedLeads || 0} 
              delta={metrics?.delta.distributed || 0} 
              delay={0.4}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Funnel Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 card p-4 min-h-[250px]"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h3 className="font-mono text-[10px] tracking-widest uppercase text-text-muted">QUEDA_NO_PIPELINE</h3>
            </div>
            <span className="text-[10px] font-mono text-accent">JANELA_MÓVEL_7D</span>
          </div>

          <div className="space-y-1">
            {funnelLoading ? (
              <LoadingSkeleton count={5} className="h-8" />
            ) : (
              funnelData?.map((item, i) => (
                <div 
                  key={item.name}
                  className="h-[32px] bg-accent-blue/80 flex items-center px-4 font-mono text-[10px] text-bg uppercase border-r-4 border-black/20"
                  style={{ width: `${100 - (i * 12)}%` }}
                >
                  {item.name === 'Captured' ? 'Capturados' : item.name === 'Validated' ? 'Validados' : item.name === 'Deduplicated' ? 'Deduplicados' : item.name === 'Scored' ? 'Pontuados' : item.name === 'Distributed' ? 'Distribuídos' : item.name} ({item.value})
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Source Breakdown */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 card p-4 min-h-[250px]"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h3 className="font-mono text-[10px] tracking-widest uppercase text-text-muted">LEADS_POR_ORIGEM (7D)</h3>
            </div>
          </div>

          {sourceLoading ? (
            <div className="space-y-4">
              <div className="h-24 bg-border animate-pulse" />
              <LoadingSkeleton count={3} />
            </div>
          ) : (
            <>
              <div className="h-[140px] w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceData} barGap={8}>
                    <Bar dataKey="value">
                      {sourceData?.map((_, index) => (
                        <Cell key={`cell-${index}`} fill="#1E1E24" className="hover:fill-accent hover:opacity-50 transition-all cursor-pointer" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {sourceData?.map((source, i) => (
                  <div key={source.name} className="flex items-center justify-between p-3 bg-bg border border-border rounded-sm">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-accent' : i === 1 ? 'bg-accent-blue' : 'bg-danger'}`} />
                      <span className="text-[10px] font-mono font-bold uppercase">{source.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] font-mono text-text-muted">
                        {totalLeadsToday > 0 ? Math.round((source.value / totalLeadsToday) * 100) : 0}%
                       </span>
                       <span className="text-sm font-mono font-bold">{source.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Recent Activity Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-border overflow-hidden min-h-[400px]"
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-mono text-[10px] tracking-widest uppercase text-text-muted">ATIVIDADE_RECENTE</h3>
          </div>
          <button className="text-[10px] font-mono text-accent hover:underline flex items-center gap-1">
            VER_LOGS_COMPLETOS
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg/50 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-mono text-text-muted uppercase tracking-widest">ID do Lead</th>
                <th className="px-6 py-4 text-[10px] font-mono text-text-muted uppercase tracking-widest">Identificação</th>
                <th className="px-6 py-4 text-[10px] font-mono text-text-muted uppercase tracking-widest">Origem</th>
                <th className="px-6 py-4 text-[10px] font-mono text-text-muted uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-mono text-text-muted uppercase tracking-widest">Score</th>
                <th className="px-6 py-4 text-[10px] font-mono text-text-muted uppercase tracking-widest text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leadsLoading ? (
                <LoadingSkeleton variant="table-row" count={5} />
              ) : (
                recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-accent/5 transition-colors group cursor-pointer border-b border-border last:border-0">
                    <td className="px-6 py-4 font-mono text-[10px] text-accent">{lead.displayId}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold group-hover:text-accent transition-colors uppercase">{lead.name}</span>
                        <span className="text-[10px] text-text-muted">{lead.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-mono uppercase bg-border px-2 py-0.5 rounded-sm">{lead.source}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         <div className={`h-1.5 w-1.5 rounded-full ${lead.score > 70 ? 'bg-accent' : 'bg-warning'}`} />
                         <span className="text-xs font-mono font-bold">{lead.score}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-[10px] text-text-muted">
                      {format(new Date(lead.createdAt), 'HH:mm:ss')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
