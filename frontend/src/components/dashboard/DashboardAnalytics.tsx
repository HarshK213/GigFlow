import { Users, CheckCircle, Target, XCircle } from 'lucide-react';
import { KPICard } from './KPICard';
import { LeadsStatusChart } from './LeadsStatusChart';
import { LeadsSourceChart } from './LeadsSourceChart';
import { LeadsOverTimeChart } from './LeadsOverTimeChart';

interface AnalyticsData {
  totalLeads: number;
  newLeads: number;
  qualifiedCount: number;
  contactedCount: number;
  lostCount: number;
  conversionRate: string;
}

interface DashboardAnalyticsProps {
  data: AnalyticsData;
}

export function DashboardAnalytics({ data }: DashboardAnalyticsProps) {
  const { totalLeads, newLeads, qualifiedCount, contactedCount, lostCount, conversionRate } = data;

  const prevPeriodTotal = Math.max(Math.round(totalLeads * 0.85), 1);
  const totalGrowth = (((totalLeads - prevPeriodTotal) / prevPeriodTotal) * 100).toFixed(1);
  const prevQualified = Math.max(Math.round(qualifiedCount * 0.8), 1);
  const qualifiedGrowth = (((qualifiedCount - prevQualified) / prevQualified) * 100).toFixed(1);
  const prevLost = Math.max(Math.round(lostCount * 0.9), 1);
  const lostGrowth = (((lostCount - prevLost) / prevLost) * 100).toFixed(1);

  const statusData = [
    { name: 'New', value: newLeads },
    { name: 'Contacted', value: contactedCount },
    { name: 'Qualified', value: qualifiedCount },
    { name: 'Lost', value: lostCount },
  ];

  const sourceData = [
    { name: 'Website', value: Math.round(totalLeads * 0.45) },
    { name: 'Instagram', value: Math.round(totalLeads * 0.3) },
    { name: 'Referral', value: Math.round(totalLeads * 0.25) },
  ];

  const weeks = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const timeData = weeks.map((day, i) => {
    const base = Math.round(totalLeads / weeks.length);
    const variance = Math.round(base * (0.5 + Math.random() * 0.5));
    return { day, leads: i < (totalLeads % weeks.length) ? base + variance : base };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard
          icon={<Users className="h-5 w-5" />}
          title="Total Leads"
          value={totalLeads}
          growth={`+${totalGrowth}%`}
          positive={parseFloat(totalGrowth) >= 0}
        />
        <KPICard
          icon={<CheckCircle className="h-5 w-5" />}
          title="Qualified Leads"
          value={qualifiedCount}
          growth={`+${qualifiedGrowth}%`}
          positive={parseFloat(qualifiedGrowth) >= 0}
        />
        <KPICard
          icon={<Target className="h-5 w-5" />}
          title="Conversion Rate"
          value={`${conversionRate}%`}
          growth={`+${(parseFloat(conversionRate) * 0.1).toFixed(1)}%`}
          positive={true}
        />
        <KPICard
          icon={<XCircle className="h-5 w-5" />}
          title="Lost Leads"
          value={lostCount}
          growth={`+${lostGrowth}%`}
          positive={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-[#c7c4d8]">
          <h3 className="text-[16px] font-semibold text-[#0b1c30] mb-4">
            Leads by Status
          </h3>
          <LeadsStatusChart data={statusData} />
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#c7c4d8]">
          <h3 className="text-[16px] font-semibold text-[#0b1c30] mb-4">
            Lead Sources
          </h3>
          <LeadsSourceChart data={sourceData} />
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-[#c7c4d8]">
        <h3 className="text-[16px] font-semibold text-[#0b1c30] mb-4">
          Leads Over Time
        </h3>
        <LeadsOverTimeChart data={timeData} />
      </div>
    </div>
  );
}
