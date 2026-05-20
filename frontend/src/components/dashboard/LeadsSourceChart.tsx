import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface SourceData {
  name: string;
  value: number;
}

const BAR_COLORS = ['#3525cd', '#4f46e5', '#818cf8'];

interface LeadsSourceChartProps {
  data: SourceData[];
}

export function LeadsSourceChart({ data }: LeadsSourceChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-[14px] text-[#464555]">
        No source data available
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="24%" margin={{ left: -10 }}>
          <XAxis
            dataKey="name"
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
            formatter={(value) => [
              `${value} (${((Number(value) / total) * 100).toFixed(1)}%)`,
              'Leads',
            ]}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={BAR_COLORS[index % BAR_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
