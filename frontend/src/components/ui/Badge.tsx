import { cn } from '../../utils/cn';
import type { LeadStatus } from '../../types';

const statusStyles: Record<LeadStatus, string> = {
  New: 'bg-blue-100 text-blue-700',
  Contacted: 'bg-orange-100 text-orange-700',
  Qualified: 'bg-green-100 text-green-700',
  Lost: 'bg-gray-100 text-gray-700',
};

interface BadgeProps {
  status: LeadStatus;
  className?: string;
}

export function Badge({ status, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex px-3 py-1 rounded-full text-[12px] font-bold tracking-[0.05em]',
        statusStyles[status],
        className
      )}
    >
      {status}
    </span>
  );
}
