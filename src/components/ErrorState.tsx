import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  queryKey?: string[];
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = "Ocorreu um erro ao carregar os dados.", 
  onRetry,
  queryKey 
}) => {
  const queryClient = useQueryClient();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else if (queryKey) {
      queryClient.invalidateQueries({ queryKey });
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-danger/5 border border-danger/20">
      <AlertCircle className="w-12 h-12 text-danger mb-4" />
      <h3 className="text-lg font-display font-black tracking-widest uppercase text-danger mb-2">Erro de Sistema</h3>
      <p className="text-xs font-mono text-text-muted uppercase max-w-md mb-6">{message}</p>
      <button 
        onClick={handleRetry}
        className="btn-outline border-danger/40 text-danger hover:bg-danger/10 flex items-center gap-2"
      >
        <RotateCcw className="w-4 h-4" /> RECOLHER_DADOS
      </button>
    </div>
  );
};
