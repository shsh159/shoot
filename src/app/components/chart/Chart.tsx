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
  data: {
    date: string;
    totalAmount: number;
  }[];
}

export default function Chart({ data }: ChartProps) {
  return (
    <LineChart width={1000} height={300} data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <CartesianGrid stroke="#eee" />
      <Line type="monotone" dataKey="totalAmount" stroke="#8884d8" />
    </LineChart>
  );
}
