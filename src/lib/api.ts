import { 
  Lead, ApiLead, LeadQueryParams, PaginatedLeads, 
  Metrics, FunnelDataPoint, SourceDataPoint, 
  ChartDataPoint, PipelineNode, ScoringConfig, 
  ServiceHealth, transformApiLead, LeadEvent 
} from '../types';
import { 
  MOCK_LEADS, MOCK_PIPELINE, MOCK_METRICS, 
  MOCK_FUNNEL_DATA, MOCK_SOURCE_DATA, MOCK_CHART_DATA 
} from './mock-data';

const BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000';
const USE_MOCK = (import.meta as any).env.VITE_USE_MOCK === 'true' || true;

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Leads
export async function getLeads(params: LeadQueryParams): Promise<PaginatedLeads> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 600)); // Simulate network
    let filtered = [...MOCK_LEADS];
    
    if (params.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(l => 
        l.name.toLowerCase().includes(s) || 
        l.email.toLowerCase().includes(s) || 
        l.displayId.toLowerCase().includes(s)
      );
    }

    if (params.status && params.status.length > 0) {
      filtered = filtered.filter(l => params.status?.includes(l.status));
    }

    if (params.source && params.source.length > 0) {
      filtered = filtered.filter(l => params.source?.includes(l.source));
    }

    if (params.minScore !== undefined) {
      filtered = filtered.filter(l => l.score >= params.minScore!);
    }

    const page = params.page || 1;
    const limit = params.limit || 12;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: filtered.slice(start, end),
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    };
  }

  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.search) query.append('search', params.search);
  if (params.minScore) query.append('min_score', params.minScore.toString());
  params.status?.forEach(s => query.append('status', s));
  params.source?.forEach(s => query.append('source', s));

  const response = await apiFetch<{ data: ApiLead[], total: number, page: number, limit: number, total_pages: number }>(
    `/api/leads?${query.toString()}`
  );

  return {
    data: response.data.map(transformApiLead),
    total: response.total,
    page: response.page,
    limit: response.limit,
    totalPages: response.total_pages,
  };
}

export async function getLeadById(id: string): Promise<Lead> {
  if (USE_MOCK) {
    const lead = MOCK_LEADS.find(l => l.id === id);
    if (!lead) throw new Error('Lead not found');
    return lead;
  }
  const apiLead = await apiFetch<ApiLead>(`/api/leads/${id}`);
  return transformApiLead(apiLead);
}

export async function getLeadEvents(id: string): Promise<LeadEvent[]> {
  if (USE_MOCK) {
    const lead = MOCK_LEADS.find(l => l.id === id);
    return lead?.events || [];
  }
  return apiFetch<LeadEvent[]>(`/api/leads/${id}/events`);
}

export async function exportLeadsCSV(params: LeadQueryParams): Promise<Blob> {
  if (USE_MOCK) {
    const content = "id,name,email,phone,source,score,status,createdAt\n" + 
      MOCK_LEADS.map(l => `${l.displayId},${l.name},${l.email},${l.phone},${l.source},${l.score},${l.status},${l.createdAt}`).join('\n');
    return new Blob([content], { type: 'text/csv' });
  }
  
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  params.status?.forEach(s => query.append('status', s));
  params.source?.forEach(s => query.append('source', s));
  query.append('format', 'csv');

  const response = await fetch(`${BASE_URL}/api/leads/export?${query.toString()}`, {
    headers: { 'Accept': 'text/csv' }
  });
  return response.blob();
}

// Metrics
export async function getMetricsToday(): Promise<Metrics> {
  if (USE_MOCK) {
    return MOCK_METRICS;
  }
  return apiFetch<Metrics>('/api/metrics/today');
}

export async function getFunnelData(window: '7d' | '30d' = '7d'): Promise<FunnelDataPoint[]> {
  if (USE_MOCK) {
    return MOCK_FUNNEL_DATA;
  }
  return apiFetch<FunnelDataPoint[]>(`/api/metrics/funnel?window=${window}`);
}

export async function getSourceBreakdown(window: '7d' | '30d' = '7d'): Promise<SourceDataPoint[]> {
  if (USE_MOCK) {
    return MOCK_SOURCE_DATA;
  }
  return apiFetch<SourceDataPoint[]>(`/api/metrics/sources?window=${window}`);
}

export async function getLeadsHistorical(days: number = 7): Promise<ChartDataPoint[]> {
  if (USE_MOCK) {
    return MOCK_CHART_DATA;
  }
  return apiFetch<ChartDataPoint[]>(`/api/metrics/historical?days=${days}`);
}

// Pipeline
export async function getPipelineNodes(): Promise<PipelineNode[]> {
  if (USE_MOCK) {
    return MOCK_PIPELINE;
  }
  return apiFetch<PipelineNode[]>('/api/pipeline/nodes');
}

// Config
export async function getScoringConfig(): Promise<ScoringConfig> {
  if (USE_MOCK) {
    return {
      emailQuality: 30,
      phoneCompleteness: 20,
      sourceQuality: 35,
      engagementSignals: 15,
    };
  }
  return apiFetch<ScoringConfig>('/api/config/scoring');
}

export async function updateScoringConfig(config: ScoringConfig): Promise<ScoringConfig> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 1000));
    return config;
  }
  return apiFetch<ScoringConfig>('/api/config/scoring', {
    method: 'POST',
    body: JSON.stringify(config),
  });
}

// Settings / Health
export async function getServicesHealth(): Promise<ServiceHealth[]> {
  if (USE_MOCK) {
    return [
      { id: 'pg', name: 'Cluster PostgreSQL', status: 'online', endpoint: 'pg-operator:5432', latency: '12ms', lastPing: new Date().toISOString() },
      { id: 'rabbit', name: 'Broker RabbitMQ', status: 'online', endpoint: 'rabbit.internal:5672', latency: '4ms', lastPing: new Date().toISOString() },
      { id: 'bot', name: 'Bot do Telegram', status: 'online', endpoint: 'api.telegram.org', latency: '142ms', lastPing: new Date().toISOString() },
    ];
  }
  return apiFetch<ServiceHealth[]>('/api/health');
}

export async function getServiceHealthById(id: string): Promise<ServiceHealth> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 500));
    return { id, name: 'Service', status: 'online', endpoint: 'localhost:8000', latency: '10ms', lastPing: new Date().toISOString() };
  }
  return apiFetch<ServiceHealth>(`/api/health/${id}`);
}
