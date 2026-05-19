import { ILead } from '../interfaces';

function escapeCsvValue(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function generateCsv(leads: ILead[]): string {
  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
  const rows = leads.map((lead) =>
    [
      escapeCsvValue(lead.name),
      escapeCsvValue(lead.email),
      escapeCsvValue(lead.status),
      escapeCsvValue(lead.source),
      new Date(lead.createdAt).toISOString(),
    ].join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}
