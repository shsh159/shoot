'use client';

import { YearChart } from '@lib/types/chart';
import { Box } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

type YearlyChartProps = YearChart & { isMobile?: boolean };

export default function YearlyChart({
  amountList,
  isMobile,
}: YearlyChartProps) {
  return (
    <Box sx={{ width: '100%', height: isMobile ? 240 : 340 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={amountList}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#eee" />
          <Line type="monotone" dataKey="amount" stroke="#ff5202" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
