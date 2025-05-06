'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface ChartProps {
  amountList: {
    date: string;
    prevAmount: number;
    currentAmount: number;
  }[];
}

export default function Chart({ amountList }: ChartProps) {
  return (
    <LineChart width={950} height={400} data={amountList}>
      <XAxis dataKey="date" />
      <YAxis />
      <Legend />
      <Tooltip />
      <CartesianGrid stroke="#eee" />
      <Line
        type="monotone"
        dataKey="prevAmount"
        name="이전 달"
        stroke="#82ca9d" // 녹색 계열
      />
      <Line
        type="monotone"
        dataKey="currentAmount"
        name="이번 달"
        stroke="#8884d8" // 보라색 계열
      />
    </LineChart>
  );
}
