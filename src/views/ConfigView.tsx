import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, AlertCircle, RefreshCw, Sliders, Info, CheckCircle2 } from 'lucide-react';
import { ScoreBar } from '../components/ScoreBar';
import { cn } from '../lib/utils';
import { useScoringConfig, useUpdateScoringConfig } from '../lib/hooks';
import { ScoringConfig } from '../types';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';

export const ConfigView: React.FC = () => {
  const { data: initialWeights, isLoading, isError, refetch } = useScoringConfig();
  const updateMutation = useUpdateScoringConfig();
  
  const [weights, setWeights] = useState<ScoringConfig>({
    emailQuality: 30,
    phoneCompleteness: 20,
    sourceQuality: 35,
    engagementSignals: 15,
  });

  useEffect(() => {
    if (initialWeights) {
      setWeights(initialWeights);
    }
  }, [initialWeights]);

  const total = weights.emailQuality + weights.phoneCompleteness + weights.sourceQuality + weights.engagementSignals;
  const isValid = total === 100;

  const [simulation, setSimulation] = useState({
    params: { email: 0.8, phone: 0.5, source: 0.9, engagement: 0.4 },
    score: 0
  });

  useEffect(() => {
    const s = 
      (simulation.params.email * (weights.emailQuality)) +
      (simulation.params.phone * (weights.phoneCompleteness)) +
      (simulation.params.source * (weights.sourceQuality)) +
      (simulation.params.engagement * (weights.engagementSignals));
    setSimulation(prev => ({ ...prev, score: Math.round(s) }));
  }, [weights, simulation.params]);

  const handleSave = () => {
    if (!isValid) return;
    updateMutation.mutate(weights, {
      onSuccess: () => {
        // We could show a toast here if we had a toast library
        alert("Configurações salvas com sucesso!");
      }
    });
  };

  if (isLoading) return <div className="p-12"><LoadingSkeleton count={4} className="h-20" /></div>;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-display font-black tracking-tight">ALGORITMO_DE_PONTUACAO_V4</h2>
          <p className="text-xs font-mono text-text-muted uppercase tracking-widest">Configure os pesos para a qualificação automatizada de leads</p>
        </div>
        <button 
          disabled={!isValid || updateMutation.isPending}
          onClick={handleSave}
          className="btn-primary flex items-center gap-2 group disabled:opacity-50"
        >
          {updateMutation.isPending ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3 group-hover:scale-120 transition-transform" />}
          {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sliders Section */}
        <div className="bg-surface border border-border p-8 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Sliders className="w-40 h-40" />
          </div>

          <div className="space-y-10 relative z-10">
            <WeightSlider 
              label="Qualidade do Email" 
              description="Pontuação baseada na autoridade do domínio, validade SMTP e status temporal"
              value={weights.emailQuality} 
              onChange={(v) => setWeights(prev => ({ ...prev, emailQuality: v }))} 
            />
            <WeightSlider 
              label="Integridade do Telefone" 
              description="Presença de WhatsApp, código de país correto e verificação de operadora"
              value={weights.phoneCompleteness} 
              onChange={(v) => setWeights(prev => ({ ...prev, phoneCompleteness: v }))} 
            />
            <WeightSlider 
              label="Qualidade da Origem" 
              description="Taxa histórica de conversão da landing page ou nó de scraping de origem"
              value={weights.sourceQuality} 
              onChange={(v) => setWeights(prev => ({ ...prev, sourceQuality: v }))} 
            />
            <WeightSlider 
              label="Sinais de Engajamento" 
              description="Cliques, velocidade de preenchimento do formulário e duração da visita"
              value={weights.engagementSignals} 
              onChange={(v) => setWeights(prev => ({ ...prev, engagementSignals: v }))} 
            />
          </div>

          <div className={cn(
            "p-4 border font-mono text-[10px] flex items-center justify-between transition-all",
            isValid ? "bg-accent/10 border-accent/20 text-accent" : "bg-danger/10 border-danger/20 text-danger"
          )}>
            <div className="flex items-center gap-2">
              {isValid ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span className="uppercase tracking-widest font-bold">
                {isValid ? "Algoritmo Validado" : `Pesos Inválidos: Soma é ${total}% (Deve ser 100%)`}
              </span>
            </div>
            <span className="font-black text-xs">{total}%</span>
          </div>
        </div>

        {/* Live Preview Section */}
        <div className="space-y-6">
          <div className="bg-surface border border-border p-8">
            <div className="flex items-center gap-3 mb-8">
              <RefreshCw className="w-4 h-4 text-accent-blue" />
              <h3 className="font-display font-black text-xs tracking-widest uppercase">Pré-visualização de Simulação</h3>
            </div>

            <div className="space-y-8">
              <div className="text-center p-8 bg-bg border border-border space-y-4">
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Score Estimado do Lead</span>
                <div className="text-6xl font-mono font-black tracking-tighter text-text-primary">
                   {simulation.score}<span className="text-lg text-text-muted">/100</span>
                </div>
                <ScoreBar score={simulation.score} className="h-2 max-w-[200px] mx-auto" />
              </div>

              <div className="space-y-4">
                <h4 className="text-[9px] font-mono font-bold text-text-muted uppercase tracking-widest">Valores do Payload de Teste</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-text-muted flex justify-between">Email Valid: <span className="text-white">80%</span></span>
                    <div className="h-1 bg-border"><div className="h-full bg-accent-blue w-[80%]" /></div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-text-muted flex justify-between">Source: <span className="text-white">90%</span></span>
                    <div className="h-1 bg-border"><div className="h-full bg-accent-blue w-[90%]" /></div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-accent/5 border border-accent/20 rounded-sm flex gap-3">
                 <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                 <p className="text-[10px] text-text-muted font-mono leading-relaxed">
                   A simulação utiliza um lead B2B hipotético do LinkedIn Scraping com um domínio validado. 
                   Os resultados podem variar +/- 5% com base em padrões de dados temporais.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WeightSlider = ({ label, description, value, onChange }: { label: string, description: string, value: number, onChange: (v: number) => void }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-end">
      <div className="space-y-1">
        <label className="text-[11px] font-display font-black text-text-primary uppercase tracking-widest">{label}</label>
        <p className="text-[10px] text-text-muted leading-relaxed max-w-[300px]">{description}</p>
      </div>
      <span className="text-lg font-mono font-black text-accent">{value}%</span>
    </div>
    <input 
      type="range" 
      min="0" 
      max="100" 
      step="5" 
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
    />
  </div>
);
