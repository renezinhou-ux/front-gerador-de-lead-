import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { useStore } from './store/useStore';
import { DashboardView } from './views/DashboardView';
import { PipelineView } from './views/PipelineView';
import { LeadsView } from './views/LeadsView';
import { ConfigView } from './views/ConfigView';
import { SettingsView } from './views/SettingsView';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 30000,
    },
  },
});

export default function App() {
  const { isSidebarCollapsed } = useStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-bg text-text-primary flex">
          <Sidebar />
          
          <div 
            className="flex-1 flex flex-col min-w-0"
            style={{ 
              marginLeft: isSidebarCollapsed ? 60 : 220, 
              transition: 'margin-left 0.3s ease-in-out' 
            }}
          >
            <TopBar />
            
            <main className="flex-1 p-6 overflow-y-auto">
              <Routes>
                <Route path="/" element={<DashboardView />} />
                <Route path="/pipeline" element={<PipelineView />} />
                <Route path="/leads" element={<LeadsView />} />
                <Route path="/config" element={<ConfigView />} />
                <Route path="/settings" element={<SettingsView />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
}
