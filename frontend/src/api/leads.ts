import api from './axios';
import type { Lead, LeadFilters, LeadsResponse, ImportResult } from '../types';

export async function getLeads(
  filters: LeadFilters
): Promise<LeadsResponse> {
  try {
    const params: Record<string, string | number | undefined> = {};
    if (filters.status) params.status = filters.status;
    if (filters.source) params.source = filters.source;
    if (filters.search) params.search = filters.search;
    if (filters.page) params.page = filters.page;
    params.limit = 10;
    if (filters.sort) params.sort = filters.sort;

    const response = await api.get<LeadsResponse>('/leads', { params });
    return response.data;
  } catch (err) {
    console.error('[getLeads]', err);
    throw err;
  }
}

export async function getLead(id: string): Promise<{ success: boolean; data: Lead }> {
  try {
    const response = await api.get<{ success: boolean; data: Lead }>(`/leads/${id}`);
    return response.data;
  } catch (err) {
    console.error('[getLead]', err);
    throw err;
  }
}

export async function createLead(
  data: Pick<Lead, 'name' | 'email' | 'status' | 'source'>
): Promise<{ success: boolean; data: Lead }> {
  try {
    const response = await api.post<{ success: boolean; data: Lead }>('/leads', data);
    return response.data;
  } catch (err) {
    console.error('[createLead]', err);
    throw err;
  }
}

export async function updateLead(
  id: string,
  data: Partial<Pick<Lead, 'name' | 'email' | 'status' | 'source'>>
): Promise<{ success: boolean; data: Lead }> {
  try {
    const response = await api.put<{ success: boolean; data: Lead }>(`/leads/${id}`, data);
    return response.data;
  } catch (err) {
    console.error('[updateLead]', err);
    throw err;
  }
}

export async function deleteLead(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/leads/${id}`
    );
    return response.data;
  } catch (err) {
    console.error('[deleteLead]', err);
    throw err;
  }
}

export async function importLeads(
  leads: Array<Pick<Lead, 'name' | 'email' | 'status' | 'source'>>
): Promise<{ success: boolean; data: ImportResult }> {
  try {
    const response = await api.post('/leads/import', { leads });
    return response.data;
  } catch (err) {
    console.error('[importLeads]', err);
    throw err;
  }
}

export async function exportLeadsCsv(
  filters: LeadFilters
): Promise<Blob> {
  try {
    const params: Record<string, string | number | undefined> = {};
    if (filters.status) params.status = filters.status;
    if (filters.source) params.source = filters.source;
    if (filters.search) params.search = filters.search;
    if (filters.sort) params.sort = filters.sort;

    const response = await api.get('/leads/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  } catch (err) {
    console.error('[exportLeadsCsv]', err);
    throw err;
  }
}
