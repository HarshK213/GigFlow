import { ArrowLeft, Edit2 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { ErrorState } from '../ui/ErrorState';
import type { Lead } from '../../types';

interface LeadDetailProps {
  lead?: Lead | null;
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onEdit: () => void;
  onBack: () => void;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function LeadDetail({
  lead,
  isLoading,
  isError,
  error,
  onRetry,
  onEdit,
  onBack,
}: LeadDetailProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        message={error?.message || 'Failed to load lead details'}
        onRetry={onRetry}
      />
    );
  }

  if (!lead) {
    return <ErrorState message="Lead not found" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to leads
        </button>
        <Button onClick={onEdit} size="sm" variant="secondary">
          <Edit2 className="h-4 w-4 mr-1.5" />
          Edit
        </Button>
      </div>

      <div className="card p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{lead.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{lead.email}</p>
          </div>
          <Badge status={lead.status} />
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1 text-sm text-gray-900">{lead.status}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Source</dt>
            <dd className="mt-1 text-sm text-gray-900">{lead.source}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Created</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formatDate(lead.createdAt)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formatDate(lead.updatedAt)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
