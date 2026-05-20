import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Users } from 'lucide-react';
import { getLeads } from '../api/leads';
import { DashboardAnalytics } from '../components/dashboard/DashboardAnalytics';

export function DashboardPage() {
  const { data } = useQuery({
    queryKey: ['leads', { page: 1, sort: 'latest', limit: 100 }],
    queryFn: () => getLeads({ page: 1, sort: 'latest' }),
  });

  const leads = data?.data || [];
  const totalLeads = data?.pagination?.total || 0;

  const newLeadsCount = leads.filter((l) => l.status === 'New').length;
  const contactedCount = leads.filter((l) => l.status === 'Contacted').length;
  const qualifiedCount = leads.filter((l) => l.status === 'Qualified').length;
  const lostCount = leads.filter((l) => l.status === 'Lost').length;
  const conversionRate = totalLeads > 0
    ? ((leads.filter((l) => l.status === 'Qualified' || l.status === 'Contacted').length / totalLeads) * 100).toFixed(1)
    : '0.0';
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-bold text-[#0b1c30] tracking-[-0.02em]">Dashboard</h1>
        <p className="text-[14px] text-[#464555] mt-1">
          {totalLeads} total lead{totalLeads !== 1 ? 's' : ''} active in your current funnel
        </p>
      </div>

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 lg:col-span-4 bg-[#3525cd] text-white p-6 rounded-2xl flex flex-col justify-between shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div>
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-[12px] font-medium tracking-[0.05em] mb-4">
              Growth Overview
            </span>
            <h2 className="text-[20px] font-semibold mb-2">
              You've converted {conversionRate}% more leads this month
            </h2>
            <p className="text-[14px] opacity-80 mb-6">
              Your funnel optimization strategy is showing positive results in the Qualified stage.
            </p>
          </div>
          <div className="flex items-end gap-2 h-24">
            <div className="flex-1 bg-white/20 rounded-t-lg h-[40%]" />
            <div className="flex-1 bg-white/20 rounded-t-lg h-[60%]" />
            <div className="flex-1 bg-white/20 rounded-t-lg h-[55%]" />
            <div className="flex-1 bg-white/20 rounded-t-lg h-[85%]" />
            <div className="flex-1 bg-white/40 rounded-t-lg h-full border-t-2 border-white" />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white p-5 rounded-2xl border border-[#c7c4d8]">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-[12px] font-medium text-[#464555] tracking-[0.05em] uppercase">New Leads</p>
            <h3 className="text-[28px] font-bold text-[#0b1c30] mt-1">{newLeadsCount}</h3>
            <div className="flex items-center gap-1 text-green-600 mt-2">
              <TrendingUp className="h-[18px] w-[18px]" />
              <span className="text-[12px] font-medium">+{newLeadsCount > 0 ? Math.min(newLeadsCount * 3, 100) : 0}%</span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#c7c4d8]">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-[12px] font-medium text-[#464555] tracking-[0.05em] uppercase">Conversion Rate</p>
            <h3 className="text-[28px] font-bold text-[#0b1c30] mt-1">{conversionRate}%</h3>
            <div className="flex items-center gap-1 text-green-600 mt-2">
              <TrendingUp className="h-[18px] w-[18px]" />
              <span className="text-[12px] font-medium">+{parseFloat(conversionRate) > 0 ? (parseFloat(conversionRate) / 5).toFixed(1) : '0'}%</span>
            </div>
          </div>
        </div>
      </div>

      <DashboardAnalytics
        data={{
          totalLeads,
          newLeads: newLeadsCount,
          qualifiedCount,
          contactedCount,
          lostCount,
          conversionRate,
        }}
      />
    </div>
  );
}
