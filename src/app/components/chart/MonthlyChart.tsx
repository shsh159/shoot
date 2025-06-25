'use client';

import { MonthChart } from '@lib/types/chart';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

type MonthlyChartProps = Pick<MonthChart, 'amountList'> & {
  isMobile?: boolean;
};

export default function MonthlyChart({
  amountList,
  isMobile,
}: MonthlyChartProps) {
  return (
    <LineChart
      width={isMobile ? 320 : 950}
      height={isMobile ? 240 : 380}
      data={amountList}
    >
      <XAxis dataKey="date" />
      <YAxis />
      <Legend />
      <Tooltip />
      <CartesianGrid stroke="#eee" />
      <Line
        type="monotone"
        dataKey="prevAmount"
        name="이전 달"
        stroke="#82ca9d"
      />
      <Line
        type="monotone"
        dataKey="currentAmount"
        name="이번 달"
        stroke="#8884d8"
      />
    </LineChart>
  );
}
