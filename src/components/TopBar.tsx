import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { RefreshCw, Search, Bell, User } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatDistanceToNow } from 'date-fns';

export const TopBar: React.FC = () => {
  const location = useLocation();
  const { lastUpdated, refresh, isSidebarCollapsed } = useStore();
  const [timeSince, setTimeSince] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSince(formatDistanceToNow(lastUpdated, { addSuffix: true }));
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'DASHBOARD';
      case '/pipeline': return 'MONITOR_DO_PIPELINE';
      case '/leads': return 'INVENTARIO_DE_LEADS';
      case '/config': return 'PESOS_DO_SCORE';
      case '/settings': return 'CONFIG_DO_SISTEMA';
      default: return 'CONSOLE';
    }
  };

  return (
    <header 
      className="h-[60px] border-b border-border bg-bg/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40"
      style={{ marginLeft: isSidebarCollapsed ? 60 : 220, transition: 'margin-left 0.3s ease-in-out' }}
    >
      <div className="flex items-center gap-4">
        <div className="font-mono text-[11px] text-text-muted flex items-center">
          OPS / <span className="text-text-primary ml-1">{getPageTitle()}</span>
        </div>
        <div className="h-3 w-[1px] bg-border mx-2" />
        <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted overflow-hidden whitespace-nowrap">
          <div className="w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_8px_var(--color-accent)] animate-pulse" />
          <span>SINCRONIZADO: <span className="text-accent underline">HÁ {timeSince.toUpperCase()}</span></span>
          <span className="opacity-50 ml-2">ID_REFRESH: 98231-X</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted">
          <span>LAST_REFRESH:</span>
          <span className="text-text-primary min-w-[100px]">{timeSince.toUpperCase()}</span>
          <button 
            onClick={() => refresh()}
            className="p-1.5 hover:bg-border rounded-sm transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 text-text-muted hover:text-text-primary transition-colors">
            <Search className="w-4 h-4" />
          </button>
          <button className="p-2 text-text-muted hover:text-text-primary transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent rounded-full border border-bg" />
          </button>
          <div className="h-8 w-8 rounded-sm bg-border border border-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-accent/50 transition-all">
            <User className="w-5 h-5 text-text-muted" />
          </div>
        </div>
      </div>
    </header>
  );
};
