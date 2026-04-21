import React from 'react';
import { motion } from 'motion/react';
import { Database, Zap, Bot, Copy, TestTube, Lock, Power } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { cn } from '../lib/utils';
import { useServicesHealth } from '../lib/hooks';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';

export const SettingsView: React.FC = () => {
  const { data: healthData, isLoading, isError, refetch } = useServicesHealth();

  if (isError) return <ErrorState onRetry={() => refetch()} />;

  const getIcon = (id: string) => {
    if (id.includes('db')) return Database;
    if (id.includes('rabbit')) return Zap;
    return Bot;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <LoadingSkeleton variant="card" className="h-40" />
            <LoadingSkeleton variant="card" className="h-40" />
            <LoadingSkeleton variant="card" className="h-40" />
          </>
        ) : (
          healthData?.map(service => (
            <ConnectionCard 
              key={service.id}
              icon={getIcon(service.id)} 
              title={service.name} 
              url={service.endpoint} 
              latency={service.latency} 
              status={service.status} 
            />
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Env Variables */}
        <div className="lg:col-span-8 bg-surface border border-border p-8 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display font-black text-xs tracking-widest uppercase">Variaveis_de_Ambiente</h3>
            <span className="text-[10px] font-mono text-text-muted">SOMENTE_LEITURA / CONTEXTO_SEGURO</span>
          </div>

          <div className="space-y-4">
             <EnvRow label="DB_MAX_CONNECTIONS" value="200" />
             <EnvRow label="RABBIT_QUEUE_TTL" value="3600" />
             <EnvRow label="SCORING_THRESHOLD" value="75" />
             <EnvRow label="WEBHOOK_SECRET" value="sk_test_...5f21" />
             <EnvRow label="API_KEY_TELEGRAM" value="6512...x92" />
          </div>
        </div>

        {/* Worker Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface border border-border p-8">
            <h3 className="font-display font-black text-xs tracking-widest uppercase mb-6">Alternar_Serviços</h3>
            <div className="space-y-6">
               <WorkerToggle label="Scraper de Leads" isActive />
               <WorkerToggle label="Validador de Email" isActive />
               <WorkerToggle label="Tarefa de Deduplicação" isActive />
               <WorkerToggle label="Push Telegram" isActive={false} />
            </div>
          </div>

          <div className="bg-danger/10 border border-danger/30 p-6 flex flex-col gap-4">
             <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-danger" />
                <h3 className="font-display font-black text-xs tracking-widest uppercase text-danger">Desligamento_Emergencia</h3>
             </div>
             <p className="text-[10px] font-mono text-text-muted uppercase">Termina imediatamente todos os workers ativos e limpa os buffers do RabbitMQ.</p>
             <button className="bg-danger text-white py-3 px-4 font-display font-black text-xs uppercase tracking-tighter hover:bg-danger/90 transition-all flex items-center justify-center gap-2">
                <Power className="w-4 h-4" /> Desligar Cluster Global
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ConnectionCardProps {
  icon: any;
  title: string;
  url: string;
  latency: string;
  status: 'online' | 'degraded' | 'offline';
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ icon: Icon, title, url, latency, status }) => (
  <div className="bg-surface border border-border p-6 space-y-4 hover:border-accent/40 transition-colors group">
    <div className="flex justify-between items-start">
      <div className="p-2 bg-bg border border-border rounded-sm group-hover:bg-accent/10 transition-colors">
        <Icon className="w-5 h-5 text-text-muted group-hover:text-accent" />
      </div>
      <StatusBadge status={status} />
    </div>
    <div className="space-y-1">
       <h4 className="font-display font-bold text-xs uppercase tracking-wider">{title}</h4>
       <p className="text-[10px] font-mono text-text-muted uppercase truncate">{url}</p>
    </div>
    <div className="pt-4 border-t border-border flex items-center justify-between">
       <span className="text-[9px] font-mono text-text-muted uppercase">Latência: <span className="text-accent font-bold">{latency}</span></span>
       <button className="text-[9px] font-mono text-accent-blue uppercase font-bold hover:underline flex items-center gap-1">
          <TestTube className="w-3 h-3" /> Testar
       </button>
    </div>
  </div>
);

const EnvRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex items-center justify-between p-3 bg-bg border border-border rounded-sm">
    <span className="text-[11px] font-mono text-text-muted">{label}</span>
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-mono font-bold">{value}</span>
      <button className="p-1.5 hover:bg-border rounded-sm transition-colors text-text-muted hover:text-text-primary">
         <Copy className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

const WorkerToggle = ({ label, isActive }: { label: string, isActive: boolean }) => (
  <div className="flex items-center justify-between">
    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">{label}</span>
    <button className={cn(
      "w-12 h-6 rounded-full p-1 transition-colors duration-200 flex items-center",
      isActive ? "bg-accent" : "bg-border"
    )}>
      <motion.div 
        layout
        className={cn(
          "w-4 h-4 rounded-full bg-bg",
          isActive ? "ml-auto" : "mr-auto"
        )}
      />
    </button>
  </div>
);
