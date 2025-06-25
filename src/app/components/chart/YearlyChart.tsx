'use client';

import { YearChart } from '@lib/types/chart';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

type YearlyChartProps = YearChart & { isMobile?: boolean };

export default function YearlyChart({
  amountList,
  isMobile,
}: YearlyChartProps) {
  return (
    <LineChart
      width={isMobile ? 340 : 1250}
      height={isMobile ? 240 : 340}
      data={amountList}
    >
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <CartesianGrid stroke="#eee" />
      <Line type="monotone" dataKey="amount" stroke="#ff5202" />
    </LineChart>
  );
}
