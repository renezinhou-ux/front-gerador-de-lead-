import { Lead, PipelineNode, Metrics, ChartDataPoint } from '../types';
import { subDays, format, subHours, subMinutes } from 'date-fns';

const SOURCES = ['Scraping', 'Chatbot', 'Tráfego Pago'] as const;
const STATUSES: Lead['status'][] = ['captured', 'validated', 'deduplicated', 'scored', 'distributed', 'rejected'];

export const generateMockLeads = (count: number): Lead[] => {
  return Array.from({ length: count }).map((_, i) => {
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];
    const score = Math.floor(Math.random() * 100);
    const date = subMinutes(new Date(), Math.floor(Math.random() * 10000));

    return {
      id: `lead-uuid-${i}`,
      displayId: `LEAD-${1000 + i}`,
      name: `User ${i + 1}`, // In a real app we'd use faker or more realistic names
      email: `user${i + 1}@example.com`,
      phone: `+55 (11) 9${Math.floor(10000000 + Math.random() * 89999999)}`,
      source,
      score,
      status,
      createdAt: date.toISOString(),
      details: {
        company: `Corporate Inc ${i % 10}`,
        industry: 'Tech',
        location: 'São Paulo, SP',
      },
      events: [
        { id: `e1-${i}`, leadId: `lead-uuid-${i}`, type: 'system', timestamp: subMinutes(date, 5).toISOString(), description: 'Lead identificado via scraping' },
        { id: `e2-${i}`, leadId: `lead-uuid-${i}`, type: 'pipeline', timestamp: subMinutes(date, 2).toISOString(), description: 'Validado: Formato de email correto' },
        { id: `e3-${i}`, leadId: `lead-uuid-${i}`, type: 'scoring', timestamp: date.toISOString(), description: 'Score calculado: 78/100' },
      ]
    };
  });
};

export const MOCK_LEADS = generateMockLeads(200);

export const MOCK_PIPELINE: PipelineNode[] = [
  {
    id: 'scraper',
    name: 'Scraper Engine',
    status: 'online',
    queueDepth: 12,
    throughput: 145,
    lastEvent: new Date().toISOString(),
    sparkline: [40, 45, 42, 48, 55, 52, 60],
  },
  {
    id: 'validator',
    name: 'Validation Guard',
    status: 'online',
    queueDepth: 5,
    throughput: 120,
    lastEvent: subMinutes(new Date(), 1).toISOString(),
    sparkline: [30, 32, 28, 35, 38, 34, 40],
  },
  {
    id: 'deduplicator',
    name: 'Deduplicator',
    status: 'degraded',
    queueDepth: 450,
    throughput: 45,
    lastEvent: subMinutes(new Date(), 5).toISOString(),
    sparkline: [80, 85, 90, 88, 92, 95, 98],
  },
  {
    id: 'scorer',
    name: 'Scoring Engine',
    status: 'online',
    queueDepth: 2,
    throughput: 180,
    lastEvent: subMinutes(new Date(), 2).toISOString(),
    sparkline: [20, 25, 22, 28, 30, 24, 32],
  },
  {
    id: 'distributor',
    name: 'CRM Distributor',
    status: 'online',
    queueDepth: 0,
    throughput: 160,
    lastEvent: subMinutes(new Date(), 3).toISOString(),
    sparkline: [15, 18, 16, 20, 19, 22, 25],
  },
];

export const MOCK_METRICS: Metrics = {
  totalLeadsToday: 2450,
  validatedLeads: 1890,
  rejectedLeads: 450,
  distributedLeads: 1240,
  delta: {
    total: 12.5,
    validated: 8.2,
    rejected: -5.4,
    distributed: 15.1,
  }
};

export const MOCK_CHART_DATA: ChartDataPoint[] = [
  { name: '7 days ago', value: 400 },
  { name: '6 days ago', value: 300 },
  { name: '5 days ago', value: 600 },
  { name: '4 days ago', value: 800 },
  { name: '3 days ago', value: 500 },
  { name: '2 days ago', value: 900 },
  { name: 'Today', value: 1100 },
];

export const MOCK_FUNNEL_DATA = [
  { name: 'Captured', value: 1000, fill: '#00E5A0' },
  { name: 'Validated', value: 850, fill: '#00E5A0cc' },
  { name: 'Deduplicated', value: 720, fill: '#00E5A0aa' },
  { name: 'Scored', value: 680, fill: '#00E5A088' },
  { name: 'Distributed', value: 520, fill: '#00E5A066' },
];

export const MOCK_SOURCE_DATA = [
  { name: 'Scraping', value: 1250 },
  { name: 'Chatbot', value: 840 },
  { name: 'Tráfego Pago', value: 360 },
];
