import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLead, updateLead } from '../api/leads';
import { LeadDetail } from '../components/leads/LeadDetail';
import { LeadForm } from '../components/leads/LeadForm';
import { Modal } from '../components/ui/Modal';
import type { CreateLeadFormData } from '../schemas/lead';

export function LeadDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => getLead(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (formData: CreateLeadFormData) =>
      updateLead(id!, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setIsFormOpen(false);
    },
  });

  const handleEdit = () => {
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData: CreateLeadFormData) => {
    updateMutation.mutate(formData);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <LeadDetail
        lead={data?.data || null}
        isLoading={isLoading}
        isError={isError}
        error={error as Error | null}
        onRetry={() => refetch()}
        onEdit={handleEdit}
        onBack={handleBack}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Edit Lead"
      >
        <LeadForm
          lead={data?.data || null}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          isLoading={updateMutation.isPending}
        />
      </Modal>
    </div>
  );
}
