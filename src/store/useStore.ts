import { create } from 'zustand';
import { Lead } from '../types';

interface AppState {
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  selectedLeadId: string | null;
  setSelectedLeadId: (id: string | null) => void;

  filters: {
    status: string[];
    source: string[];
    minScore: number;
  };
  setFilters: (filters: Partial<AppState['filters']>) => void;

  lastUpdated: Date;
  refresh: () => void;
}

export const useStore = create<AppState>((set) => ({
  isSidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

  selectedLeadId: null,
  setSelectedLeadId: (id) => set({ selectedLeadId: id }),

  filters: {
    status: [],
    source: [],
    minScore: 0,
  },
  setFilters: (newFilters) => set((state) => ({ 
    filters: { ...state.filters, ...newFilters } 
  })),

  lastUpdated: new Date(),
  refresh: () => set({ lastUpdated: new Date() }),
}));
