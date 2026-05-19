import { Search, Download, ArrowUpDown, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { LeadFilters as LeadFiltersType, LeadStatus, LeadSource } from '../../types';

const statusOptions: { value: LeadStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' },
];

const sourceOptions: { value: LeadSource | ''; label: string }[] = [
  { value: '', label: 'All Sources' },
  { value: 'Website', label: 'Website' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Referral', label: 'Referral' },
];

interface LeadFiltersProps {
  filters: LeadFiltersType;
  onFilterChange: (filters: LeadFiltersType) => void;
  onExportCsv: () => void;
}

export function LeadFilters({
  filters,
  onFilterChange,
  onExportCsv,
}: LeadFiltersProps) {
  const hasActiveFilters =
    filters.status || filters.source || filters.search || filters.sort;

  const updateFilter = (key: keyof LeadFiltersType, value: string | undefined) => {
    onFilterChange({ ...filters, [key]: value || '', page: 1 });
  };

  const clearFilters = () => {
    onFilterChange({
      status: '',
      source: '',
      search: '',
      page: 1,
      sort: undefined,
    });
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search leads..."
          value={filters.search || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="block w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <select
        value={filters.status || ''}
        onChange={(e) => updateFilter('status', e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={filters.source || ''}
        onChange={(e) => updateFilter('source', e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        {sourceOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <button
        onClick={() =>
          updateFilter('sort', filters.sort === 'latest' ? 'oldest' : 'latest')
        }
        className={cn(
          'inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
          filters.sort === 'oldest'
            ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        )}
      >
        <ArrowUpDown className="h-4 w-4" />
        {filters.sort === 'oldest' ? 'Oldest' : 'Latest'}
      </button>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-4 w-4" />
          Clear
        </button>
      )}

      <button
        onClick={onExportCsv}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Download className="h-4 w-4" />
        Export CSV
      </button>
    </div>
  );
}
