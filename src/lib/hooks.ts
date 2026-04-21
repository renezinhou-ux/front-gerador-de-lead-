import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getLeads, getLeadById, getLeadEvents, 
  getMetricsToday, getPipelineNodes, 
  getFunnelData, getSourceBreakdown, 
  getScoringConfig, updateScoringConfig,
  getServicesHealth, getLeadsHistorical
} from './api';
import { LeadQueryParams, ScoringConfig } from '../types';

export function useMetrics() {
  return useQuery({ 
    queryKey: ['metrics'], 
    queryFn: getMetricsToday,
    refetchInterval: 30000 
  });
}

export function usePipelineNodes() {
  return useQuery({ 
    queryKey: ['pipeline'], 
    queryFn: getPipelineNodes, 
    refetchInterval: 15000 
  });
}

export function useLeads(params: LeadQueryParams) {
  return useQuery({ 
    queryKey: ['leads', params], 
    queryFn: () => getLeads(params),
    placeholderData: (previousData) => previousData, // keepPreviousData behavior in v5
    staleTime: 5000
  });
}

export function useLeadDetail(id: string | null) {
  return useQuery({ 
    queryKey: ['lead', id], 
    queryFn: () => getLeadById(id!),
    enabled: !!id 
  });
}

export function useLeadEvents(id: string | null) {
  return useQuery({ 
    queryKey: ['lead-events', id], 
    queryFn: () => getLeadEvents(id!),
    enabled: !!id 
  });
}

export function useFunnelData(window: '7d' | '30d' = '7d') {
  return useQuery({ 
    queryKey: ['funnel', window], 
    queryFn: () => getFunnelData(window) 
  });
}

export function useSourceBreakdown(window: '7d' | '30d' = '7d') {
  return useQuery({ 
    queryKey: ['sources', window], 
    queryFn: () => getSourceBreakdown(window) 
  });
}

export function useLeadsHistorical(days: number = 7) {
  return useQuery({ 
    queryKey: ['historical', days], 
    queryFn: () => getLeadsHistorical(days) 
  });
}

export function useScoringConfig() {
  return useQuery({ 
    queryKey: ['scoring-config'], 
    queryFn: getScoringConfig 
  });
}

export function useUpdateScoringConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateScoringConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scoring-config'] });
    }
  });
}

export function useServicesHealth() {
  return useQuery({ 
    queryKey: ['services-health'], 
    queryFn: getServicesHealth,
    refetchInterval: 60000
  });
}
