import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';
import { WeightRecord } from '../../services/weightService';

interface WeightChartProps {
  data: WeightRecord[];
}

const WeightChart: React.FC<WeightChartProps> = ({ data }) => {
  const theme = useTheme();

  // Sort data by date ascending for the chart
  const sortedData = [...data].sort((a, b) =>
    new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime()
  );

  if (sortedData.length === 0) {
    return (
      <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5', borderRadius: 2 }}>
        <Typography color="textSecondary">Henüz kilo kaydı bulunmamaktadır.</Typography>
      </Box>
    );
  }

  // Calculate min/max for Y axis domain adding some padding
  const weights = sortedData.map(d => d.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const domainMin = Math.max(0, minWeight - 1); // 1kg buffer below
  const domainMax = maxWeight + 1; // 1kg buffer above

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={sortedData}
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
          <XAxis
            dataKey="measuredAt"
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
            stroke="#9e9e9e"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            domain={[domainMin, domainMax]}
            unit=" kg"
            stroke="#9e9e9e"
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: any) => [`${value} kg`, 'Ağırlık']}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke={theme.palette.primary.main}
            strokeWidth={3}
            dot={{ r: 4, fill: theme.palette.primary.main, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default WeightChart;
