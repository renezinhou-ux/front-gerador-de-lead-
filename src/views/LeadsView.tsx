import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { ScoreBar } from '../components/ScoreBar';
import { LeadDrawer } from '../components/LeadDrawer';
import { Lead, LeadQueryParams } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { useLeads } from '../lib/hooks';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { exportLeadsCSV } from '../lib/api';

export const LeadsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<{ status: string[], source: string[] }>({
    status: [],
    source: []
  });

  const queryParams: LeadQueryParams = {
    page: currentPage,
    limit: 12,
    search: debouncedSearch,
    status: filters.status.length > 0 ? filters.status : undefined,
    source: filters.source.length > 0 ? filters.source : undefined
  };

  const { data: leadsData, isLoading, isError, refetch } = useLeads(queryParams);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1); // Reset page on filter/search change
  }, [debouncedSearch, filters]);

  const handleExport = async () => {
    try {
      const blob = await exportLeadsCSV(queryParams);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_export_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  const toggleFilter = (type: 'status' | 'source', value: string) => {
    setFilters(prev => {
      const current = prev[type];
      const next = current.includes(value) 
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [type]: next };
    });
  };

  const STATUS_OPTIONS = ['captured', 'validated', 'deduplicated', 'scored', 'distributed', 'rejected'];
  const SOURCE_OPTIONS = ['Scraping', 'Chatbot', 'Tráfego Pago'];

  return (
    <div className="space-y-6">
      {/* Filters & Actions */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
            <input 
              type="text"
              placeholder="Buscar por ID, Nome ou Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-border pl-10 pr-4 py-2.5 text-xs font-mono focus:outline-none focus:border-accent/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "btn-outline flex items-center gap-2 flex-1 md:flex-none transition-colors",
                isFilterOpen || filters.status.length > 0 || filters.source.length > 0 ? "border-accent text-accent" : ""
              )}
            >
              <Filter className="w-3 h-3" /> Filtros
            </button>
            <button 
              onClick={handleExport}
              className="btn-outline flex items-center gap-2 flex-1 md:flex-none"
            >
              <Download className="w-3 h-3" /> Exportar CSV
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-surface border border-border p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest">Status do Lead</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {STATUS_OPTIONS.map(s => (
                      <label key={s} className="flex items-center gap-3 cursor-pointer group">
                        <div 
                          onClick={() => toggleFilter('status', s)}
                          className={cn(
                             "w-4 h-4 border border-border flex items-center justify-center transition-all",
                             filters.status.includes(s) ? "bg-accent border-accent" : "group-hover:border-accent/50"
                          )}
                        >
                          {filters.status.includes(s) && <span className="text-[8px] text-bg font-bold">L</span>}
                        </div>
                        <StatusBadge status={s as any} className="scale-90 origin-left" />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest">Canais de Origem</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {SOURCE_OPTIONS.map(s => (
                      <label key={s} className="flex items-center gap-3 cursor-pointer group">
                        <div 
                          onClick={() => toggleFilter('source', s)}
                          className={cn(
                             "w-4 h-4 border border-border flex items-center justify-center transition-all",
                             filters.source.includes(s) ? "bg-accent border-accent" : "group-hover:border-accent/50"
                          )}
                        >
                          {filters.source.includes(s) && <span className="text-[8px] text-bg font-bold">L</span>}
                        </div>
                        <span className="text-[10px] font-mono uppercase text-text-muted group-hover:text-text-primary">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 pt-4 border-t border-border flex justify-end gap-3">
                  <button 
                    onClick={() => setFilters({ status: [], source: [] })}
                    className="text-[10px] font-mono text-text-muted hover:text-white uppercase"
                  >
                    Limpar Tudo
                  </button>
                  <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="text-[10px] font-mono text-accent hover:underline uppercase"
                  >
                    Fechar Paine
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Table */}
      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-border overflow-hidden min-h-[600px] flex flex-col"
        >
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg/50 border-b border-border">
                  <th className="px-6 py-4 text-[10px] font-mono text-text-muted uppercase tracking-widest">ID_DO_LEAD</th>
                  <th className="px-6 py-4 text-[10px] font-mono text-text-muted uppercase tracking-widest">IDENTIDADE_COMERCIAL</th>
                  <th className="px-6 py-4 text-[10px] font-mono text-text-muted uppercase tracking-widest">SCORE_QUALIDADE</th>
                  <th className="px-6 py-4 text-[10px] font-mono text-text-muted uppercase tracking-widest">CANAL_ORIGEM</th>
                  <th className="px-6 py-4 text-[10px] font-mono text-text-muted uppercase tracking-widest">STATUS</th>
                  <th className="px-6 py-4 text-[10px] font-mono text-text-muted uppercase tracking-widest text-right">REGISTRADO</th>
                  <th className="px-6 py-4 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <LoadingSkeleton variant="table-row" count={12} />
                ) : (
                  leadsData?.data.map((lead) => (
                    <tr 
                      key={lead.id} 
                      onClick={() => setSelectedLead(lead)}
                      className="hover:bg-accent/5 transition-colors group cursor-pointer border-b border-border last:border-0"
                    >
                      <td className="px-6 py-5 font-mono text-[10px] text-accent">{lead.displayId}</td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold tracking-tight uppercase group-hover:text-accent transition-colors">{lead.name}</span>
                          <span className="text-[10px] text-text-muted font-mono">{lead.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 w-48">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-center text-[9px] font-mono uppercase">
                            <span className="text-text-muted">Index</span>
                            <span className={lead.score >= 70 ? "text-accent" : "text-warning"}>{lead.score}%</span>
                          </div>
                          <ScoreBar score={lead.score} />
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[10px] font-mono uppercase bg-bg border border-border px-2 py-1 rounded-sm text-text-muted group-hover:text-text-primary transition-colors">
                          {lead.source}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-6 py-5 text-right font-mono text-[10px] text-text-muted">
                        {format(new Date(lead.createdAt), 'yyyy-MM-dd HH:mm')}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-end">
                          <button className="p-1.5 hover:bg-border rounded-sm transition-colors text-text-muted group-hover:text-accent">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-border flex items-center justify-between bg-bg/20">
            <span className="text-[10px] font-mono text-text-muted uppercase">
              Exibindo {(leadsData?.data.length || 0)} de {leadsData?.total || 0} leads
            </span>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1 || isLoading}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-1.5 border border-border hover:bg-border disabled:opacity-30 transition-colors rounded-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, leadsData?.totalPages || 0) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={cn(
                      "w-8 h-8 font-mono text-[10px] border transition-colors flex items-center justify-center rounded-sm",
                      currentPage === i + 1 ? "bg-accent border-accent text-bg font-bold" : "border-border hover:bg-border text-text-muted"
                    )}
                  >
                    {(i + 1).toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
              <button 
                disabled={currentPage === (leadsData?.totalPages || 1) || isLoading}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-1.5 border border-border hover:bg-border disabled:opacity-30 transition-colors rounded-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Side Drawer */}
      <LeadDrawer 
        lead={selectedLead} 
        isOpen={!!selectedLead} 
        onClose={() => setSelectedLead(null)} 
      />
    </div>
  );
};
