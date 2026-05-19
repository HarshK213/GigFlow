import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Users } from 'lucide-react';
import { getLeads, createLead, updateLead, deleteLead, exportLeadsCsv } from '../api/leads';
import { LeadTable } from '../components/leads/LeadTable';
import { LeadFilters } from '../components/leads/LeadFilters';
import { LeadForm } from '../components/leads/LeadForm';
import { Pagination } from '../components/ui/Pagination';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { useDebounce } from '../hooks/useDebounce';
import type { Lead, LeadFilters as LeadFiltersType } from '../types';
import type { CreateLeadFormData } from '../schemas/lead';

export function DashboardPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<LeadFiltersType>({
    status: '',
    source: '',
    search: '',
    page: 1,
    sort: 'latest',
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

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

  const deleteMutation = useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const handleFilterChange = useCallback((newFilters: LeadFiltersType) => {
    setFilters(newFilters);
  }, []);

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

  const totalLeads = pagination?.total || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Users className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Leads</h2>
            <p className="text-sm text-gray-500">
              {totalLeads} total {totalLeads === 1 ? 'lead' : 'leads'}
            </p>
          </div>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-1.5" />
          Add lead
        </Button>
      </div>

      <LeadFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onExportCsv={handleExportCsv}
      />

      <div className="card overflow-hidden">
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
      </div>

      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={(page) =>
            setFilters((prev) => ({ ...prev, page }))
          }
        />
      )}

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
    </div>
  );
}
