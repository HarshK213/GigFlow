import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Download, Filter, Upload } from 'lucide-react';
import { getLeads, createLead, updateLead, deleteLead, importLeads, exportLeadsCsv } from '../api/leads';
import { LeadTable } from '../components/leads/LeadTable';
import { LeadForm } from '../components/leads/LeadForm';
import { LeadImport } from '../components/leads/LeadImport';
import { Pagination } from '../components/ui/Pagination';
import { Modal } from '../components/ui/Modal';
import { useDebounce } from '../hooks/useDebounce';
import type { Lead, LeadFilters as LeadFiltersType, LeadStatus, LeadSource, ImportResult } from '../types';
import type { CreateLeadFormData } from '../schemas/lead';

export function LeadsPage() {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<LeadFiltersType>({
    status: '',
    source: '',
    search: '',
    page: 1,
    sort: 'latest',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const debouncedSearch = useDebounce(filters.search, 500);
  const currentFilters = { ...filters, search: debouncedSearch };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['leads', currentFilters],
    queryFn: () => getLeads(currentFilters),
  });

  const createMutation = useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setIsFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lead> }) =>
      updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setIsFormOpen(false);
      setEditingLead(null);
    },
  });

  const importMutation = useMutation({
    mutationFn: importLeads,
    onSuccess: (data) => {
      setImportResult(data.data);
      if (data.data.errors.length === 0) {
        queryClient.invalidateQueries({ queryKey: ['leads'] });
        setTimeout(() => {
          setIsImportOpen(false);
          setImportResult(null);
        }, 2000);
      } else {
        queryClient.invalidateQueries({ queryKey: ['leads'] });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const handleCreateNew = () => {
    setEditingLead(null);
    setIsFormOpen(true);
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSubmit = async (formData: CreateLeadFormData) => {
    if (editingLead) {
      updateMutation.mutate({ id: editingLead._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingLead(null);
  };

  const handleImport = async (
    leads: Array<Pick<Lead, 'name' | 'email' | 'status' | 'source'>>
  ) => {
    setImportResult(null);
    importMutation.mutate(leads);
  };

  const handleExportCsv = async () => {
    try {
      const blob = await exportLeadsCsv(currentFilters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      // silently fail
    }
  };

  const leads = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#777587]" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            placeholder="Search leads..."
            className="w-full bg-[#eff4ff] border border-[#c7c4d8] rounded-full py-2 pl-10 pr-4 text-[14px] outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent transition-all"
          />
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-[#3525cd] text-white rounded-full font-bold text-[14px] hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="h-[18px] w-[18px]" />
          Add Lead
        </button>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#c7c4d8] rounded-lg font-semibold text-[14px] text-[#464555] hover:bg-[#e5eeff] transition-all"
        >
          <Filter className="h-[18px] w-[18px]" />
          Filter
        </button>
        <button
          onClick={() => setIsImportOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#c7c4d8] rounded-lg font-semibold text-[14px] text-[#464555] hover:bg-[#e5eeff] transition-all"
        >
          <Upload className="h-[18px] w-[18px]" />
          Import
        </button>
        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#c7c4d8] rounded-lg font-semibold text-[14px] text-[#464555] hover:bg-[#e5eeff] transition-all"
        >
          <Download className="h-[18px] w-[18px]" />
          Export
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-3 items-center p-4 bg-white border border-[#c7c4d8] rounded-lg">
          <select
            value={filters.status || ''}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as LeadStatus | '', page: 1 })}
            className="rounded-lg border border-[#c7c4d8] px-3 py-2 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
          <select
            value={filters.source || ''}
            onChange={(e) => setFilters({ ...filters, source: e.target.value as LeadSource | '', page: 1 })}
            className="rounded-lg border border-[#c7c4d8] px-3 py-2 text-sm"
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>
          <button
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                sort: prev.sort === 'latest' ? 'oldest' : 'latest',
              }))
            }
            className="px-3 py-2 text-sm border border-[#c7c4d8] rounded-lg hover:bg-[#e5eeff]"
          >
            {filters.sort === 'oldest' ? 'Oldest' : 'Latest'}
          </button>
          {(filters.status || filters.source || filters.sort !== 'latest') && (
            <button
              onClick={() => setFilters({ status: '', source: '', search: '', page: 1, sort: 'latest' })}
              className="px-3 py-2 text-sm text-[#464555] hover:text-[#0b1c30]"
            >
              Clear
            </button>
          )}
        </div>
      )}

      <div className="bg-white border border-[#c7c4d8] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#c7c4d8] flex justify-between items-center">
          <h3 className="text-[16px] font-semibold text-[#0b1c30]">All Leads</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[12px] font-medium tracking-[0.05em]">New</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-400" />
              <span className="text-[12px] font-medium tracking-[0.05em]">Contacted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[12px] font-medium tracking-[0.05em]">Qualified</span>
            </div>
          </div>
        </div>
        <LeadTable
          leads={leads}
          isLoading={isLoading}
          isError={isError}
          error={error as Error | null}
          onRetry={() => refetch()}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreateNew={handleCreateNew}
        />
        {pagination && (
          <div className="px-6 py-4 border-t border-[#c7c4d8]">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={(page) =>
                setFilters((prev) => ({ ...prev, page }))
              }
            />
          </div>
        )}
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={handleFormClose}
        title={editingLead ? 'Edit Lead' : 'Create Lead'}
      >
        <LeadForm
          lead={editingLead}
          onSubmit={handleFormSubmit}
          onCancel={handleFormClose}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      <Modal
        isOpen={isImportOpen}
        onClose={() => { setIsImportOpen(false); setImportResult(null); }}
        title="Import Leads"
      >
        <LeadImport
          onImport={handleImport}
          onClose={() => { setIsImportOpen(false); setImportResult(null); }}
          isImporting={importMutation.isPending}
          importResult={importResult}
        />
      </Modal>
    </div>
  );
}
