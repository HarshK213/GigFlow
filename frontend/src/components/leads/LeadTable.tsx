import { Edit2, Trash2 } from 'lucide-react';
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

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-green-100 text-green-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
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
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#eff4ff]/50">
            <th className="px-6 py-4 text-[12px] font-medium text-[#464555] tracking-[0.05em] uppercase">Name</th>
            <th className="px-6 py-4 text-[12px] font-medium text-[#464555] tracking-[0.05em] uppercase">Email</th>
            <th className="px-6 py-4 text-[12px] font-medium text-[#464555] tracking-[0.05em] uppercase text-center">Status</th>
            <th className="px-6 py-4 text-[12px] font-medium text-[#464555] tracking-[0.05em] uppercase">Source</th>
            <th className="px-6 py-4 text-[12px] font-medium text-[#464555] tracking-[0.05em] uppercase">Created</th>
            <th className="px-6 py-4 text-[12px] font-medium text-[#464555] tracking-[0.05em] uppercase text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#c7c4d8]">
          {leads.map((lead) => (
            <tr
              key={lead._id}
              className="hover:bg-[#e5eeff] transition-colors group"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${getAvatarColor(lead.name)}`}
                  >
                    {getInitials(lead.name)}
                  </div>
                  <span className="text-[14px] font-bold text-[#0b1c30]">
                    {lead.name}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-[14px] text-[#464555]">
                {lead.email}
              </td>
              <td className="px-6 py-4 text-center">
                <Badge status={lead.status} />
              </td>
              <td className="px-6 py-4 text-[14px] text-[#0b1c30]">
                {lead.source}
              </td>
              <td className="px-6 py-4 text-[14px] text-[#464555]">
                {formatDate(lead.createdAt)}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(lead)}
                    className="w-8 h-8 rounded-full hover:bg-[#dce9ff] flex items-center justify-center text-[#464555]"
                  >
                    <Edit2 className="h-[18px] w-[18px]" />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => onDelete(lead._id)}
                      className="w-8 h-8 rounded-full hover:bg-[#ffdad6] hover:text-[#93000a] flex items-center justify-center text-[#464555]"
                    >
                      <Trash2 className="h-[18px] w-[18px]" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
