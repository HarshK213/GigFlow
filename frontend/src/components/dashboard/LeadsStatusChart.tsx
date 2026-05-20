import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface StatusData {
  name: string;
  value: number;
}

const COLORS: Record<string, string> = {
  New: '#3b82f6',
  Contacted: '#f97316',
  Qualified: '#22c55e',
  Lost: '#6b7280',
};

interface LeadsStatusChartProps {
  data: StatusData[];
}

export function LeadsStatusChart({ data }: LeadsStatusChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-[14px] text-[#464555]">
        No status data available
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={COLORS[entry.name] || '#9ca3af'}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #c7c4d8',
              fontSize: '13px',
            }}
            formatter={(value) => [
              `${value} (${((Number(value) / total) * 100).toFixed(1)}%)`,
              'Leads',
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: COLORS[entry.name] || '#9ca3af' }}
            />
            <span className="text-[12px] text-[#464555] font-medium">
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
