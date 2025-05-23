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

export default function YearlyChart({ amountList }: YearChart) {
  return (
    <LineChart width={1250} height={380} data={amountList}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <CartesianGrid stroke="#eee" />
      <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
    </LineChart>
  );
}
