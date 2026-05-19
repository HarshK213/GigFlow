import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="min-w-full divide-y divide-gray-200">
        {children}
      </table>
    </div>
  );
}

interface TableHeadProps {
  children: ReactNode;
  className?: string;
}

export function TableHead({ children, className }: TableHeadProps) {
  return (
    <thead className={cn('bg-gray-50', className)}>
      {children}
    </thead>
  );
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

export function TableBody({ children, className }: TableBodyProps) {
  return (
    <tbody className={cn('divide-y divide-gray-200 bg-white', className)}>
      {children}
    </tbody>
  );
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

export function TableRow({ children, className }: TableRowProps) {
  return <tr className={cn(className)}>{children}</tr>;
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
  header?: boolean;
}

export function TableCell({
  children,
  className,
  header = false,
}: TableCellProps) {
  const Tag = header ? 'th' : 'td';
  return (
    <Tag
      className={cn(
        'px-6 py-4 text-sm whitespace-nowrap',
        header
          ? 'text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
          : 'text-gray-900',
        className
      )}
    >
      {children}
    </Tag>
  );
}
