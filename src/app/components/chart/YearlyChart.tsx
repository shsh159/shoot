'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface ChartProps {
  amountList: {
    month: string;
    amount: number;
  }[];
}

export default function YearlyChart({ amountList }: ChartProps) {
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
