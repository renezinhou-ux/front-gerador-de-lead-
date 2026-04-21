import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Phone, Globe, Building2, MapPin, Calendar, FileText } from 'lucide-react';
import { Lead } from '../types';
import { StatusBadge } from './StatusBadge';
import { ScoreBar } from './ScoreBar';
import { format } from 'date-fns';
import { useLeadDetail, useLeadEvents } from '../lib/hooks';
import { LoadingSkeleton } from './LoadingSkeleton';

interface LeadDrawerProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LeadDrawer: React.FC<LeadDrawerProps> = ({ lead, isOpen, onClose }) => {
  const { data: leadDetail, isLoading: leadDetailLoading } = useLeadDetail(lead?.id || '');
  const { data: leadEvents, isLoading: leadEventsLoading } = useLeadEvents(lead?.id || '');

  if (!lead) return null;

  // Use detailed data if available, otherwise fallback to the one from the list
  const activeLead = leadDetail || lead;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[450px] bg-surface border-l border-border z-[70] shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] text-text-muted">{activeLead.displayId}</span>
                <h2 className="text-xl font-display font-black tracking-tight">{activeLead.name.toUpperCase()}</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-border rounded-sm transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Score Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="font-display font-bold text-[10px] tracking-widest text-text-muted uppercase">Score de Confiabilidade</span>
                  <span className="font-mono text-2xl font-bold text-accent">{activeLead.score}%</span>
                </div>
                <ScoreBar score={activeLead.score} className="h-2" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-bg border border-border p-3">
                    <span className="block text-[9px] font-mono text-text-muted uppercase mb-1">Status</span>
                    <StatusBadge status={activeLead.status} />
                  </div>
                  <div className="bg-bg border border-border p-3">
                    <span className="block text-[9px] font-mono text-text-muted uppercase mb-1">Origem</span>
                    <span className="text-[10px] font-mono text-white flex items-center gap-2 uppercase">
                       <Globe className="w-3 h-3 text-accent-blue" />
                       {activeLead.source}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <h3 className="font-display font-bold text-[12px] tracking-widest text-text-muted uppercase flex items-center gap-2">
                   Informações de Contato
                </h3>
                <div className="space-y-3">
                  <DetailItem icon={Mail} label="Email" value={activeLead.email} />
                  <DetailItem icon={Phone} label="Telefone" value={activeLead.phone} />
                  {activeLead.details?.company && <DetailItem icon={Building2} label="Empresa" value={activeLead.details.company} />}
                  {activeLead.details?.location && <DetailItem icon={MapPin} label="Localização" value={activeLead.details.location} />}
                  <DetailItem icon={Calendar} label="Registrado em" value={format(new Date(activeLead.createdAt), 'dd/MM/yyyy HH:mm')} />
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="space-y-4">
                <h3 className="font-display font-bold text-[12px] tracking-widest text-text-muted uppercase flex items-center gap-2">
                   Histórico de Eventos
                </h3>
                <div className="relative pl-4 space-y-6 before:absolute before:left-[1.5px] before:top-2 before:bottom-2 before:w-[1px] before:bg-border">
                  {leadEventsLoading ? (
                    <LoadingSkeleton count={3} />
                  ) : (
                    leadEvents?.map((event) => (
                      <div key={event.id} className="relative">
                        <div className="absolute -left-[18.5px] top-1.5 w-2 h-2 rounded-full bg-border border-2 border-surface" />
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-text-primary uppercase">{event.type}</span>
                            <span className="text-[9px] font-mono text-text-muted">{format(new Date(event.timestamp), 'HH:mm:ss')}</span>
                          </div>
                          <p className="text-[11px] text-text-muted leading-relaxed">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border bg-bg/50 grid grid-cols-2 gap-3">
              <button className="btn-outline flex items-center justify-center gap-2 text-[10px] whitespace-nowrap">
                <FileText className="w-3 h-3" /> EXPORTAR PDF
              </button>
              <button className="btn-primary flex items-center justify-center gap-2 text-[10px] whitespace-nowrap uppercase">
                Encaminhar Vendas
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const DetailItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-center gap-4 bg-bg/50 border border-border p-3 rounded-sm group hover:border-accent/40 transition-colors">
    <div className="p-2 bg-surface border border-border rounded-sm group-hover:text-accent transition-colors">
      <Icon className="w-4 h-4 text-text-muted group-hover:text-accent" />
    </div>
    <div className="flex flex-col">
      <span className="text-[9px] font-mono text-text-muted uppercase">{label}</span>
      <span className="text-[11px] font-medium text-text-primary">{value}</span>
    </div>
  </div>
);

const User = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
