import { TrendingUp, TrendingDown } from 'lucide-react';
import type { ReactNode } from 'react';

interface KPICardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  growth: string;
  positive: boolean;
}

export function KPICard({ icon, title, value, growth, positive }: KPICardProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-[#c7c4d8] hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-[#e2dfff] flex items-center justify-center text-[#3525cd]">
          {icon}
        </div>
        <span
          className={`inline-flex items-center gap-1 text-[12px] font-bold px-2 py-0.5 rounded-full ${
            positive
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {positive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {growth}
        </span>
      </div>
      <p className="text-[12px] font-medium text-[#464555] tracking-[0.05em] uppercase">
        {title}
      </p>
      <p className="text-[28px] font-bold text-[#0b1c30] mt-1">{value}</p>
    </div>
  );
}
