import { Edit2, Trash2 } from 'lucide-react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Spinner } from '../ui/Spinner';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import type { Lead } from '../../types';
import { useAuthStore } from '../../store/authStore';

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function LeadTable({
  leads,
  isLoading,
  isError,
  error,
  onRetry,
  onEdit,
  onDelete,
  onCreateNew,
}: LeadTableProps) {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'Admin';

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
        message={error?.message || 'Failed to load leads'}
        onRetry={onRetry}
      />
    );
  }

  if (leads.length === 0) {
    return (
      <EmptyState
        title="No leads found"
        description="Get started by creating your first lead."
        action={{ label: 'Create lead', onClick: onCreateNew }}
      />
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell header>Name</TableCell>
          <TableCell header>Email</TableCell>
          <TableCell header>Status</TableCell>
          <TableCell header>Source</TableCell>
          <TableCell header>Created</TableCell>
          <TableCell header>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead._id}>
            <TableCell className="font-medium">{lead.name}</TableCell>
            <TableCell>{lead.email}</TableCell>
            <TableCell>
              <Badge status={lead.status} />
            </TableCell>
            <TableCell className="text-gray-500">{lead.source}</TableCell>
            <TableCell className="text-gray-500">
              {formatDate(lead.createdAt)}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(lead)}
                  className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                  title="Edit lead"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                {isAdmin && (
                  <button
                    onClick={() => onDelete(lead._id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete lead"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
