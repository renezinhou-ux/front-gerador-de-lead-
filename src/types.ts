export type LeadStatus = 'captured' | 'validated' | 'deduplicated' | 'scored' | 'distributed' | 'rejected';

// API response types (snake_case from FastAPI)
export interface ApiLead {
  id: string;            // UUID
  name: string;
  email: string;
  phone: string;
  source: 'scraping' | 'chatbot' | 'paid_traffic';
  score: number;
  status: LeadStatus;
  created_at: string;
  location?: string;
  company?: string;
  industry?: string;
  linkedin_url?: string;
}

// Frontend types (camelCase)
export interface Lead {
  id: string;
  displayId: string;
  name: string;
  email: string;
  phone: string;
  source: 'Scraping' | 'Chatbot' | 'Tráfego Pago';
  score: number;
  status: LeadStatus;
  createdAt: string;
  details?: {
    location?: string;
    company?: string;
    industry?: string;
    linkedIn?: string;
  };
  events: LeadEvent[];
}

export interface LeadEvent {
  id: string;
  leadId: string;
  type: 'pipeline' | 'scoring' | 'system' | 'error';
  description: string;
  timestamp: string;
}

export interface PaginatedLeads {
  data: Lead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LeadQueryParams {
  page?: number;
  limit?: number;
  status?: string[];
  source?: string[];
  minScore?: number;
  search?: string;
}

export interface PipelineNode {
  id: string;
  name: string;
  status: 'online' | 'degraded' | 'offline';
  queueDepth: number;
  throughput: number;
  lastEvent: string;
  sparkline: number[];
}

export interface Metrics {
  totalLeadsToday: number;
  validatedLeads: number;
  rejectedLeads: number;
  distributedLeads: number;
  delta: {
    total: number;
    validated: number;
    rejected: number;
    distributed: number;
  };
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface FunnelDataPoint {
  name: string;
  value: number;
  fill?: string;
}

export interface SourceDataPoint {
  name: string;
  value: number;
}

export interface ScoringConfig {
  emailQuality: number;
  phoneCompleteness: number;
  sourceQuality: number;
  engagementSignals: number;
}

export interface ServiceHealth {
  id: string;
  name: string;
  status: 'online' | 'degraded' | 'offline';
  endpoint: string;
  latency: string;
  lastPing: string;
}

// Transform layer
export function transformApiLead(apiLead: ApiLead): Lead {
  const sourceMap: Record<string, Lead['source']> = {
    scraping: 'Scraping',
    chatbot: 'Chatbot', 
    paid_traffic: 'Tráfego Pago'
  };
  
  return {
    id: apiLead.id,
    displayId: `LEAD-${apiLead.id.slice(-4).toUpperCase()}`,
    name: apiLead.name,
    email: apiLead.email,
    phone: apiLead.phone,
    source: sourceMap[apiLead.source] || 'Scraping',
    score: apiLead.score,
    status: apiLead.status,
    createdAt: apiLead.created_at,
    details: {
      location: apiLead.location,
      company: apiLead.company,
      industry: apiLead.industry,
      linkedIn: apiLead.linkedin_url,
    },
    events: [], // Usually loaded separately
  };
}
