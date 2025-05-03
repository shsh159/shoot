'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function Chart() {
  const data = [
    { name: '1월', 지출: 400 },
    { name: '2월', 지출: 300 },
    { name: '3월', 지출: 500 },
  ];

  return (
    <LineChart width={500} height={300} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <CartesianGrid stroke="#eee" />
      <Line type="monotone" dataKey="지출" stroke="#8884d8" />
    </LineChart>
  );
}
