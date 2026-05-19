import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createLeadSchema,
  type CreateLeadFormData,
} from '../../schemas/lead';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { Lead } from '../../types';

const statusOptions = [
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' },
];

const sourceOptions = [
  { value: 'Website', label: 'Website' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Referral', label: 'Referral' },
];

interface LeadFormProps {
  lead?: Lead | null;
  onSubmit: (data: CreateLeadFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function LeadForm({ lead, onSubmit, onCancel, isLoading }: LeadFormProps) {
  const isEditing = !!lead;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLeadFormData>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: lead
      ? {
          name: lead.name,
          email: lead.email,
          status: lead.status,
          source: lead.source,
        }
      : {
          name: '',
          email: '',
          status: 'New',
          source: 'Website',
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Name"
        placeholder="Lead name"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Email"
        type="email"
        placeholder="lead@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Select
        label="Status"
        options={statusOptions}
        error={errors.status?.message}
        {...register('status')}
      />
      <Select
        label="Source"
        options={sourceOptions}
        error={errors.source?.message}
        {...register('source')}
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {isEditing ? 'Update' : 'Create'} lead
        </Button>
      </div>
    </form>
  );
}
