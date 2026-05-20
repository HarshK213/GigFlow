import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface TimeData {
  day: string;
  leads: number;
}

interface LeadsOverTimeChartProps {
  data: TimeData[];
}

export function LeadsOverTimeChart({ data }: LeadsOverTimeChartProps) {
  const total = data.reduce((sum, d) => sum + d.leads, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-[14px] text-[#464555]">
        No time-series data available
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -10 }}>
          <defs>
            <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5eeff"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: '#464555' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#464555' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #c7c4d8',
              fontSize: '13px',
            }}
          />
          <Area
            type="monotone"
            dataKey="leads"
            stroke="#4f46e5"
            strokeWidth={2}
            fill="url(#leadsGradient)"
            activeDot={{ r: 5, fill: '#3525cd' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
