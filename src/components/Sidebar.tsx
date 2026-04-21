import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GitBranch, 
  Users, 
  Settings2, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Database,
  Terminal,
  Clock
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: GitBranch, label: 'Monitor de Pipeline', path: '/pipeline', badge: 3 },
  { icon: Users, label: 'Lista de Leads', path: '/leads' },
  { icon: Settings2, label: 'Ajuste de Score', path: '/config' },
  { icon: Settings, label: 'Configurações', path: '/settings' },
];

export const Sidebar: React.FC = () => {
  const { isSidebarCollapsed, setSidebarCollapsed } = useStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarCollapsed ? 60 : 220 }}
      className={cn(
        "h-screen fixed left-0 top-0 bg-surface border-r border-border z-50 flex flex-col transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "items-center" : "items-stretch"
      )}
    >
      <div className="h-16 flex items-center px-6 mb-10">
        <div className="flex items-center gap-3 overflow-hidden">
          {!isSidebarCollapsed && (
            <span className="font-mono font-bold text-[11px] text-accent tracking-widest uppercase">
              LEAD_CORE [v2.4]
            </span>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-0">
        {MENU_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-6 py-3 transition-all relative group text-[13px]",
              isActive 
                ? "bg-accent/3 text-text-primary font-semibold border-l-2 border-accent" 
                : "text-text-muted hover:bg-border/30 hover:text-text-primary border-l-2 border-transparent"
            )}
          >
            <item.icon className="w-4 h-4 shrink-0 opacity-70" />
            {!isSidebarCollapsed && (
              <span className="uppercase tracking-tight">
                {item.label}
              </span>
            )}
            
            {item.badge && !isSidebarCollapsed && (
              <span className="ml-auto bg-accent text-bg text-[10px] px-1.5 py-0.5 rounded-sm font-mono font-bold">
                {item.badge}
              </span>
            )}

            {isSidebarCollapsed && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-surface border border-border text-[10px] font-mono whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 uppercase tracking-widest">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        {!isSidebarCollapsed && (
          <div className="mb-4 bg-bg border border-border p-3 rounded-sm">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-3 h-3 text-accent" />
              <span className="text-[10px] font-mono text-text-muted uppercase">System Log</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[9px] font-mono">
                <span className="text-text-muted">PG_SQL</span>
                <span className="text-accent">CONNECTED</span>
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono">
                <span className="text-text-muted">RABBIT</span>
                <span className="text-accent">ACTIVE</span>
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          className="w-full h-10 flex items-center justify-center border border-border hover:bg-border transition-colors rounded-sm text-text-muted hover:text-text-primary"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
};
